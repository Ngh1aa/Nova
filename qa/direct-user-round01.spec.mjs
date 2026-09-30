import { test, expect } from '@playwright/test';

test('D-01 Safe to spend exposes its time horizon at the primary decision number', async ({ page }) => {
  await page.goto('/app.html?screen=home&lab=1');
  await expect(page.getByText('Safe to spend · next 14 days', { exact: true })).toBeVisible();
  await expect(page.getByText('Estimate through 30 Sep', { exact: true })).toBeVisible();
});

test('D-02 sensitive actions state simulated consequences before interaction', async ({ page }) => {
  await page.goto('/app.html?screen=transaction-detail&lab=1');
  await expect(page.getByText('Demo-only protection', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Freeze card in demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Preview report steps' })).toBeVisible();
  await expect(page.locator('[data-report-boundary]')).toContainText('neither action contacts a bank');
});

test('D-03 transfer review explains the projected amount as a calculation', async ({ page }) => {
  await page.goto('/app.html?screen=transfer-review&lab=1');
  const review = page.locator('.review-list');
  await expect(review).toContainText('Impact calculation');
  await expect(review).toContainText('€1,300.00 − €145.00 − €0.00 = €1,155.00');
  await expect(review).toContainText('Protected buffer €500.00 stays reserved');
  await expect(page.getByRole('heading', { name: 'Projected safe to spend · next 14 days' })).toBeVisible();
  await expect(page.getByText('Nova does not pull from it automatically.')).toBeVisible();
});

test('D-04 recovery pairs the cause with no-money-moved reassurance', async ({ page }) => {
  await page.goto('/app.html?screen=biometric-failed&lab=1');
  await expect(page.getByText('Biometric verification failed — transfer not submitted', { exact: true })).toBeVisible();
  await expect(page.getByText('No money moved and your balance is unchanged.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Use passcode' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try biometrics again' })).toBeVisible();

  await page.goto('/app.html?screen=error&lab=1');
  await expect(page.getByText('Balance revalidation failed before confirmation. No money moved and the transfer was not submitted.')).toBeVisible();
});
