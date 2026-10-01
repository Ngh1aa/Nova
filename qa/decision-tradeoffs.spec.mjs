import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const targetRoot = process.env.QA_TARGET_DIR || process.cwd();
const artifactDir = path.resolve(process.cwd(), 'artifacts');
const read = (file) => fs.readFileSync(path.join(targetRoot, file), 'utf8');

const internalDecisionIds = ['P24-D01','P24-D02','P24-D03','P24-D04','P24-D05','P24-D06','P24-D07'];
const publicStoryIds = ['protected-money','freeze-report','recovery-certainty'];
const allowedPublicEvidenceLabels = new Set([
  'User observation',
  'User self-report',
  'Benchmark / heuristic',
  'Prototype / technical',
]);

test('P2.4 keeps seven internal decisions but exposes only three recruiter stories', async () => {
  const doc = read('docs/uiux/DESIGN-DECISIONS-TRADEOFFS-2026-10-01.md');
  const html = read('design-decisions.html');
  const prototype = read('prototype.html');

  for (const id of internalDecisionIds) expect(doc).toContain(id);
  for (const id of publicStoryIds) expect(html).toContain(`data-story-id="${id}"`);

  expect(doc).toContain('Rejected alternatives');
  expect(doc).toContain('Trade-off accepted');
  expect(doc).toContain('Not allowed without new compatible evidence');
  expect(doc).toContain('post-Round-02 change is `ITERATED / NOT HUMAN-RETESTED`');

  expect(html).toContain('Three decisions worth discussing.');
  expect(html).toContain('Problem / constraint.');
  expect(html).toContain('Rejected alternative');
  expect(html).toContain('Remaining uncertainty');
  expect(html).toContain('Need the other four decisions?');
  expect(html).toContain('0</strong><span>moderated sessions or business-impact claims');
  expect(prototype).toContain('href="design-decisions.html"');

  const publicDecisionCards = (html.match(/class="decision-card"/g) || []).length;
  expect(publicDecisionCards).toBe(3);

  const labels = [...html.matchAll(/data-evidence-label="([^"]+)"/g)].map((match) => match[1]);
  expect(labels.length).toBeGreaterThan(0);
  for (const label of labels) expect(allowedPublicEvidenceLabels.has(label), `unsupported public evidence label: ${label}`).toBe(true);

  expect(doc).not.toContain('validated with users');
  expect(html).not.toContain('Tested with 5 users');
  expect(html).not.toContain('business impact improved');
  expect(html).not.toContain('User observation</span>');
});

test('P2.4 recruiter evidence renders responsively without document overflow', async ({ page }) => {
  const widths = [1440, 768, 390];
  fs.mkdirSync(artifactDir, { recursive: true });

  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/design-decisions.html');
    await expect(page).toHaveTitle('Nova — Design Decisions & Trade-offs');
    await expect(page.getByRole('heading', { name: 'Three decisions worth discussing.' })).toBeVisible();
    await expect(page.locator('.decision-card')).toHaveCount(3);
    await expect(page.getByRole('link', { name: 'Prototype', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Decisions', exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', { name: 'Need the other four decisions?' })).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow, `document overflow at ${width}px`).toBe(false);

    await page.evaluate(async () => {
      const step = Math.max(500, window.innerHeight * 0.8);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 24));
      }
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 40));
    });

    await page.screenshot({
      path: path.join(artifactDir, `decision-tradeoffs-${width}.png`),
      fullPage: true,
    });
  }
});
