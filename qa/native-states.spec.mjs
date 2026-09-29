import { test, expect } from '@playwright/test';

async function expectNoWrapperInjection(page) {
  await expect(page.locator('[data-state-lab-marker]')).toHaveCount(0);
  await expect(page.locator('style[data-state-lab-style]')).toHaveCount(0);
}

test('empty state is a direct native product route with an honest recovery action', async ({ page }) => {
  await page.goto('/app.html?screen=home&state=empty&pin=1');

  const main = page.locator('#main[data-native-product-state="empty"]');
  await expect(main).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Safe to spend unavailable' })).toBeVisible();
  await expect(main).toContainText('No accounts are connected yet');
  await expect(main).toContainText('Safe to spend');
  await expect(main).toContainText('Not calculated');
  await expect(page.getByRole('link', { name: 'Connect demo account' })).toHaveAttribute('href', 'app.html?screen=home');
  await expect(main.getByRole('note')).toContainText('No real bank connection');
  await expectNoWrapperInjection(page);

  await page.getByRole('link', { name: 'Connect demo account' }).click();
  await expect(page).toHaveURL(/screen=home(?!.*state=empty)/);
  await expect(page.locator('[data-native-product-state]')).toHaveCount(0);
  await expect(page.getByText('€1,300.00', { exact: true }).first()).toBeVisible();
});

test('loading state is native, exposes busy semantics, and auto-recovers when not pinned', async ({ page }) => {
  await page.goto('/app.html?screen=home&state=loading&pin=1');

  const pinned = page.locator('#main[data-native-product-state="loading"]');
  await expect(pinned).toBeVisible();
  await expect(pinned.getByRole('heading', { name: /Calculating what is safe to spend/i })).toBeVisible();
  await expect(pinned.locator('[aria-busy="true"]')).toBeVisible();
  await expect(pinned).toContainText('Money actions remain unavailable until this calculation completes.');
  await expectNoWrapperInjection(page);

  await page.goto('/app.html?screen=home&state=loading');
  await expect(page.locator('#main[data-native-product-state="loading"]')).toBeVisible();
  await expect(page).toHaveURL(/screen=home$/, { timeout: 4000 });
  await expect(page.locator('[data-native-product-state]')).toHaveCount(0);
  await expect(page.getByText('€1,300.00', { exact: true }).first()).toBeVisible();
});

test('edge state preserves a truthful negative safe-to-spend calculation and recovery choices', async ({ page }) => {
  await page.goto('/app.html?screen=home&state=edge&pin=1');

  const main = page.locator('#main[data-native-product-state="edge"]');
  await expect(main).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your plan needs attention' })).toBeVisible();
  await expect(main).toContainText('−€8,420.00');
  await expect(main).toContainText('Overcommitted — not safe to spend');
  await expect(main).toContainText('Annual tax payment');
  await expect(main).toContainText('€9,720.00');
  await expect(main).toContainText('€500 protected buffer remains reserved');
  await expect(main.getByRole('status')).toContainText('Future obligations exceed available balance');
  await expect(page.getByRole('link', { name: 'Review commitments' })).toHaveAttribute('href', 'app.html?screen=subscriptions');
  await expect(page.getByRole('link', { name: 'Adjust savings preview' })).toHaveAttribute('href', 'app.html?screen=savings-detail');
  await expectNoWrapperInjection(page);
});

test('transfer error remains a native recovery screen with no-money-moved reassurance', async ({ page }) => {
  await page.goto('/app.html?screen=error');

  const main = page.locator('#main[data-native-product-state="error"]');
  await expect(main).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Something changed before confirmation' })).toBeVisible();
  await expect(main).toContainText('No money moved');
  await expect(page.getByRole('link', { name: 'Review again' })).toHaveAttribute('href', 'app.html?screen=transfer-review');
  await expectNoWrapperInjection(page);
});

test('Recruiter State Lab only switches to native routes instead of injecting product markup', async ({ page }) => {
  await page.goto('/recruiter-state-lab.html?state=empty');
  const frame = page.frameLocator('#productFrame');

  await expect(page.getByText('Native product state · State Lab only switches routes')).toBeVisible();
  await expect(frame.locator('#main[data-native-product-state="empty"]')).toBeVisible();
  await expect(frame.getByRole('heading', { name: 'Safe to spend unavailable' })).toBeVisible();

  const src = await page.locator('#productFrame').getAttribute('src');
  expect(src).toContain('app.html?screen=home&state=empty');
  expect(src).toContain('lab=1');

  await page.getByRole('button', { name: 'Loading' }).click();
  await expect(frame.locator('#main[data-native-product-state="loading"]')).toBeVisible();
  await expect(frame.locator('[data-state-lab-marker]')).toHaveCount(0);
});

test('state matrix embeds direct product routes for all lifecycle states', async ({ page }) => {
  await page.goto('/state-matrix.html');

  const frames = page.locator('iframe[data-state]');
  await expect(frames).toHaveCount(4);
  await expect(page.locator('iframe[data-state="empty"]')).toHaveAttribute('src', /app\.html\?screen=home&state=empty/);
  await expect(page.locator('iframe[data-state="loading"]')).toHaveAttribute('src', /app\.html\?screen=home&state=loading/);
  await expect(page.locator('iframe[data-state="error"]')).toHaveAttribute('src', /app\.html\?screen=error/);
  await expect(page.locator('iframe[data-state="edge"]')).toHaveAttribute('src', /app\.html\?screen=home&state=edge/);

  await expect(page.frameLocator('iframe[data-state="empty"]').locator('#main[data-native-product-state="empty"]')).toBeVisible();
  await expect(page.frameLocator('iframe[data-state="loading"]').locator('#main[data-native-product-state="loading"]')).toBeVisible();
  await expect(page.frameLocator('iframe[data-state="error"]').locator('#main[data-native-product-state="error"]')).toBeVisible();
  await expect(page.frameLocator('iframe[data-state="edge"]').locator('#main[data-native-product-state="edge"]')).toBeVisible();
});
