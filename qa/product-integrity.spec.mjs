import { test, expect } from '@playwright/test';

async function reset(page) {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
}

test('custom transfer amount and reference remain consistent through receipt', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=transfer-amount');

  await page.getByLabel('Amount').fill('275');
  await page.getByLabel('Reference').fill('Dinner split');
  await page.getByRole('button', { name: /Review transfer/ }).click();

  await expect(page).toHaveURL(/screen=transfer-review/);
  await expect(page.getByText('€275.00').first()).toBeVisible();
  await expect(page.getByText('Dinner split').first()).toBeVisible();

  await page.getByRole('button', { name: /Confirm with biometrics/ }).click();
  await expect(page.getByRole('dialog')).toContainText('Confirm with biometrics');
  await page.getByRole('dialog').getByRole('button', { name: 'Approve demo' }).click();

  await expect(page).toHaveURL(/screen=transfer-success/);
  await expect(page.locator('.receipt-sheet')).toContainText('€275.00');
  await expect(page.locator('.receipt-sheet')).toContainText('Dinner split');
});

test('above-safe transfer keeps truthful planning state through biometric failure', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=transfer-amount');

  await page.getByLabel('Amount').fill('1400');
  await expect(page.locator('#safe-spend-warning')).toContainText('€100.00 above Safe to spend');
  await page.getByRole('button', { name: /Review transfer/ }).click();

  await expect(page).toHaveURL(/screen=transfer-review/);
  await expect(page.locator('[data-nova-safe-review-warning]')).toContainText('€100.00 above Safe to spend');
  await expect(page.getByText('−€100.00').first()).toBeVisible();
  await expect(page.locator('.impact-panel .horizon-bar')).toContainText('Plan shortfall €100.00');

  await page.getByRole('button', { name: /Confirm with biometrics/ }).click();
  const acknowledgement = page.getByRole('dialog', { name: 'Review the planning trade-off' });
  await expect(acknowledgement).toBeVisible();
  await expect(acknowledgement).toContainText('€100.00 above Safe to spend');

  await acknowledgement.getByRole('button', { name: 'Continue to biometric review' }).click();
  const biometric = page.getByRole('dialog', { name: 'Confirm with biometrics' });
  await expect(biometric).toBeVisible();
  await biometric.getByRole('button', { name: 'Simulate failure' }).click();

  await expect(page).toHaveURL(/screen=biometric-failed/);
  await expect(page.locator('[data-nova-safe-review-warning]')).toContainText('€100.00 above Safe to spend');
  await expect(page.locator('.impact-panel .horizon-bar')).toContainText('Plan shortfall €100.00');
  await expect(page.locator('.impact-panel')).toContainText('−€100.00');

  const recovery = page.locator('[data-nova-recovery-reassurance="true"]');
  await expect(recovery).toBeVisible();
  await expect(recovery).toContainText('No transfer has been made');
  await expect(recovery).toContainText('failed before money movement');
});

test('amount above total balance remains blocked', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=transfer-amount');

  await page.getByLabel('Amount').fill('3000');
  await page.getByRole('button', { name: /Review transfer/ }).click();

  await expect(page).toHaveURL(/screen=transfer-amount/);
  await expect(page.locator('#amount-error')).toContainText('You need €160.00 more to send this amount.');
  await expect(page.getByLabel('Amount')).toHaveAttribute('aria-invalid', 'true');
});
