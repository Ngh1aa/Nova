import { test, expect } from '@playwright/test';

// End-to-end coverage for the completed prototype workflows (feature/full-prototype).
// All data lives in sessionStorage, seeded from assets/nova-demo-data.js; nothing reaches a server.

const STATE_KEY = 'nova_demo_state_v1';
const app = (screen, extra = '') => `/app.html?screen=${screen}${extra}`;

let consoleErrors = [];
test.beforeEach(async ({ page }) => {
  consoleErrors = [];
  // A refused connection comes from the single-threaded local static server under load
  // (py -m http.server), not from the app; every other console error fails the test.
  page.on('console', (message) => { if (message.type() === 'error' && !/ERR_CONNECTION_REFUSED/.test(message.text())) consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(String(error)));
  await page.emulateMedia({ reducedMotion: 'reduce' });
});
test.afterEach(async () => { expect(consoleErrors, `console errors: ${consoleErrors.join(' | ')}`).toEqual([]); });

const dialog = (page) => page.getByRole('dialog');
async function submit(page, name) {
  await dialog(page).getByRole('button', { name, exact: true }).click();
}
// Demo tools (reset, failure simulation) live in a collapsed panel that only ?demo=1 shows.
async function openDemoTools(page) {
  const tools = page.locator('[data-nova-demo-tools]');
  if (!(await tools.evaluate((node) => node.open))) await tools.locator('summary').click();
}
async function expectFieldError(page, text) {
  await page.waitForSelector(`.dialog .field-error:has-text("${text}")`);
}

test('payees: add with validation, view, edit, delete, not-found and empty states', async ({ page }) => {
  await page.goto(app('transfer-recipient'));
  await page.getByRole('link', { name: /Manage payees/ }).click();
  await expect(page.locator('#main h1')).toHaveText('Payees');
  await page.waitForSelector('[data-wf-payee-list]');
  await expect(page.locator('[data-wf-payee-list] .nova-wf-row')).toHaveCount(4);

  await page.getByRole('button', { name: 'Add payee' }).first().click();
  await submit(page, 'Save payee');
  await expectFieldError(page, 'Enter the payee’s full name.');
  await expectFieldError(page, 'Enter an IBAN.');
  await page.getByLabel('Full name').fill('Sofia Romano');
  await page.getByLabel('IBAN').fill('IE26 NRTH 9300 1520 4820 49');
  await submit(page, 'Save payee');
  await expectFieldError(page, 'This IBAN doesn’t look right');
  await page.getByLabel('IBAN').fill('IE26 NRTH 9300 1520 4820 48');
  await submit(page, 'Save payee');
  await expectFieldError(page, 'You already have a payee with this IBAN.');
  await page.getByLabel('IBAN').fill('DE89 3704 0044 0532 0130 00');
  await page.getByLabel('Bank (optional)').fill('Rhein Bank');
  await submit(page, 'Save payee');
  await page.waitForURL(/screen=payees&payee=payee-/);
  await expect(page.locator('#main h1')).toHaveText('Sofia Romano');
  await page.waitForSelector('.task-panel .detail-grid');
  await expect(page.locator('.task-panel')).toContainText('DE89 3704 0044 0532 0130 00');
  await expect(page.locator('.toast')).toContainText('Sofia Romano saved as a payee.');

  // The new payee is offered in the transfer flow and keeps its identity through review.
  await page.getByRole('link', { name: 'Send money' }).click();
  await expect(page.locator('.task-panel > h2')).toHaveText('Send to Sofia Romano');

  await page.goBack();
  await page.waitForSelector('[data-wf="payee-edit"]');
  await page.getByRole('button', { name: 'Edit payee' }).click();
  await page.getByLabel('Nickname (optional)').fill('Landlady');
  await submit(page, 'Save changes');
  await page.waitForSelector('.task-panel .detail-grid:has-text("Landlady")');

  await page.reload();
  await page.waitForSelector('.task-panel .detail-grid:has-text("Landlady")');

  await page.getByRole('button', { name: 'Delete payee' }).click();
  await expect(dialog(page)).toContainText('Delete Sofia Romano?');
  await submit(page, 'Delete payee');
  await page.waitForURL(/screen=payees$/);
  await page.waitForSelector('[data-wf-payee-list]');
  await expect(page.locator('[data-wf-payee-list]')).not.toContainText('Sofia Romano');

  await page.locator('#nova-wf-payee-search').fill('zzz');
  await expect(page.getByText('No payees match your search')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.locator('[data-wf-payee-list] .nova-wf-row:visible')).toHaveCount(4);

  await page.goto(app('payees', '&payee=missing'));
  await expect(page.locator('#main h1')).toHaveText('Payee not found');
  await expect(page.getByRole('link', { name: 'Back to payees' })).toBeVisible();

  await page.evaluate((key) => sessionStorage.setItem(key, JSON.stringify({ version: 1, payees: [], scheduled: [] })), STATE_KEY);
  await page.goto(app('payees'));
  await page.waitForSelector('text=No saved payees yet');
  await page.goto(app('transfer-recipient'));
  await expect(page.getByText('No saved payees', { exact: true })).toBeVisible();
});

test('scheduled and recurring transfers: create, view, edit, cancel, restore and remove', async ({ page }) => {
  await page.goto(app('transfer-recipient'));
  await page.getByRole('link', { name: /Schedule/ }).click();
  await expect(page.locator('#main h1')).toHaveText('Scheduled transfers');
  await page.waitForSelector('.nova-wf-list');
  await expect(page.locator('[data-wf-count]')).toHaveText('2 planned');

  await page.getByRole('button', { name: 'New scheduled transfer' }).click();
  await page.getByLabel('Pay to').selectOption('daniel-lee-7184');
  await page.getByLabel('Amount (€)').fill('0');
  await page.getByLabel('First transfer date').fill('2026-09-10');
  await submit(page, 'Schedule transfer');
  await expectFieldError(page, 'Enter an amount greater than €0.');
  await expectFieldError(page, 'Choose a date after today');
  await page.getByLabel('Amount (€)').fill('45.50');
  await page.getByLabel('First transfer date').fill('2026-10-01');
  await page.getByLabel('Repeat').selectOption('weekly');
  await page.getByLabel('Reference (optional)').fill('Five-a-side');
  await submit(page, 'Schedule transfer');
  await page.waitForURL(/screen=scheduled&transfer=sch-/);
  await expect(page.locator('#main h1')).toHaveText('€45.50 to Daniel Lee');
  await page.waitForSelector('.task-panel .detail-grid');
  await expect(page.locator('.task-panel')).toContainText('Every week');
  await expect(page.locator('.task-panel')).toContainText('We’ll remind you the day before');

  await page.getByRole('button', { name: 'Edit transfer' }).click();
  await page.getByLabel('Amount (€)').fill('60');
  await submit(page, 'Save changes');
  await page.waitForSelector('#main h1:has-text("€60.00 to Daniel Lee")');

  await page.getByRole('button', { name: 'Cancel transfer' }).click();
  await expect(dialog(page)).toContainText('Cancel all future transfers?');
  await submit(page, 'Cancel transfer');
  await page.waitForSelector('.task-panel .status:has-text("Cancelled")');
  await page.getByRole('button', { name: 'Restore transfer' }).click();
  await page.waitForSelector('.task-panel .status:has-text("Planned")');

  await page.goto(app('scheduled'));
  await page.waitForSelector('.nova-wf-list');
  await expect(page.locator('[data-wf-count]')).toHaveText('3 planned');
  await page.locator('.nova-wf-row', { hasText: 'Birthday gift' }).click();
  await page.waitForSelector('[data-wf="scheduled-cancel"]');
  await page.getByRole('button', { name: 'Cancel transfer' }).click();
  await submit(page, 'Cancel transfer');
  await page.waitForSelector('[data-wf="scheduled-delete"]');
  await page.getByRole('button', { name: 'Remove from history' }).click();
  await submit(page, 'Remove');
  await page.waitForURL(/screen=scheduled$/);
  await page.waitForSelector('.nova-wf-list');
  await expect(page.locator('#main')).not.toContainText('Birthday gift');

  await page.goto(app('scheduled', '&transfer=missing'));
  await expect(page.locator('#main h1')).toHaveText('Scheduled transfer not found');
});

test('cards: PIN reveal, replacement with freeze, extra limits and freeze toggle', async ({ page }) => {
  await page.goto(app('cards'));
  await page.getByRole('button', { name: /Show PIN/ }).click();
  await page.getByLabel('Passcode').fill('1111');
  await submit(page, 'Show PIN');
  await expectFieldError(page, 'That passcode doesn’t match.');
  await page.getByLabel('Passcode').fill('2468');
  await submit(page, 'Show PIN');
  await page.waitForSelector('.nova-wf-pin strong');
  await expect(page.locator('.nova-wf-pin strong')).toHaveText('7302');
  await dialog(page).getByRole('button', { name: 'Hide PIN' }).click();
  await expect(page.locator('.nova-wf-pin')).toHaveCount(0);

  await page.getByRole('button', { name: /Replace card/ }).click();
  await dialog(page).getByLabel(/Lost card/).check();
  await submit(page, 'Order replacement');
  await page.waitForSelector('.nova-wf-card .nova-wf-note');
  await expect(page.locator('.nova-wf-card .nova-wf-note')).toContainText('New card ordered');
  await expect(page.locator('[data-v3-card-state]')).toContainText('Frozen');
  await page.getByRole('button', { name: /Cancel replacement/ }).click();
  await submit(page, 'Cancel replacement');
  await page.waitForSelector('[data-wf="card-replace"]');

  await page.locator('[data-v3-freeze]').click();
  await expect(page.locator('[data-v3-card-state]')).toContainText('Active');

  await page.goto(app('card-controls'));
  await page.getByLabel('Cash withdrawals per month (€)').fill('5000');
  await page.getByRole('button', { name: 'Save cash and contactless limits' }).click();
  await page.waitForSelector('#wf-atm-limit-error:has-text("€0 to €1,000")');
  await page.getByLabel('Cash withdrawals per month (€)').fill('300');
  await page.getByLabel('Single contactless payment (€)').fill('40');
  await page.getByRole('button', { name: 'Save cash and contactless limits' }).click();
  await page.waitForSelector('.toast:has-text("Limits saved")');
  await page.goto(app('cards'));
  await expect(page.locator('.v3-limits-card')).toContainText('€300 / month');
  await expect(page.locator('.v3-limits-card')).toContainText('€40');
});

test('savings goals: create, contribute, withdraw, edit, delete and empty state', async ({ page }) => {
  await page.goto(app('savings'));
  await page.getByRole('button', { name: 'New goal' }).click();
  await submit(page, 'Create goal');
  await expectFieldError(page, 'Give the goal a name.');
  await page.getByLabel('Goal name').fill('Bike');
  await page.getByLabel('Target (€)').fill('900');
  await submit(page, 'Create goal');
  await page.waitForURL(/goal=custom-/);
  await expect(page.locator('#main h1')).toHaveText('Bike');

  await page.getByRole('button', { name: 'Add money' }).click();
  await page.getByLabel('Amount (€)').fill('1000');
  await submit(page, 'Add money');
  await expectFieldError(page, 'Enter €900.00 or less.');
  await page.getByLabel('Amount (€)').fill('250');
  await submit(page, 'Add money');
  await page.waitForSelector('.goal-amount:has-text("€250.00")');
  await expect(page.locator('.nova-wf-card')).toContainText('Added');

  await page.getByRole('button', { name: 'Withdraw' }).click();
  await page.getByLabel('Amount (€)').fill('300');
  await submit(page, 'Withdraw');
  await expectFieldError(page, 'You can withdraw up to €250.00.');
  await page.getByLabel('Amount (€)').fill('50');
  await submit(page, 'Withdraw');
  await page.waitForSelector('.goal-amount:has-text("€200.00")');

  await page.getByRole('button', { name: 'Edit goal' }).click();
  await page.getByLabel('Target (€)').fill('100');
  await submit(page, 'Save changes');
  await expectFieldError(page, 'can’t be below the €200.00 already saved');
  await page.getByLabel('Goal name').fill('Road bike');
  await page.getByLabel('Target (€)').fill('1200');
  await submit(page, 'Save changes');
  await page.waitForSelector('#main h1:has-text("Road bike")');
  await expect(page.locator('.task-panel')).toContainText('€1,200.00 target');

  await page.getByRole('button', { name: 'Delete goal' }).click();
  await submit(page, 'Delete goal');
  await page.waitForURL(/screen=savings$/);
  await expect(page.locator('.v3-goal-row', { hasText: 'Road bike' })).toHaveCount(0);

  await page.goto(app('savings-detail', '&goal=custom-missing'));
  await expect(page.locator('#main')).toContainText('Item not found');
  await page.evaluate((key) => sessionStorage.setItem(key, JSON.stringify({ version: 1, goals: [] })), STATE_KEY);
  await page.goto(app('savings'));
  await expect(page.getByText('No savings goals yet')).toBeVisible();
});

test('subscriptions: pause, resume, cancel with merchant confirmation and restore', async ({ page }) => {
  await page.goto(app('subscriptions'));
  await expect(page.locator('.recurring-total strong')).toHaveText('€80.99');
  await page.locator('.ledger-row', { hasText: 'Streaming service' }).click();
  await page.getByRole('button', { name: 'Pause payments' }).click();
  await expect(dialog(page)).toContainText('Pausing is not cancelling');
  await submit(page, 'Pause payments');
  await page.waitForSelector('.task-panel .status:has-text("Paused")');
  await page.goto(app('subscriptions'));
  await expect(page.locator('.recurring-total strong')).toHaveText('€66.00');
  await expect(page.locator('.ledger-row', { hasText: 'Streaming service' })).toContainText('paused');

  await page.goto(app('payment-detail', '&payment=streaming-service'));
  await page.getByRole('button', { name: 'Resume payments' }).click();
  await page.waitForSelector('.task-panel .status:has-text("Active")');

  await page.getByRole('button', { name: 'Cancel subscription' }).click();
  await expect(dialog(page)).toContainText('cancel with Streamly directly');
  await submit(page, 'Cancel subscription');
  await page.waitForSelector('.dialog .field-error:has-text("Confirm you’ve cancelled with Streamly first.")');
  await dialog(page).getByRole('checkbox').check();
  await submit(page, 'Cancel subscription');
  await page.waitForURL(/screen=subscriptions$/);
  await expect(page.locator('.ledger-row', { hasText: 'Streaming service' })).toHaveCount(0);
  await expect(page.locator('.subscription-schedule')).toContainText('Cancelled in Nova');
  await page.getByRole('button', { name: 'Restore Streaming service' }).click();
  await page.waitForSelector('.ledger-row:has-text("Streaming service")');
  await expect(page.locator('.recurring-total strong')).toHaveText('€80.99');
});

test('notifications: unread state, mark all, mark unread, dismiss, empty state and preferences', async ({ page }) => {
  await page.goto(app('notifications'));
  await expect(page.locator('.nova-bell-chip').first()).toHaveAttribute('aria-label', 'Notifications, 2 unread');
  await expect(page.locator('.notification-item.is-unread')).toHaveCount(2);
  await page.locator('[data-notification-preview="rent"]').click();
  await page.waitForURL(/notification=rent/);
  await expect(page.locator('.notification-item.is-unread')).toHaveCount(1);
  await page.getByRole('button', { name: 'Mark as unread' }).click();
  await page.waitForURL(/keep=1/);
  await expect(page.locator('.notification-item.is-unread')).toHaveCount(2);
  await page.getByRole('button', { name: 'Mark all as read' }).click();
  await page.waitForSelector('.nova-wf-inbox-tools:has-text("All read")');
  await expect(page.locator('.notification-item.is-unread')).toHaveCount(0);
  await expect(page.locator('.nova-bell-chip').first()).toHaveAttribute('aria-label', 'Notifications');

  for (let dismissed = 1; dismissed <= 3; dismissed++) {
    await Promise.all([page.waitForEvent('load'), page.getByRole('button', { name: 'Dismiss' }).click()]);
    await page.waitForSelector('.notification-list');
    expect(await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)).notifications.filter((item) => item.dismissed).length, STATE_KEY)).toBe(dismissed);
  }
  await expect(page.getByText('You’re all caught up')).toBeVisible();
  await page.getByRole('button', { name: 'Show dismissed alerts' }).click();
  await page.waitForSelector('[data-notification-preview="payment"]:visible');

  await page.getByRole('link', { name: /Notification settings/ }).click();
  await page.waitForURL(/screen=settings#notification-preferences/);
  const instant = page.getByRole('checkbox', { name: 'Instant payment alerts' });
  await instant.uncheck({ force: true });
  await page.reload();
  await expect(page.getByRole('checkbox', { name: 'Instant payment alerts' })).not.toBeChecked();
});

