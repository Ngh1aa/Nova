(() => {
  'use strict';

  const screen = new URLSearchParams(location.search).get('screen') || 'home';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const svg = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const icons = {
    home: svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9 21v-7h6v7"/>'),
    activity: svg('<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="11" cy="18" r="1"/>'),
    pay: svg('<path d="M5 12h14"/><path d="m14 7 5 5-5 5"/>'),
    card: svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/>'),
    save: svg('<circle cx="12" cy="12" r="8"/><path d="M12 4v16"/><path d="M8.5 9.2c0-1.4 1.4-2.4 3.5-2.4s3.5 1 3.5 2.4-1.4 2.3-3.5 2.3-3.5 1-3.5 2.4 1.4 2.4 3.5 2.4 3.5-1 3.5-2.4"/>'),
    shield: svg('<path d="M12 3 5 6v5c0 4.5 2.8 8.3 7 10 4.2-1.7 7-5.5 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7L15 10"/>'),
    gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V21h-4v-.08A1.7 1.7 0 0 0 8.97 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15.03 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.6 8.97a1.7 1.7 0 0 0-.34-1.88l-.06-.06L7.03 4.2l.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 10 3.08V3h4v.08a1.7 1.7 0 0 0 1.03 1.52 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    scan: svg('<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/><path d="M7 12h10"/>'),
    calendar: svg('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    arrow: svg('<path d="M5 12h14"/><path d="m14 7 5 5-5 5"/>'),
    bank: svg('<path d="m3 9 9-5 9 5"/><path d="M5 10v7M9.5 10v7M14.5 10v7M19 10v7M3 20h18"/>')
  };

  function rebuildSidebar() {
    const rail = $('.sidebar');
    if (!rail || window.matchMedia('(max-width:1199px)').matches) return;
    const active = (key) => {
      if (key === 'home') return screen === 'home' || screen === 'notifications';
      if (key === 'activity') return screen === 'activity' || screen === 'transaction-detail';
      if (key === 'pay') return screen.startsWith('transfer') || ['pay','offline','biometric-failed','error'].includes(screen);
      if (key === 'cards') return screen.startsWith('card');
      if (key === 'save') return screen.startsWith('saving') || screen === 'subscriptions';
      return screen === key;
    };
    const item = (label, key, href, icon) => `<a href="${href}" class="${active(key) ? 'active' : ''}" ${active(key) ? 'aria-current="page"' : ''}>${icon}<span>${label}</span></a>`;
    rail.className = 'sidebar nova-rail-v4';
    rail.innerHTML = `
      <a class="v4-rail-brand" href="app.html?screen=home" aria-label="Nova home"><img src="assets/nova-mark.svg" alt=""></a>
      <nav class="v4-rail-nav" aria-label="Primary navigation">
        ${item('Home','home','app.html?screen=home',icons.home)}
        ${item('Activity','activity','app.html?screen=activity',icons.activity)}
        ${item('Pay','pay','app.html?screen=transfer-recipient',icons.pay)}
        ${item('Cards','cards','app.html?screen=cards',icons.card)}
        ${item('Save','save','app.html?screen=savings',icons.save)}
        ${item('Security','security','app.html?screen=security',icons.shield)}
        ${item('Settings','settings','app.html?screen=settings',icons.gear)}
      </nav>`;
  }

  function removeAiLikeUi() {
    $$('.nova-insight-banner, .ai-insight, [class*="ai-insight"], [data-ai-insight]').forEach((node) => node.remove());
    $$('*').forEach((node) => {
      if (node.children.length === 0 && /^(Insight for you|AI insight|Smart insight)$/i.test((node.textContent || '').trim())) {
        const container = node.closest('.nova-insight-banner,.section,.card,.nova-card');
        if (container) container.remove();
      }
    });
  }

  function renderPay() {
    const stage = $('.app-stage');
    const currentMain = $('#main');
    if (!stage || !currentMain) return;
    currentMain.outerHTML = `<main id="main" class="main-wrap v4-page v4-pay-page" tabindex="-1">
      <header class="v4-page-head">
        <div><p>Payments</p><h1>Pay & transfer</h1><span>Send money, pay a saved recipient or prepare an upcoming transfer without leaving the money context.</span></div>
        <a class="v4-dark-pill" href="app.html?screen=transfer-amount">New transfer ${icons.arrow}</a>
      </header>

      <div class="v4-pay-grid">
        <section class="v4-card v4-pay-hero">
          <div class="v4-section-head"><div><small>Available to send today</small><h2>€1,300.00</h2></div><span class="v4-status mint">Safe to spend</span></div>
          <p class="v4-copy">Bills, your €260 savings contribution and the €500 protected buffer are already excluded.</p>
          <div class="v4-pay-actions">
            <a href="app.html?screen=transfer-amount" class="v4-action blue">${icons.arrow}<span><strong>Send money</strong><small>Bank transfer</small></span></a>
            <button type="button" class="v4-action pink" data-v4-toast="QR payment is simulated in this prototype.">${icons.scan}<span><strong>Scan to pay</strong><small>QR payment</small></span></button>
            <button type="button" class="v4-action yellow" data-v4-toast="Scheduled transfer creation is simulated in this prototype.">${icons.calendar}<span><strong>Schedule</strong><small>Future transfer</small></span></button>
          </div>
        </section>

        <section class="v4-card v4-pay-search">
          <div class="v4-section-head"><div><small>Recipient</small><h2>Who are you paying?</h2></div><button type="button" class="v4-icon-button" data-v4-toast="Adding a recipient is simulated in this prototype." aria-label="Add new recipient">${icons.plus}</button></div>
          <label class="v4-search-box"><span>${icons.search}</span><input id="pay-recipient-search" type="search" placeholder="Search name, bank or account" aria-label="Search recipient"></label>
          <div class="v4-recipient-chips">
            <a href="app.html?screen=transfer-amount"><span class="v4-avatar blue">MC</span><strong>Maya</strong><small>•••• 2048</small></a>
            <a href="app.html?screen=transfer-amount"><span class="v4-avatar pink">DL</span><strong>Daniel</strong><small>•••• 7184</small></a>
            <a href="app.html?screen=transfer-amount"><span class="v4-avatar mint">AN</span><strong>An</strong><small>•••• 3052</small></a>
            <a href="app.html?screen=transfer-amount"><span class="v4-avatar yellow">NT</span><strong>Natalie</strong><small>•••• 6610</small></a>
          </div>
        </section>

        <section class="v4-card v4-pay-upcoming">
          <div class="v4-section-head"><div><small>Next 14 days</small><h2>Upcoming payments</h2></div><span class="v4-status blue">€1,040 committed</span></div>
          <div class="v4-pay-list">
            <div><span class="v4-list-icon blue">${icons.bank}</span><span><strong>Apartment rent</strong><small>20 Sep · bank transfer</small></span><b>−€620.00</b></div>
            <div><span class="v4-list-icon lavender">${icons.clock}</span><span><strong>Mobile plan</strong><small>22 Sep · direct debit</small></span><b>−€32.00</b></div>
            <div><span class="v4-list-icon pink">${icons.clock}</span><span><strong>Streaming</strong><small>24 Sep · card subscription</small></span><b>−€14.99</b></div>
            <div><span class="v4-list-icon yellow">${icons.calendar}</span><span><strong>Emergency buffer</strong><small>28 Sep · scheduled saving</small></span><b>−€260.00</b></div>
          </div>
        </section>

        <section class="v4-card v4-pay-recent">
          <div class="v4-section-head"><div><small>Recent</small><h2>Recent transfers</h2></div><a href="app.html?screen=activity">All activity →</a></div>
          <div class="v4-transfer-list">
            <a href="app.html?screen=transfer-amount"><span class="v4-avatar blue">MC</span><span><strong>Maya Chen</strong><small>12 Sep · Utilities</small></span><b>−€145.00</b></a>
            <a href="app.html?screen=transfer-amount"><span class="v4-avatar mint">AN</span><span><strong>An Nguyen</strong><small>6 Sep · Dinner split</small></span><b>−€36.50</b></a>
            <a href="app.html?screen=transfer-amount"><span class="v4-avatar pink">DL</span><span><strong>Daniel Lee</strong><small>1 Sep · Tickets</small></span><b>−€72.00</b></a>
          </div>
        </section>

        <section class="v4-card v4-pay-context">
          <div class="v4-section-head"><div><small>Transfer context</small><h2>Before you send</h2></div><span class="v4-status mint">Buffer protected</span></div>
          <div class="v4-context-grid"><div><small>Current balance</small><strong>€2,840</strong></div><div><small>Known commitments</small><strong>€1,040</strong></div><div><small>Protected buffer</small><strong>€500</strong></div><div><small>Safe after €145 transfer</small><strong>€1,155</strong></div></div>
          <a class="v4-full-action" href="app.html?screen=transfer-amount">Continue with Maya Chen ${icons.arrow}</a>
        </section>
      </div>
    </main>`;
    document.title = 'Nova — Pay & transfer';
  }

  if (screen === 'transfer-recipient') renderPay();
  rebuildSidebar();
  removeAiLikeUi();

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-v4-toast]');
    if (!target) return;
    let toast = $('.v4-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'v4-toast';
      toast.setAttribute('role','status');
      document.body.appendChild(toast);
    }
    toast.textContent = target.getAttribute('data-v4-toast');
    toast.classList.add('show');
    clearTimeout(window.__v4Toast);
    window.__v4Toast = setTimeout(() => toast.classList.remove('show'), 2200);
  });
})();