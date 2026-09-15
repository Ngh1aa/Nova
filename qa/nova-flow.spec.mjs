import { test, expect } from '@playwright/test';
import fs from 'node:fs';

fs.mkdirSync('artifacts', { recursive: true });

async function resetPrototype(page) {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
}

async function shot(page, name, width, height = 900) {
  await page.setViewportSize({ width, height });
  await page.screenshot({ path: `artifacts/${name}-${width}.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow, `Unexpected horizontal overflow on ${name} at ${width}px`).toBeFalsy();
}

test('hero flow: suspicious transaction -> freeze -> card state -> unfreeze recovery', async ({ page }) => {
  await resetPrototype(page);
  await page.goto('/app.html?screen=home');
  await expect(page.getByText('€1,300.00').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Money Horizon' })).toBeVisible();
  await page.getByRole('link', { name: /Unusual card activity/ }).click();
  await expect(page.getByText('ByteMart Online').first()).toBeVisible();
  await page.getByRole('button', { name: 'Freeze card' }).click();
  await expect(page.getByRole('dialog')).toContainText('Already-authorized or offline payments can still settle');
  await page.getByRole('dialog').getByRole('button', { name: 'Freeze card' }).click();
  await expect(page.getByText('Card frozen').first()).toBeVisible();
  await page.getByRole('link', { name: 'Review frozen card' }).click();
  await expect(page.getByText('Frozen').first()).toBeVisible();
  await page.getByRole('button', { name: 'Unfreeze' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Authenticate & unfreeze' }).click();
  await expect(page.getByText('Active').first()).toBeVisible();
});

test('transfer flow: recipient -> amount -> review -> biometric -> simulated receipt', async ({ page }) => {
  await resetPrototype(page);
  await page.goto('/app.html?screen=transfer-recipient');
  await page.getByRole('link', { name: /Maya Chen/ }).click();
  await page.getByLabel('Amount').fill('145');
  await page.getByRole('button', { name: 'Review transfer' }).click();
  await expect(page.getByRole('heading', { name: 'Review transfer' })).toBeVisible();
  await expect(page.getByText('€1,155.00').first()).toBeVisible();
  await page.getByRole('button', { name: 'Confirm with biometrics' }).click();
  await expect(page.getByRole('dialog')).toContainText('Prototype control');
  await page.getByRole('dialog').getByRole('button', { name: 'Approve demo' }).click();
  await expect(page.getByRole('heading', { name: 'Transfer prepared' })).toBeVisible();
  await expect(page.getByText('No real money moved.')).toBeVisible();
});

test('transfer exceptions: insufficient, biometric failure and offline', async ({ page }) => {
  await page.goto('/app.html?screen=transfer-amount');
  await page.getByLabel('Amount').fill('2900');
  await page.getByRole('button', { name: 'Review transfer' }).click();
  await expect(page.getByText('You need €60.00 more to send this amount.')).toBeVisible();

  await page.goto('/app.html?screen=biometric-failed');
  await expect(page.getByText('We couldn’t verify you')).toBeVisible();
  await page.getByRole('button', { name: 'Use passcode' }).click();
  await expect(page.getByRole('dialog')).toContainText('No credential is stored');
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm demo passcode' }).click();
  await expect(page.getByRole('heading', { name: 'Transfer prepared' })).toBeVisible();

  await page.goto('/app.html?screen=offline');
  await expect(page.getByText('You’re offline. You can review details, but money actions are paused.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm with biometrics' })).toBeDisabled();
});

test('KYC quality failure has specific retry and alternate path', async ({ page }) => {
  await page.goto('/app.html?screen=kyc');
  await page.getByRole('link', { name: 'Continue to ID check' }).click();
  await page.getByRole('link', { name: 'Simulate quality issue' }).click();
  await expect(page.getByText('The image was too reflective around the document number.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try again' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Request another verification option' })).toBeVisible();
});

test('material screen roles use distinct composition families', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  await expect(page.locator('.decision-field')).toBeVisible();
  await expect(page.locator('.horizon-timeline')).toBeVisible();

  await page.goto('/app.html?screen=activity');
  await expect(page.locator('.activity-header')).toBeVisible();
  await expect(page.locator('.ledger')).toBeVisible();

  await page.goto('/app.html?screen=transaction-detail');
  await expect(page.locator('.dossier-hero')).toBeVisible();
  await expect(page.locator('.evidence-panel')).toBeVisible();

  await page.goto('/app.html?screen=transfer-review');
  await expect(page.locator('.task-panel')).toBeVisible();
  await expect(page.locator('.impact-panel')).toBeVisible();

  await page.goto('/app.html?screen=kyc&state=failed');
  await expect(page.locator('.kyc-spine')).toBeVisible();
  await expect(page.locator('.document-sheet')).toBeVisible();
});

test('responsive rendered evidence covers product roles at 390 / 768 / 1024 / 1440', async ({ page }) => {
  await page.goto('/app.html?screen=home');
  for (const [w, h] of [[390, 844], [768, 1024], [1024, 900], [1440, 1000]]) {
    await shot(page, 'nova-home', w, h);
  }

  const evidence = [
    ['activity', '/app.html?screen=activity', [390, 1440]],
    ['transaction-detail', '/app.html?screen=transaction-detail', [390, 1440]],
    ['cards', '/app.html?screen=cards', [390, 1440]],
    ['transfer-review', '/app.html?screen=transfer-review', [390, 1024]],
    ['savings', '/app.html?screen=savings', [390, 1440]],
    ['kyc-failed', '/app.html?screen=kyc&state=failed', [390, 1024]],
    ['biometric-failed', '/app.html?screen=biometric-failed', [390]],
    ['offline', '/app.html?screen=offline', [390]]
  ];

  for (const [name, route, widths] of evidence) {
    await page.goto(route);
    for (const width of widths) {
      await shot(page, `nova-${name}`, width, width === 390 ? 844 : width === 1024 ? 900 : 1000);
    }
  }

  await page.goto('/prototype.html');
  await shot(page, 'nova-prototype', 1440, 1000);
  await page.goto('/component-states.html');
  await shot(page, 'nova-component-states', 1440, 1000);
  await page.goto('/design-system.html');
  await shot(page, 'nova-design-system', 1440, 1000);
});