test('settings: profile edit validates and persists, date format, demo failure and reset', async ({ page }) => {
  await page.goto(app('settings', '&demo=1'));
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.getByLabel('Email', { exact: true }).fill('not-an-email');
  await page.getByLabel('Mobile number').fill('087 555');
  await submit(page, 'Save changes');
  await expectFieldError(page, 'Enter an email like name@novamail.app.');
  await expectFieldError(page, 'Start with + and the country code');
  await page.getByLabel('Name', { exact: true }).fill('Alex Byrne');
  await page.getByLabel('Email', { exact: true }).fill('alex.byrne@novamail.app');
  await page.getByLabel('Mobile number').fill('+353 86 123 4567');
  await submit(page, 'Save changes');
  await page.waitForSelector('.toast:has-text("Profile saved")');
  await page.reload();
  await expect(page.locator('.v3-settings-profile h2')).toHaveText('Alex Byrne');
  await expect(page.locator('.v3-settings-profile p')).toHaveText('alex.byrne@novamail.app');

  await page.getByRole('button', { name: /Date format/ }).click();
  await dialog(page).getByLabel(/15\/09\/2026/).check();
  await submit(page, 'Save format');
  await page.waitForSelector('[data-wf="date-format"] small:has-text("DD/MM/YYYY")');

  // Simulated failure: the request fails once, the form keeps its input and retry succeeds.
  await openDemoTools(page);
  await page.getByLabel('Simulate a failed request').selectOption('next');
  await page.goto(app('payees'));
  await page.waitForSelector('[data-nova-wf-region] .nova-wf-alert');
  await expect(page.getByText('Couldn’t load this list')).toBeVisible();
  await page.getByRole('button', { name: 'Try again' }).click();
  await page.waitForSelector('[data-wf-payee-list]');

  await page.goto(app('settings'));
  await openDemoTools(page);
  await page.getByLabel('Simulate a failed request').selectOption('always');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.getByLabel('Name', { exact: true }).fill('Alex Failure');
  await submit(page, 'Save changes');
  await page.waitForSelector('.dialog [data-wf-dialog-error]:not([hidden])');
  await expect(dialog(page)).toContainText('Nothing was changed');
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Alex Failure');
  await page.keyboard.press('Escape');
  await openDemoTools(page);
  await page.getByLabel('Simulate a failed request').selectOption('off');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.getByLabel('Name', { exact: true }).fill('Alex Retry');
  await submit(page, 'Save changes');
  await page.waitForSelector('.v3-settings-profile h2:has-text("Alex Retry")');

  await openDemoTools(page);
  await page.getByRole('button', { name: 'Reset demo data' }).click();
  await submit(page, 'Reset demo data');
  await page.waitForSelector('.toast:has-text("Demo data reset")');
  await expect(page.locator('.v3-settings-profile h2')).toHaveText('Alex Nguyen');
  await expect(page.getByLabel('Simulate a failed request')).toHaveValue('off');
  await expect(page.locator('[data-wf="date-format"] small')).toHaveText('DD MMM YYYY');
});

