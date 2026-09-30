import { test, expect } from '@playwright/test';

test('D-02 makes demo-only consequences primary and separates Freeze from Report', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/app.html?screen=transaction-detail&lab=1');

  const protection = page.locator('.protection-band');
  await expect(protection.locator('.nova-d02-boundary')).toContainText(/DEMO ONLY.*NO BANK CONTACT/i);
  await expect(page.getByRole('heading', { name: 'Freeze card and Report do different things' })).toBeVisible();

  const freezeCard = protection.locator('[data-nova-d02-action="freeze"]');
  const reportCard = protection.locator('[data-nova-d02-action="report"]');
  await expect(freezeCard).toBeVisible();
  await expect(reportCard).toBeVisible();
  await expect(freezeCard).toContainText('Prototype card state only');
  await expect(freezeCard).toContainText('Report the transaction, reverse ByteMart, or contact a bank');
  await expect(reportCard).toContainText('Nothing in account or card state');
  await expect(reportCard).toContainText('Freeze the card, create a bank case, request a refund, or contact a bank');

  const freeze = page.getByRole('button', { name: /Freeze card in demo.*no bank contact/i });
  const reportPreview = page.getByRole('link', { name: /Preview report steps.*no bank case created.*no bank contact/i });
  await expect(freeze).toBeVisible();
  await expect(reportPreview).toBeVisible();
  await expect(page.locator('[data-report-boundary]')).toContainText('Neither action contacts a bank');
  await expect(page.locator('[data-report-boundary]')).toContainText('Freeze does not report the transaction');
  await expect(page.locator('[data-report-boundary]')).toContainText('Report preview does not freeze the card');

  await freeze.click();
  const freezeDialog = page.getByRole('dialog', { name: /Freeze demo card only.*no bank contact/i });
  await expect(freezeDialog).toBeVisible();
  await expect(freezeDialog.locator('.nova-d02-dialog-boundary')).toContainText(/DEMO ONLY.*NO BANK CONTACT/i);
  await expect(freezeDialog).toContainText('does not report ByteMart, reverse the payment, or contact a bank');
  await expect(freezeDialog.getByRole('button', { name: /Freeze demo card only.*no bank contact/i })).toBeVisible();
  await freezeDialog.getByRole('button', { name: 'Cancel' }).click();

  await reportPreview.click();
  await expect(page).toHaveURL(/screen=report-transaction/);
  await expect(page.locator('.task-panel .nova-d02-boundary')).toContainText(/DEMO ONLY.*NO BANK CONTACT/i);
  await expect(page.getByRole('heading', { name: 'Preview reporting ByteMart Online' })).toBeVisible();
  await expect(page.getByText('Nothing has been reported')).toBeVisible();
  await expect(page.getByText('cannot contact a bank, create a dispute, request a refund, or freeze the card')).toBeVisible();
  await expect(page.locator('.nova-d02-report-note')).toContainText('Report preview does not freeze the card');
  await expect(page.locator('.review-list')).toContainText('ByteMart Online');
  await expect(page.locator('.review-list')).toContainText('−€189.40');

  await page.getByRole('link', { name: /Preview bank handoff requirements.*no bank contact/i }).click();
  await expect(page).toHaveURL(/screen=report-transaction&state=handoff/);
  await expect(page.locator('.task-panel .nova-d02-boundary')).toContainText(/DEMO RESULT.*NO BANK CASE CREATED/i);
  await expect(page.getByText(/Demo result.*simulated support handoff/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'No bank case created' })).toBeVisible();
  await expect(page.getByText('Nothing was submitted')).toBeVisible();
  await expect(page.locator('.nova-d02-report-note')).toContainText('This report preview did not freeze or unfreeze the card');
  await expect(page.locator('.review-list')).toContainText('Bank case');
  await expect(page.locator('.review-list')).toContainText('Not created');
  await expect(page.locator('.review-list')).toContainText('Not requested or promised');
  await expect(page.getByText('Create a case/reference only after a real submission succeeds.')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-nova-d02-evidence', 'round02-informed-not-retested');
});

test('D-02 report preview does not change card freeze state', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());

  await page.goto('/app.html?screen=report-transaction&state=handoff&lab=1');
  const frozen = await page.evaluate(() => localStorage.getItem('nova_card_frozen'));
  expect(frozen).toBeNull();

  await expect(page.locator('.review-list').getByText('Card protection', { exact: true })).toBeVisible();
  await expect(page.getByText('Not changed by this preview', { exact: true })).toBeVisible();
  await expect(page.getByText(/report submitted/i)).toHaveCount(0);
  await expect(page.locator('.nova-d02-report-note')).toContainText('Card protection is separate');
});

test('D-02 truth boundary remains clear and operable at 390px without reviewer tooling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/app.html?screen=transaction-detail&lab=1');

  await expect(page.locator('[data-nova-state-lab-launcher]')).toHaveCount(0);
  await expect(page.locator('.nova-d02-boundary')).toContainText(/DEMO ONLY.*NO BANK CONTACT/i);
  await expect(page.getByRole('link', { name: /Preview report steps.*no bank case created/i })).toBeVisible();
  await expect(page.locator('[data-nova-d02-action]')).toHaveCount(2);

  const freezeBox = await page.locator('[data-nova-d02-action="freeze"]').boundingBox();
  const reportBox = await page.locator('[data-nova-d02-action="report"]').boundingBox();
  expect(freezeBox).not.toBeNull();
  expect(reportBox).not.toBeNull();
  expect(reportBox.y).toBeGreaterThan(freezeBox.y + freezeBox.height - 2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

  await page.getByRole('link', { name: /Preview report steps.*no bank case created/i }).click();
  await expect(page.locator('.task-panel .nova-d02-boundary')).toContainText(/DEMO ONLY.*NO BANK CONTACT/i);
  await expect(page.getByRole('heading', { name: 'Preview reporting ByteMart Online' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Preview bank handoff requirements.*no bank contact/i })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

  await page.getByRole('link', { name: /Preview bank handoff requirements.*no bank contact/i }).click();
  await expect(page.locator('.task-panel .nova-d02-boundary')).toContainText(/DEMO RESULT.*NO BANK CASE CREATED/i);
  await expect(page.getByRole('heading', { name: 'No bank case created' })).toBeVisible();
  await expect(page.getByText('Not requested or promised', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
