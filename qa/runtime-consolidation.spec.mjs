import { test, expect } from '@playwright/test';

const retiredScripts = [
  'nova-system-v3.js',
  'nova-system-v4.js',
  'nova-system-v5.js',
  'nova-product-rules.js',
  'nova-transfer-impact.js',
  'nova-passcode-recovery.js',
  'nova-savings-preview.js',
  'nova-recipient-flow.js',
  'nova-native-states.js'
];

const retiredStyles = [
  'nova-system-v3.css',
  'nova-system-v4.css',
  'nova-system-v5.css'
];

async function runtimeAssets(page) {
  return page.evaluate(() => ({
    scripts: [...document.scripts].map((node) => node.src).filter(Boolean),
    styles: [...document.querySelectorAll('link[rel="stylesheet"]')].map((node) => node.href),
    runtime: window.NovaCurrentRuntime
  }));
}

test('app loads one canonical renderer and one canonical interaction/state owner', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  const assets = await runtimeAssets(page);

  expect(assets.scripts.filter((src) => src.includes('/assets/nova-current-renderer.js'))).toHaveLength(1);
  expect(assets.scripts.filter((src) => src.includes('/assets/nova-current-state.js'))).toHaveLength(1);
  expect(assets.styles.filter((href) => href.includes('/assets/nova-current.css'))).toHaveLength(1);

  for (const retired of retiredScripts) {
    expect(assets.scripts.some((src) => src.includes(`/assets/${retired}`)), `${retired} must stay out of runtime`).toBe(false);
  }
  for (const retired of retiredStyles) {
    expect(assets.styles.some((href) => href.includes(`/assets/${retired}`)), `${retired} must stay out of runtime`).toBe(false);
  }

  expect(assets.runtime?.renderer?.owner).toBe('assets/nova-current-renderer.js');
  expect(assets.runtime?.renderer?.architecture).toBe('canonical-renderer');
  expect(assets.runtime?.state?.owner).toBe('assets/nova-current-state.js');
  expect(assets.runtime?.state?.architecture).toBe('canonical-interaction-state');
});

test('canonical owners still produce the final Cards and Pay surfaces', async ({ page }) => {
  await page.goto('/app.html?screen=cards');
  await expect(page.locator('#main.v3-cards-page')).toBeVisible();
  await expect(page.locator('[data-v3-card-state]')).toContainText('Active');
  await expect(page.locator('.v4-rail-nav .v5-rail-primary')).toBeVisible();

  await page.goto('/app.html?screen=transfer-recipient');
  await expect(page.locator('#main.v4-pay-page')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search recipient by name or account' })).toBeVisible();
  await expect(page.getByText('Saved recipients only')).toBeVisible();
});
