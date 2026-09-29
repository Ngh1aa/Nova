import { test, expect } from '@playwright/test';

async function reset(page) {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
}

test('transfer amount previews safe-to-spend impact before review', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=transfer-amount');

  const amount = page.getByLabel('Amount');
  const status = page.locator('[data-nova-transfer-impact-status]');
  const horizon = page.locator('.impact-panel .horizon');
  const bar = horizon.locator('.horizon-bar');
  const legend = horizon.locator('.horizon-legend');
  const note = horizon.locator('.horizon-note');

  await expect(status).toContainText('€1,155.00 Safe to spend after sending');
  await expect(status).toContainText('€2,695.00 remains in the account');
  await expect(legend).toContainText('Safe after transfer');
  await expect(legend).toContainText('€1,155.00');
  await expect(note).toContainText('Known commitments and the protected buffer remain fully covered');

  await amount.fill('500');
  await expect(status).toContainText('€800.00 Safe to spend after sending');
  await expect(status).toContainText('€2,340.00 remains in the account');
  await expect(bar).toHaveAttribute('aria-label', /€800\.00 safe to spend after transfer/);
  await expect(legend).toContainText('€800.00');

  await amount.fill('1300');
  await expect(status).toContainText('€0.00 Safe to spend after sending');
  await expect(status).toContainText('€1,540.00 remains in the account');
  await expect(page.locator('#safe-spend-warning')).toBeHidden();

  await amount.fill('1400');
  await expect(page.locator('#safe-spend-warning')).toContainText('€100.00 above Safe to spend');
  await expect(status).toContainText('Plan shortfall €100.00');
  await expect(status).toContainText('€1,440.00 would remain');
  await expect(bar).toContainText('Plan shortfall €100.00');
  await expect(legend).toContainText('−€100.00');
  await expect(note).toContainText('before review');

  await amount.fill('3000');
  await expect(page.locator('#safe-spend-warning')).toContainText('Above available balance');
  await expect(page.locator('#safe-spend-warning')).toContainText('€160.00 more');
  await expect(status).toContainText('Transfer blocked in preview');
  await expect(status).toContainText('€160.00 more');
  await expect(bar).toContainText('Cannot send this amount');
  await expect(legend).toContainText('Available balance');
  await expect(legend).toContainText('€2,840.00');

  await page.getByRole('button', { name: /Review transfer/ }).click();
  await expect(page).toHaveURL(/screen=transfer-amount/);
  await expect(page.locator('#amount-error')).toContainText('You need €160.00 more to send this amount.');

  await amount.fill('145');
  await expect(status).toContainText('€1,155.00 Safe to spend after sending');
  await expect(bar).not.toContainText('Cannot send this amount');
  await expect(page.locator('#safe-spend-warning')).toBeHidden();
});
