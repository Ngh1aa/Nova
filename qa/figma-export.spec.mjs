import { test, expect } from '@playwright/test';

const path = (number,id) => `/figma-export/${String(number).padStart(2,'0')}-${id}`;
test('all 70 URLs have unique, capture-ready DOM without errors, broken assets or overflow',async({page,request})=>{
  test.setTimeout(180_000);
  const manifest=await (await request.get('/figma-export/manifest.json')).json();
  expect(manifest.screens).toHaveLength(70);
  expect(new Set(manifest.screens.map(item=>item.path)).size).toBe(70);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const item of manifest.screens){
    const response=await page.goto(item.path);
    expect(response.status(),item.name).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('data-export-ready','true');
    await expect(page.locator('#main')).toHaveAttribute('data-export-id',item.id);
    await expect(page.locator('#main h1')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),item.name).toBe(true);
    expect(await page.evaluate(()=>[...document.images].filter(image=>!image.complete||image.naturalWidth===0).map(image=>image.src)),item.name).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('capture seeds ignore and preserve existing browser storage',async({page})=>{
  await page.goto('/app.html?screen=home');
  await page.evaluate(()=>{localStorage.setItem('nova_card_frozen','true');localStorage.setItem('nova_transfer_amount','900');localStorage.setItem('user-key','keep-me');});
  await page.goto(path(29,'transfer-review'));
  await expect(page.locator('html')).toHaveAttribute('data-export-ready','true');
  await expect(page.locator('.review-total')).toContainText('€145.00');
  await page.goto(path(39,'card-active'));
  await expect(page.locator('#main')).toContainText('Your card is active');
  await page.goto('/app.html?screen=home');
  expect(await page.evaluate(()=>({frozen:localStorage.getItem('nova_card_frozen'),amount:localStorage.getItem('nova_transfer_amount'),user:localStorage.getItem('user-key')}))).toEqual({frozen:'true',amount:'900',user:'keep-me'});
});

test('pinned lifecycle and processing states stay stable',async({page})=>{
  await page.goto(path(3,'home-loading'));
  await expect(page.locator('#main')).toContainText('Calculating what is safe to spend');
  await page.waitForTimeout(1600); // Beyond the native 1200ms lifecycle redirect.
  await expect(page).toHaveURL(/03-home-loading/);
  await page.goto(path(35,'transfer-processing'));
  await expect(page.locator('#main')).toContainText('No real money moves');
  await expect(page.getByRole('button',{name:'Processing',exact:true})).toBeDisabled();
});

test('direct state URLs expose the intended semantic states, not only renamed screens',async({page})=>{
  await page.goto(path(11,'activity-search'));
  await expect(page.locator('#txn-search')).toHaveValue('Greenline');
  await expect(page.locator('.ledger-row:visible')).toHaveCount(1);
  await page.goto(path(12,'activity-filters'));
  await expect(page.getByRole('button',{name:'Needs review',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.goto(path(13,'transaction-normal'));
  await expect(page.locator('#main')).toContainText('−€42.70');
  await expect(page.locator('#main')).not.toContainText('ByteMart Online');
  await page.goto(path(16,'freeze-confirmation'));
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('no bank');
  await page.goto(path(21,'transaction-already-frozen'));
  await expect(page.locator('#main')).toContainText('The prototype card is currently frozen');
  await expect(page.locator('#freeze-card')).toHaveCount(0);
  await page.goto(path(22,'transaction-restricted'));
  await expect(page.getByRole('button',{name:'Unfreeze unavailable'})).toBeDisabled();
  await page.goto(path(28,'transfer-insufficient'));
  await expect(page.locator('#amount')).toHaveAttribute('aria-invalid','true');
  await expect(page.locator('#amount-error')).toContainText('€160.00');
  await page.goto(path(30,'biometric-auth'));
  await expect(page.getByRole('dialog')).toContainText('Confirm with biometrics');
  await page.goto(path(32,'passcode-fallback'));
  await expect(page.getByRole('dialog')).toContainText('2468');
  await page.goto(path(33,'transfer-offline'));
  await expect(page.locator('#confirm-transfer')).toBeDisabled();
  await page.goto(path(34,'transfer-revalidated'));
  await expect(page.locator('#main')).toContainText('Reconnected');
  await page.goto(path(37,'transfer-cancelled'));
  await expect(page.locator('#main')).toContainText('No money moved');
  await page.goto(path(41,'card-restricted'));
  await expect(page.getByRole('button',{name:'Self-unfreeze unavailable'})).toBeDisabled();
  await page.goto(path(67,'kyc-approved'));
  await expect(page.locator('#main')).toContainText('No identity has been verified by a real provider');
  await page.goto(path(68,'kyc-capture-failed'));
  await expect(page.locator('#main')).toContainText('Remove glare');
  await page.goto(path(70,'kyc-manual-review'));
  await expect(page.locator('#main')).toContainText('No identity data was submitted');
});

for(const number of [1,10,14,29,38,45,60]){
  test(`representative ${number} fits 1440 / 1024 / 768 / 390`,async({page,request})=>{
    const manifest=await (await request.get('/figma-export/manifest.json')).json(),item=manifest.screens.find(item=>item.number===number);
    for(const width of [1440,1024,768,390]){
      await page.setViewportSize({width,height:width===390?844:1000});
      await page.goto(item.path);
      await expect(page.locator('html')).toHaveAttribute('data-export-ready','true');
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${item.id} at ${width}`).toBe(true);
      await expect(page.locator('#main h1')).toBeVisible();
      if(width===390){
        await expect(page.locator('.bottom-nav')).toBeVisible();
        const dock=await page.locator('.bottom-nav').boundingBox();
        expect(dock.x).toBeGreaterThanOrEqual(0);
        expect(dock.x+dock.width).toBeLessThanOrEqual(width);
      }
    }
  });
}

test('index, manifest and invalid capture are explicit',async({page,request})=>{
  await page.goto('/figma-export/');
  await expect(page.locator('#screens tr')).toHaveCount(70);
  await page.locator('#search').fill('insufficient');
  await expect(page.locator('#screens tr')).toHaveCount(1);
  await expect(page.locator('#screens')).toContainText('28');
  expect((await request.get('/figma-export/manifest.json')).headers()['content-type']).toContain('application/json');
  await page.goto('/figma-export/99-unknown');
  await expect(page.getByRole('heading',{name:'Export screen not found'})).toBeVisible();
  await expect(page.locator('[data-export-ready]')).toHaveCount(0);
});

test('native mobile dock stays fully inside the viewport after responsive positioning',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/app.html?screen=kyc');
  const dock=await page.locator('.bottom-nav').boundingBox();
  expect(dock.x).toBeGreaterThanOrEqual(0);
  expect(dock.x+dock.width).toBeLessThanOrEqual(390);
  await expect(page.locator('.bottom-nav a')).toHaveCount(5);
});
