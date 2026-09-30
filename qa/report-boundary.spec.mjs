import { test, expect } from '@playwright/test';

test('report transaction flow is explicit, reversible and does not claim a bank case', async ({ page }) => {
  await page.goto('/app.html?screen=transaction-detail&lab=1');

  const startReport = page.getByRole('link', { name: 'Start report' });
  await expect(startReport).toBeVisible();
  await expect(page.locator('[data-report-boundary]')).toContainText('Report flow is simulated');
  await expect(page.locator('[data-report-boundary]')).toContainText('No bank case is created');

  await startReport.click();
  await expect(page).toHaveURL(/screen=report-transaction/);
  await expect(page.getByRole('heading', { name: 'Report this transaction' })).toBeVisible();
  await expect(page.getByText('Nothing has been reported')).toBeVisible();
  await expect(page.getByText('cannot contact a bank, create a dispute, or request a refund')).toBeVisible();
  await expect(page.locator('.review-list')).toContainText('ByteMart Online');
  await expect(page.locator('.review-list')).toContainText('−€189.40');

  await page.getByRole('link', { name: 'Preview report handoff' }).click();
  await expect(page).toHaveURL(/screen=report-transaction&state=handoff/);
  await expect(page.getByRole('heading', { name: 'Report handoff preview' })).toBeVisible();
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

  await expect(page.getByText('Card protection')).toBeVisible();
  await expect(page.getByText('Not changed by this preview')).toBeVisible();
  await expect(page.getByText(/report submitted/i)).toHaveCount(0);
});
