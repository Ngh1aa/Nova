import {test,expect} from '@playwright/test';

test('desktop inbox fits its content and preserves selected notification identity',async({page})=>{
 await page.setViewportSize({width:1772,height:832});
 await page.goto('/app.html?screen=notifications');
 await expect(page.locator('#notification-title')).toHaveText('ByteMart Online');
 const inbox=await page.locator('.notification-inbox').boundingBox();
 expect(inbox.width).toBeLessThanOrEqual(1280);
 expect(inbox.height).toBeLessThan(620);
 const item=await page.locator('.notification-item').first().boundingBox();
 expect(item.height).toBeLessThan(130);
 expect(inbox.y+inbox.height).toBeLessThanOrEqual(832);
 await page.locator('[data-notification-preview="rent"]').click();
 await expect(page.locator('#notification-title')).toHaveText('Apartment rent');
 await page.locator('.notification-next a').click();
 await expect(page).toHaveURL(/screen=payment-detail&payment=apartment-rent/);
 await page.goto('/app.html?screen=notifications');
 await page.locator('[data-notification-preview="savings"]').click();
 await expect(page.locator('#notification-title')).toHaveText('Emergency buffer');
 await page.locator('.notification-next a').click();
 await expect(page).toHaveURL(/screen=savings-detail&goal=emergency/);
});

test('rail has no scrollable overflow and phone notifications open native details',async({page})=>{
 for(const height of [560,600,832,1080]){
  await page.setViewportSize({width:1440,height});
  await page.goto('/app.html?screen=notifications');
  const rail=await page.locator('.sidebar').evaluate(el=>({scroll:el.scrollHeight,height:el.clientHeight,overflow:getComputedStyle(el).overflowY,bar:getComputedStyle(el).scrollbarWidth}));
  expect(rail.scroll).toBeGreaterThanOrEqual(rail.height);
  expect(rail.overflow).toBe('auto');
  expect(rail.bar).toBe('none');
  await page.locator('.sidebar a[title="Settings"]').focus();
  const settings=await page.locator('.sidebar a[title="Settings"]').boundingBox();
  expect(settings.y+settings.height).toBeLessThanOrEqual(height);
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto('/app.html?screen=notifications');
 await expect(page.locator('.notification-preview')).toBeHidden();
 await page.locator('[data-notification-preview="rent"]').click();
 await expect(page).toHaveURL(/screen=payment-detail&payment=apartment-rent/);
});

test('Home phone profile remains visible above the header and opens Settings',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/app.html?screen=home');
 const profile=page.locator('.nova-profile-chip');
 await expect(profile).toBeVisible();
 await profile.click();
 await expect(page).toHaveURL(/screen=settings/);
});
