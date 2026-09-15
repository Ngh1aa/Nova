(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const screen = params.get('screen') || 'home';

  const META = {
    home: { title: 'Home', caption: 'Your money, planned ahead' },
    activity: { title: 'Activity', caption: 'September overview' },
    'transaction-detail': { title: 'Payment', back: 'app.html?screen=activity', backLabel: 'Activity' },
    cards: { title: 'Cards', caption: 'Card status and controls' },
    'card-frozen': { title: 'Cards', caption: 'Card status and controls' },
    'card-controls': { title: 'Card controls', back: 'app.html?screen=cards', backLabel: 'Cards' },
    'transfer-recipient': { title: 'Send money', back: 'app.html?screen=home', backLabel: 'Home' },
    'transfer-amount': { title: 'Amount', back: 'app.html?screen=transfer-recipient', backLabel: 'Recipient' },
    'transfer-review': { title: 'Review transfer', back: 'app.html?screen=transfer-amount', backLabel: 'Amount' },
    'biometric-failed': { title: 'Confirm', back: 'app.html?screen=transfer-review', backLabel: 'Review' },
    offline: { title: 'Confirm', back: 'app.html?screen=transfer-review', backLabel: 'Review' },
    'transfer-success': { title: 'Transfer complete', back: 'app.html?screen=home', backLabel: 'Home' },
    savings: { title: 'Savings', caption: 'Emergency buffer' },
    'savings-detail': { title: 'Emergency buffer', back: 'app.html?screen=savings', backLabel: 'Save' },
    subscriptions: { title: 'Subscriptions', back: 'app.html?screen=home', backLabel: 'Home' },
    security: { title: 'Security', back: 'app.html?screen=home', backLabel: 'Home' },
    notifications: { title: 'Notifications', back: 'app.html?screen=home', backLabel: 'Home' },
    kyc: { title: 'Identity check', back: 'app.html?screen=onboarding', backLabel: 'Back' },
    onboarding: { title: 'Welcome to Nova' },
    error: { title: 'Something went wrong', back: 'app.html?screen=home', backLabel: 'Home' }
  };

  function svg(name) {
    const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    if (name === 'back') return `<svg ${common}><path d="m15 18-6-6 6-6"/></svg>`;
    if (name === 'bell') return `<svg ${common}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 19h4"/></svg>`;
    return `<svg ${common}><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>`;
  }

  function currentTitle() {
    const configured = META[screen]?.title;
    if (configured) return configured;
    const candidate = document.querySelector('.page-heading h1,.dossier-title,.goal-hero h1,.receipt h1,.task-panel h1,.task-panel h2');
    return candidate?.textContent?.trim() || 'Nova';
  }

  function buildNavigation() {
    const stage = document.querySelector('.app-stage');
    if (!stage || document.querySelector('.ios26-nav')) return;

    const legacyBar = stage.querySelector('.mobile-topbar');
    if (legacyBar) legacyBar.hidden = true;

    const cfg = META[screen] || {};
    const isRoot = ['home', 'activity', 'cards', 'card-frozen', 'savings'].includes(screen);
    const title = currentTitle();
    const caption = cfg.caption || (isRoot ? 'Prototype data · Simulated banking' : 'Prototype data · Simulated banking');

    const nav = document.createElement('header');
    nav.className = 'ios26-nav';
    nav.innerHTML = `
      <div class="ios26-nav-inner">
        <div class="ios26-nav-row">
          <div class="ios26-nav-leading">
            ${cfg.back
              ? `<a class="ios26-back" href="${cfg.back}" aria-label="Back to ${cfg.backLabel || 'previous screen'}">${svg('back')}<span>${cfg.backLabel || ''}</span></a>`
              : `<a class="ios26-brand" href="app.html?screen=home" aria-label="Nova home"><img src="assets/nova-mark.svg" alt=""><span class="ios26-wordmark">Nova</span></a>`}
          </div>
          <div class="ios26-nav-center" aria-hidden="true">${title}</div>
          <div class="ios26-nav-actions">
            ${isRoot ? `<a class="ios26-icon-btn" href="app.html?screen=notifications" aria-label="Notifications">${svg('bell')}</a><a class="ios26-icon-btn" href="app.html?screen=security" aria-label="Security and profile">${svg('user')}</a>` : ''}
          </div>
        </div>
        <div class="ios26-nav-title"><h1>${title}</h1>${caption ? `<p>${caption}</p>` : ''}</div>
      </div>`;

    stage.insertBefore(nav, stage.firstChild);

    let raf = 0;
    const sync = () => {
      raf = 0;
      nav.classList.toggle('is-collapsed', window.scrollY > 56);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function normalizeLegacyLanguage() {
    document.querySelectorAll('.prototype-label').forEach((node) => node.remove());
    document.querySelectorAll('.page-heading').forEach((node) => {
      node.hidden = true;
      node.setAttribute('aria-hidden', 'true');
    });

    document.querySelectorAll('.card-brand').forEach((node) => {
      node.textContent = 'Nova / DEBIT';
    });
    document.querySelectorAll('[aria-label*="Ledger debit card"]').forEach((node) => {
      node.setAttribute('aria-label', node.getAttribute('aria-label').replace(/Ledger/g, 'Nova'));
    });

    const activityEyebrow = document.querySelector('.activity-header .eyebrow');
    if (activityEyebrow) activityEyebrow.textContent = 'Cash flow';

    const savingsEyebrow = document.querySelector('.goal-hero .eyebrow');
    if (savingsEyebrow) savingsEyebrow.textContent = 'Savings goal';

    const heroEyebrow = document.querySelector('.decision-copy > .eyebrow');
    if (heroEyebrow) heroEyebrow.textContent = 'Available after bills, saving and buffer';

    const horizonDescription = document.querySelector('.fi-horizon-head p');
    if (horizonDescription) horizonDescription.textContent = 'See how known payments, saving and expected income change what stays available.';
  }

  function enhanceSearch() {
    document.querySelectorAll('.search-wrap').forEach((wrap) => {
      const input = wrap.querySelector('input[type="search"]');
      if (!input || wrap.querySelector('.ios-search-cancel')) return;

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
      input.addEventListener('blur', () => {
        window.setTimeout(() => {
          if (document.activeElement !== cancel) wrap.classList.remove('is-focused');
        }, 90);
      });
    });
  }

  function enhanceControlSemantics() {
    document.querySelectorAll('.filter-row').forEach((row) => {
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', row.getAttribute('aria-label') || 'Filters');
    });

    document.querySelectorAll('.ledger-row.is-risk').forEach((row) => {
      row.dataset.swipeAction = 'Review';
      const existing = row.getAttribute('aria-label') || row.textContent.trim();
      row.setAttribute('aria-label', `${existing} — needs review`);
    });
  }

  function annotateScreen() {
    document.documentElement.dataset.novaScreen = screen;
    document.body.classList.add('nova-ios26');
    document.querySelectorAll('.horizon,.ledger,.goal-ledger,.receipt-sheet,.card-object,.fi-horizon').forEach((node) => {
      node.dataset.surface = 'content';
    });
    document.querySelectorAll('.control-list,.task-panel,.recipient-card,.bottom-nav,.ios26-nav').forEach((node) => {
      node.dataset.surface = 'interaction';
    });
  }

  function init() {
    annotateScreen();
    buildNavigation();
    normalizeLegacyLanguage();
    enhanceSearch();
    enhanceControlSemantics();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
