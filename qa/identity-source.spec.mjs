import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const targetRoot = process.env.QA_TARGET_DIR || process.cwd();
const readTarget = (file) => fs.readFileSync(path.join(targetRoot, file), 'utf8');

test('P2.2 canonical runtime owns Nova identity without Ledger rewrite patches', async () => {
  const renderer = readTarget('assets/nova-current-renderer.js');
  const redesign = readTarget('assets/nova-redesign.js');
  const manifest = JSON.parse(readTarget('docs/uiux/runtime-manifest.p2-1b.json'));

  expect(renderer).not.toMatch(/\bLedger\b/);
  expect(renderer).not.toContain('LDG_');
  expect(redesign).not.toMatch(/\bLedger\b/);
  expect(redesign).not.toContain('LDG_');
  expect(manifest.bundled_js_sources).not.toContain('assets/nova-brand-fixes.js');
  expect(manifest.canonical_identity).toMatchObject({
    brand: 'Nova',
    transaction_prefix: 'NVA_',
    generation_owner: 'scripts/p2-1b-consolidate-runtime.mjs',
    runtime_identity_rewrite: false
  });
});

test('P2.2 rendered product identity is Nova-native across representative routes', async ({ page }) => {
  const routes = [
    '/app.html?screen=home',
    '/app.html?screen=onboarding',
    '/app.html?screen=cards',
    '/app.html?screen=transaction-detail',
    '/app.html?screen=transfer-recipient',
    '/app.html?screen=savings',
    '/app.html?screen=kyc'
  ];

  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('#main')).toBeVisible();
    await expect(page).toHaveTitle(/^Nova\b/);
    await expect(page.locator('[aria-label="Nova home"]').first()).toBeVisible();
    await expect(page.getByText(/\bLedger\b/)).toHaveCount(0);
    expect(await page.locator('body').innerText()).not.toMatch(/\bLedger\b/);
  }

  await page.goto('/app.html?screen=transaction-detail');
  await expect(page.getByText(/txn_NVA_9F2K7Q/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Nova noticed a pattern change' })).toBeVisible();

  await page.goto('/app.html?screen=cards');
  await expect(page.locator('[aria-label^="Nova debit card"]')).toBeVisible();
});
