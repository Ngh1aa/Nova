import { test, expect } from '@playwright/test';

test('recipient identity stays consistent through the transfer flow', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/app.html?screen=transfer-recipient');

  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Add new recipient/i })).toHaveCount(0);
  await expect(page.locator('[data-nova-recipient-scope]')).toContainText('One saved recipient in this prototype');

  const recipient = page.locator('[data-recipient-id="maya-chen-2048"]');
  await expect(recipient).toContainText('Maya Chen');
  await expect(recipient).toContainText('Northfield Bank');
  await recipient.click();

  await expect(page).toHaveURL(/screen=transfer-amount/);
  await expect(page.getByRole('heading', { name: 'Send to Maya Chen' })).toBeVisible();
  await expect(page.locator('.task-panel .recipient-card')).toContainText('Northfield Bank');

  await page.getByLabel('Amount').fill('145');
  await page.getByLabel('Reference').fill('Rent split');
  await page.getByRole('button', { name: /Review transfer/ }).click();

  await expect(page.locator('.review-list')).toContainText('Maya Chen');
  await expect(page.locator('.review-list')).toContainText('Northfield Bank');
  await expect(page.locator('.review-list')).toContainText('Rent split');

  await page.goto('/app.html?screen=biometric-failed');
  await expect(page.locator('.review-list')).toContainText('Maya Chen');
  await expect(page.locator('.review-list')).toContainText('Northfield Bank');

  await page.goto('/app.html?screen=transfer-success');
  await expect(page.locator('.receipt-sheet')).toContainText('Maya Chen');
  await expect(page.locator('[data-nova-recipient-account]')).toContainText('Northfield Bank');
  await expect(page.locator('.receipt-sheet')).toContainText('€145.00');
  await expect(page.locator('.receipt-sheet')).toContainText('Rent split');
});
