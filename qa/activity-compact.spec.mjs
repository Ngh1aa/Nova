import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('compact ledger exposes every transaction once across pages and filters the full dataset',async({page})=>{
 await page.goto('/app.html?screen=activity');
 const rows=page.locator('.activity-ledger .ledger-row');
 const visible=page.locator('.activity-ledger .ledger-row:visible');
 const range=page.locator('[data-activity-page-range]');
 const previous=page.getByRole('button',{name:'Previous',exact:true});
 const next=page.getByRole('button',{name:'Next',exact:true});
 await expect(rows).toHaveCount(12);await expect(visible).toHaveCount(6);
 await expect(range).toHaveText('1–6 of 12');await expect(previous).toBeDisabled();
 const first=await visible.locator('.list-title').allTextContents();
 await next.click();await expect(range).toHaveText('7–12 of 12');await expect(next).toBeDisabled();
 const second=await visible.locator('.list-title').allTextContents();
 expect(new Set([...first,...second]).size).toBe(12);
 await previous.click();await expect(range).toHaveText('1–6 of 12');
 await next.click();await page.getByRole('searchbox',{name:'Search transactions'}).fill('Maya');
 await expect(visible).toHaveCount(1);await expect(visible).toContainText('Maya Chen');
 await expect(page.locator('[data-activity-pagination]')).toBeHidden();
 await visible.click();await expect(page.locator('#main h1')).toHaveText('Maya Chen');
 await page.goto('/app.html?screen=activity');await next.click();
 await page.getByRole('button',{name:'Needs review',exact:true}).click();
 await expect(visible).toHaveCount(1);await expect(visible).toContainText('ByteMart Online');
 await page.getByRole('searchbox',{name:'Search transactions'}).fill('no result');
 await expect(page.getByText('No matching transactions',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Clear search and filters'}).click();
 await expect(range).toHaveText('1–6 of 12');await expect(visible).toHaveCount(6);
});

test('compact card fits phones and bounded desktop layouts without hiding controls',async({page})=>{
 for(const width of [320,390,768,1440,1920]){
  await page.setViewportSize({width,height:1000});await page.goto('/app.html?screen=activity');
  const card=await page.locator('.activity-ledger').boundingBox();
  if(width>=1200){expect(card.width).toBeLessThanOrEqual(976);expect(card.height).toBeLessThan(600);}
  for(const button of await page.locator('.activity-page-controls button').all()){
   const box=await button.boundingBox();expect(box.x).toBeGreaterThanOrEqual(card.x);expect(box.x+box.width).toBeLessThanOrEqual(card.x+card.width);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:1000});await page.goto('/app.html?screen=activity');
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>v.id)).toEqual([]);
 }
});
