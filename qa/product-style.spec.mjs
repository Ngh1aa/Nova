import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const screens=['home','activity','transaction-detail','report-transaction','cards','card-frozen','card-controls','transfer-recipient','transfer-amount','transfer-review','biometric-failed','offline','transfer-success','savings','savings-detail','subscriptions','security','settings','notifications','onboarding','kyc','error'];
const states=['home&state=empty&pin=1','home&state=loading&pin=1','home&state=edge&pin=1','report-transaction&state=handoff','kyc&state=capture','kyc&state=failed','kyc&state=manual','kyc&state=review'];

test('all native product screens share the reference style and pass accessible responsive smoke checks',async({page})=>{
 test.setTimeout(180000);
 await page.emulateMedia({reducedMotion:'reduce'});
 const errors=[],violations=[];page.on('pageerror',error=>errors.push(error.message));
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  for(const screen of [...screens,...states]){
   await page.goto('/app.html?screen='+screen);
   if(screen.startsWith('home&state=')){
    const state=new URLSearchParams('screen='+screen).get('state');
    await page.locator(`[data-native-product-state="${state}"]`).waitFor();
   }
   await expect(page.locator('#main')).toBeVisible();
   expect(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor),`${screen}/${width}`).toBe('rgb(28, 27, 34)');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${screen}/${width}`).toBe(true);
   if(width===390&&await page.locator('.ios26-nav-center').isVisible()){
    const title=await page.locator('.ios26-nav-center').boundingBox();
    const actions=await page.locator('.ios26-nav-actions').boundingBox();
    expect(title.y).toBeGreaterThanOrEqual(actions.y+actions.height);
    expect(title.x+title.width).toBeLessThanOrEqual(width);
   }
   const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
   violations.push(...result.violations.map(v=>({screen,width,id:v.id,nodes:v.nodes.map(n=>n.target)})));
  }
 }
 expect(errors).toEqual([]);
 expect(violations).toEqual([]);
});

test('mobile theme control fits its card and frozen card retains the same owner and readable number',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390]){
  await page.setViewportSize({width,height:900});
  await page.goto('/app.html?screen=settings');
  const card=page.locator('.v3-settings-card').filter({has:page.getByRole('heading',{name:'Appearance'})});
  const bounds=await card.boundingBox();
  for(const button of await card.locator('.v3-segmented button').all()){
   const box=await button.boundingBox();
   expect(box.x).toBeGreaterThan(bounds.x);
   expect(box.x+box.width).toBeLessThan(bounds.x+bounds.width);
  }
  await page.goto('/app.html?screen=card-frozen');
  await expect(page.locator('.card-bottom')).toContainText('Alex Nguyen');
  await expect(page.locator('.card-number')).toContainText('4821');
  expect(await page.locator('.card-object.frozen').evaluate(el=>getComputedStyle(el,'::before').content)).toBe('none');
 }
 await page.goto('/app.html?screen=offline');
 const confirm=page.getByRole('button',{name:'Confirm with biometrics'});
 await expect(confirm).toBeDisabled();
 expect(await confirm.evaluate(el=>getComputedStyle(el).cursor)).toBe('not-allowed');
});

test('labelled charcoal rail stays attached while workspace content scrolls',async({page})=>{
 test.setTimeout(60000);
 await page.setViewportSize({width:1440,height:900});
 for(const reducedMotion of ['no-preference','reduce']){
  await page.emulateMedia({reducedMotion});
  for(const screen of ['home','activity','savings','settings']){
   await page.goto('/app.html?screen='+screen);
   await page.locator('#app').evaluate(async root=>{await Promise.all(root.getAnimations().map(animation=>animation.finished));});
   const rail=page.locator('.sidebar');
   const before=await rail.boundingBox();
   await page.evaluate(()=>{document.querySelector('#main').style.minHeight='2400px';document.querySelector('.app-stage').scrollTo(0,600);});
   const after=await rail.boundingBox();
   expect(after.y,`${screen}/${reducedMotion}`).toBeCloseTo(before.y,1);
   const frame=await page.locator('.app-shell').boundingBox();
   expect(after.y).toBeCloseTo(frame.y,1);
   expect(after.height).toBeCloseTo(frame.height,1);
   expect(await page.locator('.app-stage').evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
   const last=await page.locator('.v4-rail-nav a').last().boundingBox();
   expect(last.y+last.height).toBeLessThanOrEqual(after.y+after.height);
   const gap=await page.locator('.v4-rail-nav').evaluate(nav=>{
    const primary=nav.querySelector('.v5-rail-primary').getBoundingClientRect();
    const secondary=nav.querySelector('.v5-rail-secondary').getBoundingClientRect();
    return secondary.top-primary.bottom;
   });
   expect(gap).toBeGreaterThanOrEqual(0);
  }
 }
});

test('full-height sidebar keeps Settings reachable in a short viewport',async({page})=>{
 await page.setViewportSize({width:1280,height:480});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/app.html?screen=savings');
 await page.locator('#app').evaluate(async root=>{await Promise.all(root.getAnimations().map(animation=>animation.finished));});
 const settings=page.locator('.v4-rail-nav').getByRole('link',{name:'Settings',exact:true});
 await settings.focus();
 const item=await settings.boundingBox(),rail=await page.locator('.sidebar').boundingBox();
 expect(item.y).toBeGreaterThanOrEqual(rail.y);
 expect(item.y+item.height).toBeLessThanOrEqual(rail.y+rail.height+1);
 await settings.click();
 await expect(page).toHaveURL(/screen=settings/);
});

test('desktop sidebar scales with screen height and opens its added native destinations',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const height of [720,900,1080]){
  await page.setViewportSize({width:1440,height});
  await page.goto('/app.html?screen=home');
  const rail=page.locator('.sidebar');
  expect((await rail.boundingBox()).height).toBeCloseTo(height,1);
  expect(await rail.evaluate(el=>el.scrollHeight<=el.clientHeight)).toBe(true);
  for(const [name,screen] of [['Subscriptions','subscriptions'],['Notifications','notifications']]){
   await rail.getByRole('link',{name,exact:true}).click();
   await expect(page).toHaveURL(new RegExp(`screen=${screen}`));
   await expect(rail.locator('[aria-current="page"]')).toHaveCount(1);
   await expect(rail.locator('[aria-current="page"]')).toHaveText(name);
  }
 }
});
