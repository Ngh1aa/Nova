import {test,expect} from '@playwright/test';

test('savings preview and recurring payments use bounded two-column desktop layouts',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/app.html?screen=savings-detail&goal=emergency');
 const form=await page.locator('.savings-detail-grid .task-panel').boundingBox();
 const context=await page.locator('.savings-allocation').boundingBox();
 expect(context.x).toBeGreaterThanOrEqual(form.x+form.width);
 expect((await page.locator('#contribution').boundingBox()).width).toBeLessThan(700);
 await page.locator('#contribution').fill('300');
 await page.getByRole('button',{name:'Preview change'}).click();
 await expect(page.locator('.savings-allocation')).toContainText('€1,260.00');
 await page.goto('/app.html?screen=subscriptions');
 const summary=await page.locator('.subscription-summary').boundingBox();
 const list=await page.locator('.subscription-schedule').boundingBox();
 expect(list.x).toBeGreaterThanOrEqual(summary.x+summary.width);
 await page.getByRole('link',{name:/River Gym/}).click();
 await expect(page.locator('#main h1')).toHaveText('River Gym');
 expect((await page.locator('#main').boundingBox()).width).toBeLessThanOrEqual(760);
});

test('identity preparation, capture and recovery retain one progress overview',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/app.html?screen=kyc');
 await expect(page.getByLabel('Identity verification progress')).toHaveCount(1);
 await page.getByRole('link',{name:'Continue to ID check'}).click();
 await expect(page.getByRole('heading',{name:'Keep every edge visible'})).toBeVisible();
 await expect(page.locator('.kyc-spine [aria-current=step]')).toHaveText('Capture ID');
 await expect(page.locator('.kyc-spine .done')).toHaveCount(1);
 expect((await page.locator('.capture-frame').boundingBox()).height).toBeLessThan(240);
 const captureAction=await page.getByRole('link',{name:'Use this capture'}).boundingBox();
 expect(captureAction.y+captureAction.height).toBeLessThan(756);
 await page.getByRole('link',{name:'Simulate quality issue'}).click();
 await expect(page.getByRole('heading',{name:'Remove glare, then try again'})).toBeVisible();
 await page.getByRole('link',{name:'Try again',exact:true}).click();
 await expect(page.getByRole('link',{name:'Use this capture'})).toBeVisible();
});


test('subscriptions belongs to Home in phone navigation',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/app.html?screen=subscriptions');
 await expect(page.locator('.bottom-nav [aria-current="page"]')).toHaveText('Home');
});
