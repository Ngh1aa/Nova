import { test, expect } from '@playwright/test';
import fs from 'node:fs';

fs.mkdirSync('artifacts', { recursive: true });

async function resetPrototype(page) {
  await page.goto('/app.html?screen=home');
  await page.evaluate(() => localStorage.clear());
}

async function tabUntil(page, selector, maxTabs = 40) {
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press('Tab');
    const matched = await page.evaluate((target) => document.activeElement?.matches?.(target) || false, selector);
    if (matched) return index + 1;
  }
  throw new Error(`Keyboard focus never reached ${selector} within ${maxTabs} Tab presses`);
}

async function focusEvidence(page) {
  return page.evaluate(() => {
    const node = document.activeElement;
    const style = node ? getComputedStyle(node) : null;
    return {
      tag: node?.tagName || null,
      id: node?.id || null,
      text: (node?.textContent || node?.getAttribute?.('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 100),
      outlineStyle: style?.outlineStyle || null,
      outlineWidth: style?.outlineWidth || null,
      outlineColor: style?.outlineColor || null,
      boxShadow: style?.boxShadow || null
    };
  });
}

async function expectVisibleFocus(page) {
  const evidence = await focusEvidence(page);
  const outlineWidth = Number.parseFloat(evidence.outlineWidth || '0');
  const hasOutline = evidence.outlineStyle !== 'none' && outlineWidth >= 2;
  const hasShadow = !!evidence.boxShadow && evidence.boxShadow !== 'none';
  expect(hasOutline || hasShadow, `Focused element lacks a visible focus indicator: ${JSON.stringify(evidence)}`).toBeTruthy();
  return evidence;
}

async function assertNoHorizontalOverflow(page, label) {
  const state = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth
  }));
  expect(state.scrollWidth, `${label} horizontal overflow: ${JSON.stringify(state)}`).toBeLessThanOrEqual(state.clientWidth + 1);
  expect(state.bodyScrollWidth, `${label} body horizontal overflow: ${JSON.stringify(state)}`).toBeLessThanOrEqual(state.clientWidth + 1);
  return state;
}

test('keyboard-only critical transfer path keeps logical focus and visible focus indicators', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await resetPrototype(page);
  await page.goto('/app.html?screen=transfer-recipient');

  const trace = [];

  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  trace.push({ step: 'skip-link', ...(await expectVisibleFocus(page)) });

  await tabUntil(page, '#pay-recipient-search');
  await expect(page.locator('#pay-recipient-search')).toBeFocused();
  trace.push({ step: 'recipient-search', ...(await expectVisibleFocus(page)) });
  await page.keyboard.type('Daniel');

  await tabUntil(page, '[data-recipient-id="daniel-lee-7184"]');
  trace.push({ step: 'recipient-daniel', ...(await expectVisibleFocus(page)) });
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/screen=transfer-amount/);
  await tabUntil(page, '#amount');
  trace.push({ step: 'amount', ...(await expectVisibleFocus(page)) });
  await page.keyboard.press('Control+A');
  await page.keyboard.type('145');
  await tabUntil(page, '#note');
  await expect(page.locator('#note')).toBeFocused();
  trace.push({ step: 'reference', ...(await expectVisibleFocus(page)) });
  await page.keyboard.press('Control+A');
  await page.keyboard.type('Keyboard rent split');
  await tabUntil(page, '#amount-form button[type="submit"]');
  await expect(page.getByRole('button', { name: /Review transfer/ })).toBeFocused();
  trace.push({ step: 'review-transfer', ...(await expectVisibleFocus(page)) });
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/screen=transfer-review/);
  await tabUntil(page, '#confirm-transfer');
  trace.push({ step: 'confirm-transfer', ...(await expectVisibleFocus(page)) });
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Approve demo' })).toBeVisible();

  fs.writeFileSync('artifacts/p1-8-keyboard-focus.json', JSON.stringify(trace, null, 2));
});

test('200 percent zoom-equivalent reflow and 200 percent text scaling do not create horizontal scrolling', async ({ page }) => {
  const routes = [
    '/app.html?screen=home',
    '/app.html?screen=activity',
    '/app.html?screen=transfer-recipient',
    '/app.html?screen=transfer-amount',
    '/app.html?screen=cards',
    '/app.html?screen=savings-detail'
  ];
  const evidence = [];

  for (const route of routes) {
    // 720 CSS px is the layout-width equivalent of a 1440px viewport at 200% browser zoom.
    await page.setViewportSize({ width: 720, height: 900 });
    await page.goto(route);
    await expect(page.locator('#main')).toBeVisible();
    evidence.push({ route, mode: '200%-zoom-equivalent', ...(await assertNoHorizontalOverflow(page, `${route} at 200% zoom equivalent`)) });

    // Separately stress text enlargement without changing the wide layout viewport.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await expect(page.locator('#main')).toBeVisible();
    evidence.push({ route, mode: '200%-root-text', ...(await assertNoHorizontalOverflow(page, `${route} at 200% text scaling`)) });
  }

  fs.writeFileSync('artifacts/p1-8-zoom-reflow.json', JSON.stringify(evidence, null, 2));
});

