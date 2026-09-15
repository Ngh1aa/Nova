(() => {
  'use strict';

  const screen = new URLSearchParams(location.search).get('screen') || 'home';
  const euro = value => `€${Number(value).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const signed = value => `${value < 0 ? '−' : value > 0 ? '+' : ''}${euro(Math.abs(value))}`;

  const activityRows = [
    { date: '12 Sep', desc: 'Merchant refund', credit: 22, balance: 3168.99, stamp: 'reconciled' },
    { date: '13 Sep', desc: 'River Gym', debit: 34, balance: 3134.99, stamp: 'cleared' },
    { date: '14 Sep', desc: 'Northstar Books', debit: 28.50, balance: 3106.49 },
    { date: '15 Sep', desc: 'ByteMart Online', debit: 189.40, balance: 2917.09, risk: true, href: 'app.html?screen=transaction-detail' },
    { date: '15 Sep', desc: 'Atelier Coffee', debit: 6.40, balance: 2910.69 },
    { date: '15 Sep', desc: 'Cloudbox', debit: 9.99, balance: 2900.70, stamp: 'cleared' },
    { date: '15 Sep', desc: 'Metro Transit', debit: 18, balance: 2882.70 },
    { date: '15 Sep', desc: 'Greenline Market', debit: 42.70, balance: 2840.00, stamp: 'cleared' }
  ];

  function stamp(text, kind = '') {
    return `<span class="pb-stamp ${kind}">${text}</span>`;
  }

  function ledgerTable(rows, options = {}) {
    const includeCredit = options.includeCredit !== false;
    const caption = options.caption || 'Ledger entries';
    const body = rows.map(row => {
      const description = row.href ? `<a href="${row.href}">${row.desc}</a>` : row.desc;
      const mark = row.risk ? stamp('needs review', 'risk') : row.stamp ? stamp(row.stamp, row.stamp === 'covered' ? 'ochre' : '') : '';
      return `<tr class="${row.risk ? 'is-risk' : ''}">
        <td class="pb-date">${row.date || '15 Sep'}</td>
        <td class="pb-desc">${description}${mark}</td>
        <td class="pb-debit ${row.risk ? 'is-risk' : ''}">${row.debit ? signed(-row.debit) : '—'}</td>
        ${includeCredit ? `<td class="pb-credit">${row.credit ? signed(row.credit) : '—'}</td>` : ''}
        <td class="pb-balance">${row.balance != null ? euro(row.balance) : '—'}</td>
      </tr>`;
    }).join('');
    return `<div class="pb-table-wrap"><table class="pb-ledger-table"><caption class="sr-only">${caption}</caption><thead><tr><th scope="col" class="pb-date">Date</th><th scope="col" class="pb-desc">Description</th><th scope="col" class="pb-debit">Debit</th>${includeCredit ? '<th scope="col" class="pb-credit">Credit</th>' : ''}<th scope="col" class="pb-balance">Running balance</th></tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function rewriteSeparators(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(textNode => {
      const parent = textNode.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) return;
      textNode.nodeValue = textNode.nodeValue.replace(/\s·\s/g, ' — ');
    });
  }

  function horizonExtract() {
    const old = document.querySelector('.horizon');
    if (!old) return;
    old.outerHTML = `<section class="pb-horizon" aria-labelledby="pb-horizon-title">
      <div class="pb-horizon-head"><div><h2 id="pb-horizon-title">Money Horizon</h2><p>What remains after known commitments and your protected buffer.</p></div><span class="meta">Next 14 days</span></div>
      <div class="pb-horizon-row safe"><strong>Safe</strong><span class="pb-money">€1,300.00</span><span class="pb-inline-track" aria-hidden="true"><span style="width:46%"></span></span></div>
      <div class="pb-horizon-row committed"><strong>Committed</strong><span class="pb-money">€1,040.00</span><span class="pb-inline-track" aria-hidden="true"><span style="width:37%"></span></span></div>
      <div class="pb-horizon-row buffer"><strong>Buffer</strong><span class="pb-money">€500.00</span><span class="pb-inline-track" aria-hidden="true"><span style="width:17%"></span></span></div>
      <p class="pb-horizon-note">Safe to spend = balance − known commitments − planned saving − protected buffer. Prototype data can change.</p>
    </section>`;
  }

  function replaceLedgerInSection(section, rows, caption) {
    if (!section) return;
    const old = section.querySelector('.ledger');
    if (old) old.outerHTML = ledgerTable(rows, { caption });
    else section.insertAdjacentHTML('beforeend', ledgerTable(rows, { caption }));
  }

  function enhanceHome() {
    document.querySelector('.decision-field')?.classList.add('pb-ledger-page');
    document.querySelector('.context-panel')?.classList.add('pb-ledger-page');
    horizonExtract();

    const sections = [...document.querySelectorAll('.section')];
    const activity = sections.find(section => section.querySelector('h2')?.textContent.trim() === 'Recent activity');
    replaceLedgerInSection(activity, activityRows.slice(-5), 'Recent account activity');

    const attention = document.querySelector('.attention-strip small');
    if (attention) attention.textContent = '€189.40 at ByteMart Online — Singapore — 02:14';
  }

  function enhanceActivity() {
    const sections = [...document.querySelectorAll('.section')];
    const latest = sections.find(section => section.querySelector('h2')?.textContent.trim() === 'Latest entries');
    replaceLedgerInSection(latest, activityRows, 'September account statement');
    const meta = latest?.querySelector('.section-head .meta');
    if (meta) meta.textContent = '8 entries — 12 to 15 September';
  }

  function enhanceTransaction() {
    const hero = document.querySelector('.dossier-hero');
    if (!hero) return;
    hero.classList.add('pb-ledger-page');
    const main = hero.querySelector('.dossier-main');
    if (main && !hero.querySelector('.pb-table-wrap')) {
      main.insertAdjacentHTML('afterend', ledgerTable([
        { date: '15 Sep', desc: 'ByteMart Online', debit: 189.40, balance: 2917.09, risk: true }
      ], { caption: 'Transaction under review' }));
    }
    const reasons = hero.querySelector('.risk-reasons');
    if (reasons) {
      const labels = [...reasons.querySelectorAll('.risk-chip')].map(node => node.textContent.trim()).filter(Boolean);
      reasons.hidden = true;
      reasons.insertAdjacentHTML('afterend', `<div class="pb-risk-flag">Unusual location and pattern — ${labels.join(', ')}</div>`);
    }
    const status = hero.querySelector('.status-risk');
    if (status) status.textContent = 'Needs review';
  }

  function enhanceCards() {
    const frozen = screen === 'card-frozen' || document.querySelector('.card-object.frozen');
    const cardActivity = [...document.querySelectorAll('.section')].find(section => section.querySelector('h2')?.textContent.trim() === 'Recent card activity');
    replaceLedgerInSection(cardActivity, activityRows.slice(-5), 'Recent card activity');
    if (frozen) {
      const grid = document.querySelector('.card-grid');
      if (grid && !document.querySelector('.pb-frozen-entry')) {
        grid.insertAdjacentHTML('beforebegin', `<section class="pb-ledger-page pb-frozen-entry" style="padding:20px 20px 20px 56px;margin-bottom:24px"><h2 style="margin:0 0 8px">Card frozen</h2><p style="margin:0;color:var(--pb-text)">Card frozen — 15/09, 09:44 ${stamp('verified')}</p></section>`);
      }
    }
  }

  function enhanceRecipient() {
    const panel = document.querySelector('.task-panel');
    panel?.classList.add('pb-ledger-page');
    const recipient = document.querySelector('.recipient-card');
    if (recipient && !document.querySelector('.pb-recipient-head')) {
      recipient.insertAdjacentHTML('beforebegin', '<div class="pb-recipient-head" style="display:grid;grid-template-columns:1fr auto;gap:16px;padding:9px 0;border-top:1px solid var(--pb-ink);color:var(--pb-text);font-size:11px;font-weight:600"><span>Recipient</span><span>Account note</span></div>');
    }
  }

  function enhanceAmount() {
    const panel = document.querySelector('.task-panel');
    panel?.classList.add('pb-ledger-page');
    document.querySelector('.impact-panel')?.classList.add('pb-ledger-page');
    const field = document.querySelector('.amount-field');
    const input = document.querySelector('#amount');
    if (field && input && !document.querySelector('.pb-balance-after')) {
      field.insertAdjacentHTML('afterend', '<div class="pb-balance-after"><span>Safe to spend after</span><strong>€1,155.00</strong></div>');
      const output = document.querySelector('.pb-balance-after strong');
      const update = () => {
        const amount = Math.max(0, Number(input.value) || 0);
        output.textContent = euro(Math.max(0, 1300 - amount));
      };
      input.addEventListener('input', update);
      update();
    }
  }

  function enhanceReview() {
    document.querySelector('.task-panel')?.classList.add('pb-ledger-page');
    document.querySelector('.impact-panel')?.classList.add('pb-ledger-page');
    const list = document.querySelector('.review-list');
    if (!list || list.dataset.passbook === 'true') return;
    const amountText = list.querySelector('.review-total strong')?.textContent?.trim() || '€145.00';
    const amount = Number(amountText.replace(/[^0-9.]/g, '')) || 145;
    const projected = Math.max(0, 1300 - amount);
    const html = `${ledgerTable([{ date: '15 Sep', desc: 'Transfer to Maya Chen', debit: amount, balance: projected }], { caption: 'Transfer entry preview', includeCredit: false })}
      <div class="review-list pb-review-notes" data-passbook="true"><div class="review-row"><span>Recipient</span><strong>Maya Chen<br><span class="meta">Personal •••• 2048</span></strong></div><div class="review-row"><span>Fee</span><strong>€0.00</strong></div><div class="review-row"><span>Expected arrival</span><strong>Usually within minutes</strong></div><div class="review-row"><span>Reference</span><strong>September utilities</strong></div></div>`;
    list.outerHTML = html;
  }

  function enhanceSuccess() {
    const receipt = document.querySelector('.receipt');
    if (!receipt) return;
    receipt.classList.add('pb-ledger-page');
    const heading = receipt.querySelector('h1');
    if (heading) heading.textContent = 'Transfer successful';
    const sheet = receipt.querySelector('.receipt-sheet');
    if (sheet) {
      sheet.outerHTML = `${ledgerTable([{ date: '15 Sep', desc: `Transfer to Maya Chen ${stamp('cleared')}`, debit: 145, balance: 1155 }], { caption: 'Completed transfer', includeCredit: false })}<p class="meta" style="margin-top:12px">Prototype receipt NVA-TX-0915-2048 — no real money moved.</p>`;
    }
  }

  function enhanceSavings() {
    const hero = document.querySelector('.goal-hero');
    hero?.classList.add('pb-ledger-page');
    const ledger = document.querySelector('.goal-ledger');
    if (ledger) {
      ledger.outerHTML = ledgerTable([
        { date: '28 Jul', desc: 'Monthly contribution', credit: 260, balance: 1960, stamp: 'reconciled' },
        { date: '28 Aug', desc: 'Monthly contribution', credit: 260, balance: 2220, stamp: 'reconciled' },
        { date: '15 Sep', desc: 'Current goal balance', credit: 260, balance: 2480 }
      ], { caption: 'Emergency buffer contributions' });
    }
  }

  function enhanceSubscriptions() {
    const section = [...document.querySelectorAll('.section')].find(node => node.querySelector('h2')?.textContent.trim() === 'Recurring ledger');
    if (!section) return;
    const rows = [
      { date: '22 Sep', desc: 'Mobile plan', debit: 32, balance: 748, stamp: 'covered' },
      { date: '24 Sep', desc: 'Streaming service', debit: 14.99, balance: 733.01, stamp: 'covered' },
      { date: '02 Oct', desc: 'River Gym', debit: 34, balance: 699.01 }
    ];
    replaceLedgerInSection(section, rows, 'Upcoming subscriptions');
  }

  function enhanceKyc() {
    document.querySelector('.document-sheet')?.classList.add('pb-ledger-page');
    const state = new URLSearchParams(location.search).get('state') || 'intro';
    if (state === 'manual') {
      const sheet = document.querySelector('.document-sheet');
      const heading = sheet?.querySelector('h2');
      if (heading) heading.textContent = 'Your ID is under review';
      const firstBody = sheet?.querySelector('.callout p');
      if (firstBody) firstBody.textContent = 'A specialist review would normally finish within 1–2 business days. This portfolio prototype submits no identity data.';
    }
  }

  function enhanceRecovery() {
    document.querySelector('.task-panel')?.classList.add('pb-ledger-page');
    if (screen === 'biometric-failed') {
      const primary = document.querySelector('#use-passcode');
      if (primary) primary.textContent = 'Use PIN instead';
    }
    if (screen === 'offline') {
      const heading = document.querySelector('.page-heading h1');
      if (heading) heading.textContent = "You're offline";
    }
    if (screen === 'error') {
      const heading = document.querySelector('.empty-state h1');
      if (heading) heading.textContent = 'Not enough safe-to-spend balance';
      const p = document.querySelector('.empty-state > p:not(.eyebrow)');
      if (p) p.textContent = 'Short by €120.00 — this would use money reserved for bills.';
    }
  }

  function init() {
    document.body.classList.add('passbook-v2');
    rewriteSeparators();

    if (screen === 'home') enhanceHome();
    if (screen === 'activity') enhanceActivity();
    if (screen === 'transaction-detail') enhanceTransaction();
    if (screen === 'cards' || screen === 'card-frozen') enhanceCards();
    if (screen === 'transfer-recipient') enhanceRecipient();
    if (screen === 'transfer-amount') enhanceAmount();
    if (['transfer-review', 'biometric-failed', 'offline'].includes(screen)) enhanceReview();
    if (screen === 'transfer-success') enhanceSuccess();
    if (screen === 'savings') enhanceSavings();
    if (screen === 'subscriptions') enhanceSubscriptions();
    if (screen === 'kyc') enhanceKyc();
    if (['biometric-failed', 'offline', 'error'].includes(screen)) enhanceRecovery();

    rewriteSeparators();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();