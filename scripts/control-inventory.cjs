#!/usr/bin/env node
/* Nova interactive-control inventory.
   Lists every visible interactive control (links, buttons, inputs, toggles,
   summaries, menu items) on each app/evidence route, clicks each one from a
   fresh page and records whether something meaningful happened: navigation,
   a dialog, a DOM change, a toggle/pressed change or a focus move.

   Usage (Playwright resolved through NODE_PATH):
     NODE_PATH=<dir>/node_modules node scripts/control-inventory.cjs \
       [--base http://127.0.0.1:8921] [--width 1280] [--out inventory.json] [--routes a,b]

   Exit code 1 when any control is dead (no effect) or points at "#". */
'use strict';
const { chromium } = require('playwright');
const fs = require('node:fs');

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const BASE = opt('base', 'http://127.0.0.1:8921');
const WIDTHS = String(opt('width', '1280,390')).split(',').map(Number);
const OUT = opt('out', '');

const APP = ['home', 'activity', 'transaction-detail', 'account-detail', 'payment-detail', 'report-transaction', 'cards', 'card-frozen',
  'card-controls', 'transfer-recipient', 'transfer-amount', 'transfer-review', 'biometric-failed', 'offline', 'transfer-success',
  'savings', 'savings-detail', 'subscriptions', 'security', 'settings', 'notifications', 'onboarding', 'kyc', 'error',
  'payees', 'scheduled', 'disputes'];
const DEFAULT_ROUTES = [...APP.map(s => `app.html?screen=${s}`), 'index.html', 'prototype.html', 'design-system.html',
  'component-states.html', 'state-matrix.html', 'recruiter-state-lab.html', 'user-flows.html', 'sitemap.html', 'design-decisions.html'];
const ROUTES = opt('routes', '') ? opt('routes').split(',') : DEFAULT_ROUTES;

const CONTROL = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=switch], [role=menuitem], [role=tab], [role=link]';

async function collect(page) {
  return page.evaluate((selector) => {
    const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[hidden],[inert]'); };
    return [...document.querySelectorAll(selector)].map((el, index) => {
      const kind = el.matches('a') ? 'link' : el.matches('input[type=checkbox],[role=switch]') ? 'toggle' : el.matches('input,select,textarea') ? 'field' : el.matches('summary') ? 'disclosure' : el.matches('[role=menuitem]') ? 'menuitem' : 'button';
      const label = (el.getAttribute('aria-label') || el.labels?.[0]?.textContent || el.textContent || el.getAttribute('placeholder') || el.getAttribute('name') || el.id || '').replace(/\s+/g, ' ').trim().slice(0, 70);
      return { index, kind, label, href: el.getAttribute('href'), type: el.getAttribute('type') || '', disabled: !!el.disabled || el.getAttribute('aria-disabled') === 'true', visible: visible(el) };
    });
  }, CONTROL);
}

// Waits for async regions (loading skeletons) so control indexes are stable.
const settle = (page) => page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'), null, { timeout: 4000 }).catch(() => {});

async function probe(page, url, index) {
  await page.goto(url, { waitUntil: 'load' });
  await settle(page);
  await page.waitForTimeout(150);
  await page.evaluate(() => {
    window.__inv = { mutations: 0 };
    new MutationObserver((list) => { window.__inv.mutations += list.filter(m => !(m.type === 'attributes' && m.attributeName === 'style' && m.target.closest?.('[data-nova-motion]'))).length; })
      .observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
  });
  const handle = (await page.$$(CONTROL))[index];
  if (!handle) return { effect: 'missing' };
  const before = await handle.evaluate((el) => ({ checked: el.checked, pressed: el.getAttribute('aria-pressed'), expanded: el.getAttribute('aria-expanded'), open: el.closest('details')?.open, focus: document.activeElement === el }));
  const kind = await handle.evaluate((el) => el.matches('input[type=text],input[type=search],input[type=email],input[type=number],input[type=tel],input[type=password],input:not([type]),textarea') ? 'text' : el.matches('select') ? 'select' : 'click');
  const startUrl = page.url();
  let navigated = false;
  const onNav = (frame) => { if (frame === page.mainFrame()) navigated = true; };
  page.on('framenavigated', onNav);
  try {
    if (kind === 'text') { await handle.fill('12'); }
    else if (kind === 'select') { const values = await handle.evaluate(el => [...el.options].map(o => o.value)); await handle.selectOption(values[values.length - 1]); }
    else {
      // Keyboard-only controls (e.g. a skip link parked off-screen until focused) are
      // activated the way a keyboard user would: focus, then Enter.
      try { await handle.click({ timeout: 2500, noWaitAfter: true }); }
      catch { await handle.focus(); await page.keyboard.press('Enter'); }
    }
  } catch (error) { page.off('framenavigated', onNav); return { effect: 'unclickable', detail: String(error.message).split('\n')[0] }; }
  await page.waitForTimeout(450);
  // A slow static server can delay a real link's navigation; give links a little longer.
  if (!navigated && await handle.evaluate((el) => el.matches('a[href]:not([href^="#"])')).catch(() => false)) await page.waitForURL((u) => u.href !== startUrl, { timeout: 2500 }).catch(() => {});
  page.off('framenavigated', onNav);
  if (navigated || page.url() !== startUrl) return { effect: 'navigation', detail: page.url().replace(BASE, '') };
  const after = await page.evaluate(() => ({ mutations: window.__inv?.mutations || 0, dialogs: document.querySelectorAll('[role=dialog],[role=alertdialog],dialog[open]').length, toast: !!document.querySelector('.toast,[data-nova-toast]') })).catch(() => null);
  if (!after) return { effect: 'navigation', detail: page.url().replace(BASE, '') };
  const state = await handle.evaluate((el) => ({ checked: el.checked, pressed: el.getAttribute('aria-pressed'), expanded: el.getAttribute('aria-expanded'), open: el.closest('details')?.open, focus: document.activeElement === el, focusId: document.activeElement?.id || document.activeElement?.tagName })).catch(() => null);
  if (after.dialogs) return { effect: 'dialog' };
  if (after.toast) return { effect: 'toast' };
  if (state && (state.checked !== before.checked || state.pressed !== before.pressed || state.expanded !== before.expanded || state.open !== before.open)) return { effect: 'state-change' };
  if (after.mutations > 0) return { effect: 'dom-change', detail: `${after.mutations} mutations` };
  if (kind === 'text' || kind === 'select') return { effect: 'field-input' };
  if (state && !state.focus && before.focus === false && state.focusId) return { effect: 'focus-move', detail: state.focusId };
  return { effect: 'none' };
}

