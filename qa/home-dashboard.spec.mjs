import {test,expect} from '@playwright/test';

// The user-requested charcoal rebuild replaces the former attention-first/pastel layout.
// Preserve correct review links, fixture-derived data and panel-local error recovery.
test('unusual transaction stays actionable at desktop, tablet and phone sizes',async({page})=>{
 for(const width of [1440,1024,390]){
  await page.setViewportSize({width,height:1000});await page.goto('/app.html?screen=home');
  const risk=page.locator('.nova-txn-row.risk');await expect(risk).toContainText('ByteMart Online');
  await risk.click();await expect(page.locator('#main h1')).toHaveText('ByteMart Online');
 }
});
test('forecast values come from planned payments, with a text alternative',async({page})=>{
 await page.goto('/app.html?screen=home');await expect(page.locator('.nova-forecast-total')).toContainText('€1,800.00');
 await expect(page.getByRole('table',{name:'Demo balance forecast, based on known payments'})).toContainText('30 Sep€1,800.00');
});
test('a failed forecast keeps balances and payments usable and retries in place',async({page})=>{
 await page.goto('/app.html?screen=home&panel=forecast-error');
 const forecast=page.locator('[data-nova-panel="forecast"]');
 await expect(forecast.getByRole('status')).toContainText('Forecast unavailable');
 await expect(page.locator('.nova-hero-card .money-amount')).toHaveText('€1,300.00');
 await expect(page.locator('.nova-upcoming-card')).toBeVisible();
 await forecast.getByRole('button',{name:'Try again'}).click();
 await expect(forecast.getByRole('img')).toHaveAttribute('aria-label',/1800 euros/);
 await expect(page.getByRole('heading',{name:'Balance forecast'})).toBeFocused();
});
test('phone retains both quick transfer and all five planned payments',async({page})=>{
 await page.setViewportSize({width:390,height:1000});await page.goto('/app.html?screen=home');
 await expect(page.locator('.nova-quick-card').getByRole('link',{name:'Send money',exact:false})).toBeVisible();
 await expect(page.locator('.nova-bill-row')).toHaveCount(5);
});
