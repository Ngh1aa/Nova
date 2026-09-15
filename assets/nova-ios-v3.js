(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const screen = params.get('screen') || 'home';

  const meta = {
    home: { title: 'Home', caption: 'Tuesday, 15 September — updated 09:42' },
    activity: { title: 'Activity', caption: 'September · Prototype data' },
    'transaction-detail': { title: 'Payment', back: 'app.html?screen=activity', backLabel: 'Activity' },
    cards: { title: 'Cards' },
    'card-frozen': { title: 'Cards' },
    'card-controls': { title: 'Card controls', back: 'app.html?screen=cards', backLabel: 'Cards' },
    'transfer-recipient': { title: 'Recipient', back: 'app.html?screen=home', backLabel: 'Home' },
    'transfer-amount': { title: 'Amount', back: 'app.html?screen=transfer-recipient', backLabel: 'Recipient' },
    'transfer-review': { title: 'Review', back: 'app.html?screen=transfer-amount', backLabel: 'Amount' },
    'biometric-failed': { title: 'Confirm', back: 'app.html?screen=transfer-review', backLabel: 'Review' },
    offline: { title: 'Confirm', back: 'app.html?screen=transfer-review', backLabel: 'Review' },
    'transfer-success': { title: 'Transfer complete', back: 'app.html?screen=home', backLabel: 'Home' },
    savings: { title: 'Emergency buffer' },
    'savings-detail': { title: 'Emergency buffer', back: 'app.html?screen=savings', backLabel: 'Save' },
    subscriptions: { title: 'Subscriptions', back: 'app.html?screen=home', backLabel: 'Home' },
    security: { title: 'Security', back: 'app.html?screen=home', backLabel: 'Home' },
    notifications: { title: 'Notifications', back: 'app.html?screen=home', backLabel: 'Home' },
    kyc: { title: 'Identity check', back: 'app.html?screen=onboarding', backLabel: 'Back' },
    onboarding: { title: 'Welcome to Nova' },
    error: { title: 'Something went wrong', back: 'app.html?screen=home', backLabel: 'Home' }
  };

  const icon = (name) => {
    if (name === 'back') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
    if (name === 'bell') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 19h4"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>';
  };

  function inferredTitle() {
    const configured = meta[screen]?.title;
    if (configured) return configured;
    const node = document.querySelector('.page-heading h1,.dossier-title,.goal-hero h1,.receipt h1,.task-panel h2');
    return node?.textContent?.trim() || 'Nova';
  }

  function buildNav() {
    const stage = document.querySelector('.app-stage');
    if (!stage || document.querySelector('.ios-nav-bar')) return;
    const old = stage.querySelector('.mobile-topbar');
    if (old) old.hidden = true;

    const cfg = meta[screen] || {};
    const title = inferredTitle();
    const isRoot = ['home','activity','cards','card-frozen','savings'].includes(screen);
    const caption = cfg.caption || (isRoot ? 'Prototype data · Simulated banking' : 'Prototype data');

    const nav = document.createElement('header');
    nav.className = 'ios-nav-bar';
    nav.innerHTML = `
      <div class="ios-nav-inner">
        <div class="ios-nav-compact">
          <div class="ios-nav-leading">
            ${cfg.back
              ? `<a class="ios-nav-back" href="${cfg.back}" aria-label="Back to ${cfg.backLabel || 'previous screen'}">${icon('back')}<span>${cfg.backLabel || ''}</span></a>`
              : `<a class="ios-nav-brand" href="app.html?screen=home" aria-label="Nova home"><img src="assets/nova-mark.svg" alt=""></a>`}
          </div>
          <div class="ios-nav-small-title" aria-hidden="true">${title}</div>
          <div class="ios-nav-trailing">
            ${isRoot ? `<a class="ios-nav-icon" href="app.html?screen=notifications" aria-label="Notifications">${icon('bell')}</a><a class="ios-nav-icon" href="app.html?screen=security" aria-label="Security and profile">${icon('user')}</a>` : ''}
          </div>
        </div>
        <div class="ios-nav-large"><h1>${title}</h1>${caption ? `<p class="ios-nav-caption">${caption}</p>` : ''}</div>
      </div>`;

    stage.insertBefore(nav, stage.firstChild);

    const sync = () => nav.classList.toggle('is-collapsed', window.scrollY > 42);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
  }

  function cleanDuplicateChrome() {
    document.querySelectorAll('.prototype-label').forEach((node) => node.remove());
    document.querySelectorAll('.page-heading').forEach((node) => node.setAttribute('aria-hidden', 'true'));
    document.querySelectorAll('.ledger-row.is-risk .list-value small').forEach((node) => node.remove());
    document.querySelectorAll('.card-brand').forEach((node) => { if (/Ledger/i.test(node.textContent)) node.textContent = 'Nova / DEBIT'; });
    document.querySelectorAll('[aria-label*="Ledger debit card"]').forEach((node) => node.setAttribute('aria-label', node.getAttribute('aria-label').replace(/Ledger/g,'Nova')));
  }

  function enhanceSearch() {
    document.querySelectorAll('.search-wrap').forEach((wrap) => {
      if (wrap.querySelector('.ios-search-cancel')) return;
      const input = wrap.querySelector('input[type="search"]');
      if (!input) return;
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'ios-search-cancel';
      cancel.textContent = 'Cancel';
      cancel.addEventListener('click', () => {
        input.value = '';
        input.blur();
        wrap.classList.remove('is-focused');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      wrap.appendChild(cancel);
      input.addEventListener('focus', () => wrap.classList.add('is-focused'));
      input.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== cancel) wrap.classList.remove('is-focused'); }, 90));
    });
  }

  function enhanceSegments() {
    document.querySelectorAll('.filter-row').forEach((row) => {
      row.setAttribute('role', 'group');
      row.classList.add('ios-segmented');
    });
  }

  function enhanceLedgerRiskRows() {
    document.querySelectorAll('.ledger-row.is-risk').forEach((row) => {
      row.dataset.swipeAction = 'Needs review';
      row.setAttribute('aria-label', `${row.getAttribute('aria-label') || row.textContent.trim()} — swipe left for review action`);
    });
  }

  function markContentVsChrome() {
    document.querySelectorAll('.horizon,.ledger,.goal-ledger,.receipt-sheet,.card-object').forEach((node) => node.dataset.visualLanguage = 'ledger-content');
    document.querySelectorAll('.control-list,.task-panel,.cashflow-strip,.decision-actions,.recipient-card').forEach((node) => node.dataset.visualLanguage = 'ios-chrome');
  }

  function init() {
    document.body.classList.add('ios-native-v3');
    buildNav();
    cleanDuplicateChrome();
    enhanceSearch();
    enhanceSegments();
    enhanceLedgerRiskRows();
    markContentVsChrome();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
