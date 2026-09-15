import { test, expect } from '@playwright/test';
import fs from 'node:fs';

fs.mkdirSync('artifacts', { recursive: true });

async function resetPrototype(page) {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
}

async function shot(page, name, width, height = 900) {
  await page.setViewportSize({ width, height });
  await page.screenshot({ path: `artifacts/${name}-${width}.png`, fullPage: true });
  const state = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    bodyWidth: document.body.getBoundingClientRect().width,
    viewport: document.documentElement.clientWidth
  }));
  expect(state.overflow, `Unexpected horizontal overflow on ${name} at ${width}px`).toBeFalsy();
}

test('core protection flow works', async ({ page }) => {
  await resetPrototype(page);
  await page.goto('/app.html?screen=home');
  await expect(page.getByText('€1,300.00').first()).toBeVisible();
  await page.getByRole('link', { name: /Unusual card activity/ }).click();
  await expect(page.getByText('ByteMart Online').first()).toBeVisible();
  await page.getByRole('button', { name: 'Freeze card' }).click();
  await expect(page.getByRole('dialog')).toContainText('Already-authorized or offline payments can still settle');
  await page.getByRole('dialog').getByRole('button', { name: 'Freeze card' }).click();
  await expect(page.getByText('Card frozen').first()).toBeVisible();
});

test('core transfer flow works', async ({ page }) => {
  await resetPrototype(page);
  await page.goto('/app.html?screen=transfer-recipient');
  await page.getByRole('link', { name: /Maya Chen/ }).click();
  await page.getByLabel('Amount').fill('145');
  await page.getByRole('button', { name: 'Review transfer' }).click();
  await expect(page.getByRole('heading', { name: 'Review transfer' })).toBeVisible();
  await expect(page.getByText('€1,155.00').first()).toBeVisible();
  await page.getByRole('button', { name: 'Confirm with biometrics' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Approve demo' }).click();
  await expect(page.getByRole('heading', { name: 'Transfer successful' })).toBeVisible();
  await expect(page.getByText('No real money moved.')).toBeVisible();
});

test('Nova visual contract prevents Home overlap at portfolio breakpoints', async ({ page }) => {
  for (const [width, height] of [[390, 844], [768, 1024], [1024, 900], [1440, 1000]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/app.html?screen=home');
    const state = await page.evaluate(() => {
      const amount = document.querySelector('.money-amount');
      const actions = [...document.querySelectorAll('.decision-action')];
      const amountRect = amount.getBoundingClientRect();
      const overlaps = actions.some(action => {
        const rect = action.getBoundingClientRect();
        return !(amountRect.right <= rect.left || amountRect.left >= rect.right || amountRect.bottom <= rect.top || amountRect.top >= rect.bottom);
      });
      const actionStyle = getComputedStyle(actions[0]);
      const amountStyle = getComputedStyle(amount);
      return {
        overlaps,
        actionRadius: actionStyle.borderRadius,
        actionShadow: actionStyle.boxShadow,
        amountRight: amountRect.right,
        viewportWidth: document.documentElement.clientWidth,
        amountFontFamily: amountStyle.fontFamily
      };
    });
    expect(state.overlaps, `Safe-to-spend amount overlaps actions at ${width}px`).toBeFalsy();
    expect(state.amountRight, `Safe-to-spend amount escapes viewport at ${width}px`).toBeLessThanOrEqual(state.viewportWidth + 1);
    expect(parseFloat(state.actionRadius)).toBe(0);
    expect(state.actionShadow).toBe('none');
    expect(state.amountFontFamily.toLowerCase()).toContain('source serif 4');
  }
});

test('portfolio screenshots render without overflow', async ({ page }) => {
  const screens = [
    ['home', '/app.html?screen=home', [390, 768, 1024, 1440]],
    ['activity', '/app.html?screen=activity', [390, 1440]],
    ['transaction', '/app.html?screen=transaction-detail', [390, 1440]],
    ['cards', '/app.html?screen=cards', [390, 1440]],
    ['transfer', '/app.html?screen=transfer-review', [390, 1024, 1440]],
    ['savings', '/app.html?screen=savings', [390, 1440]],
    ['kyc', '/app.html?screen=kyc&state=failed', [390, 1024]]
  ];

  for (const [name, route, widths] of screens) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : width === 768 ? 1024 : width === 1024 ? 900 : 1000 });
      await page.goto(route);
      await expect(page.locator('#main')).toBeVisible();
      await shot(page, `nova-${name}`, width, width === 390 ? 844 : width === 768 ? 1024 : width === 1024 ? 900 : 1000);
    }
  }
});