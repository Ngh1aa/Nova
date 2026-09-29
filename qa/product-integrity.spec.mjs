import { test, expect } from '@playwright/test';

async function reset(page) {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
}

function cardControl(page, name) {
  return page.locator(`input[data-control="${name}"]`);
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

test('activity search, filters and no-results state change the native ledger', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=activity');

  const rows = page.locator('.section .ledger .ledger-row');
  const visibleRows = page.locator('.section .ledger .ledger-row:not([hidden])');
  const summary = page.locator('.section .section-head .meta');
  const empty = page.locator('[data-nova-activity-empty]');
  const search = page.getByRole('searchbox', { name: 'Search transactions' });

  await expect(rows).toHaveCount(8);
  await expect(visibleRows).toHaveCount(8);
  await expect(summary).toContainText('8 transactions · newest first');

  await search.fill('ByteMart');
  await expect(visibleRows).toHaveCount(1);
  await expect(visibleRows.first()).toContainText('ByteMart Online');
  await expect(summary).toContainText('1 transaction · filtered');

  await search.fill('');
  await page.getByRole('button', { name: 'Pending', exact: true }).click();
  await expect(visibleRows).toHaveCount(1);
  await expect(visibleRows.first()).toContainText('Northstar Books');

  await page.getByRole('button', { name: 'Income', exact: true }).click();
  await expect(visibleRows).toHaveCount(1);
  await expect(visibleRows.first()).toContainText('Merchant refund');

  await page.getByRole('button', { name: 'Needs review', exact: true }).click();
  await expect(visibleRows).toHaveCount(1);
  await expect(visibleRows.first()).toContainText('ByteMart Online');

  await page.getByRole('button', { name: 'Recurring', exact: true }).click();
  await expect(visibleRows).toHaveCount(2);
  await expect(visibleRows).toContainText(['Cloudbox', 'River Gym']);

  await search.fill('does-not-exist');
  await expect(visibleRows).toHaveCount(0);
  await expect(empty).toBeVisible();
  await expect(empty).toContainText('No matching transactions');
  await expect(summary).toContainText('0 transactions · filtered');

  await empty.getByRole('button', { name: 'Clear search and filters' }).click();
  await expect(search).toHaveValue('');
  await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(visibleRows).toHaveCount(8);
  await expect(empty).toBeHidden();
});

test('card preferences persist, freeze remains authoritative, and daily limit rejects invalid values', async ({ page }) => {
  await reset(page);
  await page.goto('/app.html?screen=cards');

  const onlineQuick = cardControl(page, 'Online payments');
  const contactlessQuick = cardControl(page, 'Contactless');
  await expect(onlineQuick).toBeChecked();
  await expect(contactlessQuick).toBeChecked();

  await onlineQuick.uncheck({ force: true });
  await contactlessQuick.uncheck({ force: true });
  await expect(page.locator('[data-nova-card-status]')).toContainText('Contactless disabled');

  await page.goto('/app.html?screen=card-controls');
  const online = cardControl(page, 'Online payments');
  const contactless = cardControl(page, 'Contactless');
  const cash = cardControl(page, 'Cash withdrawals');
  const magstripe = cardControl(page, 'Magstripe');

  await expect(online).not.toBeChecked();
  await expect(contactless).not.toBeChecked();
  await expect(cash).toBeChecked();
  await expect(magstripe).not.toBeChecked();

  await cash.uncheck({ force: true });
  await magstripe.check({ force: true });
  await page.reload();
  await expect(online).not.toBeChecked();
  await expect(contactless).not.toBeChecked();
  await expect(cash).not.toBeChecked();
  await expect(magstripe).toBeChecked();

  const limit = page.getByLabel('Card purchases');
  const save = page.getByRole('button', { name: 'Save limit' });
  const error = page.locator('#daily-limit-error');
  const status = page.locator('[data-nova-card-status]');

  await expect(limit).toHaveValue('1200');

  await limit.fill('');
  await save.click();
  await expect(error).toContainText('Enter a daily card limit.');
  await expect(limit).toHaveAttribute('aria-invalid', 'true');

  await limit.fill('abc');
  await save.click();
  await expect(error).toContainText('Enter a valid number for the daily card limit.');

  await limit.fill('0');
  await save.click();
  await expect(error).toContainText('must be greater than €0');

  await limit.fill('-25');
  await save.click();
  await expect(error).toContainText('must be greater than €0');

  await limit.fill('5001');
  await save.click();
  await expect(error).toContainText('cannot exceed €5,000.00');

  await limit.fill('900.5');
  await save.click();
  await expect(error).toBeHidden();
  await expect(limit).not.toHaveAttribute('aria-invalid', 'true');
  await expect(status).toContainText('Daily card limit saved at €900.50 per day.');

  await page.reload();
  await expect(page.getByLabel('Card purchases')).toHaveValue('900.5');
  await expect(cardControl(page, 'Online payments')).not.toBeChecked();
  await expect(cardControl(page, 'Contactless')).not.toBeChecked();
  await expect(cardControl(page, 'Cash withdrawals')).not.toBeChecked();
  await expect(cardControl(page, 'Magstripe')).toBeChecked();

  await page.goto('/app.html?screen=cards');
  await page.getByRole('button', { name: 'Freeze', exact: true }).click();
  const freezeDialog = page.getByRole('dialog', { name: 'Freeze card?' });
  await expect(freezeDialog).toBeVisible();
  await freezeDialog.getByRole('button', { name: 'Freeze card', exact: true }).click();
  await expect(page).toHaveURL(/screen=cards/);

  await expect(cardControl(page, 'Online payments')).toBeDisabled();
  await expect(cardControl(page, 'Online payments')).not.toBeChecked();
  await expect(page.locator('[data-nova-card-status]')).toContainText('all new card payments and ATM withdrawals remain blocked');

  await page.goto('/app.html?screen=card-controls');
  await expect(cardControl(page, 'Online payments')).toBeDisabled();
  await expect(cardControl(page, 'Contactless')).toBeDisabled();
  await expect(cardControl(page, 'Cash withdrawals')).toBeDisabled();
  await expect(cardControl(page, 'Magstripe')).toBeDisabled();
  await expect(page.getByLabel('Card purchases')).toHaveValue('900.5');

  await page.goto('/app.html?screen=cards');
  await page.getByRole('button', { name: 'Unfreeze', exact: true }).click();
  const unfreezeDialog = page.getByRole('dialog', { name: 'Unfreeze card?' });
  await expect(unfreezeDialog).toBeVisible();
  await unfreezeDialog.getByRole('button', { name: 'Authenticate & unfreeze', exact: true }).click();
  await expect(page).toHaveURL(/screen=cards/);

  await expect(cardControl(page, 'Online payments')).toBeEnabled();
  await expect(cardControl(page, 'Online payments')).not.toBeChecked();
  await expect(cardControl(page, 'Contactless')).toBeEnabled();
  await expect(cardControl(page, 'Contactless')).not.toBeChecked();
});
