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
  await expect(page.getByText(/This portfolio prototype simulates a successful/)).toBeVisible();
});

test('Nova iOS 26 visual contract holds at portfolio breakpoints', async ({ page }) => {
  for (const [width, height] of [[390, 844], [768, 1024], [1024, 900], [1440, 1000], [1728, 1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/app.html?screen=home');
    await expect(page.locator('.fi-horizon')).toBeVisible();
    await expect(page.locator('.bottom-nav')).toBeVisible();
    await expect(page.locator('.ios26-nav')).toBeVisible();
    await expect(page.locator('.ios26-account-snapshot')).toBeVisible();
    await expect(page.locator('.ios26-stat-strip')).toBeVisible();

    const state = await page.evaluate(() => {
      const amount = document.querySelector('.money-amount');
      const actions = [...document.querySelectorAll('.decision-action')];
      const dock = document.querySelector('.bottom-nav');
      const forecast = document.querySelector('.fi-horizon');
      const main = document.querySelector('.main-wrap');
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
        densityVersion: document.documentElement.dataset.novaDensity,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      };
    });

    expect(state.overlaps, `Safe-to-spend amount overlaps actions at ${width}px`).toBeFalsy();
    expect(state.amountRight, `Safe-to-spend amount escapes viewport at ${width}px`).toBeLessThanOrEqual(state.viewportWidth + 1);
    expect(state.amountFontFamily).toContain('sans-serif');
    expect(state.amountFontFamily).not.toMatch(/source serif|georgia|times new roman|times,/);
    expect(state.amountNumeric).toContain('tabular-nums');
    expect(state.bodyBackground).toBe('rgb(245, 245, 247)');
    expect(state.dockPosition).toBe('fixed');
    expect(state.dockRadius).toBeGreaterThanOrEqual(24);
    expect(state.dockWidth).toBeLessThanOrEqual(642);
    expect(state.dockWidth).toBeLessThanOrEqual(state.viewportWidth - (width <= 430 ? 14 : 20));
    expect(state.forecastRadius).toBeGreaterThanOrEqual(22);
    expect(state.densityVersion).toBe('wide-v4');
    if (width >= 1024) expect(state.mainWidth).toBeGreaterThan(950);
    if (width >= 1440) expect(state.mainWidth).toBeGreaterThan(1350);
    if (width >= 1700) expect(state.mainWidth).toBeGreaterThan(1600);
    expect(state.overflow, `Unexpected page overflow at ${width}px`).toBeFalsy();
  }
});

test('wide root screens use space for information rather than empty gutters', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 1080 });
  const routes = [
    ['home', '.ios26-account-snapshot'],
    ['activity', '.ios26-activity-insights'],
    ['cards', '.ios26-card-metrics'],
    ['savings', '.ios26-goal-summary']
  ];

  for (const [screen, required] of routes) {
    await page.goto(`/app.html?screen=${screen}`);
    await expect(page.locator(required)).toBeVisible();
    const state = await page.evaluate(() => {
      const main = document.querySelector('.main-wrap').getBoundingClientRect();
      return {
        mainWidth: main.width,
        leftGutter: main.left,
        rightGutter: document.documentElement.clientWidth - main.right,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      };
    });
    expect(state.mainWidth, `${screen} should use the wide desktop canvas`).toBeGreaterThan(1600);
    expect(state.leftGutter, `${screen} left gutter should stay compact`).toBeLessThan(70);
    expect(state.rightGutter, `${screen} right gutter should stay compact`).toBeLessThan(70);
    expect(state.overflow).toBeFalsy();
  }
});

test('iOS search cancel is contextual, not permanently visible', async ({ page }) => {
  for (const route of ['/app.html?screen=activity', '/app.html?screen=transfer-recipient']) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);
    const search = page.locator('input[type="search"]').first();
    const cancel = page.locator('.ios-search-cancel').first();
    await expect(search).toBeVisible();
    await expect(cancel).toBeHidden();
    await search.focus();
    await expect(cancel).toBeVisible();
  }
});

