import { test, expect } from '@playwright/test';

// Home dashboard contract (2026-11-02): the review item leads, charts carry readable values,
// one failing panel never blanks Home, and phones keep four full panels plus summary rows.

test('review item comes right after the safe-to-spend answer at every width', async ({ page }) => {
  for (const width of [1440, 1024, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/app.html?screen=home');
    const attention = page.locator('.nova-attention-card');
    await expect(attention).toBeVisible();
    await expect(attention.getByRole('link', { name: 'Unusual card activity at ByteMart Online' })).toHaveAttribute('href', 'app.html?screen=transaction-detail');
    const tops = await page.evaluate(() => ['.nova-hero-card', '.nova-attention-card', '.nova-forecast-card']
      .map((s) => document.querySelector(s).getBoundingClientRect().top));
    expect(tops[1], `attention below hero start at ${width}`).toBeGreaterThanOrEqual(tops[0]);
    expect(tops[1], `attention above forecast at ${width}`).toBeLessThan(tops[2]);
    await expect(page.locator('.nova-transactions-card .nova-txn-row.risk')).toHaveCount(0);
  }
});

test('charts use sorted bars and readable values instead of donuts and legends', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  await expect(page.locator('.nova-donut, .nova-progress-ring, .nova-chart-legend')).toHaveCount(0);
  const amounts = await page.locator('.nova-category-row b').allTextContents();
  const values = amounts.map((v) => Number(v.replace(/[^\d]/g, '')));
  expect(values.slice(0, -1)).toEqual([...values.slice(0, -1)].sort((a, b) => b - a));
  await expect(page.locator('.nova-category-row').last()).toContainText('Other');
  await expect(page.locator('.nova-bars')).toHaveAttribute('aria-label', /€2,980 in, €1,680 out/);
  await expect(page.locator('.nova-flow-card .nova-date-pill')).toHaveText('Apr–Sep');
  await expect(page.locator('.nova-bars em').last()).toHaveText('Sep');
  await expect(page.locator('.nova-goal-meter')).toHaveCount(2);
});

test('a failing forecast keeps every other panel and recovers in place', async ({ page }) => {
  await page.goto('/app.html?screen=home&panel=forecast-error');
  const forecast = page.locator('[data-nova-panel="forecast"]');
  await expect(forecast.getByRole('status')).toContainText('Forecast unavailable');
  await expect(page.locator('.nova-hero-card .money-amount')).toHaveText('€1,300.00');
  await expect(page.locator('.nova-upcoming-card')).toBeVisible();
  await forecast.getByRole('button', { name: 'Try again' }).click();
  await expect(forecast.getByRole('img')).toHaveAttribute('aria-label', /1050 euros/);
  await expect(page.getByRole('heading', { name: 'Balance forecast' })).toBeFocused();
});

test('phone keeps four full panels and opens the rest from summary rows', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/app.html?screen=home');
  await expect(page.locator('.nova-home-detail:visible')).toHaveCount(0);
  const rows = page.locator('.nova-summary-row');
  await expect(rows).toHaveCount(6);
  for (const row of await rows.all()) await expect(row).toHaveAttribute('href', /^app\.html\?screen=/);
  await rows.filter({ hasText: 'Savings progress' }).click();
  await expect(page).toHaveURL(/screen=savings-detail/);
});

test('desktop rows never leave a stretched empty panel or a lone last panel', async ({ page }) => {
  for (const width of [1440, 1280, 1024]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/app.html?screen=home');
    const result = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('.nova-density-dashboard > .nova-card')].filter((c) => c.offsetParent);
      const voids = cards.map((card) => {
        const r = card.getBoundingClientRect();
        const bottom = Math.max(...[...card.querySelectorAll('*')].filter((n) => n.offsetParent && (n.children.length === 0 || n.matches('svg'))).map((n) => n.getBoundingClientRect().bottom));
        return { name: card.className.split(' ')[1], gap: Math.round(r.bottom - parseFloat(getComputedStyle(card).paddingBottom) - bottom), h: r.height };
      });
      const rows = {};
      for (const c of cards) { const t = Math.round(c.getBoundingClientRect().top); (rows[t] ||= []).push(c.getBoundingClientRect().width); }
      return { voids, rows: Object.values(rows) };
    });
    for (const v of result.voids) expect(v.gap, `${v.name} at ${width}`).toBeLessThanOrEqual(Math.max(96, v.h * 0.25));
    const last = result.rows[result.rows.length - 1];
    expect(last.length > 1 || result.rows.length < 2, `lone last panel at ${width}`).toBe(true);
  }
});
