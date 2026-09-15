(() => {
  'use strict';

  const screen = new URLSearchParams(location.search).get('screen') || 'home';

  const captions = {
    home: 'Your money, planned ahead',
    activity: 'Balances, payments and recurring patterns',
    cards: 'Card, controls and recent usage',
    'card-frozen': 'Card, controls and recent usage',
    'card-controls': 'Payment permissions and limits',
    'transaction-detail': 'Card payment details',
    'transfer-recipient': 'Secure bank transfer',
    'transfer-amount': 'Secure bank transfer',
    'transfer-review': 'Review before you send',
    'biometric-failed': 'Confirm your identity',
    offline: 'Transfer paused while offline',
    'transfer-success': 'Transfer confirmation',
    savings: 'Goal progress and planned contributions',
    'savings-detail': 'Contribution preview',
    subscriptions: 'Recurring payments and future commitments',
    security: 'Account protection and access',
    notifications: 'Updates that need your attention',
    kyc: 'Identity verification',
    onboarding: 'Personal banking, planned ahead',
    error: 'Your transfer has not moved'
  };

  function money(value, sign = '') {
    return `${sign}€${Number(value).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function row(title, subtitle, value) {
    return `<div class="ios26-row"><div class="ios26-row-copy"><strong>${title}</strong><span>${subtitle}</span></div><div class="ios26-row-value">${value}</div></div>`;
  }

  function panel(title, action, body, className = '') {
    return `<section class="ios26-panel ${className}"><div class="ios26-panel-head"><h2>${title}</h2>${action || ''}</div>${body}</section>`;
  }

  function updateNavigationCopy() {
    const caption = document.querySelector('.ios26-nav-title p');
    if (caption && captions[screen]) caption.textContent = captions[screen];

    const center = document.querySelector('.ios26-nav-center');
    if (center && screen === 'home') center.textContent = 'Nova';
  }

  function enhanceHome() {
    const horizon = document.querySelector('.fi-horizon');
    if (horizon && !document.querySelector('.ios26-stat-strip')) {
      horizon.insertAdjacentHTML('afterend', `
        <section class="ios26-stat-strip" aria-label="Monthly account summary">
          <div class="ios26-stat"><span>Money in this month</span><strong>+€2,700.00</strong><small>Salary and incoming transfers</small></div>
          <div class="ios26-stat"><span>Money out this month</span><strong>−€1,084.99</strong><small>Completed and planned activity</small></div>
          <div class="ios26-stat"><span>Net so far</span><strong>+€1,615.01</strong><small>Before remaining September plans</small></div>
        </section>`);
    }

    const rail = document.querySelector('.context-rail');
    if (rail && !rail.querySelector('.ios26-account-snapshot')) {
      rail.insertAdjacentHTML('beforeend', panel(
        'Account snapshot',
        '<a href="app.html?screen=activity">View activity</a>',
        row('Current balance', 'Personal account', '€2,840.00') +
        row('Safe to spend', 'After bills, saving and buffer', '€1,300.00') +
        row('Protected buffer', 'Excluded from safe to spend', '€500.00') +
        row('Card ending 4821', 'Online and contactless enabled', 'Active'),
        'ios26-account-snapshot'
      ));
      rail.insertAdjacentHTML('beforeend', panel(
        'This month',
        '<a href="app.html?screen=savings">Open savings</a>',
        row('Emergency buffer', '62% of €4,000 target', '€2,480.00') +
        row('Next saving', '28 Sep', '€260.00') +
        row('Recurring services', '3 known subscriptions', '€80.99') +
        '<p class="ios26-panel-note">Nova keeps future commitments visible alongside today’s spendable money instead of hiding them in a separate budget screen.</p>',
        'ios26-month-snapshot'
      ));
    }
  }

  function enhanceActivity() {
    const header = document.querySelector('.activity-header');
    if (!header || document.querySelector('.ios26-activity-insights')) return;

    header.insertAdjacentHTML('afterend', `
      <section class="ios26-activity-insights" aria-label="Activity insights">
        ${panel(
          'What needs attention',
          '<a href="app.html?screen=transaction-detail">Review payment</a>',
          row('ByteMart Online', 'Electronics – unusual card activity', '−€189.40') +
          row('Northstar Books', 'Pending card payment', '−€28.50')
        )}
        ${panel(
          'Recurring this month',
          '<a href="app.html?screen=subscriptions">Manage</a>',
          row('Mobile plan', '22 Sep', '−€32.00') +
          row('Streaming service', '24 Sep', '−€14.99') +
          row('River Gym', '2 Oct', '−€34.00')
        )}
      </section>`);
  }

  function enhanceTransferRecipient() {
    const main = document.querySelector('main.task-shell');
    const panelNode = main?.querySelector('.task-panel');
    if (!main || !panelNode) return;

    main.classList.add('ios26-pay-recipient');

    const addButton = panelNode.querySelector('.btn-secondary');
    const existing = panelNode.querySelector('.recipient-card');
    if (existing && addButton && !panelNode.querySelector('.ios26-demo-recipient')) {
      addButton.insertAdjacentHTML('beforebegin', `
        <a class="recipient-card ios26-demo-recipient" href="app.html?screen=transfer-amount">
          <span class="avatar" aria-hidden="true">SA</span>
          <span><strong>Sofia Andersson</strong><span>Nordic Union – Personal •••• 7712</span></span>
          <span style="margin-left:auto" aria-hidden="true">›</span>
        </a>
        <a class="recipient-card ios26-demo-recipient" href="app.html?screen=transfer-amount">
          <span class="avatar" aria-hidden="true">NW</span>
          <span><strong>Noah Williams</strong><span>Harbor Bank – Personal •••• 0519</span></span>
          <span style="margin-left:auto" aria-hidden="true">›</span>
        </a>`);
    }

    if (!main.querySelector('.ios26-pay-aside')) {
      main.insertAdjacentHTML('beforeend', `
        <aside class="ios26-pay-aside" aria-label="Transfer context">
          <p class="eyebrow">Available to send</p>
          <span class="ios26-safe-value">€1,300.00</span>
          <p class="ios26-panel-note">Safe to spend after known bills, planned saving and your protected €500 buffer.</p>
          ${row('Transfer fee', 'Standard bank transfer', '€0.00')}
          ${row('Typical arrival', 'For existing recipients', 'Minutes')}
          ${row('Protected buffer', 'Never pulled automatically', '€500.00')}
          ${row('Recent recipients', 'Saved in this prototype', '3')}
        </aside>`);
    }
  }

  function enhanceCards() {
    const state = document.querySelector('.card-state');
    if (state && !document.querySelector('.ios26-card-metrics')) {
      state.insertAdjacentHTML('afterend', `
        <section class="ios26-card-metrics" aria-label="Card usage summary">
          <div class="ios26-card-metric"><span>Spent this month</span><strong>€328.49</strong></div>
          <div class="ios26-card-metric"><span>Daily purchase limit</span><strong>€1,200.00</strong></div>
          <div class="ios26-card-metric"><span>Payment channels</span><strong>2 active</strong></div>
        </section>`);
    }

    const quick = document.querySelector('.card-quick');
    if (quick && !quick.querySelector('.ios26-card-detail-panel')) {
      quick.insertAdjacentHTML('beforeend', panel(
        'Card details',
        '<a href="app.html?screen=card-controls">All controls</a>',
        row('Card type', 'Virtual debit', '•••• 4821') +
        row('Cash withdrawals', 'ATM access', 'Enabled') +
        row('Magstripe', 'Fallback only', 'Off'),
        'ios26-card-detail-panel'
      ));
    }
  }

  function enhanceSavings() {
    const hero = document.querySelector('.goal-hero');
    if (hero && !hero.querySelector('.ios26-goal-summary')) {
      const timeline = hero.querySelector('.goal-timeline');
      const markup = `
        <section class="ios26-goal-summary" aria-label="Savings goal summary">
          <div><span>Remaining</span><strong>€1,520.00</strong></div>
          <div><span>Next contribution</span><strong>€260.00 – 28 Sep</strong></div>
          <div><span>Projected target</span><strong>Mar 2027</strong></div>
        </section>`;
      if (timeline) timeline.insertAdjacentHTML('afterend', markup);
      else hero.insertAdjacentHTML('beforeend', markup);
    }

    const rail = document.querySelector('.context-rail');
    if (rail && !rail.querySelector('.ios26-contribution-history')) {
      rail.insertAdjacentHTML('beforeend', panel(
        'Recent contributions',
        '<a href="app.html?screen=savings-detail">Adjust plan</a>',
        row('28 Aug', 'Monthly contribution', '+€260.00') +
        row('28 Jul', 'Monthly contribution', '+€260.00') +
        row('28 Jun', 'Monthly contribution', '+€260.00'),
        'ios26-contribution-history'
      ));
    }
  }

  function enhanceSubscriptions() {
    const total = document.querySelector('.recurring-total');
    if (!total || document.querySelector('.ios26-subscription-summary')) return;
    total.insertAdjacentHTML('afterend', `
      <section class="ios26-stat-strip ios26-subscription-summary" aria-label="Subscription summary">
        <div class="ios26-stat"><span>Monthly recurring</span><strong>€80.99</strong><small>3 known services</small></div>
        <div class="ios26-stat"><span>Inside current Horizon</span><strong>€46.99</strong><small>Due before 30 Sep</small></div>
        <div class="ios26-stat"><span>Next charge</span><strong>22 Sep</strong><small>Mobile plan</small></div>
      </section>`);
  }

  function enhanceSecurity() {
    const summary = document.querySelector('.security-summary');
    if (!summary || document.querySelector('.ios26-security-summary')) return;
    summary.insertAdjacentHTML('afterend', `
      <section class="ios26-stat-strip ios26-security-summary" aria-label="Security summary">
        <div class="ios26-stat"><span>Sensitive actions</span><strong>Biometrics</strong><small>Transfer and card changes</small></div>
        <div class="ios26-stat"><span>Login alerts</span><strong>On</strong><small>New-device notifications</small></div>
        <div class="ios26-stat"><span>Trusted devices</span><strong>1</strong><small>Prototype device</small></div>
      </section>`);
  }

  function enhanceNotifications() {
    const main = document.querySelector('#main');
    if (!main || document.querySelector('.ios26-notification-summary')) return;
    const firstGroup = main.querySelector('.notification-group');
    if (firstGroup) {
      firstGroup.insertAdjacentHTML('beforebegin', `
        <section class="ios26-stat-strip ios26-notification-summary" aria-label="Notification summary">
          <div class="ios26-stat"><span>Needs action</span><strong>1</strong><small>Unusual card activity</small></div>
          <div class="ios26-stat"><span>Planning updates</span><strong>2</strong><small>Rent and savings</small></div>
          <div class="ios26-stat"><span>Unread</span><strong>3</strong><small>Prototype notifications</small></div>
        </section>`);
    }
  }

  function normalizeVisibleCopy() {
    document.querySelectorAll('.fi-impact-safe').forEach((node) => {
      const strong = node.querySelector('strong');
      if (strong) strong.textContent = 'Your €500 buffer stays protected.';
    });

    document.querySelectorAll('.list-sub,.upcoming-copy span,.meta,.ios26-panel-note').forEach((node) => {
      node.innerHTML = node.innerHTML.replace(/\s·\s/g, ' – ');
    });
  }

  function init() {
    document.documentElement.dataset.novaDensity = 'wide-v4';
    updateNavigationCopy();
    if (screen === 'home') enhanceHome();
    if (screen === 'activity') enhanceActivity();
    if (screen === 'transfer-recipient') enhanceTransferRecipient();
    if (screen === 'cards' || screen === 'card-frozen') enhanceCards();
    if (screen === 'savings') enhanceSavings();
    if (screen === 'subscriptions') enhanceSubscriptions();
    if (screen === 'security') enhanceSecurity();
    if (screen === 'notifications') enhanceNotifications();
    normalizeVisibleCopy();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
