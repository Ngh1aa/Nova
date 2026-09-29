import { test, expect } from '@playwright/test';

async function reset(page) {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/app.html?screen=savings-detail');
}

test('savings preview validates input and recomputes Money Horizon without moving money', async ({ page }) => {
  await reset(page);

  const contribution = page.getByLabel('Monthly contribution');
  const preview = page.getByRole('button', { name: 'Preview change' });
  const error = page.locator('#contribution-error');
  const status = page.locator('[data-nova-savings-preview-status]');
  const horizon = page.locator('.section .horizon');
  const bar = horizon.locator('.horizon-bar');

  await expect(contribution).toHaveValue('260');
  await expect(horizon.locator('[data-nova-preview-safe]')).toHaveText('€1,300.00');
  await expect(horizon.locator('[data-nova-preview-committed]')).toHaveText('€1,040.00');

  await contribution.fill('');
  await preview.click();
  await expect(error).toContainText('Enter a monthly contribution to preview.');
  await expect(contribution).toHaveAttribute('aria-invalid', 'true');
  await expect(horizon.locator('[data-nova-preview-safe]')).toHaveText('€1,300.00');

  await contribution.fill('abc');
  await preview.click();
  await expect(error).toContainText('Enter a valid number for the monthly contribution.');

  await contribution.fill('-50');
  await preview.click();
  await expect(error).toContainText('Monthly contribution cannot be negative.');

  await contribution.fill('10001');
  await preview.click();
  await expect(error).toContainText('cannot exceed €10,000.00');

  await contribution.fill('500');
  await preview.click();
  await expect(error).toBeHidden();
  await expect(contribution).not.toHaveAttribute('aria-invalid', 'true');
  await expect(status).toContainText('Preview updated');
  await expect(status).toContainText('€1,280.00 committed');
  await expect(status).toContainText('€1,060.00 Safe to spend');
  await expect(horizon.locator('[data-nova-preview-safe]')).toHaveText('€1,060.00');
  await expect(horizon.locator('[data-nova-preview-committed]')).toHaveText('€1,280.00');
  await expect(bar).toHaveAttribute('aria-label', /€1,060\.00 safe to spend, €1,280\.00 committed/);
  await expect(horizon.locator('.horizon-note')).toContainText('No money has moved');

  await contribution.fill('0');
  await preview.click();
  await expect(status).toContainText('€780.00 committed');
  await expect(status).toContainText('€1,560.00 Safe to spend');
  await expect(horizon.locator('[data-nova-preview-safe]')).toHaveText('€1,560.00');
  await expect(horizon.locator('[data-nova-preview-committed]')).toHaveText('€780.00');

  await contribution.fill('1600');
  await preview.click();
  await expect(status).toContainText('Overcommitted by €40.00');
  await expect(status).toContainText('€2,380.00 would be committed');
  await expect(status).toContainText('Safe to spend at −€40.00');
  await expect(horizon.locator('[data-nova-preview-safe]')).toHaveText('−€40.00');
  await expect(horizon.locator('[data-nova-preview-committed]')).toHaveText('€2,380.00');
  await expect(horizon.locator('[data-nova-savings-shortfall]')).toContainText('Plan shortfall €40.00');
  await expect(bar).toHaveAttribute('aria-label', /Plan shortfall €40\.00/);
  await expect(horizon.locator('.horizon-note')).toContainText('overcommitted by €40.00');
  await expect(horizon.locator('.horizon-note')).toContainText('no money has moved');
});
