import { test, expect } from '@playwright/test';

async function reset(page) {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
}

test('F-03 promotes the 14-day horizon into primary safe-to-spend language', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=home');

  const primaryHorizonLabel = page.locator('.decision-label').first();
  if (await primaryHorizonLabel.count()) {
    await expect(primaryHorizonLabel).toContainText(/safe to spend.*next 14 days/i);
  } else {
    await expect(page.locator('#main')).toContainText(/safe to spend.*next 14 days/i);
  }

  await page.goto('/app.html?screen=transfer-amount');
  await expect(page.locator('.impact-panel > h2')).toContainText(/next 14 days/i);
  await expect(page.locator('.horizon-range').first()).toHaveText('Next 14 days');
});

test('F-02 states the protected-buffer rule at the transfer decision point', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=transfer-amount');

  const amountNote = page.locator('[data-nova-phase3-buffer-note]');
  await expect(amountNote).toBeVisible();
  await expect(amountNote).toContainText('Protected buffer stays reserved');
  await expect(amountNote).toContainText('This transfer does not use the €500.00 protected buffer');

  await page.getByRole('button', { name: /Review transfer/ }).click();
  await expect(page).toHaveURL(/screen=transfer-review/);
  const reviewNote = page.locator('[data-nova-phase3-buffer-note]');
  await expect(reviewNote).toBeVisible();
  await expect(reviewNote).toContainText('Protected buffer stays reserved');
  await expect(page.locator('.impact-panel > h2')).toContainText(/next 14 days/i);
});

test('F-04 makes no-money-moved status dominant after biometric failure while preserving recovery continuity', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=biometric-failed');

  const banner = page.locator('[data-nova-phase3-recovery]');
  await expect(banner).toBeVisible();
  await expect(banner).toContainText('No money moved');
  await expect(banner).toContainText('Biometric verification failed before the transfer was submitted');
  await expect(banner).toContainText(/Balance unchanged\s*[·–-]\s*€2,840\.00/);
  await expect(banner).toBeFocused();

  const existingRecovery = page.locator('[data-nova-recovery-reassurance="true"]');
  await expect(existingRecovery).toBeVisible();
  await expect(existingRecovery).toContainText('Biometric verification failed — no money moved.');
  await expect(existingRecovery).toContainText('the transfer was not submitted and your balance is unchanged');
  await expect(existingRecovery).toHaveClass(/nova-phase3-recovery-support/);
  await expect(existingRecovery.locator('xpath=..')).toHaveClass(/task-panel/);
});

test('F-04 keeps offline reassurance inside the decision card', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=offline');

  const banner = page.locator('[data-nova-phase3-recovery]');
  const existingRecovery = page.locator('[data-nova-recovery-reassurance="true"]');
  await expect(banner).toBeVisible();
  await expect(banner).toContainText('No money moved');
  await expect(existingRecovery).toBeVisible();
  await expect(existingRecovery).toHaveClass(/nova-phase3-recovery-support/);
  await expect(existingRecovery.locator('xpath=..')).toHaveClass(/task-panel/);
});

test('F-04 augments generic revalidation failure without replacing its recovery contract', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=error');

  const banner = page.locator('[data-nova-phase3-recovery]');
  await expect(banner).toBeVisible();
  await expect(banner).toContainText('No money moved');
  await expect(banner).toContainText('Balance revalidation failed before confirmation');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Something changed before confirmation');
  await expect(page.getByText('Balance revalidation failed before confirmation. No money moved and the transfer was not submitted. Review the amount and try again.', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Review again' })).toBeVisible();
});

test('amount validation error is programmatically announced', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=transfer-amount');

  const input = page.getByLabel('Amount');
  const error = page.locator('#amount-error');
  await expect(error).toHaveAttribute('role', 'alert');
  await expect(error).toHaveAttribute('aria-live', 'assertive');
  await expect(error).toHaveAttribute('aria-atomic', 'true');

  await input.fill('3000');
  await page.getByRole('button', { name: /Review transfer/ }).click();
  await expect(error).toBeVisible();
  await expect(error).toContainText('You need €160.00 more to send this amount.');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
});

test('runtime exposes the evidence boundary rather than implying moderated validation', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  await expect(page.locator('html')).toHaveAttribute('data-nova-phase3-evidence', 'round02-informed-not-moderated');
});