test('Activity filters stay reachable on iPhone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/app.html?screen=activity');
  const filters = page.locator('.filter-row');
  const income = filters.getByRole('button', { name: 'Income' });
  await expect(filters).toBeVisible();

  const initial = await filters.evaluate((node) => ({
    overflowX: getComputedStyle(node).overflowX,
    scrollWidth: node.scrollWidth,
    clientWidth: node.clientWidth,
    pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  }));
  expect(['auto', 'scroll']).toContain(initial.overflowX);
  expect(initial.scrollWidth).toBeGreaterThan(initial.clientWidth);
  expect(initial.pageOverflow).toBeFalsy();

  await filters.evaluate((node) => { node.scrollLeft = node.scrollWidth; });
  await page.waitForTimeout(80);
  const visibility = await page.evaluate(() => {
    const row = document.querySelector('.filter-row').getBoundingClientRect();
    const last = [...document.querySelectorAll('.filter-row .chip')].at(-1).getBoundingClientRect();
    return { lastRight: last.right, rowRight: row.right, lastLeft: last.left, rowLeft: row.left };
  });
  expect(visibility.lastRight).toBeLessThanOrEqual(visibility.rowRight + 2);
  expect(visibility.lastLeft).toBeGreaterThanOrEqual(visibility.rowLeft - 2);
  await expect(income).toBeVisible();
});

test('Pay recipient split view includes transfer context and recent history', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 1080 });
  await page.goto('/app.html?screen=transfer-recipient');
  await expect(page.locator('.ios26-pay-aside')).toBeVisible();
  await expect(page.locator('.ios26-pay-history')).toBeVisible();
  await expect(page.getByText('Recent transfers')).toBeVisible();
  await expect(page.getByText('Sofia Andersson').first()).toBeVisible();
});

test('Cards uses responsive card-plus-controls composition', async ({ page }) => {
  for (const width of [390, 1440, 1728]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto('/app.html?screen=cards');
    await expect(page.locator('.card-object')).toBeVisible();
    await expect(page.locator('.control-list')).toBeVisible();
    await expect(page.locator('.ios26-card-metrics')).toBeVisible();

    const state = await page.evaluate(() => {
      const grid = document.querySelector('.card-grid');
      const card = document.querySelector('.card-object');
      const controls = document.querySelector('.card-quick');
      const cardRect = card.getBoundingClientRect();
      const controlRect = controls.getBoundingClientRect();
      return {
        columns: getComputedStyle(grid).gridTemplateColumns,
        cardRadius: parseFloat(getComputedStyle(card).borderRadius),
        cardWidth: cardRect.width,
        controlsBesideCard: controlRect.left > cardRect.left + cardRect.width * .72,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      };
    });

    expect(state.cardRadius).toBeGreaterThanOrEqual(22);
    expect(state.cardWidth).toBeLessThanOrEqual(width - 20);
    if (width >= 1200) expect(state.controlsBesideCard).toBeTruthy();
    expect(state.overflow).toBeFalsy();
  }
});

test('portfolio screenshots render without overflow', async ({ page }) => {
  const screens = [
    ['home', '/app.html?screen=home', [390, 768, 1024, 1440, 1728]],
    ['activity', '/app.html?screen=activity', [390, 1440, 1728]],
    ['transaction', '/app.html?screen=transaction-detail', [390, 1440]],
    ['cards', '/app.html?screen=cards', [390, 1440, 1728]],
    ['transfer-recipient', '/app.html?screen=transfer-recipient', [390, 1440, 1728]],
    ['transfer', '/app.html?screen=transfer-review', [390, 1024, 1440]],
    ['savings', '/app.html?screen=savings', [390, 1440, 1728]],
    ['subscriptions', '/app.html?screen=subscriptions', [390, 1440]],
    ['security', '/app.html?screen=security', [390, 1440]],
    ['notifications', '/app.html?screen=notifications', [390, 1440]],
    ['kyc', '/app.html?screen=kyc&state=failed', [390, 1024]]
  ];

  for (const [name, route, widths] of screens) {
    for (const width of widths) {
      const height = width === 390 ? 844 : width === 768 ? 1024 : width === 1024 ? 900 : width >= 1700 ? 1080 : 1000;
      await page.setViewportSize({ width, height });
      await page.goto(route);
      await expect(page.locator('#main')).toBeVisible();
      await shot(page, `nova-${name}`, width, height);
    }
  }
});