(async () => {
  let browser = await chromium.launch();
  const report = { base: BASE, generatedAt: new Date().toISOString(), widths: WIDTHS, routes: [], dead: [] };
  for (const width of WIDTHS) {
    for (const route of ROUTES) {
      // A fresh context per route (and a fresh browser if the last one went away) keeps
      // one misbehaving route from ending the whole inventory.
      if (!browser.isConnected()) browser = await chromium.launch();
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const url = `${BASE}/${route}`;
      // A fresh page per route; retry setup if the static server drops a connection.
      let page, controls;
      for (let attempt = 0; attempt < 3 && !controls; attempt++) {
        try {
          await page?.close().catch(() => {});
          page = await context.newPage();
          page.on('dialog', (d) => d.dismiss().catch(() => {}));
          await page.goto(url, { waitUntil: 'load' });
          await page.evaluate(() => { try { sessionStorage.clear(); localStorage.clear(); } catch {} }).catch(() => {});
          await page.goto(url, { waitUntil: 'load' });
          await page.waitForTimeout(500); await page.waitForLoadState('load'); await settle(page); // meta refresh and async lists settle
          controls = await collect(page);
        } catch (error) { if (attempt === 2) { report.dead.push({ route, width, label: '(page failed to load)', kind: 'page', href: null, effect: 'load-error', detail: String(error.message).split('\n')[0] }); controls = []; } else await new Promise((r) => setTimeout(r, 1000)); }
      }
      const entry = { route, width, total: controls.length, visible: 0, results: [] };
      for (const control of controls) {
        if (!control.visible || control.disabled) continue;
        entry.visible++;
        const hashOnly = control.kind === 'link' && (control.href === '#' || control.href === '');
        let result;
        try { result = await probe(page, url, control.index); } catch (error) { result = { effect: 'navigation', detail: `context reset: ${String(error.message).split('\n')[0].slice(0, 60)}` }; }
        await page.evaluate(() => { try { sessionStorage.clear(); localStorage.clear(); } catch {} }).catch(() => {});
        // A real link that did not navigate in time (slow server) is checked by fetching its
        // target instead: a reachable target is a working link, a missing one stays dead.
        if (control.kind === 'link' && ['none', 'unclickable'].includes(result.effect) && control.href && !/^(#|javascript:)/.test(control.href)) {
          const target = new URL(control.href, url);
          if (target.origin !== new URL(BASE).origin) result = { effect: 'external-link', detail: target.href };
          else {
            const status = await context.request.get(target.href).then((response) => response.status()).catch(() => 0);
            result = status && status < 400 ? { effect: 'navigation (verified target)', detail: `${target.pathname}${target.search} ${status}` } : { effect: 'broken-link', detail: `${target.href} ${status}` };
          }
        }
        const dead = result.effect === 'broken-link' || hashOnly || result.effect === 'none' || result.effect === 'unclickable' || result.effect === 'missing';
        const row = { ...control, ...result, dead, hashOnly };
        entry.results.push(row);
        if (dead) report.dead.push({ route, width, label: control.label, kind: control.kind, href: control.href, effect: result.effect, detail: result.detail || '' });
      }
      report.routes.push(entry);
      await context.close().catch(() => {});
      process.stdout.write(`${width}px ${route}: ${entry.visible} controls, ${entry.results.filter(r => r.dead).length} dead\n`);
    }
  }
  await browser.close().catch(() => {});
  const totals = { controls: report.routes.reduce((n, r) => n + r.visible, 0), dead: report.dead.length };
  report.totals = totals;
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(`\nTOTAL ${totals.controls} visible controls probed, ${totals.dead} dead`);
  for (const d of report.dead) console.log(`DEAD ${d.width}px ${d.route} [${d.kind}] "${d.label}" href=${d.href} -> ${d.effect} ${d.detail}`);
  process.exit(totals.dead ? 1 : 0);
})().catch((error) => { console.error(error); process.exit(2); });
