import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('activity, card payments and recent transfers open the selected transaction',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const [route,selector] of [['activity','.ledger-row'],['cards','.v3-list > a'],['transfer-recipient','.v4-transfer-list > a']]){
  await page.goto('/app.html?screen='+route);
  const entries=await page.locator(selector).evaluateAll(rows=>rows.map(row=>({name:(row.querySelector('.list-title,strong')?.textContent||'').trim(),href:row.getAttribute('href')})));
  expect(entries.length).toBeGreaterThan(0);
  for(const entry of entries){
   expect(entry.href).toContain('screen=transaction-detail');
   await page.goto('/'+entry.href);
   await expect(page.locator('#main h1')).toHaveText(entry.name);
   await expect(page.getByRole('heading',{name:entry.name,exact:true})).toBeVisible();
   if(entry.name!=='ByteMart Online')await expect(page.locator('.protection-band')).toHaveCount(0);
  }
 }
 await page.goto('/app.html?screen=transaction-detail&transaction=missing');
 await expect(page.locator('#main')).toContainText('Item not found');
});

test('goal, account and payment links preserve identity and financial context',async({page})=>{
 await page.goto('/app.html?screen=home');await page.evaluate(()=>localStorage.clear());await page.reload();
 await page.locator('.nova-account-row').filter({hasText:'Current account'}).click();
 await expect(page.locator('#main')).toContainText('€2,840.00');
 await expect(page.locator('#main')).toContainText('•••• 4421');
 await page.goto('/app.html?screen=savings');
 await page.getByRole('link',{name:/Holiday fund.*3,200/}).click();
 await expect(page.locator('#main h1')).toHaveText('Holiday fund');
 await expect(page.locator('.goal-amount')).toHaveText('€3,200.00');
 await expect(page.getByLabel('Monthly contribution')).toHaveValue('0');
 await page.getByLabel('Monthly contribution').fill('200');await page.getByRole('button',{name:'Preview change'}).click();
 await expect(page.locator('[data-nova-preview-safe]')).toHaveText('€1,100.00');
 await page.goto('/app.html?screen=savings-detail');await expect(page.getByLabel('Monthly contribution')).toHaveValue('260');
 for(const [route,selector] of [['home','.nova-bill-row'],['transfer-recipient','.v4-pay-list > a'],['subscriptions','.ledger-row']]){
  await page.goto('/app.html?screen='+route);
  const links=await page.locator(selector).evaluateAll(rows=>rows.map(row=>({name:row.querySelector('strong,.list-title').textContent,href:row.getAttribute('href')})));
  for(const link of links){await page.goto('/'+link.href);await expect(page.locator('#main h1')).toHaveText(link.name);}
 }
 await page.goto('/app.html?screen=notifications');
 await page.getByRole('link',{name:/Rent is due/}).click();await expect(page.locator('#notification-title')).toHaveText('Apartment rent');
 await page.locator('.notification-next a').click();await expect(page.locator('#main h1')).toHaveText('Apartment rent');
});

test('profile editing and goal creation validate, persist and render input as text',async({page})=>{
 await page.goto('/app.html?screen=settings');await page.evaluate(()=>localStorage.clear());await page.reload();
 await page.locator('.v3-settings-profile button').click();
 const dialog=page.getByRole('dialog');await page.getByLabel('Name',{exact:true}).fill('');await dialog.getByRole('button',{name:'Save changes'}).click();await expect(dialog).toBeVisible();
 await page.getByLabel('Name',{exact:true}).fill('Alex Tran');await page.getByLabel('Email',{exact:true}).fill('alex.tran@example.com');await dialog.getByRole('button',{name:'Save changes'}).click();
 await page.reload();await expect(page.locator('.v3-settings-profile h2')).toHaveText('Alex Tran');
 await page.goto('/app.html?screen=home');await expect(page.locator('.nova-dashboard-intro h1')).toHaveText('Welcome back, Alex');
 await page.goto('/app.html?screen=savings');await page.getByRole('button',{name:'New goal'}).click();
 await page.getByLabel('Goal name').fill('Laptop <img src=x>');await page.getByLabel('Target (€)').fill('1200');await page.getByRole('button',{name:'Create goal',exact:true}).click();
 await expect(page).toHaveURL(/goal=custom-/);await expect(page.locator('#main h1')).toHaveText('Laptop <img src=x>');
 await expect(page.locator('#main img')).toHaveCount(0);await expect(page.locator('#main')).toContainText('€1,200.00 target');
 await page.goto('/app.html?screen=savings');await expect(page.getByRole('link',{name:/Laptop <img src=x>/})).toBeVisible();
});

test('new detail views and secondary dialogs remain accessible on desktop and mobile',async({page})=>{
 test.setTimeout(120000);await page.emulateMedia({reducedMotion:'reduce'});
 const routes=['account-detail','payment-detail&payment=apartment-rent','savings-detail&goal=holiday','transaction-detail&transaction=greenline-market','transaction-detail&transaction=salary-deposit','transaction-detail&transaction=northstar-books','transaction-detail&transaction=merchant-refund','transaction-detail&transaction=maya-chen'];
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  for(const route of routes){
   await page.goto('/app.html?screen='+route);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBe(true);
   const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(audit.violations,route).toEqual([]);
  }
  await page.goto('/app.html?screen=settings');await page.getByRole('button',{name:/Documents & statements/}).click();
  await expect(page.getByRole('dialog',{name:'Demo statement'})).toBeVisible();
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByRole('button',{name:/Documents & statements/})).toBeFocused();
 }
});
