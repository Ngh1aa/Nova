import { test, expect } from '@playwright/test';

test('recipient search filters saved people and selected identity survives the transfer flow', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/app.html?screen=transfer-recipient');

  const search = page.getByRole('searchbox', { name: 'Search recipient by name or account' });
  await expect(search).toBeVisible();
  await expect(page.getByRole('button', { name: /Add new recipient/i })).toHaveCount(0);
  await expect(page.locator('[data-nova-recipient-scope]')).toContainText('Saved recipients only');
  await expect(page.locator('[data-nova-recipient-boundary]')).toContainText('outside this portfolio scenario');

  const maya = page.locator('[data-recipient-id="maya-chen-2048"]');
  const daniel = page.locator('[data-recipient-id="daniel-lee-7184"]');
  const savedRecipients = page.locator('.v4-recipient-chips [data-recipient-id]');
  await expect(savedRecipients).toHaveCount(4);

  await search.fill('7184');
  await expect(daniel).toBeVisible();
  await expect(maya).toBeHidden();

  await search.fill('not-a-recipient');
  await expect(page.locator('[data-nova-recipient-empty]')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(search).toHaveValue('');
  await expect(savedRecipients).toHaveCount(4);
  await expect(maya).toBeVisible();

  await search.fill('Daniel');
  await expect(daniel).toBeVisible();
  await daniel.click();

  await expect(page).toHaveURL(/screen=transfer-amount/);
  await expect(page.getByRole('heading', { name: 'Send to Daniel Lee' })).toBeVisible();
  await expect(page.locator('.task-panel .recipient-card')).toContainText('7184');

  await page.getByLabel('Amount').fill('145');
  await page.getByLabel('Reference').fill('Rent split');
  await page.getByRole('button', { name: /Review transfer/ }).click();

  await expect(page.locator('.review-list')).toContainText('Daniel Lee');
  await expect(page.locator('.review-list')).toContainText('7184');
  await expect(page.locator('.review-list')).toContainText('Rent split');

  await page.goto('/app.html?screen=biometric-failed');
  await expect(page.locator('.review-list')).toContainText('Daniel Lee');
  await expect(page.locator('.review-list')).toContainText('7184');

  await page.goto('/app.html?screen=transfer-success');
  await expect(page.locator('.receipt-sheet')).toContainText('Daniel Lee');
  await expect(page.locator('[data-nova-recipient-account]')).toContainText('7184');
  await expect(page.locator('.receipt-sheet')).toContainText('€145.00');
  await expect(page.locator('.receipt-sheet')).toContainText('Rent split');
});
