import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes=['home','activity','transaction-detail','report-transaction','cards','card-controls','transfer-recipient','transfer-amount','transfer-review','biometric-failed','offline','transfer-success','savings','savings-detail','subscriptions','settings','security','kyc','onboarding','notifications','error'];
test('shared pastel owners remain visible and usable on native routes at desktop and mobile',async({page})=>{
 test.setTimeout(120_000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,390])for(const screen of routes){
  await page.setViewportSize({width,height:1000});await page.goto('/app.html?screen='+screen);
  await expect(page.locator('#main')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),screen).toBe(true);
  expect(await page.evaluate(()=>[...document.images].every(x=>x.complete&&x.naturalWidth>0)),screen).toBe(true);
  const broken=await page.locator('.v3-icon,.v3-pill-btn,.v4-dark-pill,.v3-switch>span,.v3-network i,.v3-network b').evaluateAll(xs=>xs.filter(x=>getComputedStyle(x).borderRadius==='0px').map(x=>x.className));
  expect(broken,screen).toEqual([]);
 }
 expect(errors).toEqual([]);
});
test('Activity month, filters and search have clear hierarchy and functioning selected states',async({page})=>{
 await page.goto('/app.html?screen=activity');
 const month=page.getByRole('heading',{name:'September',exact:true});await expect(month).toBeVisible();
 expect(await month.evaluate(x=>parseFloat(getComputedStyle(x).fontSize))).toBeLessThanOrEqual(50);
 await page.getByRole('button',{name:'Needs review',exact:true}).click();
 await expect(page.getByRole('button',{name:'Needs review',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.ledger-row:visible')).toHaveCount(1);
 await page.getByRole('button',{name:'All',exact:true}).click();
 await page.getByRole('searchbox',{name:'Search transactions'}).fill('Greenline');
 await expect(page.locator('.ledger-row:visible')).toHaveCount(1);
 await page.getByRole('searchbox',{name:'Search transactions'}).fill('');
 await expect(page.locator('.ledger-row:visible')).toHaveCount(8);
 expect(await page.locator('.v4-rail-nav a.active .v5-rail-icon').evaluate(x=>getComputedStyle(x,'::after').content)).toBe('none');
});
test('Pay and Cards CTAs stay legible in default hover and keyboard focus states',async({page})=>{
 for(const [screen,name] of [['transfer-recipient','Choose recipient'],['cards','All controls']]){
  await page.goto('/app.html?screen='+screen);
  const cta=page.getByRole('link',{name:new RegExp(name)});await expect(cta).toBeVisible();
  for(const state of ['default','hover','focus']){
   if(state==='hover')await cta.hover();if(state==='focus')await cta.focus();
   const style=await cta.evaluate(x=>{const s=getComputedStyle(x);return {radius:parseFloat(s.borderRadius),color:s.color,bg:s.backgroundColor};});
   expect(style.radius).toBeGreaterThan(10);expect(style.color).toBe('rgb(255, 255, 255)');expect(style.bg).not.toBe(style.color);
  }
  await cta.click();
  if(screen==='cards')await expect(page).toHaveURL(/screen=card-controls/);
  else await expect(page.getByRole('searchbox',{name:'Search recipient by name or account'})).toBeFocused();
 }
});
test('Settings switches align, expose names, work with Space and persist on return',async({page})=>{
 for(const reducedMotion of ['reduce','no-preference']){
  await page.emulateMedia({reducedMotion});await page.goto('/app.html?screen=settings');
  const check=page.getByRole('checkbox',{name:'Instant payment alerts'});
  expect(await check.evaluate(x=>getComputedStyle(x).opacity)).toBe('0');
  const rightEdges=await page.locator('.v3-settings-card').filter({has:page.getByRole('heading',{name:'Stay informed, not interrupted'})}).locator('.v3-switch').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().right));
  expect(Math.max(...rightEdges)-Math.min(...rightEdges)).toBeLessThan(1);
  const before=await check.isChecked();await check.focus();await page.keyboard.press('Space');await expect(check).toBeChecked({checked:!before});
  await page.reload();await expect(check).toBeChecked({checked:!before});
  for(const label of await page.locator('.v3-switch').all()){
   await expect.poll(async()=>Math.round((await label.boundingBox()).width)).toBeGreaterThanOrEqual(44);
   await expect.poll(async()=>Math.round((await label.boundingBox()).height)).toBeGreaterThanOrEqual(44);
  }
 }
});
test('Security reflects changed demo preferences without falsely retaining the positive score',async({page})=>{
 await page.goto('/app.html?screen=security');const check=page.getByRole('checkbox',{name:'Biometric confirmation'});
 await check.uncheck();await expect(page.locator('.v3-protection-list .v3-status')).toHaveText('3 enabled');
 await expect(page.getByRole('heading',{name:'Your account is well protected'})).toHaveCount(0);
 await expect(page.locator('.v3-score-ring')).toBeHidden();await page.reload();await expect(check).not.toBeChecked();
 await check.check();await expect(page.locator('.v3-protection-list .v3-status')).toHaveText('4 enabled');
 await expect(page.locator('.v3-score-ring')).toBeVisible();
});
test('Settings and Security added to accessibility coverage at desktop and mobile',async({page})=>{
 for(const width of [1440,390])for(const screen of ['settings','security']){
  await page.setViewportSize({width,height:1000});await page.goto('/app.html?screen='+screen);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),`${screen}/${width}`).toEqual([]);
 }
});
