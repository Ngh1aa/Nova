import { test, expect } from '@playwright/test';

async function reset(page) {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
}

test('passcode fallback starts empty, validates errors, retries, and completes only with the demo code', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=transfer-review');

  await page.getByRole('button', { name: /Confirm with biometrics/ }).click();
  const biometric = page.getByRole('dialog', { name: 'Confirm with biometrics' });
  await expect(biometric).toBeVisible();
  await biometric.getByRole('button', { name: 'Simulate failure' }).click();

  await expect(page).toHaveURL(/screen=biometric-failed/);
  const recovery = page.locator('[data-nova-recovery-reassurance="true"]');
  await expect(recovery).toContainText('Biometric verification failed — no money moved.');
  await expect(recovery).toContainText('the transfer was not submitted and your balance is unchanged');

  await page.getByRole('button', { name: /Use passcode/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Use passcode instead' });
  const input = dialog.getByLabel('Prototype passcode');
  const error = dialog.locator('#nova-passcode-error');

  await expect(dialog).toBeVisible();
  await expect(input).toHaveAttribute('type', 'password');
  await expect(input).toHaveValue('');
  await expect(dialog).toContainText('Prototype hint: use 2468');
  await expect(dialog).toContainText('No credential is stored');

  await dialog.getByRole('button', { name: 'Confirm passcode' }).click();
  await expect(error).toContainText('Enter the 4-digit prototype passcode.');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(page).toHaveURL(/screen=biometric-failed/);

  await input.fill('12');
  await dialog.getByRole('button', { name: 'Confirm passcode' }).click();
  await expect(error).toContainText('Use exactly 4 numbers');
  await expect(page).toHaveURL(/screen=biometric-failed/);

  await input.fill('1111');
  await dialog.getByRole('button', { name: 'Confirm passcode' }).click();
  await expect(error).toContainText('does not match. Try again.');
  await expect(input).toHaveValue('1111');
  await expect(page).toHaveURL(/screen=biometric-failed/);

  await input.fill('2468');
  await expect(error).toBeHidden();
  await expect(input).toHaveAttribute('aria-invalid', 'false');
  await dialog.getByRole('button', { name: 'Confirm passcode' }).click();

  await expect(page).toHaveURL(/screen=transfer-success/);
  await expect(page.locator('.receipt-sheet')).toBeVisible();
});

test('passcode dialog can be cancelled without completing the transfer', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=biometric-failed');

  await page.getByRole('button', { name: /Use passcode/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Use passcode instead' });
  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/screen=biometric-failed/);
  const recovery = page.locator('[data-nova-recovery-reassurance="true"]');
  await expect(recovery).toContainText('Biometric verification failed — no money moved.');
  await expect(recovery).toContainText('the transfer was not submitted and your balance is unchanged');
});