test('security: device review, sign out one and all others, passcode rules and activity log', async ({ page }) => {
  await page.goto(app('security'));
  await expect(page.locator('.v3-devices-card .v3-device-row')).toHaveCount(3);
  await page.getByRole('button', { name: 'Review MacBook Pro' }).click();
  await expect(dialog(page)).toContainText('Ho Chi Minh City');
  await dialog(page).getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Sign out MacBook Pro' }).click();
  await submit(page, 'Sign out');
  await page.waitForSelector('.toast:has-text("MacBook Pro signed out")');
  await expect(page.locator('.v3-devices-card .v3-device-row')).toHaveCount(2);
  await expect(page.locator('.v3-security-log')).toContainText('Device signed out');
  await page.getByRole('button', { name: 'Sign out all others' }).click();
  await submit(page, 'Sign out all others');
  await page.waitForSelector('.v3-devices-card:has-text("Only this device is signed in.")');

  await page.getByRole('button', { name: /Change passcode/ }).click();
  await page.getByLabel('Current passcode').fill('2468');
  await page.getByLabel('New passcode', { exact: true }).fill('1234');
  await page.getByLabel('Confirm new passcode').fill('1234');
  await submit(page, 'Change passcode');
  await expectFieldError(page, 'Avoid repeated or sequential numbers');
  await page.getByLabel('New passcode', { exact: true }).fill('5820');
  await page.getByLabel('Confirm new passcode').fill('5821');
  await submit(page, 'Change passcode');
  await expectFieldError(page, 'The passcodes don’t match.');
  await page.getByLabel('Confirm new passcode').fill('5820');
  await submit(page, 'Change passcode');
  await page.waitForSelector('.v3-action-tile:has-text("Last changed just now")');
  await expect(page.locator('.v3-security-log')).toContainText('Passcode changed');
});

