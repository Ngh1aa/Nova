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
  await page.getByRole('link', { name: 'Continue with Maya Chen' }).click();
  await page.getByLabel('Amount').fill('145');
  await page.getByRole('button', { name: 'Review transfer' }).click();
  await expect(page.getByRole('heading', { name: 'Check every detail' })).toBeVisible();
  await expect(page.getByText('€1,155.00').first()).toBeVisible();
  await page.getByRole('button', { name: 'Confirm with biometrics' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Approve demo' }).click();
  await expect(page.getByRole('heading', { name: 'Transfer successful' })).toBeVisible();
  await expect(page.getByText(/This portfolio prototype simulates a successful/)).toBeVisible();
});

test('Nova adaptive pastel visual contract holds at portfolio breakpoints', async ({ page }) => {
  for (const [width, height] of [[390, 844], [768, 1024], [1024, 900], [1440, 1000]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/app.html?screen=home');
    await expect(page.locator('.fi-horizon')).toBeVisible();
    await expect(page.locator('.ios26-nav')).toBeVisible();

    if (width < 768) {
      await expect(page.locator('.bottom-nav')).toBeVisible();
      await expect(page.locator('.nova-top-tabs')).toBeHidden();
    } else {
      await expect(page.locator('.bottom-nav')).toBeHidden();
      await expect(page.locator('.nova-top-tabs')).toBeVisible();
    }

    if (width >= 1200) await expect(page.locator('.sidebar')).toBeVisible();

    const state = await page.evaluate(() => {
      const amount = document.querySelector('.money-amount');
      const actions = [...document.querySelectorAll('.decision-action')];
      const dock = document.querySelector('.bottom-nav');
      const forecast = document.querySelector('.fi-horizon');
      const main = document.querySelector('.main-wrap');
      const sidebar = document.querySelector('.sidebar');
      const amountRect = amount.getBoundingClientRect();
      const dockRect = dock.getBoundingClientRect();
      const mainRect = main.getBoundingClientRect();
      const overlaps = actions.some(action => {
        const rect = action.getBoundingClientRect();
        return !(amountRect.right <= rect.left || amountRect.left >= rect.right || amountRect.bottom <= rect.top || amountRect.top >= rect.bottom);
      });
      const dockStyle = getComputedStyle(dock);
      const amountStyle = getComputedStyle(amount);
      const bodyStyle = getComputedStyle(document.body);
      const sidebarStyle = getComputedStyle(sidebar);
      return {
        overlaps,
        amountRight: amountRect.right,
        viewportWidth: document.documentElement.clientWidth,
        amountFontFamily: amountStyle.fontFamily.toLowerCase(),
        amountNumeric: amountStyle.fontVariantNumeric,
        bodyBackground: bodyStyle.backgroundColor,
        dockPosition: dockStyle.position,
        dockRadius: parseFloat(dockStyle.borderRadius),
        dockWidth: dockRect.width,
        forecastRadius: parseFloat(getComputedStyle(forecast).borderRadius),
        mainWidth: mainRect.width,
        sidebarRadius: parseFloat(sidebarStyle.borderRadius),
        sidebarBackground: sidebarStyle.backgroundColor,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      };
    });

    expect(state.overlaps, `Safe-to-spend amount overlaps actions at ${width}px`).toBeFalsy();
    expect(state.amountRight, `Safe-to-spend amount escapes viewport at ${width}px`).toBeLessThanOrEqual(state.viewportWidth + 1);
    expect(state.amountFontFamily).toMatch(/sans-serif|monospace|ui-monospace/);
    expect(state.amountFontFamily).not.toMatch(/source serif|georgia|times new roman|times,/);
    expect(state.amountNumeric).toContain('tabular-nums');
    expect(state.bodyBackground).toBe('rgb(243, 246, 250)');
    expect(state.forecastRadius).toBeGreaterThanOrEqual(20);

    if (width < 768) {
      expect(state.dockPosition).toBe('fixed');
      expect(state.dockRadius).toBeGreaterThanOrEqual(24);
      expect(state.dockWidth).toBeLessThanOrEqual(582);
      expect(state.dockWidth).toBeLessThanOrEqual(state.viewportWidth - (width <= 430 ? 16 : 20));
    }

    if (width >= 1200) {
      expect(state.sidebarRadius).toBeGreaterThanOrEqual(24);
      expect(state.sidebarBackground).not.toBe('rgba(0, 0, 0, 0)');
    }

    if (width >= 1024) expect(state.mainWidth).toBeGreaterThan(900);
    expect(state.overflow, `Unexpected page overflow at ${width}px`).toBeFalsy();
  }
});

test('Cards uses responsive card-plus-controls composition', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto('/app.html?screen=cards');
    await expect(page.locator('.v3-bank-card')).toBeVisible();
    await expect(page.locator('.v3-card-actions')).toBeVisible();

    const state = await page.evaluate(() => {
      const grid = document.querySelector('.v3-cards-layout');
      const cardSurface = document.querySelector('.v3-card-showcase');
      const controls = document.querySelector('.v3-card-actions');
      const cardRect = cardSurface.getBoundingClientRect();
      const controlRect = controls.getBoundingClientRect();
      return {
        columns: getComputedStyle(grid).gridTemplateColumns,
        cardRadius: parseFloat(getComputedStyle(cardSurface).borderRadius),
        cardWidth: cardRect.width,
        controlsBesideCard: controlRect.left > cardRect.left + cardRect.width * .72,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      };
    });

    expect(state.cardRadius).toBeGreaterThanOrEqual(22);
    expect(state.cardWidth).toBeLessThanOrEqual(width - 20);
    if (width >= 1000) expect(state.controlsBesideCard).toBeTruthy();
    expect(state.overflow).toBeFalsy();
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
