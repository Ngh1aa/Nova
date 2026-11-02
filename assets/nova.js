(() => {
  'use strict';

  const DATA = {
    profile: { name: 'Alex Nguyen' },
    account: { balance: 2840, committed: 780, goal: 260, buffer: 500, safe: 1300, freshness: 'Updated 09:42 · Prototype data' },
    commitments: [
      ['Apartment rent', 'Sep 20', 620, 'Bill'],
      ['Mobile plan', 'Sep 22', 32, 'Subscription'],
      ['Streaming service', 'Sep 24', 14.99, 'Subscription'],
      ['Utilities estimate', 'Sep 27', 113.01, 'Estimate']
    ],
    goal: { id: 'emergency', name: 'Emergency buffer', current: 2480, target: 4000, contribution: 260, next: '28 Sep', status: 'On track' },
    goals: [
      { id: 'emergency', name: 'Emergency buffer', current: 2480, target: 4000, contribution: 260, next: '28 Sep', status: 'On track' },
      { id: 'holiday', name: 'Holiday fund', current: 3200, target: 5000, contribution: 0, next: 'Not scheduled', status: 'In progress' }
    ],
    suspicious: { id: 'txn_LDG_9F2K7Q', merchant: 'ByteMart Online', amount: 189.40, timestamp: 'Sep 15 · 02:14', status: 'Completed', channel: 'Online card', card: '•••• 4821', location: 'Singapore', category: 'Electronics', reasons: ['New merchant', 'Higher than your usual online purchase'] },
    transactions: [
      ['Greenline Market', 'Groceries', -42.70, 'completed', '15 Sep'],
      ['Metro Transit', 'Transport', -18, 'completed', '15 Sep'],
      ['Cloudbox', 'Subscription', -9.99, 'completed', '15 Sep'],
      ['Atelier Coffee', 'Dining', -6.40, 'completed', '15 Sep'],
      ['ByteMart Online', 'Electronics', -189.40, 'risk', '15 Sep'],
      ['Northstar Books', 'Shopping', -28.50, 'pending', '14 Sep'],
      ['River Gym', 'Subscription', -34, 'completed', '13 Sep'],
      ['Merchant refund', 'Shopping', 22, 'reversed', '12 Sep'],
      ['Salary deposit', 'Income', 2500, 'completed', '15 Sep'],
      ['Maya Chen', 'Transfer', -145, 'completed', '12 Sep'],
      ['An Nguyen', 'Transfer', -36.50, 'completed', '6 Sep'],
      ['Daniel Lee', 'Transfer', -72, 'completed', '1 Sep']
    ],
    recipients: [
      { id: 'maya-chen-2048', name: 'Maya Chen', bank: 'Northfield Bank', account: 'Personal •••• 2048' },
      { id: 'daniel-lee-7184', name: 'Daniel Lee', bank: '', account: '•••• 7184' },
      { id: 'an-nguyen-3052', name: 'An Nguyen', bank: '', account: '•••• 3052' },
      { id: 'natalie-6610', name: 'Natalie', bank: '', account: '•••• 6610' }
    ],
    recipient: { name: 'Maya Chen', bank: 'Northfield Bank', account: 'Personal •••• 2048', amount: 145, fee: 0, arrival: 'Usually within minutes', reference: 'September utilities', afterSafe: 1155 }
  };

  // User-created demo goals use the same detail and contribution-preview flow.
  try {
    const saved = JSON.parse(localStorage.getItem('nova_savings_goals') || '[]');
    if (Array.isArray(saved)) saved.filter(goal => /^custom-[a-z0-9-]+$/.test(goal.id) && typeof goal.name === 'string' && goal.name.length <= 40 && Number.isFinite(goal.target) && goal.target > 0).forEach(goal => DATA.goals.push({ ...goal, name: escapeHtml(goal.name), current: 0, contribution: 0, next: 'Not scheduled', status: 'New goal' }));
  } catch {}

  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }

  const screens = {
    onboarding: renderOnboarding,
    kyc: renderKyc,
    home: renderHome,
    activity: renderActivity,
    'transaction-detail': renderTransactionDetail,
    'account-detail': renderAccountDetail,
    'payment-detail': renderPaymentDetail,
    'report-transaction': renderReportTransaction,
    cards: renderCards,
    'card-frozen': () => renderCards(true),
    'card-controls': renderCardControls,
    'transfer-recipient': renderTransferRecipient,
    'transfer-amount': renderTransferAmount,
    'transfer-review': renderTransferReview,
    'biometric-failed': () => renderTransferReview({ biometricFailed: true }),
    offline: () => renderTransferReview({ offline: true }),
    'transfer-success': renderTransferSuccess,
    savings: renderSavings,
    'savings-detail': renderSavingsDetail,
    subscriptions: renderSubscriptions,
    security: renderSecurity,
    notifications: renderNotifications,
    error: renderError
  };

  const app = document.querySelector('#app');
  const params = new URLSearchParams(location.search);
  const currentScreen = params.get('screen') || 'home';

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9 21v-7h6v7"/>',
    activity: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><circle cx="8" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="11" cy="18" r="1"/>',
    pay: '<path d="M5 12h14"/><path d="m14 7 5 5-5 5"/>',
    cards: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/><path d="M7 15h4"/>',
    save: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16"/><path d="M8.5 9.2c0-1.4 1.4-2.4 3.5-2.4s3.5 1 3.5 2.4-1.4 2.3-3.5 2.3-3.5 1-3.5 2.4 1.4 2.4 3.5 2.4 3.5-1 3.5-2.4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 19h4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    shield: '<path d="M12 3 5 6v5c0 4.5 2.8 8.3 7 10 4.2-1.7 7-5.5 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7L15 10"/>',
    arrow: '<path d="m9 18 6-6-6-6"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    alert: '<path d="M12 4 3.5 19h17L12 4Z"/><path d="M12 9v4"/><path d="M12 16h.01"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    device: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 18h4"/>',
    refresh: '<path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M6.1 8a7 7 0 0 1 11.7-1.4L20 9"/><path d="M17.9 16a7 7 0 0 1-11.7 1.4L4 15"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    goal: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    eye: '<path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.5"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5.5 16c.7-1.8 4.3-1.8 5 0M13 10h5M13 14h5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.7 2c-.9.6-1.5 1.1-1.5 2.2"/><path d="M12 17h.01"/>'
  };

  function icon(name, className = '') {
    const body = ICONS[name] || ICONS.help;
    return `<svg ${className ? `class="${className}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  function euro(value, signed = false) {
    const abs = Math.abs(Number(value)).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const sign = signed ? (value > 0 ? '+' : value < 0 ? '−' : '') : '';
    return `${sign}€${abs}`;
  }

  function storageGet(key, fallback = 'false') { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }
  function storageSet(key, value) { try { localStorage.setItem(key, String(value)); } catch {} }
  function isFrozen(forced = false) { return forced || storageGet('nova_card_frozen') === 'true'; }

  function activeFor(screen) {
    if (['home', 'notifications', 'subscriptions'].includes(screen)) return 'home';
    if (['activity', 'transaction-detail', 'report-transaction'].includes(screen)) return 'activity';
    if (screen.startsWith('transfer') || ['offline', 'biometric-failed', 'error'].includes(screen)) return 'pay';
    if (screen.startsWith('card')) return 'cards';
    if (screen.startsWith('saving')) return 'save';
    return '';
  }

  function navLink(label, key, screen) {
    const active = activeFor(currentScreen) === key;
    return `<a href="app.html?screen=${screen}" class="${active ? 'active' : ''}" ${active ? 'aria-current="page"' : ''}><span class="nav-glyph">${icon(key)}</span><span>${label}</span></a>`;
  }

  function accountActions() {
    return `<div class="ios26-nav-actions"><span class="v6-sim-pill" title="Prototype with sample data. No real banking connection.">Demo account</span><a class="nova-search-chip" href="app.html?screen=activity" aria-label="Search activity">${icon('search')}<span>Search activity</span></a><a class="nova-bell-chip" href="app.html?screen=notifications" aria-label="Notifications">${icon('bell')}<i aria-hidden="true"></i></a><a class="nova-profile-chip" href="app.html?screen=settings" title="Open profile and settings"><span class="sr-only">Open profile and settings </span><span class="nova-avatar" aria-hidden="true">AN</span><span><small>Personal account</small><strong>Alex Nguyen</strong></span></a></div>`;
  }

  function shell(main, options = {}) {
    const offline = !!options.offline;
    return `<div class="app-shell">
      <aside class="sidebar" aria-label="Primary navigation"><a class="brand" href="app.html?screen=home"><span class="brand-mark" aria-hidden="true">L</span><span>Ledger</span></a><div class="sidebar-account"><span>Personal account</span><strong>${euro(DATA.account.balance)}</strong></div><nav class="side-nav">${navLink('Home', 'home', 'home')}${navLink('Activity', 'activity', 'activity')}${navLink('Pay', 'pay', 'transfer-recipient')}${navLink('Cards', 'cards', 'cards')}${navLink('Save', 'save', 'savings')}</nav><div class="side-bottom"><nav class="side-nav"><a href="app.html?screen=security">${icon('shield')}<span>Security</span></a><a href="prototype.html">${icon('eye')}<span>Prototype index</span></a></nav><p class="meta" style="padding:10px 11px 0">Prototype data · Simulated banking</p></div></aside>
      <div class="app-stage"><header class="mobile-topbar"><a class="brand" href="app.html?screen=home"><span class="brand-mark" aria-hidden="true">L</span><span>Ledger</span></a><div class="utility-actions"><a class="icon-btn" aria-label="Notifications" href="app.html?screen=notifications">${icon('bell')}<span class="notification-dot" aria-hidden="true"></span></a><a class="icon-btn" aria-label="Security and profile" href="app.html?screen=security">${icon('user')}</a></div></header>${offline ? '<div class="offline-banner" role="status">You’re offline. You can review details, but money actions are paused.</div>' : ''}${main}</div>
      <nav class="bottom-nav" aria-label="Primary navigation">${navLink('Home', 'home', 'home')}${navLink('Activity', 'activity', 'activity')}${navLink('Pay', 'pay', 'transfer-recipient')}${navLink('Cards', 'cards', 'cards')}${navLink('Save', 'save', 'savings')}</nav>
    </div>`;
  }

  function pageHeader(title, description = '', back = '') {
    return `<div class="page-heading"><div>${back ? `<a class="back-link" href="${back}">${icon('back')}<span>Back</span></a>` : ''}<p class="eyebrow">Ledger · Prototype data</p><h1>${title}</h1>${description ? `<p>${description}</p>` : ''}</div><span class="prototype-label">Simulated</span></div>`;
  }

  function stepper(current, labels = ['Recipient', 'Amount', 'Review', 'Confirm']) {
    return `<div class="stepper" aria-label="Transfer progress">${labels.map((_, i) => `<span class="${i < current ? 'done' : ''}"></span>`).join('')}</div><div class="step-labels" aria-hidden="true">${labels.map(label => `<span>${label}</span>`).join('')}</div>`;
  }

  function horizon(compact = false, safe = DATA.account.safe) {
    const committedCombined = DATA.account.committed + DATA.account.goal;
    const total = DATA.account.balance;
    const safePct = Math.max(0, Math.round((safe / total) * 100));
    const committedPct = Math.max(0, Math.round((committedCombined / total) * 100));
    const bufferPct = Math.max(0, 100 - safePct - committedPct);
    return `<section class="horizon ${compact ? 'compact' : ''}" aria-labelledby="horizon-title"><div class="horizon-top"><div><h2 id="horizon-title">Money Horizon</h2><p>How your balance is allocated.</p></div><span class="horizon-range">Next 14 days</span></div><div class="horizon-timeline"><div class="horizon-bar" role="img" aria-label="${euro(safe)} safe to spend, ${euro(committedCombined)} committed to bills and goal contribution, ${euro(DATA.account.buffer)} protected buffer"><div class="horizon-zone safe" style="width:${safePct}%">Safe to spend</div><div class="horizon-zone committed" style="width:${committedPct}%">Committed</div><div class="horizon-zone buffer" style="width:${bufferPct}%">Protected</div></div></div><div class="horizon-legend"><div><span class="legend-key"><span class="legend-swatch" style="background:var(--safe)"></span>Safe to spend</span><strong>${euro(safe)}</strong></div><div><span class="legend-key"><span class="legend-swatch" style="background:var(--committed)"></span>Known commitments</span><strong>${euro(committedCombined)}</strong></div><div><span class="legend-key"><span class="legend-swatch" style="background:var(--buffer)"></span>Protected buffer</span><strong>${euro(DATA.account.buffer)}</strong></div></div><p class="horizon-note">Safe to spend excludes bills, planned savings and your buffer. Future spending can change this estimate.</p></section>`;
  }

  function commitmentRows() {
    return `<div class="upcoming-list">${DATA.commitments.map(([name, date, amount, type]) => { const [, day] = date.split(' '); return `<div class="upcoming-row"><div class="upcoming-date">Sep<strong>${day}</strong></div><div class="upcoming-copy"><strong>${name}</strong><span>${type} · included in Horizon</span></div><div class="upcoming-amount">${euro(-amount, true)}<small>scheduled</small></div></div>`; }).join('')}</div>`;
  }

  function transactionRows(limit = DATA.transactions.length, ledger = false) {
    const rows = [...DATA.transactions].sort((a,b)=>parseInt(b[4])-parseInt(a[4])).slice(0, limit).map(([name, category, amount, status, date]) => {
      const risk = status === 'risk'; const pending = status === 'pending'; const reversed = status === 'reversed';
      const href = transactionHref(name);
      const state = risk ? 'Needs review' : pending ? 'Pending' : reversed ? 'Reversed' : 'Completed';
      const glyph = risk ? 'alert' : pending ? 'calendar' : reversed ? 'refresh' : 'receipt';
      return `<a class="${ledger ? 'ledger-row' : 'list-row'} ${risk ? 'is-risk' : ''}" href="${href}">${ledger ? `<div class="ledger-date">${date}</div>` : `<div class="list-icon">${icon(glyph)}</div>`}<div><div class="list-title">${name}</div><div class="list-sub">${category}${currentScreen === 'activity' && status === 'completed' ? '' : ` · ${state}`}</div></div><div class="list-value">${euro(amount, true)}${risk ? '<small>Review</small>' : ''}</div></a>`;
    }).join('');
    return `<div class="${ledger ? 'ledger' : 'list'}">${rows}</div>`;
  }

  function transactionId(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
  function transactionHref(name) { return `app.html?screen=transaction-detail&transaction=${transactionId(name)}`; }

  function detailRows(rows) {
    return `<dl class="detail-grid">${rows.map(([label, value]) => `<div class="detail-row"><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>`;
  }

  function missingDetail(back) {
    return shell(`<main id="main" class="main-wrap task-shell" tabindex="-1">${pageHeader('Item not found', 'Choose an item from the list to see its details.', back)}<a class="btn btn-primary" href="${back}">Back to list</a></main>`);
  }

  function renderAccountDetail() {
    return shell(`<main id="main" class="main-wrap task-shell account-detail-page" tabindex="-1">${pageHeader('Current account', '', 'app.html?screen=home')}<section class="task-panel"><p class="eyebrow">Your balance</p><div class="goal-amount">${euro(DATA.account.balance)}</div>${detailRows([['Account', 'Nova · •••• 4421'], ['Bills and savings', euro(DATA.account.committed + DATA.account.goal)], ['Protected buffer', euro(DATA.account.buffer)], ['Safe to spend', euro(DATA.account.safe)]])}<div class="action-stack"><a class="btn btn-primary" href="app.html?screen=transfer-recipient">Send money</a><a class="btn btn-secondary" href="app.html?screen=activity">View activity</a></div></section></main>`);
  }

  function renderPaymentDetail() {
    const payments = [...DATA.commitments, [DATA.goal.name, DATA.goal.next, DATA.goal.contribution, 'Savings'], ['River Gym', 'Oct 02', 34, 'Subscription']];
    const payment = payments.find(item => transactionId(item[0]) === params.get('payment'));
    if (!payment) return missingDetail('app.html?screen=subscriptions');
    const [name, date, amount, type] = payment;
    return shell(`<main id="main" class="main-wrap task-shell payment-detail-page" tabindex="-1">${pageHeader(name, '', 'app.html?screen=home')}<section class="task-panel"><p class="eyebrow">Upcoming payment</p><div class="goal-amount">${euro(amount)}</div>${detailRows([['Due date', date], ['Type', type], ['From', 'Current account · •••• 4421'], ['Planning', name === 'River Gym' ? 'Outside the current 14-day plan' : 'Included in bills and savings']])}<p class="field-hint">Planned payment in the demo. No money is scheduled with a bank.</p><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=${type === 'Savings' ? 'savings-detail' : 'subscriptions'}">${type === 'Savings' ? 'View goal' : 'View subscriptions'}</a><a class="btn btn-secondary" href="app.html?screen=home">Back to home</a></div></section></main>`);
  }

  function renderHome() {
    const frozen = isFrozen();
    const main = `<main id="main" class="main-wrap home-page" tabindex="-1"><div class="home-kicker"><div><p class="eyebrow">Money today</p><strong>Tuesday, 15 September</strong></div><time datetime="2026-09-15T09:42">09:42 · Prototype data</time></div><div class="page-grid has-context"><div><section class="decision-field"><div class="decision-top"><div class="decision-copy"><p class="eyebrow">After known bills + savings + buffer</p><h1 class="money-amount">${euro(DATA.account.safe)}</h1><div class="decision-label">Safe to spend · next 14 days</div><div class="money-sub"><span>Estimate through 30 Sep</span><span>Total balance ${euro(DATA.account.balance)}</span><span>Protected ${euro(DATA.account.buffer)}</span><span>${DATA.account.freshness}</span></div></div><div class="decision-actions" aria-label="Quick actions"><a class="decision-action" href="app.html?screen=transfer-recipient">${icon('pay')}<strong>Send money</strong><small>Review impact first</small></a><a class="decision-action" href="app.html?screen=savings-detail">${icon('goal')}<strong>Move to goal</strong><small>Preview contribution</small></a></div></div>${horizon()}</section><section class="section"><div class="section-head"><h2>Needs your attention</h2><span class="status status-risk">1 review</span></div><a class="attention-strip" href="app.html?screen=transaction-detail"><span class="attention-mark">${icon('alert')}</span><span><strong>Unusual card activity</strong><small>${euro(DATA.suspicious.amount)} at ByteMart Online · Singapore · 02:14</small></span><span class="chevron">${icon('arrow')}</span></a>${frozen ? '<div class="callout callout-success" style="margin-top:12px"><strong>Card protection active</strong><p>Your card ending 4821 is frozen. Review or unfreeze it from Cards.</p></div>' : ''}</section><section class="section"><div class="section-head"><h2>Coming up</h2><a class="text-link" href="app.html?screen=subscriptions">Recurring payments ${icon('arrow')}</a></div>${commitmentRows()}</section><section class="section"><div class="section-head"><h2>Emergency buffer</h2><a class="text-link" href="app.html?screen=savings-detail">Open goal ${icon('arrow')}</a></div><div class="goal-strip"><div><h3>${euro(DATA.goal.current)} saved</h3><p class="meta" style="margin:5px 0 10px">of ${euro(DATA.goal.target)} · ${euro(DATA.goal.contribution)} planned ${DATA.goal.next}</p><div class="progress" role="progressbar" aria-label="Emergency buffer progress" aria-valuemin="0" aria-valuemax="4000" aria-valuenow="2480"><span style="width:${DATA.goal.current / DATA.goal.target * 100}%"></span></div></div><div class="goal-percent">${Math.round(DATA.goal.current / DATA.goal.target * 100)}%</div></div></section><section class="section"><div class="section-head"><h2>Recent activity</h2><a class="text-link" href="app.html?screen=activity">See all ${icon('arrow')}</a></div>${transactionRows(5, true)}</section></div><aside class="context-rail" aria-label="Money health context"><section class="context-panel"><p class="eyebrow">This week</p><h2>Spending pulse</h2><div class="pulse-bars" aria-label="Prototype seven-day spending comparison"><span style="height:33%"></span><span style="height:49%"></span><span style="height:28%"></span><span style="height:65%"></span><span style="height:42%"></span><span class="current" style="height:78%"></span><span style="height:18%"></span></div><div class="pulse-caption"><span>Mon</span><span>Today</span><span>Sun</span></div><div class="insight-line"><strong>Dining is €34 above your recent weekly pattern</strong><p>Prototype comparison only. No financial-health score is inferred.</p></div><div class="insight-line"><strong>Subscriptions are covered</strong><p>Known recurring charges inside the Horizon are already committed.</p></div><div class="insight-line"><strong>Buffer stays protected</strong><p>${euro(DATA.account.buffer)} is excluded from safe to spend.</p></div></section></aside></div></main>`;
    return shell(main);
  }

  function renderActivity() {
    const incoming = DATA.transactions.reduce((sum, row) => sum + Math.max(0, row[2]), 0);
    const outgoing = DATA.transactions.reduce((sum, row) => sum + Math.min(0, row[2]), 0);
    return shell(`<main id="main" class="main-wrap activity-page" tabindex="-1">
      <header class="activity-header"><div class="activity-heading-row"><h1>Activity</h1><p>September 2026</p></div>
        <dl class="cashflow-strip"><div class="cashflow-item"><dt>Money in</dt><dd><strong>${euro(incoming, true)}</strong></dd></div><div class="cashflow-item"><dt>Money out</dt><dd><strong>${euro(outgoing, true)}</strong></dd></div><div class="cashflow-item"><dt>Net so far</dt><dd><strong>${euro(incoming + outgoing, true)}</strong></dd></div></dl>
      </header>
      <section class="section activity-ledger"><div class="section-head"><h2>Transactions</h2><span class="meta">${DATA.transactions.length} transactions</span></div>
        <div class="ledger-toolbar"><div class="search-wrap"><span class="search-icon">${icon('search')}</span><label class="sr-only" for="txn-search">Search transactions</label><input class="input" id="txn-search" type="search" placeholder="Search transactions"></div><div class="filter-row" aria-label="Transaction filters">${['All','Needs review','Recurring','Pending','Income'].map((label, index) => `<button class="chip" aria-pressed="${index === 0}">${label}</button>`).join('')}</div></div>
        ${transactionRows(DATA.transactions.length, true)}
        <nav class="activity-pagination" aria-label="Transaction pages" data-activity-pagination>
          <span class="meta" data-activity-page-range aria-live="polite" aria-atomic="true"></span>
          <div class="activity-page-controls"><button class="btn btn-secondary" type="button" data-activity-previous>${icon('arrow', 'activity-previous-icon')}<span>Previous</span></button><button class="btn btn-secondary" type="button" data-activity-next><span>Next</span>${icon('arrow')}</button></div>
        </nav>
      </section></main>`);
  }

  function renderTransactionDetail() {
    const selectedId = params.get('transaction');
    const selected = selectedId ? DATA.transactions.find(row => transactionId(row[0]) === selectedId) : null;
    if (selectedId && !selected) return missingDetail('app.html?screen=activity');
    if (selected && selected[3] !== 'risk') {
      const [name, category, amount, status, date] = selected;
      const statusLabel = status === 'reversed' ? 'Refunded' : status === 'pending' ? 'Pending' : 'Completed';
      return shell(`<main id="main" class="main-wrap task-shell transaction-detail-page" tabindex="-1">${pageHeader(name, '', 'app.html?screen=activity')}<section class="task-panel"><p class="eyebrow">${statusLabel}</p><div class="goal-amount">${euro(amount, true)}</div>${detailRows([['Date', date], ['Category', category], ['Status', statusLabel], ['Account', 'Current account · •••• 4421'], ['Method', ['Income', 'Transfer'].includes(category) ? 'Bank transfer' : amount > 0 ? 'Merchant refund' : 'Debit card · •••• 4821']])}${status === 'pending' ? '<p class="field-hint">The final amount may change when this payment settles.</p>' : ''}<div class="action-stack"><a class="btn btn-secondary" href="app.html?screen=activity">Back to activity</a></div></section></main>`);
    }
    const frozen = isFrozen(); const t = DATA.suspicious;
    const main = `<main id="main" class="main-wrap transaction-detail-page" tabindex="-1"><section class="dossier-hero"><div class="dossier-topline"><a class="back-link" href="app.html?screen=activity">${icon('back')}<span>Activity</span></a><span class="status status-risk">Unusual activity · review</span></div><div class="dossier-main"><div><p class="eyebrow">${t.timestamp}</p><h1 class="dossier-title">${t.merchant}</h1><div class="dossier-meta"><span>${t.channel}</span><span>${t.card}</span><span>${t.location}</span></div></div><div><div class="dossier-amount">${euro(-t.amount, true)}</div><p class="meta" style="text-align:right;margin:8px 0 0">${t.status} · prototype data</p></div></div></section><div class="dossier-layout"><div><section class="section"><div class="section-head"><h2>Payment details</h2></div><dl class="detail-grid"><div class="detail-row"><dt>Status</dt><dd><span class="status status-success">${t.status}</span></dd></div><div class="detail-row"><dt>Card</dt><dd>${t.card}</dd></div><div class="detail-row"><dt>Channel</dt><dd>${t.channel}</dd></div><div class="detail-row"><dt>Location</dt><dd>${t.location}</dd></div><div class="detail-row"><dt>Category</dt><dd>${t.category}</dd></div><div class="detail-row"><dt>Reference</dt><dd class="mono">${t.id}</dd></div></dl></section><section class="protection-band"><p class="eyebrow">Protective action</p><h2>Protect your card without pretending the payment disappears</h2>${frozen ? '<div class="callout callout-success" style="margin-top:14px"><strong>Card frozen</strong><p>New card payments and ATM withdrawals are blocked. Already-authorized or offline transactions can still settle.</p></div>' : '<div class="callout callout-warning" style="margin-top:14px"><strong>Demo-only protection</strong><p>Freeze changes only this prototype state. It does not contact a bank or reverse the payment.</p></div><p>If you do not recognise this payment, freezing is a reversible first step while you investigate.</p>'}<div class="action-stack">${frozen ? '<a class="btn btn-primary" href="app.html?screen=cards">Review frozen card</a>' : '<button class="btn btn-risk" id="freeze-card">Freeze card in demo</button>'}<a class="btn btn-secondary" id="report-transaction" href="app.html?screen=report-transaction">Preview report steps</a></div><p class="meta" data-report-boundary style="margin:10px 0 0">Demo only — report preview submits nothing. Freeze changes only this prototype state; neither action contacts a bank.</p></section></div><aside class="evidence-panel"><p class="eyebrow">Why this surfaced</p><h2>Why this needs review</h2><p>Not confirmed fraud. Check the merchant, time and place before you act.</p><div class="insight-line"><strong>New merchant</strong><p>First payment to ByteMart.</p></div><div class="insight-line"><strong>Higher online amount</strong><p>Above your usual online spend.</p></div></aside></div></main>`;
    return shell(main);
  }

  function renderReportTransaction() {
    const t = DATA.suspicious;
    const state = new URLSearchParams(location.search).get('state') || 'review';
    if (state === 'handoff') {
      const main = `<main id="main" class="main-wrap task-shell report-page" tabindex="-1">${pageHeader('Report preview complete', 'This demo stops before any bank case is created.', 'app.html?screen=transaction-detail')}<section class="task-panel"><p class="eyebrow">Simulated support handoff</p><h2>No bank case created</h2><div class="callout callout-warning"><strong>Nothing was submitted</strong><p>Nova is not connected to a bank dispute system. This state only previews what a production handoff would need to communicate after a user chooses to report a transaction.</p></div><div class="review-list" style="margin-top:18px"><div class="review-row"><span>Transaction</span><strong>${t.merchant}</strong></div><div class="review-row"><span>Amount</span><strong>${euro(-t.amount, true)}</strong></div><div class="review-row"><span>Card protection</span><strong>Not changed by this preview</strong></div><div class="review-row"><span>Bank case</span><strong>Not created</strong></div><div class="review-row"><span>Refund / provisional credit</span><strong>Not requested or promised</strong></div></div><section class="section" style="margin-top:18px"><div class="section-head"><h2>What a real bank flow would do next</h2></div><ul class="dialog-list"><li>Confirm the transaction and reason for reporting.</li><li>Check whether the card should remain active or be frozen.</li><li>Collect any bank-specific dispute details and consent.</li><li>Create a case/reference only after a real submission succeeds.</li><li>Explain review timing and any refund rules without promising an outcome.</li></ul></section><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=transaction-detail">Return to transaction</a><a class="btn btn-secondary" href="app.html?screen=cards">Review card protection</a></div></section></main>`;
      return shell(main);
    }
    const main = `<main id="main" class="main-wrap task-shell report-page" tabindex="-1">${pageHeader('Report preview', 'Review what would be reported. This demo does not contact a bank or create a case.', 'app.html?screen=transaction-detail')}<section class="task-panel"><p class="eyebrow">Report preview</p><h2>${t.merchant}</h2><div class="callout callout-warning"><strong>Nothing has been reported</strong><p>This portfolio prototype can preview the reporting decision, but it cannot contact a bank, create a dispute, or request a refund.</p></div><div class="review-list" style="margin-top:18px"><div class="review-row"><span>Merchant</span><strong>${t.merchant}</strong></div><div class="review-row"><span>Amount</span><strong>${euro(-t.amount, true)}</strong></div><div class="review-row"><span>Card</span><strong>${t.card}</strong></div><div class="review-row"><span>Location</span><strong>${t.location}</strong></div><div class="review-row"><span>Reference</span><strong class="mono">${t.id}</strong></div></div><section class="section" style="margin-top:18px"><div class="section-head"><h2>What happens next</h2></div><p class="meta" style="max-width:62ch">Your bank would ask for a reason and supporting details. This preview stops before submission.</p></section><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=report-transaction&state=handoff">Preview bank handoff requirements</a><a class="btn btn-secondary" href="app.html?screen=transaction-detail">Cancel and go back</a></div></section></main>`;
    return shell(main);
  }

  function renderCards(forceFrozen = false) {
    const frozen = isFrozen(forceFrozen);
    const main = `<main id="main" class="main-wrap" tabindex="-1">${pageHeader('Cards', 'One card object, clear state, then the controls that change what it can do.')}<div class="card-grid"><section><div class="card-object ${frozen ? 'frozen' : ''}" aria-label="Ledger debit card ending 4821, ${frozen ? 'frozen' : 'active'}"><div class="card-top"><span class="card-brand">Ledger / DEBIT</span><span class="card-chip" aria-hidden="true"></span></div><div class="card-number">•••• &nbsp;•••• &nbsp;•••• &nbsp;4821</div><div class="card-bottom"><div><small>Cardholder</small><strong>${DATA.profile.name}</strong></div><div><small>Expires</small><strong>09/29</strong></div></div></div><div class="card-state"><span class="status ${frozen ? 'status-neutral' : 'status-success'}">${frozen ? 'Frozen' : 'Active'}</span><span class="meta">Virtual prototype card · no network mark</span></div></section><section class="card-quick"><p class="eyebrow">Protection first</p><h2>Quick controls</h2><p>${frozen ? 'Your preferences are saved, but the card stays blocked until you authenticate and unfreeze.' : 'Pause the card instantly or adjust payment channels without leaving this screen.'}</p><div class="control-list"><div class="control-row"><div><strong>${frozen ? 'Unfreeze card' : 'Freeze card'}</strong><p>${frozen ? 'Restore new card payments after authentication.' : 'Pause new payments and ATM withdrawals.'}</p></div><button class="btn ${frozen ? 'btn-primary' : 'btn-risk'}" id="card-freeze-toggle">${frozen ? 'Unfreeze' : 'Freeze'}</button></div><div class="control-row"><div><strong>Online payments</strong><p>Allow purchases where the card is not physically present.</p></div><label class="switch"><span class="sr-only">Online payments</span><input type="checkbox" checked data-control="Online payments"><span></span></label></div><div class="control-row"><div><strong>Contactless</strong><p>Tap-to-pay at supported terminals.</p></div><label class="switch"><span class="sr-only">Contactless</span><input type="checkbox" checked data-control="Contactless"><span></span></label></div></div><a class="text-link" href="app.html?screen=card-controls" style="margin-top:12px">All card controls ${icon('arrow')}</a></section></div><section class="section"><div class="section-head"><h2>Recent card activity</h2><a class="text-link" href="app.html?screen=activity">All activity ${icon('arrow')}</a></div>${transactionRows(5, true)}</section></main>`;
    return shell(main);
  }

  function renderCardControls() {
    const frozen = isFrozen();
    const controls = [['Online payments', 'Allow card-not-present purchases.', true], ['Contactless', 'Allow tap-to-pay transactions.', true], ['Cash withdrawals', 'Allow ATM cash withdrawals.', true], ['Magstripe', 'Use only when chip/contactless are unavailable.', false]];
    const main = `<main id="main" class="main-wrap card-controls-page" tabindex="-1">${pageHeader('Card controls', 'Manage payment preferences and daily limits for your demo card.', 'app.html?screen=cards')}${frozen ? '<div class="callout callout-warning"><strong>Card is frozen</strong><p>Control preferences are saved, but new card payments remain blocked until you unfreeze.</p></div>' : ''}<section class="section"><div class="control-list">${controls.map(([name, description, on]) => `<div class="control-row"><div><strong>${name}</strong><p>${description}</p></div><label class="switch"><span class="sr-only">${name}</span><input type="checkbox" ${on ? 'checked' : ''} data-control="${name}"><span></span></label></div>`).join('')}</div></section><section class="section"><div class="section-head"><h2>Daily card limit</h2></div><div class="field"><label for="daily-limit">Card purchases</label><input class="input" id="daily-limit" inputmode="decimal" value="1200"><span class="field-hint">€ per day · Prototype setting</span></div><button class="btn btn-primary" data-toast="Daily limit saved in the prototype.">Save limit</button></section></main>`;
    return shell(main);
  }

  function renderTransferRecipient() {
    const main = `<main id="main" class="main-wrap task-shell" tabindex="-1">${pageHeader('Send money', 'Choose who receives the money. Ledger keeps recipient identity visible through review.')}${stepper(1)}<section class="task-panel"><p class="eyebrow">Step 1 · Recipient</p><h2>Who are you paying?</h2><div class="search-wrap"><span class="search-icon">${icon('search')}</span><label class="sr-only" for="recipient-search">Search recipient</label><input class="input" id="recipient-search" type="search" placeholder="Search name or account"></div><div class="section-head" style="margin-top:22px"><h2>Recent</h2></div><a class="recipient-card" href="app.html?screen=transfer-amount"><span class="avatar" aria-hidden="true">MC</span><span><strong>${DATA.recipient.name}</strong><span>${DATA.recipient.bank}, ${DATA.recipient.account}</span></span><span style="margin-left:auto">${icon('arrow')}</span></a><button class="btn btn-secondary" style="margin-top:18px" data-toast="New-recipient verification is outside this portfolio flow.">${icon('plus')} Add new recipient</button></section></main>`;
    return shell(main);
  }

  function renderTransferAmount() {
    const main = `<main id="main" class="main-wrap task-shell" tabindex="-1">${pageHeader('How much?', 'Enter the amount, then inspect what remains safe before review.', 'app.html?screen=transfer-recipient')}${stepper(2)}<div class="transfer-grid"><section class="task-panel"><p class="eyebrow">Step 2 · Amount</p><h2>Send to ${DATA.recipient.name}</h2><div class="recipient-card"><span class="avatar" aria-hidden="true">MC</span><span><strong>${DATA.recipient.name}</strong><span>${DATA.recipient.account}</span></span></div><form id="amount-form" style="margin-top:22px"><div class="field"><label for="amount">Amount</label><div class="amount-field"><span class="currency-prefix" aria-hidden="true">€</span><input class="input amount-input" id="amount" name="amount" type="number" min="1" step="0.01" value="145" aria-describedby="amount-help amount-error"></div><span id="amount-help" class="field-hint">Available balance ${euro(DATA.account.balance)} · Protected buffer is never pulled automatically.</span><span id="amount-error" class="field-error" hidden></span></div><div class="field"><label for="note">Reference</label><input class="input" id="note" value="${DATA.recipient.reference}"></div><button class="btn btn-primary btn-wide" type="submit">Review transfer ${icon('arrow')}</button></form></section><aside class="impact-panel"><p class="eyebrow">Impact preview</p><h2>Money after sending</h2>${horizon(true, DATA.recipient.afterSafe)}</aside></div></main>`;
    return shell(main);
  }

  function renderTransferReview(options = {}) {
    const offline = !!options.offline; const biometricFailed = !!options.biometricFailed;
    const amount = Number(storageGet('nova_transfer_amount', String(DATA.recipient.amount))) || DATA.recipient.amount;
    const afterSafe = DATA.account.safe - amount;
    const main = `<main id="main" class="main-wrap task-shell" tabindex="-1">${pageHeader('Review transfer', 'Nothing moves until you confirm after this review.', 'app.html?screen=transfer-amount')}${stepper(3)}<div class="transfer-grid"><section class="task-panel"><p class="eyebrow">Step 3 · Review</p><h2>Check every detail</h2><div class="review-list"><div class="review-row"><span>Recipient</span><strong>${DATA.recipient.name}<br><span class="meta">${DATA.recipient.account}</span></strong></div><div class="review-row review-total"><span>Amount</span><strong>${euro(amount)}</strong></div><div class="review-row"><span>Fee</span><strong>${euro(DATA.recipient.fee)}</strong></div><div class="review-row"><span>Safe after transfer</span><strong>${euro(afterSafe, afterSafe < 0)}</strong></div><details class="nova-calculation"><summary>How it’s calculated</summary>${detailRows([['Safe to spend',euro(DATA.account.safe)],['Transfer',euro(-amount,true)],['Fee',euro(DATA.recipient.fee)],['After transfer',euro(afterSafe, afterSafe < 0)]])}</details><div class="review-row"><span>Expected arrival</span><strong>${DATA.recipient.arrival}<br><span class="meta">Prototype scenario</span></strong></div><div class="review-row"><span>Reference</span><strong>${DATA.recipient.reference}</strong></div></div>${biometricFailed ? '<div class="callout callout-risk" style="margin-top:18px"><strong>Biometric verification failed — transfer not submitted</strong><p>Your identity check did not complete. No money moved and your balance is unchanged. Try biometrics again or use your passcode.</p></div>' : ''}${offline ? '<div class="callout callout-warning" style="margin-top:18px"><strong>Reconnect to continue</strong><p>Your review is preserved. Ledger will revalidate the balance before you can confirm again.</p></div>' : ''}<div class="action-stack">${biometricFailed ? '<button class="btn btn-primary" id="use-passcode">Use passcode</button><button class="btn btn-secondary" id="retry-biometric">Try biometrics again</button>' : `<button class="btn btn-primary" id="confirm-transfer" ${offline ? 'disabled aria-disabled="true" title="Reconnect to continue"' : ''}>${icon('lock')} Confirm with biometrics</button><a class="btn btn-secondary" href="app.html?screen=transfer-amount">Edit transfer</a>`}</div></section><aside class="impact-panel"><p class="eyebrow">After confirmation</p><h2>After this transfer</h2><div class="goal-amount" >${euro(afterSafe)}</div><p>Safe to spend after sending.</p>${horizon(true, afterSafe)}</aside></div></main>`;
    return shell(main, { offline });
  }

  function renderTransferSuccess() {
    const main = `<main id="main" class="main-wrap" tabindex="-1"><section class="receipt"><div class="receipt-mark">${icon('check')}</div><p class="eyebrow">Simulated transfer</p><h1>Transfer prepared</h1><p>This portfolio prototype simulates a successful confirmation. No real money moved.</p><div class="receipt-sheet"><div class="review-row"><span>To</span><strong>${DATA.recipient.name}</strong></div><div class="review-row"><span>Amount</span><strong>${euro(DATA.recipient.amount)}</strong></div><div class="review-row"><span>Reference</span><strong>${DATA.recipient.reference}</strong></div><div class="review-row"><span>Prototype receipt</span><strong class="mono">NVA-TX-0915-2048</strong></div></div><div class="action-stack" style="max-width:520px;margin:20px auto 0"><a class="btn btn-primary" href="app.html?screen=home">Done</a><button class="btn btn-secondary" data-toast="Receipt sharing is simulated in this prototype.">Share receipt</button></div></section></main>`;
    return shell(main);
  }

  function renderSavings() {
    const pct = Math.round((DATA.goal.current / DATA.goal.target) * 100);
    const main = `<main id="main" class="main-wrap" tabindex="-1"><section class="goal-hero"><div class="goal-topline"><div><p class="eyebrow">Save · Primary goal</p><span class="status status-success">${DATA.goal.status}</span></div><span class="prototype-label">Simulated</span></div><h1>${DATA.goal.name}</h1><div class="goal-amount">${euro(DATA.goal.current)}</div><div class="money-sub"><span>Target ${euro(DATA.goal.target)}</span><span>${pct}% complete</span><span>${euro(DATA.goal.target - DATA.goal.current)} remaining</span></div><div class="goal-timeline"><div class="goal-timeline-fill"></div><div class="goal-timeline-points"><div class="goal-point"><strong>Started</strong><span>Jan 2026</span></div><div class="goal-point"><strong>Today</strong><span>${euro(DATA.goal.current)}</span></div><div class="goal-point future"><strong>Next</strong><span>${DATA.goal.next} · ${euro(DATA.goal.contribution)}</span></div><div class="goal-point future"><strong>Target</strong><span>${euro(DATA.goal.target)}</span></div></div></div></section><div class="page-grid has-context"><div><section class="section"><div class="section-head"><h2>Contribution plan</h2><a class="text-link" href="app.html?screen=savings-detail">Adjust ${icon('arrow')}</a></div><div class="goal-ledger"><div class="goal-ledger-row"><span>Planned monthly contribution</span><strong>${euro(DATA.goal.contribution)}</strong></div><div class="goal-ledger-row"><span>Next contribution</span><strong>${DATA.goal.next}</strong></div><div class="goal-ledger-row"><span>Treatment in Money Horizon</span><strong>Committed</strong></div></div></section><section class="section"><div class="section-head"><h2>Why this goal matters now</h2></div><p class="meta" style="max-width:62ch">Ledger keeps goal contributions inside the same cash-flow context as bills so saving does not become an invisible promise that competes with everyday spending.</p></section></div><aside class="context-rail">${horizon(true)}</aside></div></main>`;
    return shell(main);
  }

  function renderSavingsDetail() {
    const goal = DATA.goals.find(item => item.id === (params.get('goal') || 'emergency'));
    if (!goal) return missingDetail('app.html?screen=savings');
    const percent = Math.round(goal.current / goal.target * 100);
    return shell(`<main id="main" class="main-wrap task-shell savings-detail-page" tabindex="-1" data-goal="${goal.id}">${pageHeader(goal.name, '', 'app.html?screen=savings')}<div class="savings-detail-grid"><section class="task-panel"><p class="eyebrow">${percent}% saved</p><div class="goal-amount">${euro(goal.current)}</div><p class="meta">${euro(goal.target)} target · ${euro(goal.target - goal.current)} to go</p><div class="progress" role="progressbar" aria-label="${goal.name}" aria-valuemin="0" aria-valuemax="${goal.target}" aria-valuenow="${goal.current}"><span style="width:${percent}%"></span></div><div class="field"><label for="contribution">Monthly contribution</label><input class="input" id="contribution" type="text" inputmode="decimal" value="${goal.contribution}"><span class="field-hint">Preview only. No money moves.</span></div><button class="btn btn-primary" id="save-contribution">Preview change</button></section><section class="section savings-allocation">${horizon()}</section></div></main>`);
  }

  function renderSubscriptions() {
    const rows = [['Mobile plan', 'Sep 22', 32, 'Monthly'], ['Streaming service', 'Sep 24', 14.99, 'Monthly'], ['River Gym', 'Oct 02', 34, 'Monthly']];
    const monthly = rows.reduce((sum, row) => sum + row[2], 0);
    const main = `<main id="main" class="main-wrap subscriptions-page" tabindex="-1"><header class="v3-page-head"><div><h1>Subscriptions</h1></div></header><div class="subscription-layout"><aside class="subscription-summary"><section class="recurring-total"><div><p class="eyebrow">Monthly total</p><span class="meta">${rows.length} subscriptions</span></div><strong>${euro(monthly)}</strong><p class="subscription-next-date">Next payment <b>${rows[0][1]}</b></p></section><details class="subscription-help"><summary>Blocking is not cancellation</summary><p>To end a subscription, cancel with the merchant. Freezing a card does not cancel it.</p></details></aside><section class="section subscription-schedule"><div class="section-head"><h2>Next payments</h2><span class="meta">Upcoming</span></div><div class="ledger">${rows.map(([name, date, amount, cycle]) => `<a class="ledger-row" href="app.html?screen=payment-detail&payment=${transactionId(name)}"><div class="ledger-date">${date}</div><div><div class="list-title">${name}</div><div class="list-sub">${cycle}</div></div><div class="list-value">${euro(-amount, true)}<small>scheduled</small></div><span class="chevron" aria-hidden="true"></span></a>`).join('')}</div></section></div></main>`;
    return shell(main);
  }

  function renderSecurity() {
    const main = `<main id="main" class="main-wrap" tabindex="-1">${pageHeader('Security center', 'High-consequence settings are explicit, reversible where possible, and explain what they protect.')}<section class="security-summary"><div class="security-state">${icon('shield')}<span>Core protections enabled</span></div><h2>Your account uses biometrics for sensitive prototype actions</h2><p class="meta" style="margin:0">No real credential or device trust is connected in this portfolio build.</p></section><section class="section"><div class="section-head"><h2>Protection checklist</h2><span class="meta">3 settings</span></div><div class="control-list"><div class="control-row"><div><strong>Biometric confirmation</strong><p>Confirm transfers and card-security changes with device biometrics.</p></div><label class="switch"><span class="sr-only">Biometric confirmation</span><input type="checkbox" checked data-control="Biometric confirmation"><span></span></label></div><div class="control-row"><div><strong>Hide sensitive notification previews</strong><p>Show a private alert instead of merchant and amount.</p></div><label class="switch"><span class="sr-only">Hide sensitive notification previews</span><input type="checkbox" data-control="Sensitive previews"><span></span></label></div><div class="control-row"><div><strong>Login alerts</strong><p>Notify when a new device signs in.</p></div><label class="switch"><span class="sr-only">Login alerts</span><input type="checkbox" checked data-control="Login alerts"><span></span></label></div></div></section><section class="section"><div class="section-head"><h2>Account access</h2></div><div class="action-stack"><button class="btn btn-secondary" data-toast="Passcode change is simulated in this prototype.">${icon('lock')} Change passcode</button><button class="btn btn-secondary" data-toast="Device management is a prototype entry point.">${icon('device')} Trusted devices</button></div></section><section class="section"><div class="callout callout-risk"><strong>Lost access?</strong><p>Freeze the card separately from account-access recovery. The prototype keeps these consequences distinct.</p></div></section></main>`;
    return shell(main);
  }

  function renderNotifications() {
    const rent = DATA.commitments[0];
    const notices = [
      { id: 'payment', title: 'Review card payment', subtitle: `${euro(DATA.suspicious.amount)} at ${DATA.suspicious.merchant}`, glyph: 'alert', category: 'Needs action', heading: DATA.suspicious.merchant, amount: euro(-DATA.suspicious.amount, true), description: 'Check this payment before deciding whether to report it.', rows: [['Date', DATA.suspicious.timestamp], ['Payment method', `Nova debit ${DATA.suspicious.card}`], ['Status', DATA.suspicious.status], ['Location', DATA.suspicious.location]], note: DATA.suspicious.reasons.join('. ') + '.', href: transactionHref(DATA.suspicious.merchant), action: 'Review payment' },
      { id: 'rent', title: 'Rent is due in 5 days', subtitle: `${euro(rent[2])} · ${rent[1]}`, glyph: 'calendar', category: 'Planning updates', heading: rent[0], amount: euro(-rent[2], true), description: 'This bill is already included in your spending plan.', rows: [['Due date', rent[1]], ['Type', rent[3]], ['Account', 'Personal account'], ['Plan', 'Included in safe to spend']], note: 'Review the planned payment to see how it affects your balance.', href: 'app.html?screen=payment-detail&payment=apartment-rent', action: 'View payment' },
      { id: 'savings', title: 'Emergency buffer on track', subtitle: `${euro(DATA.goal.contribution)} planned · ${DATA.goal.next}`, glyph: 'goal', category: 'Planning updates', heading: DATA.goal.name, amount: euro(DATA.goal.current), description: 'Your next contribution is included in your spending plan.', rows: [['Target', euro(DATA.goal.target)], ['Next contribution', euro(DATA.goal.contribution)], ['Scheduled for', DATA.goal.next], ['Status', DATA.goal.status]], note: 'Open your goal to review progress and contribution options.', href: 'app.html?screen=savings-detail&goal=emergency', action: 'View goal' }
    ];
    const selected = notices.find(item => item.id === params.get('notification')) || notices[0];
    const list = notices.map((item, index) => `${index === 0 || notices[index - 1].category !== item.category ? `<h3 class="notification-group-label">${item.category}</h3>` : ''}<a class="notification-item ${item.id === selected.id ? 'is-selected' : ''}" href="${item.href}" data-notification-preview="${item.id}" ${item.id === selected.id ? 'aria-current="true"' : ''}><span class="notification-item-body"><span class="list-icon">${icon(item.glyph)}</span><span><strong>${item.title}</strong><small>${item.subtitle}</small></span>${icon('arrow')}</span></a>`).join('');
    return shell(`<main id="main" class="main-wrap notifications-page" tabindex="-1"><header class="v3-page-head"><div><h1 class="notification-page-title">Notifications</h1></div></header><div class="notification-inbox"><nav class="notification-list" aria-label="Notifications"><h2 class="sr-only">Inbox</h2>${list}<a class="notification-preferences" href="app.html?screen=settings">Notification settings ${icon('arrow')}</a></nav><section class="notification-preview" aria-labelledby="notification-title"><div class="notification-preview-head"><span>${selected.category}</span><h2 id="notification-title">${selected.heading}</h2><strong class="notification-amount">${selected.amount}</strong><p>${selected.description}</p></div>${detailRows(selected.rows)}<div class="notification-next"><p>${selected.note}</p><a class="btn btn-primary" href="${selected.href}">${selected.action} ${icon('arrow')}</a></div></section></div></main>`);
  }

  function renderOnboarding() {
    const main = `<main id="main" class="main-wrap" tabindex="-1" data-whitespace="Focused onboarding ends after its entry actions"><section class="onboarding-hero" data-whitespace="Focused introduction ends after the two entry actions"><div class="onboarding-copy"><p class="eyebrow">Ledger · Personal Banking & Money Health</p><h1>See what is truly safe to spend.</h1><p>See what remains after bills, savings and your protected buffer.</p></div><div class="onboarding-art" aria-hidden="true"><div class="onboarding-horizon"><span></span><span></span><span></span></div></div><div class="onboarding-actions"><div class="callout"><strong>Portfolio prototype</strong><p>Identity checks, balances and money movement are simulated. No real banking service is connected.</p></div><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=kyc">Get started ${icon('arrow')}</a><a class="btn btn-secondary" href="app.html?screen=home">Explore demo account</a></div></div></section></main>`;
    return shell(main);
  }

  function renderKyc() {
    const state = new URLSearchParams(location.search).get('state') || 'intro';
    const stateContent = {
      intro: `<p class="eyebrow">Before capture</p><h2>Prepare one valid photo ID</h2><p>Use good lighting and keep your ID flat.</p><div class="callout"><strong>Why Ledger asks</strong><p>This prototype represents identity verification but does not submit or verify identity data.</p></div><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=kyc&state=capture">Continue to ID check</a><button class="btn btn-secondary" data-toast="Help and alternate verification are prototype entry points.">I need help</button></div>`,
      capture: `<p class="eyebrow">Document capture</p><h2>Keep every edge visible</h2><p>Move away from direct light and avoid glare across the document number.</p><div class="kyc-capture"><div class="capture-frame"><div>${icon('id')}<strong>Position your ID inside the frame</strong><p>All four edges · sharp text · no reflection</p></div></div></div><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=kyc&state=review">Use this capture</a><a class="btn btn-secondary" href="app.html?screen=kyc&state=failed">Simulate quality issue</a></div>`,
      failed: `<p class="eyebrow">Capture needs attention</p><h2>Remove glare, then try again</h2><div class="callout callout-risk"><strong>We couldn’t read the document clearly</strong><p>The image was too reflective around the document number. Move away from direct light and keep the card flat.</p></div><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=kyc&state=capture">Try again</a><a class="btn btn-secondary" href="app.html?screen=kyc&state=manual">Request another verification option</a></div>`,
      manual: `<p class="eyebrow">Alternative path</p><h2>Manual review requested</h2><div class="callout"><strong>No identity data was submitted</strong><p>A real service would explain expected timing and support options here. This prototype only demonstrates the recovery path.</p></div><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=home">Continue demo</a><a class="btn btn-secondary" href="app.html?screen=kyc&state=capture">Back to capture</a></div>`,
      review: `<p class="eyebrow">Review before submission</p><h2>Check the extracted identity details</h2><div class="callout callout-success"><strong>Capture ready for review</strong><p>In production, editable extracted fields would appear before submission.</p></div><dl class="detail-grid" style="margin-top:16px"><div class="detail-row"><dt>Name</dt><dd>Lina Moreau</dd></div><div class="detail-row"><dt>Date of birth</dt><dd>14 Apr 2001</dd></div><div class="detail-row"><dt>Document</dt><dd>Sample ID •••• 7231</dd></div><div class="detail-row"><dt>Status</dt><dd>SIMULATED</dd></div></dl><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=home">Submit demo & continue</a><a class="btn btn-secondary" href="app.html?screen=kyc&state=capture">Retake</a></div>`
    };
    const steps = { intro: 1, capture: 2, failed: 2, manual: 3, review: 3 }; const step = steps[state] || 1;
    const main = `<main id="main" class="main-wrap kyc-page" tabindex="-1">${pageHeader('Verify your identity', 'Prepare a photo ID to try the demo identity check.', 'app.html?screen=onboarding')}<div class="kyc-layout"><aside class="kyc-spine" aria-label="Identity verification progress"><p class="eyebrow">Progress</p><h2>Step ${step} of 3</h2><ol>${['Prepare', 'Capture ID', 'Review'].map((label, index) => `<li class="${index + 1 < step ? 'done' : index + 1 === step ? 'is-current' : ''}" ${index + 1 === step ? 'aria-current="step"' : ''}>${label}</li>`).join('')}</ol><p class="meta">No real identity verification occurs.</p></aside><section class="document-sheet">${stateContent[state] || stateContent.intro}</section></div></main>`;
    return shell(main);
  }

  function renderError() {
    const main = `<main id="main" class="main-wrap" tabindex="-1"><section class="empty-state"><div class="empty-mark">${icon('alert')}</div><h1>Transfer not completed</h1><p>Review the amount and try again.</p><div class="action-stack" style="max-width:460px;margin:20px auto 0"><a class="btn btn-primary" href="app.html?screen=transfer-review">Review again</a><a class="btn btn-secondary" href="app.html?screen=home">Return home</a></div></section></main>`;
    return shell(main);
  }

  function openDialog({ title, body, primaryLabel = 'Continue', primaryClass = 'btn-primary', onPrimary, beforePrimary, secondaryLabel = 'Cancel', onSecondary }) {
    const lastFocus = document.activeElement; const backdrop = document.createElement('div'); backdrop.className = 'dialog-backdrop';
    backdrop.innerHTML = `<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabindex="-1"><h2 id="dialog-title">${title}</h2>${body}<div class="dialog-actions"><button class="btn ${primaryClass}" data-primary>${primaryLabel}</button>${secondaryLabel ? `<button class="btn btn-secondary" data-secondary>${secondaryLabel}</button>` : ''}</div></div>`;
    document.body.appendChild(backdrop); const dialog = backdrop.querySelector('.dialog'); const primary = backdrop.querySelector('[data-primary]'); const secondary = backdrop.querySelector('[data-secondary]');
    const close = () => { backdrop.remove(); document.removeEventListener('keydown', keyHandler); if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus(); };
    const keyHandler = event => { if (event.key === 'Escape') { event.preventDefault(); close(); return; } if (event.key === 'Tab') { const focusable = [...backdrop.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')]; const first = focusable[0]; const last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } };
    document.addEventListener('keydown', keyHandler); primary.addEventListener('click', () => { if (beforePrimary && beforePrimary(dialog) === false) return; close(); if (onPrimary) onPrimary(); }); secondary?.addEventListener('click', () => { close(); if (onSecondary) onSecondary(); }); backdrop.addEventListener('mousedown', event => { if (event.target === backdrop) close(); }); dialog.focus();
  }

  function toast(message) {
    document.querySelector('.toast')?.remove(); const node = document.createElement('div'); node.className = 'toast'; node.setAttribute('role', 'status'); node.textContent = message; document.body.appendChild(node); setTimeout(() => node.remove(), 3200);
  }

  function bindInteractions() {
    document.querySelectorAll('[data-notification-preview]').forEach(link => link.addEventListener('click', event => {
      if (!matchMedia('(min-width:1024px)').matches || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      location.href = `app.html?screen=notifications&notification=${link.dataset.notificationPreview}`;
    }));
    document.querySelectorAll('[data-toast]').forEach(element => element.addEventListener('click', event => { if (element.getAttribute('href') === '#') event.preventDefault(); toast(element.dataset.toast); }));
    document.querySelectorAll('[data-control]').forEach(input => input.addEventListener('change', () => toast(`${input.dataset.control} ${input.checked ? 'enabled' : 'disabled'} · prototype state.`)));
    document.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => { document.querySelectorAll('.chip').forEach(candidate => candidate.setAttribute('aria-pressed', 'false')); chip.setAttribute('aria-pressed', 'true'); toast(`${chip.textContent.trim()} filter applied in the prototype.`); }));

    const freeze = document.querySelector('#freeze-card');
    if (freeze) freeze.addEventListener('click', () => openDialog({ title: 'Freeze card ending 4821?', body: '<p>This is reversible. New card payments and ATM withdrawals will be blocked.</p><ul class="dialog-list"><li>Already-authorized or offline payments can still settle.</li><li>Refunds can still return to your account.</li><li>Freezing does not cancel a merchant subscription.</li></ul>', primaryLabel: 'Freeze card', primaryClass: 'btn-risk', onPrimary: () => { storageSet('nova_card_frozen', 'true'); toast('Card frozen. New card payments and ATM withdrawals are blocked.'); setTimeout(() => { location.href = 'app.html?screen=transaction-detail'; }, 350); } }));

    const toggle = document.querySelector('#card-freeze-toggle');
    if (toggle) toggle.addEventListener('click', () => { const frozen = isFrozen(); openDialog({ title: frozen ? 'Unfreeze card?' : 'Freeze card?', body: `<p>${frozen ? 'New card payments will be restored after this simulated authentication.' : 'New card payments and ATM withdrawals will be blocked. Already-authorized payments can still settle.'}</p>`, primaryLabel: frozen ? 'Authenticate & unfreeze' : 'Freeze card', primaryClass: frozen ? 'btn-primary' : 'btn-risk', onPrimary: () => { storageSet('nova_card_frozen', String(!frozen)); toast(frozen ? 'Card active again.' : 'Card frozen.'); setTimeout(() => { location.href = 'app.html?screen=cards'; }, 300); } }); });

    const amountForm = document.querySelector('#amount-form');
    if (amountForm) amountForm.addEventListener('submit', event => { event.preventDefault(); const input = amountForm.querySelector('#amount'); const error = amountForm.querySelector('#amount-error'); const value = Number(input.value); if (!value || value <= 0) { input.setAttribute('aria-invalid', 'true'); error.hidden = false; error.textContent = 'Enter an amount greater than €0.'; input.focus(); return; } if (value > DATA.account.balance) { input.setAttribute('aria-invalid', 'true'); error.hidden = false; error.textContent = `You need ${euro(value - DATA.account.balance)} more to send this amount.`; input.focus(); return; } input.removeAttribute('aria-invalid'); error.hidden = true; storageSet('nova_transfer_amount', value); location.href = 'app.html?screen=transfer-review'; });

    const confirm = document.querySelector('#confirm-transfer');
    if (confirm) confirm.addEventListener('click', () => openDialog({ title: 'Confirm with biometrics', body: '<p>A real mobile app would now invoke the device biometric prompt. Choose a prototype outcome to inspect the flow.</p><p class="prototype-label">Prototype control</p>', primaryLabel: 'Approve demo', onPrimary: () => { location.href = 'app.html?screen=transfer-success'; }, secondaryLabel: 'Simulate failure', onSecondary: () => { location.href = 'app.html?screen=biometric-failed'; } }));

    const retry = document.querySelector('#retry-biometric'); if (retry) retry.addEventListener('click', () => { location.href = 'app.html?screen=transfer-review'; });
    const passcode = document.querySelector('#use-passcode'); if (passcode) passcode.addEventListener('click', () => openDialog({ title: 'Passcode fallback', body: '<p>Fallback preserves the task when biometrics fail.</p><div class="field"><label for="demo-passcode">Prototype passcode</label><input id="demo-passcode" class="input" inputmode="numeric" value="4821" aria-describedby="passcode-hint"><span id="passcode-hint" class="field-hint">Demo only. No credential is stored.</span></div>', primaryLabel: 'Confirm demo passcode', onPrimary: () => { location.href = 'app.html?screen=transfer-success'; } }));
    const contribution = document.querySelector('#save-contribution'); if (contribution) contribution.addEventListener('click', () => { const field = document.querySelector('#contribution'); const next = Number(field?.value || DATA.goal.contribution); toast(`Preview: ${euro(next)} monthly. Money Horizon would recompose before any real money movement.`); });
  }

  function render() {
    const renderScreen = screens[currentScreen] || screens.home; app.innerHTML = renderScreen(); document.title = `Ledger — ${currentScreen.replaceAll('-', ' ')} · Personal Banking`; bindInteractions();
  }

  // Shared product data/composition seam for deterministic capture surfaces.
  // Export pages consume these owners; they never copy the financial model.
  window.NovaProduct = Object.freeze({
    data: DATA,
    components: Object.freeze({ accountActions, icon, euro, horizon, commitmentRows, transactionRows, pageHeader, stepper, transactionHref, transactionId, detailRows, openDialog, escapeHtml })
  });
  render();
})();
