import {test,expect} from '@playwright/test';

test('Activity monetary values keep their sign and amount on one line at pressure widths',async({page})=>{
 for(const width of [320,390]){
  await page.setViewportSize({width,height:900});await page.goto('/app.html?screen=activity');
  await expect(page.getByPlaceholder('Search transactions',{exact:true})).toBeVisible();
  const lines=await page.locator('.cashflow-item strong').evaluateAll(values=>values.map(value=>{
   const range=document.createRange();range.selectNodeContents(value);return range.getClientRects().length;
  }));
  expect(lines).toEqual([1,1,1]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});

test('scrollbars are hidden while wheel and keyboard scrolling remain available',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/app.html?screen=home');
  const stage=page.locator('.app-stage');
  expect(await stage.evaluate(el=>getComputedStyle(el).scrollbarWidth)).toBe('none');
  expect(await stage.evaluate(el=>getComputedStyle(el).overflowY)).toBe('auto');
  await stage.hover();await page.mouse.wheel(0,420);
  await expect.poll(()=>stage.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
  await stage.evaluate(el=>el.scrollTop=0);await page.locator('#main').focus();await page.keyboard.press('PageDown');
  await expect.poll(()=>stage.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
 }
});

test('desktop workspace occupies the complete browser viewport without an outer frame',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [1280,1440,1857,1920]){
  await page.setViewportSize({width,height:900});await page.goto('/app.html?screen=home');
  const frame=await page.locator('.app-shell').boundingBox();
  expect(frame.x).toBe(0);expect(frame.y).toBe(0);expect(frame.width).toBe(width);expect(frame.height).toBe(900);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const main=await page.locator('#main').boundingBox();expect(main.width).toBeGreaterThanOrEqual(Math.min(width-212,1440));
 }
});

test('sidebar remains canonical when a narrow browser window is maximized or resized',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of ['home','cards','savings']){
  for(const startWidth of [390,1024]){
   await page.setViewportSize({width:startWidth,height:900});await page.goto('/app.html?screen='+route);
   for(const width of [1440,1857,900,1280]){
    await page.setViewportSize({width,height:900});
    await expect(page.locator('.sidebar-account')).toHaveCount(0);
    await expect(page.locator('.v4-rail-nav a')).toHaveCount(9);
    if(width>=1200){
     const sidebar=page.locator('.sidebar');await expect(sidebar).toBeVisible();
     expect(await sidebar.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
     await expect(sidebar.locator('[aria-current="page"]')).toHaveCount(1);
    }else await expect(page.locator('.sidebar')).toBeHidden();
   }
  }
 }
});

test('mobile navigation reserves its own space and cannot cover task controls or goal rows',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});
  for(const [route,selectors] of [['transfer-review',['#confirm-transfer','.action-stack a[href*="transfer-amount"]']],['savings',['.v3-goal-row[href*="holiday"]']],['home',['.nova-bill-row[href*="apartment-rent"]']]]){
   await page.goto('/app.html?screen='+route);
   const stage=await page.locator('.app-stage').boundingBox(),nav=await page.locator('.bottom-nav').boundingBox();
   expect(stage.y+stage.height,route).toBeLessThanOrEqual(nav.y);
   for(const selector of selectors){
    const item=page.locator(selector).first();await item.scrollIntoViewIfNeeded();await item.focus();const box=await item.boundingBox();
    expect(box.y+box.height,`${route}/${selector}`).toBeLessThanOrEqual(stage.y+stage.height+1);
    expect(box.y,`${route}/${selector}`).toBeGreaterThanOrEqual(stage.y);
   }
  }
 }
});

test('transfer calculation disclosure preserves both normal and over-plan amounts',async({page})=>{
 await page.goto('/app.html?screen=home');await page.evaluate(()=>localStorage.clear());
 for(const [amount,result] of [[145,'€1,155.00'],[1400,'−€100.00']]){
  await page.evaluate(value=>localStorage.setItem('nova_transfer_amount',String(value)),amount);
  await page.goto('/app.html?screen=transfer-review');
  const row=page.locator('.review-row').filter({has:page.getByText('Safe after transfer',{exact:true})});
  await expect(row.locator('strong')).toHaveText(result);
  const disclosure=page.locator('.nova-calculation');await expect(disclosure).not.toHaveAttribute('open');
  await disclosure.locator('summary').click();await expect(disclosure).toHaveAttribute('open','');
  await expect(disclosure).toContainText(result);await expect(disclosure).toContainText('€1,300.00');
  await expect(page.locator('.horizon-dates')).toHaveCount(0);
 }
});