test('activity: search, filters and dispute drafts without any bank submission', async ({ page }) => {
  await page.goto(app('activity'));
  await page.locator('#txn-search').fill('greenline');
  await expect(page.locator('.ledger-row:visible')).toHaveCount(1);
  await page.locator('#txn-search').fill('');
  await page.getByRole('button', { name: 'Income', exact: true }).click();
  await expect(page.locator('.ledger-row:visible')).toHaveCount(1);
  await page.getByRole('button', { name: 'All', exact: true }).click();

  await page.getByRole('link', { name: /Dispute drafts/ }).click();
  await page.waitForSelector('text=No dispute drafts');
  await page.goto(app('transaction-detail', '&transaction=northstar-books'));
  await page.getByRole('button', { name: 'Draft a dispute' }).click();
  await page.getByLabel('Amount in question (€)').fill('40');
  await page.getByLabel('What happened?').fill('short');
  await submit(page, 'Save draft');
  await expectFieldError(page, 'can’t be more than the €28.50 transaction');
  await expectFieldError(page, 'at least 10 characters');
  await dialog(page).getByLabel('Wrong amount').check();
  await page.getByLabel('Amount in question (€)').fill('8.50');
  await page.getByLabel('What happened?').fill('Charged €28.50 but the receipt says €20.00.');
  await submit(page, 'Save draft');
  await page.waitForURL(/screen=disputes&dispute=dispute-/);
  await page.waitForSelector('.task-panel .detail-grid');
  await expect(page.locator('.task-panel')).toContainText('Wrong amount');
  await expect(page.locator('.task-panel')).toContainText('Not submitted yet.');
  await expect(page.locator('.task-panel')).toContainText('Not created');

  await page.getByRole('button', { name: 'Edit draft' }).click();
  await dialog(page).getByLabel('Charged twice').check();
  await submit(page, 'Save changes');
  await page.waitForSelector('.task-panel:has-text("Charged twice")');

  await page.goto(app('transaction-detail', '&transaction=northstar-books'));
  await expect(page.getByText('You have a dispute draft for this payment.')).toBeVisible();
  await page.getByRole('link', { name: 'Open draft' }).click();
  await page.waitForSelector('[data-wf="dispute-delete"]');
  await page.getByRole('button', { name: 'Delete draft' }).click();
  await submit(page, 'Delete draft');
  await page.waitForURL(/screen=disputes$/);
  await page.waitForSelector('text=No dispute drafts');
  await page.goto(app('disputes', '&dispute=missing'));
  await expect(page.locator('#main h1')).toHaveText('Dispute draft not found');
});

