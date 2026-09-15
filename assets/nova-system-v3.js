(() => {
  'use strict';

  const screen = new URLSearchParams(location.search).get('screen') || 'home';
  const $ = (selector, root = document) => root.querySelector(selector);
  const svg = (path) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  const icons = {
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
    bell: svg('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 19h4"/>'),
    shield: svg('<path d="M12 3 5 6v5c0 4.5 2.8 8.3 7 10 4.2-1.7 7-5.5 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7L15 10"/>'),
    gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V21h-4v-.08A1.7 1.7 0 0 0 8.97 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15.03 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.6 8.97a1.7 1.7 0 0 0-.34-1.88l-.06-.06L7.03 4.2l.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 10 3.08V3h4v.08a1.7 1.7 0 0 0 1.03 1.52 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"/>'),
    card: svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/>'),
    lock: svg('<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),
    phone: svg('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10 18h4"/>'),
    globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>'),
    eye: svg('<path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.5"/>'),
    arrow: svg('<path d="M5 12h14"/><path d="m14 7 5 5-5 5"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    check: svg('<path d="m5 12 4 4L19 6"/>'),
    trend: svg('<path d="m4 16 5-5 4 4 7-8"/><path d="M15 7h5v5"/>'),
    cash: svg('<rect x="3" y="6" width="18" height="12" rx="3"/><circle cx="12" cy="12" r="2.5"/><path d="M7 9H6v1M17 15h1v-1"/>'),
    wifi: svg('<path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M11 18.5a2 2 0 0 1 2 0"/>'),
    target: svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>'),
    calendar: svg('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/>'),
    user: svg('<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>')
  };

  function repairChrome() {
    const actions = $('.ios26-nav-actions');
    if (actions) {
      actions.innerHTML = `
        <a class="nova-search-chip v3-search" href="app.html?screen=activity" aria-label="Search transactions">${icons.search}<span>Search anything…</span></a>
        <a class="nova-bell-chip v3-bell" href="app.html?screen=notifications" aria-label="Notifications">${icons.bell}<i aria-hidden="true"></i></a>
        <a class="nova-profile-chip v3-profile" href="app.html?screen=settings" aria-label="Open profile and settings"><span class="nova-avatar">AN</span><span><small>Good morning</small><strong>Alex</strong></span><b aria-hidden="true">⌄</b></a>`;
    }

    const rail = $('.sidebar');
    if (rail) {
      rail.classList.add('nova-rail-v3');
      const sideBottom = $('.side-bottom', rail);
      if (sideBottom) {
        sideBottom.innerHTML = `<nav class="side-nav v3-bottom-nav">
          <a href="app.html?screen=security" class="${screen === 'security' ? 'active' : ''}" ${screen === 'security' ? 'aria-current="page"' : ''}>${icons.shield}<span>Security</span></a>
          <a href="app.html?screen=settings" class="${screen === 'settings' ? 'active' : ''}" ${screen === 'settings' ? 'aria-current="page"' : ''}>${icons.gear}<span>Settings</span></a>
        </nav>`;
      }
    }

    document.querySelectorAll('.nova-top-tabs a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      const map = screen === 'cards' || screen.startsWith('card-') ? 'cards' : screen.startsWith('saving') ? 'savings' : screen;
      if (href.includes(`screen=${map}`)) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function pageHead(title, eyebrow, description, extra = '') {
    return `<header class="v3-page-head"><div><p>${eyebrow}</p><h1>${title}</h1><span>${description}</span></div>${extra}</header>`;
  }

  function renderCards() {
    return `<main id="main" class="main-wrap v3-page v3-cards-page" tabindex="-1">
      ${pageHead('Cards', 'Wallet', 'Manage the card you carry, payment methods, limits and security from one place.', '<a class="v3-pill-btn" href="app.html?screen=card-controls">All controls →</a>')}
      <div class="v3-cards-layout">
        <section class="v3-surface v3-card-showcase" aria-label="Nova debit card">
          <div class="v3-bank-card">
            <div class="v3-bank-top"><span class="v3-bank-brand"><img src="assets/nova-mark.svg" alt="">Nova</span><span class="v3-debit">DEBIT</span></div>
            <div class="v3-chip-line"><span class="v3-emv" aria-hidden="true"></span><span class="v3-contactless" aria-hidden="true">)))</span></div>
            <div class="v3-pan" id="v3-pan">•••• &nbsp;•••• &nbsp;•••• &nbsp;4821</div>
            <div class="v3-bank-bottom"><div><small>CARDHOLDER</small><strong>Alex Nguyen</strong></div><div><small>VALID THRU</small><strong>09/29</strong></div><span class="v3-network" aria-label="Card network"><i></i><b></b></span></div>
          </div>
          <div class="v3-card-summary">
            <div><span class="v3-status live">● Active</span><strong>Everyday debit</strong><small>Linked to Current Account •••• 4421</small></div>
            <button class="v3-primary-action" type="button" data-v3-reveal>${icons.eye}<span>Show details</span></button>
          </div>
        </section>

        <section class="v3-surface v3-card-balance"><div class="v3-section-title"><div><small>Available to spend</small><h2>€1,300.00</h2></div><span class="v3-icon blue">${icons.card}</span></div><div class="v3-stat-grid"><div><small>Spent this month</small><strong>€620</strong><span>62% of €1,000 limit</span></div><div><small>Cash withdrawals</small><strong>€120</strong><span>€380 left this month</span></div></div><div class="v3-meter"><span style="width:62%"></span></div></section>

        <section class="v3-surface v3-card-actions"><div class="v3-section-title"><div><small>Card controls</small><h2>Use it your way</h2></div><span class="v3-status safe">Protected</span></div><div class="v3-action-grid">
          <button class="v3-action-tile danger" type="button" data-v3-freeze>${icons.lock}<strong>Freeze card</strong><span>Pause new payments instantly</span></button>
          <button class="v3-action-tile blue" type="button" data-v3-toggle="Online payments">${icons.globe}<strong>Online payments</strong><span>Enabled</span></button>
          <button class="v3-action-tile mint" type="button" data-v3-toggle="Contactless">${icons.wifi}<strong>Contactless</strong><span>Enabled</span></button>
          <button class="v3-action-tile yellow" type="button" data-v3-toggle="Cash withdrawals">${icons.cash}<strong>Cash withdrawals</strong><span>Enabled</span></button>
        </div></section>

        <section class="v3-surface v3-wallet-card"><div class="v3-section-title"><div><small>Mobile wallet</small><h2>Apple Pay</h2></div><span class="v3-status safe">Ready</span></div><div class="v3-wallet-row"><span class="v3-icon blue">${icons.phone}</span><div><strong>iPhone 16 Pro</strong><small>Default contactless card</small></div><button type="button" class="v3-text-button" data-v3-toast="Wallet management is simulated in this prototype.">Manage</button></div><div class="v3-wallet-row"><span class="v3-icon lavender">${icons.phone}</span><div><strong>Apple Watch</strong><small>Added 2 months ago</small></div><span class="v3-status live">Active</span></div></section>

        <section class="v3-surface v3-limits-card"><div class="v3-section-title"><div><small>Limits</small><h2>Spending guardrails</h2></div><a href="app.html?screen=card-controls">Edit →</a></div><div class="v3-limit-row"><span>Daily card spend</span><strong>€1,000</strong></div><div class="v3-limit-row"><span>Cash withdrawal</span><strong>€500 / month</strong></div><div class="v3-limit-row"><span>Single contactless tap</span><strong>€100</strong></div></section>

        <section class="v3-surface v3-card-activity"><div class="v3-section-title"><div><small>Card activity</small><h2>Recent payments</h2></div><a href="app.html?screen=activity">See all →</a></div><div class="v3-list">
          <a href="app.html?screen=transaction-detail"><span class="v3-merchant blue">G</span><div><strong>Greenline Market</strong><small>Today, 14:32 · Groceries</small></div><b>−€42.70</b></a>
          <a href="app.html?screen=transaction-detail"><span class="v3-merchant pink">B</span><div><strong>ByteMart Online</strong><small>Today, 02:14 · Needs review</small></div><b>−€189.40</b></a>
          <a href="app.html?screen=activity"><span class="v3-merchant yellow">C</span><div><strong>Atelier Coffee</strong><small>Yesterday, 16:20 · Dining</small></div><b>−€6.40</b></a>
        </div></section>
      </div>
    </main>`;
  }

  function renderSavings() {
    return `<main id="main" class="main-wrap v3-page v3-savings-page" tabindex="-1">
      ${pageHead('Savings', 'Goals & growth', 'Keep your emergency buffer, short-term goals and monthly contribution visible together.', '<a class="v3-primary-link" href="app.html?screen=savings-detail">+ Add money</a>')}
      <div class="v3-savings-layout">
        <section class="v3-surface v3-goal-main"><div class="v3-section-title"><div><small>Primary goal</small><h2>Emergency buffer</h2></div><span class="v3-status safe">On track</span></div><div class="v3-goal-amount"><strong>€2,480</strong><span>of €4,000</span></div><div class="v3-progress"><span style="width:62%"></span></div><div class="v3-goal-stats"><div><small>Progress</small><strong>62%</strong></div><div><small>Remaining</small><strong>€1,520</strong></div><div><small>Next contribution</small><strong>€260 · Sep 28</strong></div><div><small>Projected goal</small><strong>Mar 2027</strong></div></div></section>

        <section class="v3-surface v3-growth-card"><div class="v3-section-title"><div><small>Savings account</small><h2>4.2% APY</h2></div><span class="v3-icon mint">${icons.trend}</span></div><p>Your protected buffer earns interest while remaining separate from safe-to-spend.</p><div class="v3-growth-stats"><div><small>Interest earned</small><strong>+€8.68</strong></div><div><small>30-day change</small><strong>+€268.68</strong></div></div></section>

        <section class="v3-surface v3-goals-card"><div class="v3-section-title"><div><small>Your goals</small><h2>Save with purpose</h2></div><a href="app.html?screen=savings-detail">Manage →</a></div><div class="v3-goal-row blue"><span class="v3-icon blue">${icons.shield}</span><div><strong>Emergency buffer</strong><small>€2,480 of €4,000</small><div class="v3-mini-progress"><i style="width:62%"></i></div></div><b>62%</b></div><div class="v3-goal-row pink"><span class="v3-icon pink">${icons.target}</span><div><strong>Holiday fund</strong><small>€3,200 of €5,000</small><div class="v3-mini-progress"><i style="width:64%"></i></div></div><b>64%</b></div><button class="v3-add-goal" type="button" data-v3-toast="New goal creation is simulated in this prototype.">${icons.plus}<span>Create another goal</span></button></section>

        <section class="v3-surface v3-contribution-card"><div class="v3-section-title"><div><small>Contribution plan</small><h2>€260 every month</h2></div><a href="app.html?screen=savings-detail">Adjust →</a></div><div class="v3-contribution-row"><span class="v3-icon yellow">${icons.calendar}</span><div><strong>Next transfer</strong><small>28 September · from Current Account</small></div><b>€260</b></div><div class="v3-contribution-row"><span class="v3-icon mint">${icons.check}</span><div><strong>Money Horizon</strong><small>Already counted as a known commitment</small></div><span class="v3-status safe">Included</span></div></section>

        <section class="v3-surface v3-horizon-card"><div class="v3-section-title"><div><small>Next 14 days</small><h2>Money Horizon</h2></div><span class="v3-status live">Healthy</span></div><div class="v3-horizon-bar"><span class="safe" style="width:46%">Safe €1,300</span><span class="committed" style="width:37%">Committed €1,040</span><span class="buffer" style="width:17%">Buffer €500</span></div><div class="v3-horizon-items"><div><i class="safe"></i><span>Safe now</span><strong>€1,300</strong></div><div><i class="committed"></i><span>Known commitments</span><strong>€1,040</strong></div><div><i class="buffer"></i><span>Protected buffer</span><strong>€500</strong></div></div></section>
      </div>
    </main>`;
  }

  function renderSecurity() {
    return `<main id="main" class="main-wrap v3-page v3-security-page" tabindex="-1">
      ${pageHead('Security', 'Privacy & protection', 'See your protection status, trusted devices and sensitive-action controls at a glance.')}
      <div class="v3-security-layout">
        <section class="v3-surface v3-security-score"><div class="v3-score-ring"><span>92</span><small>/100</small></div><div><span class="v3-status safe">Strong protection</span><h2>Your account is well protected</h2><p>Biometrics, login alerts and protected transfer checks are active.</p></div></section>
        <section class="v3-surface v3-security-actions"><div class="v3-section-title"><div><small>Quick actions</small><h2>Protect the account</h2></div><span class="v3-icon mint">${icons.shield}</span></div><div class="v3-action-grid two"><button class="v3-action-tile blue" type="button" data-v3-toast="Passcode change is simulated.">${icons.lock}<strong>Change passcode</strong><span>Last changed 4 months ago</span></button><a class="v3-action-tile mint" href="app.html?screen=cards">${icons.card}<strong>Card security</strong><span>Freeze, limits & payment methods</span></a></div></section>
        <section class="v3-surface v3-protection-list"><div class="v3-section-title"><div><small>Protection checklist</small><h2>Core protections</h2></div><span class="v3-status live">4 enabled</span></div><div class="v3-toggle-row"><span class="v3-icon blue">${icons.user}</span><div><strong>Biometric confirmation</strong><small>Require Face ID for sensitive actions</small></div><label class="v3-switch"><input type="checkbox" checked><span></span></label></div><div class="v3-toggle-row"><span class="v3-icon pink">${icons.bell}</span><div><strong>Private notification previews</strong><small>Hide merchant and amount on lock screen</small></div><label class="v3-switch"><input type="checkbox" checked><span></span></label></div><div class="v3-toggle-row"><span class="v3-icon yellow">${icons.globe}</span><div><strong>New-device login alerts</strong><small>Notify immediately when a new device signs in</small></div><label class="v3-switch"><input type="checkbox" checked><span></span></label></div><div class="v3-toggle-row"><span class="v3-icon mint">${icons.shield}</span><div><strong>Added Security for large transfers</strong><small>Extra verification above €1,000 per day</small></div><label class="v3-switch"><input type="checkbox" checked><span></span></label></div></section>
        <section class="v3-surface v3-devices-card"><div class="v3-section-title"><div><small>Trusted devices</small><h2>2 signed in</h2></div><button class="v3-text-button" type="button" data-v3-toast="Device management is simulated.">Manage</button></div><div class="v3-device-row"><span class="v3-icon blue">${icons.phone}</span><div><strong>iPhone 16 Pro</strong><small>Ho Chi Minh City · Active now</small></div><span class="v3-status safe">This device</span></div><div class="v3-device-row"><span class="v3-icon lavender">${icons.phone}</span><div><strong>MacBook Pro</strong><small>Ho Chi Minh City · 2 hours ago</small></div><button class="v3-text-button" type="button" data-v3-toast="Session removal is simulated.">Review</button></div></section>
        <section class="v3-surface v3-security-log"><div class="v3-section-title"><div><small>Recent security activity</small><h2>Everything looks normal</h2></div><span class="v3-status safe">No alerts</span></div><div class="v3-log-row"><span>Today, 09:42</span><strong>Biometric confirmation used</strong><small>Transfer review</small></div><div class="v3-log-row"><span>Yesterday, 18:11</span><strong>Login from trusted device</strong><small>MacBook Pro</small></div><div class="v3-log-row"><span>12 Sep, 14:08</span><strong>Card controls reviewed</strong><small>No changes made</small></div></section>
      </div>
    </main>`;
  }

  function renderSettings() {
    return `<main id="main" class="main-wrap v3-page v3-settings-page" tabindex="-1">
      ${pageHead('Settings', 'Account preferences', 'Personalise Nova, manage notifications and control how your banking workspace behaves.')}
      <div class="v3-settings-layout">
        <section class="v3-surface v3-profile-card"><div class="v3-settings-profile"><span class="v3-profile-avatar">AN</span><div><h2>Alex Nguyen</h2><p>alex.nguyen@example.com</p><span class="v3-status safe">Personal account</span></div><button class="v3-text-button" type="button" data-v3-toast="Profile editing is simulated in this prototype.">Edit</button></div></section>
        <section class="v3-surface v3-settings-card"><div class="v3-section-title"><div><small>Appearance</small><h2>Make Nova yours</h2></div><span class="v3-icon lavender">${icons.eye}</span></div><div class="v3-setting-row"><div><strong>Interface theme</strong><small>Match your system by default</small></div><div class="v3-segmented"><button class="active" type="button">System</button><button type="button">Light</button><button type="button">Dark</button></div></div><div class="v3-setting-row"><div><strong>Compact dashboard</strong><small>Show more financial detail on wide screens</small></div><label class="v3-switch"><input type="checkbox" checked><span></span></label></div></section>
        <section class="v3-surface v3-settings-card"><div class="v3-section-title"><div><small>Notifications</small><h2>Stay informed, not interrupted</h2></div><span class="v3-icon pink">${icons.bell}</span></div><div class="v3-toggle-row"><div><strong>Instant payment alerts</strong><small>Every card payment and transfer</small></div><label class="v3-switch"><input type="checkbox" checked><span></span></label></div><div class="v3-toggle-row"><div><strong>Upcoming bills</strong><small>Reminder 2 days before a known commitment</small></div><label class="v3-switch"><input type="checkbox" checked><span></span></label></div><div class="v3-toggle-row"><div><strong>Weekly money insight</strong><small>One summary every Sunday</small></div><label class="v3-switch"><input type="checkbox"><span></span></label></div></section>
        <section class="v3-surface v3-settings-card"><div class="v3-section-title"><div><small>Regional</small><h2>Language & money</h2></div><span class="v3-icon yellow">${icons.globe}</span></div><button class="v3-settings-link" type="button" data-v3-toast="Language selection is simulated."><span><strong>Language</strong><small>English</small></span><b>›</b></button><button class="v3-settings-link" type="button" data-v3-toast="Currency selection is simulated."><span><strong>Primary currency</strong><small>EUR · Euro</small></span><b>›</b></button><button class="v3-settings-link" type="button" data-v3-toast="Date format selection is simulated."><span><strong>Date format</strong><small>DD MMM YYYY</small></span><b>›</b></button></section>
        <section class="v3-surface v3-settings-card"><div class="v3-section-title"><div><small>Privacy & account</small><h2>Account controls</h2></div><span class="v3-icon mint">${icons.shield}</span></div><a class="v3-settings-link" href="app.html?screen=security"><span><strong>Security & privacy</strong><small>Biometrics, devices and Added Security</small></span><b>›</b></a><button class="v3-settings-link" type="button" data-v3-toast="Statement download is simulated."><span><strong>Documents & statements</strong><small>Monthly statements and account documents</small></span><b>›</b></button><button class="v3-settings-link danger" type="button" data-v3-toast="Account closure is intentionally not performed in this prototype."><span><strong>Close account</strong><small>Review requirements before closing</small></span><b>›</b></button></section>
      </div>
    </main>`;
  }

  const renderers = { cards: renderCards, savings: renderSavings, security: renderSecurity, settings: renderSettings };
  const renderer = renderers[screen];
  if (renderer) {
    const stage = $('.app-stage');
    const oldMain = $('#main');
    if (stage && oldMain) oldMain.outerHTML = renderer();
    document.title = `Nova — ${screen[0].toUpperCase()}${screen.slice(1)}`;
  }

  repairChrome();

  function toast(message) {
    let node = $('.v3-toast');
    if (!node) {
      node = document.createElement('div');
      node.className = 'v3-toast';
      node.setAttribute('role', 'status');
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(window.__novaV3Toast);
    window.__novaV3Toast = setTimeout(() => node.classList.remove('show'), 2200);
  }

  document.addEventListener('click', (event) => {
    const toastTarget = event.target.closest('[data-v3-toast]');
    if (toastTarget) toast(toastTarget.getAttribute('data-v3-toast'));

    const reveal = event.target.closest('[data-v3-reveal]');
    if (reveal) {
      const pan = $('#v3-pan');
      const revealed = reveal.dataset.revealed === 'true';
      if (pan) pan.textContent = revealed ? '••••  ••••  ••••  4821' : '5399  1284  5520  4821';
      reveal.dataset.revealed = String(!revealed);
      const label = $('span', reveal);
      if (label) label.textContent = revealed ? 'Show details' : 'Hide details';
      toast(revealed ? 'Card details hidden.' : 'Prototype card number revealed. Real apps require authentication.');
    }

    const freeze = event.target.closest('[data-v3-freeze]');
    if (freeze) {
      const frozen = freeze.dataset.frozen === 'true';
      freeze.dataset.frozen = String(!frozen);
      const strong = $('strong', freeze);
      const span = $('span', freeze);
      if (strong) strong.textContent = frozen ? 'Freeze card' : 'Card frozen';
      if (span) span.textContent = frozen ? 'Pause new payments instantly' : 'Tap again to unfreeze';
      toast(frozen ? 'Card unfrozen in prototype.' : 'Card frozen in prototype.');
    }

    const toggle = event.target.closest('[data-v3-toggle]');
    if (toggle) {
      const current = toggle.dataset.enabled !== 'false';
      toggle.dataset.enabled = String(!current);
      const status = $('span', toggle);
      if (status) status.textContent = current ? 'Disabled' : 'Enabled';
      toast(`${toggle.dataset.v3Toggle} ${current ? 'disabled' : 'enabled'} in prototype.`);
    }

    const segment = event.target.closest('.v3-segmented button');
    if (segment) {
      segment.parentElement.querySelectorAll('button').forEach((button) => button.classList.remove('active'));
      segment.classList.add('active');
      toast(`${segment.textContent} appearance selected for the prototype.`);
    }
  });
})();