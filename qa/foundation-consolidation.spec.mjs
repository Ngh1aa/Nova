import { test, expect } from '@playwright/test';

const historicalScripts = [
  'nova.js',
  'nova-redesign.js',
  'nova-financial-intelligence.js',
  'accessibility.js',
  'nova-brand-fixes.js',
  'nova-ios26.js',
  'nova-pastel-dashboard.js',
  'nova-dashboard-v2.js',
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

const historicalStyles = [
  'nova.css',
  'accessibility.css',
  'ledger.css',
  'ledger-v2.css',
  'ledger-final.css',
  'nova-redesign.css',
  'nova-financial-intelligence.css',
  'nova-floating-dock.css',
  'nova-a11y.css',
  'nova-polish.css',
  'nova-logo.css',
  'nova-ios26.css',
  'nova-ios26-final.css',
  'nova-ios26-critique.css',
  'nova-ios26-release.css',
  'nova-pastel-dashboard.css',
  'nova-pastel-contrast.css',
  'nova-dashboard-v2.css',
  'nova-dashboard-v2-responsive.css',
  'nova-dashboard-v2-contrast.css',
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

test('P2.1B app runtime no longer loads historical foundation owners', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  const assets = await runtimeAssets(page);

  expect(assets.scripts.filter((src) => src.includes('/assets/nova-current-renderer.js'))).toHaveLength(1);
  expect(assets.scripts.filter((src) => src.includes('/assets/nova-current-state.js'))).toHaveLength(1);
  expect(assets.styles.filter((href) => href.includes('/assets/nova-current.css'))).toHaveLength(1);
  expect(assets.styles.filter((href) => href.includes('/assets/nova-motion.css'))).toHaveLength(1);

  for (const retired of historicalScripts) {
    expect(assets.scripts.some((src) => src.includes(`/assets/${retired}`)), `${retired} must not be a runtime dependency`).toBe(false);
  }
  for (const retired of historicalStyles) {
    expect(assets.styles.some((href) => href.includes(`/assets/${retired}`)), `${retired} must not be a runtime dependency`).toBe(false);
  }

  expect(assets.runtime?.foundation?.owner).toBe('assets/nova-current-renderer.js');
  expect(assets.runtime?.foundation?.architecture).toBe('canonical-foundation-bundle');
  expect(assets.runtime?.foundation?.bundled).toBe(true);
  expect(assets.runtime?.renderer?.owner).toBe('assets/nova-current-renderer.js');
  expect(assets.runtime?.state?.owner).toBe('assets/nova-current-state.js');
});

test('historical foundation behavior is preserved by the canonical bundle', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  await expect(page.locator('body')).toHaveClass(/nova-density-v2/);
  await expect(page.locator('.nova-density-dashboard')).toBeVisible();
  await expect(page.locator('.ios26-nav')).toBeVisible();
  await expect(page.locator('.nova-top-tabs')).toBeVisible();
  await expect(page.getByText('Nova', { exact: true }).first()).toBeVisible();

  await page.goto('/app.html?screen=onboarding');
  await expect(page.getByRole('heading', { name: /See what is truly safe to spend/i })).toBeVisible();

  await page.goto('/app.html?screen=cards');
  await expect(page.locator('#main.v3-cards-page')).toBeVisible();
  await expect(page.locator('.v4-rail-nav .v5-rail-primary')).toBeVisible();

  await page.goto('/app.html?screen=transfer-recipient');
  await expect(page.locator('#main.v4-pay-page')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search recipient by name or account' })).toBeVisible();
});
