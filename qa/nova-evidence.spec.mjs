import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const prototypeSource = fs.readFileSync('prototype.html', 'utf8');

test('recruiter prototype uses current Nova product truth, not the retired Daybook direction', async ({ page }) => {
  expect(prototypeSource).not.toContain('Modern Daybook');
  expect(prototypeSource).not.toContain('Accountable</span><span class="prototype-label">Editorial');
  expect(prototypeSource).toContain('Financial Workspace');
  expect(prototypeSource).toContain('Money Horizon');
  expect(prototypeSource).toContain('PLANNED / RECRUITING · 0 verified sessions');
  expect(prototypeSource).toContain('Product designer · prototype author');
  expect(prototypeSource).toContain('Evidence before destructive action');
  expect(prototypeSource).toContain('Consequence before confirmation');

  await page.goto('/prototype.html');
  await expect(page.getByRole('heading', { name: /Know what is safe to spend/ })).toBeVisible();
  await expect(page.getByText(/SIMULATED/).first()).toBeVisible();
  await expect(page.getByText(/0 verified sessions/).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Three product decisions worth reviewing' })).toBeVisible();
});

test('recruiter guide exposes direct paths to thesis, trust, commitment and recovery evidence', async ({ page }) => {
  await page.goto('/prototype.html');

  const destinations = [
    'app.html?screen=home',
    'app.html?screen=transaction-detail',
    'app.html?screen=transfer-recipient',
    'app.html?screen=offline',
    'app.html?screen=cards',
    'app.html?screen=kyc&state=failed',
    'design-system.html',
    'component-states.html',
    'sitemap.html',
    'user-flows.html'
  ];

  for (const href of destinations) {
    await expect(page.locator(`a[href="${href}"]`).first(), `Missing recruiter evidence link: ${href}`).toBeVisible();
  }
});

test('A32 evidence documents keep validation and ownership boundaries explicit', async () => {
  const audience = fs.readFileSync('docs/audience-intent.md', 'utf8');
  const audit = fs.readFileSync('docs/website-audit.md', 'utf8');

  expect(audience).toContain('PLANNED_VALIDATION');
  expect(audience).toContain('not a validated demographic segment');
  expect(audience).toContain('The recruiter layer belongs in `prototype.html`');

  expect(audit).toContain('P0 — Recruiter entry narrative contradicts active source of truth');
  expect(audit).toContain('Do not add another visual override layer in A32');
  expect(audit).toContain('CSS/JS layer consolidation');
  expect(audit).toContain('Direct-user findings until real sessions exist');
});
