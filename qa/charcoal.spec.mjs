import {test,expect} from '@playwright/test';

test('Home shortcuts preserve the selected saved recipient through review and profile edits do not alter recipient identities',async({page})=>{
 await page.goto('/app.html?screen=home');await page.evaluate(()=>localStorage.clear());await page.reload();
 for(const [id,name] of [['daniel-lee-7184','Daniel Lee'],['an-nguyen-3052','An Nguyen'],['maya-chen-2048','Maya Chen']]){
  await page.goto('/app.html?screen=home');await page.locator(`.nova-recipient-list a[href*="recipient=${id}"]`).click();
  await expect(page.locator('.task-panel>h2')).toHaveText('Send to '+name);
  await page.getByLabel('Amount',{exact:true}).fill('80');await page.getByRole('button',{name:'Review transfer',exact:true}).click();
  await expect(page.locator('.review-row').filter({hasText:'Recipient'})).toContainText(name);
 }
 await page.goto('/app.html?screen=home');await page.evaluate(()=>localStorage.setItem('nova_profile',JSON.stringify({name:'Linh Tran',email:'linh@example.com'})));await page.reload();
 await expect(page.locator('.nova-profile-chip')).toContainText('Linh');await expect(page.locator('.nova-recipient-list .nova-avatar')).toHaveText(['MC','DL','AN','']);
});

test('all task routes fit narrow, tablet and laptop viewports with meaningful visible headings',async({page})=>{
 test.setTimeout(90000);
 const routes=['home','activity','cards','card-controls','transfer-recipient','transfer-amount','transfer-review','transfer-success','transaction-detail','report-transaction','savings','savings-detail','subscriptions','notifications','security','settings','onboarding','kyc','offline','biometric-failed','error'];
 for(const width of [320,768,1024]){await page.setViewportSize({width,height:900});for(const route of routes){
  await page.goto('/app.html?screen='+route);await expect(page.locator('#main h1').first()).toBeVisible();
  expect(await page.evaluate(()=>{const stage=document.querySelector('.app-stage');return document.documentElement.scrollWidth<=innerWidth+1&&stage.scrollWidth<=stage.clientWidth+1}),route+'/'+width).toBe(true);
 }}
});