test.describe('reduced motion evidence', () => {
  test.use({ reducedMotion: 'reduce' });

  test('prefers-reduced-motion removes route and interaction motion while preserving content', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/app.html?screen=home');
    await expect(page.locator('#main')).toBeVisible();

    const evidence = await page.evaluate(() => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const app = getComputedStyle(document.querySelector('.app-root'));
      const sidebar = getComputedStyle(document.querySelector('.sidebar'));
      const motionNodes = [...document.querySelectorAll('[data-nova-motion]')].slice(0, 12).map((node) => {
        const style = getComputedStyle(node);
        return {
          tag: node.tagName,
          motion: node.getAttribute('data-nova-motion'),
          animationName: style.animationName,
          transitionDuration: style.transitionDuration,
          opacity: style.opacity,
          transform: style.transform
        };
      });
      return {
        reduced,
        appAnimationName: app.animationName,
        sidebarAnimationName: sidebar.animationName,
        motionNodes
      };
    });

    expect(evidence.reduced).toBeTruthy();
    expect(evidence.appAnimationName).toBe('none');
    expect(evidence.sidebarAnimationName).toBe('none');
    for (const node of evidence.motionNodes) {
      expect(node.animationName).toBe('none');
      expect(node.opacity).toBe('1');
      expect(node.transform).toBe('none');
      const durations = node.transitionDuration.split(',').map((part) => Number.parseFloat(part) || 0);
      expect(Math.max(...durations)).toBeLessThanOrEqual(0.01);
    }

    fs.writeFileSync('artifacts/p1-8-reduced-motion.json', JSON.stringify(evidence, null, 2));
  });
});

test('Chromium accessibility tree exposes usable names, roles, dialog semantics and live errors', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Accessibility-tree evidence uses Chromium CDP.');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/app.html?screen=transfer-recipient');

  const session = await page.context().newCDPSession(page);
  const snapshot = async () => {
    const { nodes } = await session.send('Accessibility.getFullAXTree');
    return nodes
      .filter((node) => !node.ignored)
      .map((node) => ({
        role: node.role?.value || '',
        name: node.name?.value || '',
        description: node.description?.value || ''
      }))
      .filter((node) => node.role || node.name);
  };

  const recipientTree = await snapshot();
  expect(recipientTree.some((node) => node.role === 'main')).toBeTruthy();
  expect(recipientTree.some((node) => node.role === 'heading' && node.name === 'Who are you paying?')).toBeTruthy();
  expect(recipientTree.some((node) => node.role === 'searchbox' && /Search recipient by name or account/i.test(node.name))).toBeTruthy();
  expect(recipientTree.some((node) => node.role === 'link' && /Daniel Lee|Daniel/i.test(node.name))).toBeTruthy();

  await page.goto('/app.html?screen=biometric-failed');
  await page.getByRole('button', { name: 'Use passcode' }).click();
  await expect(page.getByRole('dialog', { name: 'Use passcode instead' })).toBeVisible();
  await page.getByLabel('Prototype passcode').fill('1111');
  await page.getByRole('button', { name: 'Confirm passcode' }).click();
  await expect(page.getByRole('alert')).toContainText('does not match');

  const recoveryTree = await snapshot();
  expect(recoveryTree.some((node) => node.role === 'dialog' && node.name === 'Use passcode instead')).toBeTruthy();
  expect(recoveryTree.some((node) => node.role === 'textbox' && node.name === 'Prototype passcode')).toBeTruthy();
  // Chromium may expose the live-region text as a child StaticText node rather than
  // using it as the accessible name of the alert container. Verify both semantics.
  expect(recoveryTree.some((node) => node.role === 'alert')).toBeTruthy();
  expect(recoveryTree.some((node) => /does not match/i.test(node.name))).toBeTruthy();

  fs.writeFileSync('artifacts/p1-8-accessibility-tree.json', JSON.stringify({ recipientTree, recoveryTree }, null, 2));
});
