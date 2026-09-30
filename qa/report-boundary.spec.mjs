import { test, expect } from '@playwright/test';

test('report transaction flow is explicit, reversible and does not claim a bank case', async ({ page }) => {
  await page.goto('/app.html?screen=transaction-detail&lab=1');

  const startReport = page.getByRole('link', { name: 'Start report' });
  await expect(startReport).toBeVisible();
  await expect(page.locator('[data-report-boundary]')).toContainText('Report flow is simulated');
  await expect(page.locator('[data-report-boundary]')).toContainText('No bank case is created');

  await startReport.click();
  await expect(page).toHaveURL(/screen=report-transaction/);
  await expect(page.getByRole('heading', { name: 'Report ByteMart Online?' })).toBeVisible();
  await expect(page.getByText('Nothing has been reported')).toBeVisible();
  await expect(page.getByText('cannot contact a bank, create a dispute, or request a refund')).toBeVisible();
  await expect(page.locator('.review-list')).toContainText('ByteMart Online');
  await expect(page.locator('.review-list')).toContainText('−€189.40');

  await page.getByRole('link', { name: 'Preview report handoff' }).click();
  await expect(page).toHaveURL(/screen=report-transaction&state=handoff/);
  await expect(page.getByText('Simulated support handoff', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'No bank case created' })).toBeVisible();
  await expect(page.getByText('Nothing was submitted')).toBeVisible();
  await expect(page.locator('.review-list')).toContainText('Bank case');
  await expect(page.locator('.review-list')).toContainText('Not created');
  await expect(page.locator('.review-list')).toContainText('Not requested or promised');
  await expect(page.getByText('Create a case/reference only after a real submission succeeds.')).toBeVisible();
});

test('report preview does not change card freeze state', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());

  await page.goto('/app.html?screen=report-transaction&state=handoff&lab=1');
  const frozen = await page.evaluate(() => localStorage.getItem('nova_card_frozen'));
  expect(frozen).toBeNull();

  await expect(page.locator('.review-list').getByText('Card protection', { exact: true })).toBeVisible();
  await expect(page.getByText('Not changed by this preview', { exact: true })).toBeVisible();
  await expect(page.getByText(/report submitted/i)).toHaveCount(0);
});

test('report boundary remains clear and operable at 390px without reviewer tooling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/app.html?screen=transaction-detail&lab=1');

  await expect(page.locator('[data-nova-state-lab-launcher]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Start report' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

  await page.getByRole('link', { name: 'Start report' }).click();
  await expect(page.getByRole('heading', { name: 'Report ByteMart Online?' })).toBeVisible();
  await expect(page.getByText('Nothing has been reported')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Preview report handoff' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

  await page.getByRole('link', { name: 'Preview report handoff' }).click();
  await expect(page.getByRole('heading', { name: 'No bank case created' })).toBeVisible();
  await expect(page.getByText('Nothing was submitted')).toBeVisible();
  await expect(page.getByText('Not requested or promised', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
