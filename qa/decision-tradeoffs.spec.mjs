import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const targetRoot = process.env.QA_TARGET_DIR || process.cwd();
const read = (file) => fs.readFileSync(path.join(targetRoot, file), 'utf8');

const decisionIds = ['P24-D01','P24-D02','P24-D03','P24-D04','P24-D05','P24-D06','P24-D07'];

test('P2.4 decision record exposes choices, rejected alternatives, trade-offs and claim boundaries', async () => {
  const doc = read('docs/uiux/DESIGN-DECISIONS-TRADEOFFS-2026-10-01.md');
  const html = read('design-decisions.html');
  const prototype = read('prototype.html');

  for (const id of decisionIds) {
    expect(doc).toContain(id);
    expect(html).toContain(`data-decision-id="${id}"`);
  }

  expect(doc).toContain('Rejected alternatives');
  expect(doc).toContain('Trade-off accepted');
  expect(doc).toContain('Not allowed without new compatible evidence');
  expect(doc).toContain('post-Round-02 change is `ITERATED / NOT HUMAN-RETESTED`');
  expect(html).toContain('What I chose. What I rejected. What it cost.');
  expect(html).toContain('Not supported without new evidence');
  expect(html).toContain('0</strong><span>moderated sessions or business-impact claims');
  expect(prototype).toContain('href="design-decisions.html"');

  expect(doc).not.toContain('validated with users');
  expect(html).not.toContain('Tested with 5 users');
  expect(html).not.toContain('business impact improved');
});

test('P2.4 recruiter evidence renders responsively without document overflow', async ({ page }) => {
  const widths = [1440, 768, 390];

  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/design-decisions.html');
    await expect(page).toHaveTitle('Nova — Design Decisions & Trade-offs');
    await expect(page.getByRole('heading', { name: 'What I chose. What I rejected. What it cost.' })).toBeVisible();
    await expect(page.locator('.decision-card')).toHaveCount(7);
    await expect(page.getByRole('link', { name: 'Prototype' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Decisions' })).toHaveAttribute('aria-current', 'page');

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow, `document overflow at ${width}px`).toBe(false);
  }
});