test('session persistence, loading and error states, and reset restore the seed', async ({ page, context, browser }) => {
  await page.goto(app('payees', '&state=loading&pin=1'));
  await expect(page.locator('[data-nova-wf-region][aria-busy="true"] .nova-wf-skeleton')).toBeVisible();
  await page.goto(app('scheduled', '&state=error'));
  await page.waitForSelector('[data-nova-wf-region] .nova-wf-alert');
  await page.getByRole('button', { name: 'Try again' }).click();
  await page.waitForURL(/screen=scheduled$/);
  await page.waitForSelector('.nova-wf-list');

  await page.goto(app('savings'));
  await page.getByRole('button', { name: 'New goal' }).click();
  await page.getByLabel('Goal name').fill('Concert');
  await page.getByLabel('Target (€)').fill('150');
  await submit(page, 'Create goal');
  await page.waitForURL(/goal=custom-/);
  await page.reload();
  await expect(page.locator('#main h1')).toHaveText('Concert');

  // A new tab (new session) starts from the seed.
  const other = await browser.newContext();
  const fresh = await other.newPage();
  await fresh.goto(page.url().replace(/\/app\.html.*/, '/app.html?screen=savings'));
  await expect(fresh.locator('.v3-goal-row', { hasText: 'Concert' })).toHaveCount(0);
  await other.close();

  await page.goto(app('settings', '&demo=1'));
  await openDemoTools(page);
  await page.getByRole('button', { name: 'Reset demo data' }).click();
  await submit(page, 'Reset demo data');
  await page.waitForSelector('.toast:has-text("Demo data reset")');
  await page.goto(app('savings'));
  await expect(page.locator('.v3-goal-row')).toHaveCount(2);
  await expect(page.locator('.v3-goal-row', { hasText: 'Concert' })).toHaveCount(0);
  const keys = await page.evaluate(() => Object.keys(sessionStorage).filter((key) => key.startsWith('nova_') && !['nova_demo_state_v1', 'nova_demo_tools'].includes(key)));
  expect(keys).toEqual([]);
});

