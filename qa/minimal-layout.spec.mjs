import {test,expect} from '@playwright/test';

test('all Activity filters remain visible on phones and preserve ledger filtering',async({page})=>{
 for(const width of [320,390]){
  await page.setViewportSize({width,height:900});await page.goto('/app.html?screen=activity');
  for(const button of await page.locator('.filter-row button').all()){
   const rect=await button.boundingBox();expect(rect.x).toBeGreaterThanOrEqual(16);expect(rect.x+rect.width).toBeLessThanOrEqual(width-16);
  }
  await page.getByRole('button',{name:'Income',exact:true}).click();await expect(page.locator('.ledger-row:visible')).toHaveCount(1);await expect(page.locator('.ledger-row:visible')).toContainText('Salary deposit');
  await page.getByRole('button',{name:'Needs review',exact:true}).click();await expect(page.locator('.ledger-row:visible')).toHaveCount(1);
  await page.getByRole('button',{name:'All',exact:true}).click();await page.getByRole('searchbox',{name:'Search transactions'}).fill('no matching merchant');
  await expect(page.getByText('No matching transactions',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Clear search and filters'}).click();await expect(page.locator('.ledger-row:visible')).toHaveCount(6);
 }
});

test('Savings shows derived totals, exposes account details and keeps new goal flow',async({page})=>{
 await page.goto('/app.html?screen=savings');await page.evaluate(()=>localStorage.clear());await page.reload();
 await expect(page.locator('.savings-overview')).toContainText('€5,680');await expect(page.locator('.savings-overview')).toContainText('€9,000');
 await page.getByText('Savings account details',{exact:true}).click();await expect(page.getByText('4.2% APY',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'New goal'}).click();await page.getByLabel('Goal name',{exact:true}).fill('Laptop');await page.getByLabel('Target (€)',{exact:true}).fill('2000');
 await page.getByRole('dialog').getByRole('button',{name:'Create goal',exact:true}).click();await expect(page).toHaveURL(/goal=custom-/);
 await page.goto('/app.html?screen=savings');await expect(page.locator('.savings-overview')).toContainText('Across 3 goals');await expect(page.locator('.savings-overview')).toContainText('€11,000');
 await page.locator('.v3-goal-row').filter({hasText:'Laptop'}).click();await expect(page.locator('#main h1')).toHaveText('Laptop');
});

test('subscription cancellation distinction stays available through its disclosure',async({page})=>{
 await page.goto('/app.html?screen=subscriptions');
 await page.getByText('Blocking is not cancellation',{exact:true}).click();
 await expect(page.getByText('To end a subscription, cancel with the merchant. Freezing a card does not cancel it.',{exact:true})).toBeVisible();
 await page.getByRole('link',{name:/Streaming service/}).click();await expect(page.locator('#main h1')).toHaveText('Streaming service');
});
