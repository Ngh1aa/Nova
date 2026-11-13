import { test, expect } from '@playwright/test';

test('D-02 makes consequences primary and separates Freeze from Report', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => sessionStorage.clear());
  await page.goto('/app.html?screen=transaction-detail&lab=1');

  const protection = page.locator('.protection-band');
  // v6.1: one visible status replaces the band, intro and footnote that repeated it.
  await expect(protection.locator('.nova-d02-status')).toHaveText('Not reported yet');
  await expect(protection.locator('.nova-d02-status')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Card protection' })).toBeVisible();

  const freezeCard = protection.locator('[data-nova-d02-action="freeze"]');
  const reportCard = protection.locator('[data-nova-d02-action="report"]');
  await expect(freezeCard).toBeVisible();
  await expect(reportCard).toBeVisible();
  await expect(freezeCard).toContainText('Pauses new card payments');
  await expect(freezeCard).toContainText('Reverse this payment or report it');
  await expect(reportCard).toContainText('Sends the payment to our team for review');
  await expect(reportCard).toContainText('Freeze your card');

  const freeze = page.getByRole('button', { name: 'Freeze card' });
  const reportPreview = page.getByRole('link', { name: 'Report payment' });
  await expect(freeze).toBeVisible();
  await expect(reportPreview).toBeVisible();
  await expect(freeze).toHaveAttribute('aria-describedby', 'nova-d02-freeze-effects');
  await expect(reportPreview).toHaveAttribute('aria-describedby', 'nova-d02-report-effects');

  await freeze.click();
  const freezeDialog = page.getByRole('dialog', { name: 'Freeze card ending 4821?' });
  await expect(freezeDialog).toBeVisible();
  await expect(freezeDialog.locator('.nova-d02-dialog-boundary')).toContainText(/FREEZE ONLY.*PAYMENT NOT REPORTED/i);
  await expect(freezeDialog).toContainText('doesn’t report ByteMart or reverse the payment');
  await expect(freezeDialog.getByRole('button', { name: 'Freeze card' })).toBeVisible();
  await freezeDialog.getByRole('button', { name: 'Cancel' }).click();

  await reportPreview.click();
  await expect(page).toHaveURL(/screen=report-transaction/);
  await expect(page.locator('.task-panel .nova-d02-boundary')).toContainText(/NOT SENT YET/i);
  await expect(page.getByRole('heading', { name: 'ByteMart Online' })).toBeVisible();
  await expect(page.getByText('Not sent yet', { exact: true })).toBeVisible();
  await expect(page.locator('.task-panel .callout').getByText('A refund isn’t guaranteed until the review is complete')).toBeVisible();
  await expect(page.locator('.nova-d02-report-note')).toContainText('Your card stays unchanged');
  await expect(page.locator('.review-list')).toContainText('ByteMart Online');
  await expect(page.locator('.review-list')).toContainText('−€189.40');

  await page.getByRole('link', { name: 'Send report' }).click();
  await expect(page).toHaveURL(/screen=report-transaction&state=handoff/);
  await expect(page.locator('.task-panel .nova-d02-boundary')).toContainText(/REPORT RECEIVED/i);
  await expect(page.getByText('Reference NVA-R-20915')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Under review' })).toBeVisible();
  await expect(page.getByText('Review within 2 business days', { exact: true })).toBeVisible();
  await expect(page.locator('.nova-d02-report-note')).toContainText('Reporting did not freeze or unfreeze the card');
  await expect(page.locator('.review-list')).toContainText('Report reference');
  await expect(page.locator('.review-list')).toContainText('NVA-R-20915');
  await expect(page.locator('.review-list')).toContainText('Decided after the review');
  await expect(page.getByText('Contact you in the app if we need receipts or more details.')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-nova-d02-evidence', 'round02-informed-not-retested');
});

test('D-02 reporting does not change card freeze state', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => sessionStorage.clear());

  await page.goto('/app.html?screen=report-transaction&state=handoff&lab=1');
  const frozen = await page.evaluate(() => sessionStorage.getItem('nova_card_frozen'));
  expect(frozen).toBeNull();

  await expect(page.locator('.review-list').getByText('Card protection', { exact: true })).toBeVisible();
  await expect(page.getByText('Not changed by this report', { exact: true })).toBeVisible();
  await expect(page.getByText(/report submitted/i)).toHaveCount(0);
  await expect(page.locator('.nova-d02-report-note')).toContainText('Card protection is separate');
});

test('D-02 truth boundary remains clear and operable at 390px without reviewer tooling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => sessionStorage.clear());
  await page.goto('/app.html?screen=transaction-detail&lab=1');

  await expect(page.locator('[data-nova-state-lab-launcher]')).toHaveCount(0);
  await expect(page.locator('.protection-band .nova-d02-status')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Report payment' })).toBeVisible();
  await expect(page.locator('[data-nova-d02-action]')).toHaveCount(2);

  const freezeBox = await page.locator('[data-nova-d02-action="freeze"]').boundingBox();
  const reportBox = await page.locator('[data-nova-d02-action="report"]').boundingBox();
  expect(freezeBox).not.toBeNull();
  expect(reportBox).not.toBeNull();
  expect(reportBox.y).toBeGreaterThan(freezeBox.y + freezeBox.height - 2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

  await page.getByRole('link', { name: 'Report payment' }).click();
  await expect(page.locator('.task-panel .nova-d02-boundary')).toContainText(/NOT SENT YET/i);
  await expect(page.getByRole('heading', { name: 'ByteMart Online' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Send report' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

  await page.getByRole('link', { name: 'Send report' }).click();
  await expect(page.locator('.task-panel .nova-d02-boundary')).toContainText(/REPORT RECEIVED/i);
  await expect(page.getByRole('heading', { name: 'Under review' })).toBeVisible();
  await expect(page.getByText('Decided after the review', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