test('former toast-only placeholders open real dialogs: receipt sharing and identity-check help', async ({ page }) => {
  await page.goto(app('transfer-success'));
  await page.getByRole('button', { name: 'Share receipt' }).click();
  await expect(dialog(page)).toContainText('Transfer receipt.');
  await expect(dialog(page).getByRole('button', { name: 'Copy receipt text' })).toBeVisible();
  await dialog(page).getByRole('button', { name: 'Close' }).click();
  await expect(dialog(page)).toHaveCount(0);
  await page.goto(app('kyc'));
  await page.getByRole('button', { name: 'I need help' }).click();
  await dialog(page).getByRole('link', { name: 'Request another verification option' }).click();
  await page.waitForURL(/screen=kyc&state=manual/);
  await expect(page.getByText('Manual review requested')).toBeVisible();
});

const ROUTES = ['home', 'activity', 'transaction-detail', 'transaction-detail&transaction=greenline-market', 'account-detail', 'payment-detail&payment=river-gym',
  'report-transaction', 'cards', 'card-frozen', 'card-controls', 'transfer-recipient', 'transfer-amount', 'transfer-review', 'biometric-failed', 'offline',
  'transfer-success', 'savings', 'savings-detail', 'subscriptions', 'security', 'settings', 'notifications', 'onboarding', 'kyc', 'error',
  'payees', 'payees&payee=maya-chen-2048', 'payees&payee=missing', 'scheduled', 'scheduled&transfer=sch-gift', 'disputes'];

