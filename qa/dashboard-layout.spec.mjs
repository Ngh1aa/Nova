import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('dashboard panels do not overlap and labelled desktop navigation stays fixed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [768, 1024, 1200, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/app.html?screen=home');
    const geometry = await page.locator('.nova-density-dashboard').evaluate(grid => {
      const cards = [...grid.children].map(card => card.getBoundingClientRect());
      const outer = grid.getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(grid).gap);
      // Extend half a gutter around every tile. A hole or overlap changes the area.
      const area = cards.reduce((sum, card) => sum + (card.width + gap) * (card.height + gap), 0);
      return {
        count: cards.length,
        area,
        expected: (outer.width + gap) * (outer.height + gap),
        overlaps: cards.some((a, i) => cards.slice(i + 1).some(b =>
          a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1)),
        overflow: document.documentElement.scrollWidth > innerWidth + 1
      };
    });
    expect(geometry.count).toBe(8);
    expect(geometry.overlaps).toBe(false);
    expect(geometry.overflow).toBe(false);
    expect(geometry.area).toBeGreaterThan(geometry.expected * 0.8);
    if (width < 1200) continue;
    const rail = page.locator('.sidebar');
    const before = await rail.boundingBox();
    const colours = await page.locator('.v4-rail-nav a').evaluateAll(links => links.map(link => getComputedStyle(link).color));
    expect(colours).toHaveLength(9);
    expect(new Set(colours).size).toBe(2);
    await expect(page.locator('.v4-rail-nav [aria-current="page"]')).toHaveText('Overview');
    for(const link of await page.locator('.v4-rail-nav a').all())await expect(link.locator('span').last()).toBeVisible();
    await page.locator('.app-stage').evaluate(el=>el.scrollTo(0,el.scrollHeight));
    expect((await rail.boundingBox()).y).toBe(before.y);
  }
});

test('dashboard remains accessible at narrow, tablet and desktop widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/app.html?screen=home');
    expect(await page.locator('.nova-density-dashboard > section').count()).toBe(8);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) }))).toEqual([]);
  }
});

test('upcoming payments preserve all dates and totals and open the recurring-payment flow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/app.html?screen=home');
  const plannedDays = ['20','22','24','27','28'];
  const billDays = await page.locator('.nova-bill-row small').allTextContents();
  expect(billDays.map(text => text.match(/^\d+/)[0])).toEqual(plannedDays);
  const amounts = await page.locator('.nova-bill-row > b').allTextContents();
  const total = amounts.reduce((sum, text) => sum + Number(text.replace(/[^\d.]/g, '')), 0);
  expect(total).toBeCloseTo(1040, 2);
  await expect(page.locator('.nova-upcoming-total strong')).toHaveText('€1,040.00');
  await expect(page.locator('.nova-dashboard-intro time')).toHaveAttribute('datetime', '2026-09-15T09:42:00');
  await page.locator('.nova-upcoming-card').getByRole('link', { name: 'View all', exact:true }).click();
  await expect(page).toHaveURL(/screen=subscriptions/);
  await expect(page.locator('#main')).toBeVisible();
});

test('forecast geometry follows known payments and never invents future income', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  const endpoints = await page.locator('.nova-line').evaluate(path => {
    const start = path.getPointAtLength(0);
    const end = path.getPointAtLength(path.getTotalLength());
    return { startY: start.y, endY: end.y };
  });
  expect(endpoints.endY).toBeGreaterThan(endpoints.startY);
  const data = page.getByRole('table', { name: 'Demo balance forecast, based on known payments' });
  await expect(data.getByRole('row')).toHaveCount(8);
  await expect(data).toContainText('15 Sep€2,840');
  await expect(data).toContainText('27 Sep€2,060.00');
  await expect(data).toContainText('30 Sep€1,800.00');
  await expect(page.locator('.nova-forecast-total strong')).toHaveText('€1,800.00');
  const totals=await page.evaluate(()=>window.NovaProduct.data.transactions.reduce((sum,row)=>({income:sum.income+Math.max(0,row[2]),out:sum.out+Math.max(0,-row[2])}),{income:0,out:0}));
  await expect(page.locator('.nova-kpi').first()).toContainText(`€${totals.income.toLocaleString('en-IE',{minimumFractionDigits:2,maximumFractionDigits:2})}`);
  await expect(page.locator('.nova-spending-total')).toContainText(`€${totals.out.toLocaleString('en-IE',{minimumFractionDigits:2,maximumFractionDigits:2})}`);
});