test('every product and evidence page loads without console errors or "#" links', async ({ page }) => {
  test.setTimeout(180_000);
  const pages = [...ROUTES.map((route) => app(route)), '/index.html', '/signin.html', '/prototype.html', '/design-system.html', '/component-states.html', '/state-matrix.html',
    '/recruiter-state-lab.html', '/user-flows.html', '/sitemap.html', '/design-decisions.html'];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const url of pages) {
      await page.goto(url, { waitUntil: 'load' });
      await page.waitForTimeout(350);
      const report = await page.evaluate(() => ({
        hashLinks: [...document.querySelectorAll('a[href]')].filter((link) => ['#', ''].includes(link.getAttribute('href').trim())).map((link) => link.outerHTML.slice(0, 120)),
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        heading: !!document.querySelector('h1')
      }));
      expect(report.hashLinks, `${url} @${width}`).toEqual([]);
      expect(report.overflow, `${url} @${width} overflow`).toBe(false);
      if (url.startsWith('/app.html')) expect(report.heading, `${url} @${width} heading`).toBe(true);
    }
  }
});

const SIGNALS = /prototype|demo data|sandbox|simulat|fictional|state lab|portfolio review/i;

test('product pages carry no prototype signals; demo tools appear only with ?demo=1', async ({ page }) => {
  test.setTimeout(180_000);
  const pages = ['/signin.html', ...ROUTES.map((route) => app(route)), app('report-transaction', '&state=handoff'), app('home', '&state=empty&pin=1'), app('home', '&state=edge&pin=1'), app('kyc', '&state=review')];
  for (const url of pages) {
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(250);
    const text = await page.evaluate(() => document.body.innerText);
    const hits = text.split('\n').filter((line) => SIGNALS.test(line));
    expect(hits, `${url} visible text`).toEqual([]);
    await expect(page.locator('[data-nova-demo-tools]'), url).toHaveCount(0);
    await expect(page.locator('[data-nova-credit]'), url).toHaveText('Concept product designed by Đỗ Anh Nghĩa.');
  }

  await page.goto(app('settings', '&demo=1'));
  const tools = page.locator('[data-nova-demo-tools]');
  await expect(tools).toBeVisible();
  await tools.locator('summary').click();
  await expect(tools.getByRole('button', { name: 'Reset demo data' })).toBeVisible();
  await expect(tools.getByLabel('Simulate a failed request')).toBeVisible();
  // The flag stays on for the tab, and ?demo=0 turns it off.
  await page.goto(app('home'));
  await expect(page.locator('[data-nova-demo-tools]')).toBeVisible();
  await page.goto(app('home', '&demo=0'));
  await expect(page.locator('[data-nova-demo-tools]')).toHaveCount(0);
});

test('the root URL opens the signed-in home; sign out shows the login screen and sign in returns home', async ({ page }) => {
  await page.goto('/');
  await page.waitForURL(/app\.html\?screen=home/);
  await expect(page.locator('#main h1')).toContainText('Alex');

  await page.goto(app('settings'));
  await page.getByRole('button', { name: 'Sign out' }).click();
  await submit(page, 'Sign out');
  await page.waitForURL(/signin\.html/);
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  // Signed out: product routes return to the login screen.
  await page.goto(app('cards'));
  await page.waitForURL(/signin\.html/);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.locator('#signin-email-error')).toHaveText('Enter your email address.');
  await page.getByLabel('Email').fill('alex.nguyen@novamail.app');
  await page.getByLabel('Passcode').fill('1111');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toContainText('don’t match');
  await page.getByLabel('Passcode').fill('2468');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/screen=home/);

  await page.goto(app('settings'));
  await page.getByRole('button', { name: 'Sign out' }).click();
  await submit(page, 'Sign out');
  await page.waitForURL(/signin\.html/);
  await page.getByRole('button', { name: /Continue as Alex Nguyen/ }).click();
  await page.waitForURL(/screen=home/);
});
