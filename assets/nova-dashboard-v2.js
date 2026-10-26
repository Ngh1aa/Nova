(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const screen = params.get('screen') || 'home';

  const svg = (name) => {
    const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    const paths = {
      bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 19h4"/>',
      arrow: '<path d="M5 12h14"/><path d="m14 7 5 5-5 5"/>',
      wallet: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M16 11h5"/><circle cx="16" cy="12.5" r="1"/>',
      shield: '<path d="M12 3 5 6v5c0 4.5 2.8 8.3 7 10 4.2-1.7 7-5.5 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7L15 10"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      leaf: '<path d="M12 21V10"/><path d="M12 14c-5 0-8-3-8-8 5 0 8 3 8 8Z"/><path d="M12 11c0-4 3-7 8-7 0 5-3 8-8 8"/>',
      home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9 21v-7h6v7"/>',
      phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 18h4"/>',
      play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',
      bolt: '<path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z"/>',
      heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
      cart: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2.4 10.5a2 2 0 0 0 2 1.5h7.7a2 2 0 0 0 2-1.6L21 7H6"/>',
      card: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/>',
      coffee: '<path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M17 10h2a3 3 0 0 1 0 6h-2"/>',
      bag: '<path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
      sparkle: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>'
    };
    return `<svg ${common}>${paths[name] || paths.sparkle}</svg>`;
  };

  const MODEL = Object.freeze({ balance: 2840, committed: 1040, buffer: 500, safe: 1300 });
  const money = (value) => `€${value.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const share = (value) => `${(value / MODEL.balance) * 100}%`;

  function enrichChrome() {
    const actions = document.querySelector('.ios26-nav-actions');
    if (actions && !actions.querySelector('.nova-profile-chip')) {
      actions.innerHTML = `
        <span class="v6-sim-pill">Simulated data</span>
        <a class="nova-search-chip" href="app.html?screen=activity" aria-label="Search activity">${svg('search')}<span>Search</span></a>
        <a class="nova-bell-chip" href="app.html?screen=notifications" aria-label="Notifications">${svg('bell')}<i aria-hidden="true"></i></a>
        <a class="nova-profile-chip" href="app.html?screen=security" aria-label="Security and profile"><span class="nova-avatar">AN</span><span><small>Good morning</small><strong>Alex</strong></span></a>`;
    }

    const rail = document.querySelector('.sidebar');
    if (rail) {
      rail.classList.add('nova-floating-rail');
      const prototypeLink = [...rail.querySelectorAll('.side-bottom .side-nav a')].find((link) => /prototype/i.test(link.textContent));
      if (prototypeLink) {
        prototypeLink.href = 'app.html?screen=security';
        prototypeLink.setAttribute('aria-label', 'Settings');
        const label = prototypeLink.querySelector('span:last-child');
        if (label) label.textContent = 'Settings';
      }
    }
  }

  function renderDenseHome() {
    if (screen !== 'home') return;
    const main = document.querySelector('main.home-page');
    if (!main) return;

    main.innerHTML = `
      <div class="nova-density-dashboard">
        <section class="nova-card nova-hero-card" aria-labelledby="nova-safe-title">
          <p class="nova-label" id="nova-safe-label">Safe to spend for the next 14 days</p>
          <h1 id="nova-safe-title" class="money-amount" aria-describedby="nova-safe-label">${money(MODEL.safe)}</h1>
          <div class="nova-hero-status"><span class="nova-hero-pill">${svg('leaf')}On track</span><span>€124 more than last week</span></div>
          <div class="nova-horizon-split">
            <div class="nova-horizon-split-bar" role="img" aria-label="${money(MODEL.balance)} total balance: ${money(MODEL.safe)} safe to spend, ${money(MODEL.committed)} known commitments, ${money(MODEL.buffer)} protected buffer">
              <i class="safe" style="width:${share(MODEL.safe)}"></i><i class="committed" style="width:${share(MODEL.committed)}"></i><i class="buffer" style="width:${share(MODEL.buffer)}"></i>
            </div>
            <ul class="nova-horizon-split-legend">
              <li class="safe"><span>Safe now</span><strong>${money(MODEL.safe)}</strong></li>
              <li class="committed"><span>Bills and saving</span><strong>${money(MODEL.committed)}</strong></li>
              <li class="buffer"><span>Protected buffer</span><strong>${money(MODEL.buffer)}</strong></li>
              <li class="total"><span>Total balance</span><strong>${money(MODEL.balance)}</strong></li>
            </ul>
          </div>
          <div class="nova-hero-footer">
            <p class="nova-hero-updated">${svg('clock')}<span>Updated today, 09:42</span></p>
            <div class="nova-hero-actions" aria-label="Quick actions">
              <a class="decision-action nova-action blue" href="app.html?screen=transfer-recipient">${svg('arrow')}<span>Send money</span></a>
              <a class="decision-action nova-action pink" href="app.html?screen=savings-detail">${svg('plus')}<span>Add to savings</span></a>
            </div>
          </div>
        </section>

        <section class="nova-card nova-upcoming-card" aria-labelledby="bills-title">
          <div class="nova-card-head"><div><small>Next 14 days</small><h2 id="bills-title">Upcoming bills</h2></div><span class="nova-date-pill">5 items</span></div>
          <div class="nova-bill-list">
            <div class="nova-bill-row"><span class="nova-icon blue">${svg('home')}</span><span><strong>Apartment rent</strong><small>20 Sep, bill</small></span><b>−€620.00</b></div>
            <div class="nova-bill-row"><span class="nova-icon blue">${svg('phone')}</span><span><strong>Mobile plan</strong><small>22 Sep, subscription</small></span><b>−€32.00</b></div>
            <div class="nova-bill-row"><span class="nova-icon blue">${svg('play')}</span><span><strong>Streaming</strong><small>24 Sep, subscription</small></span><b>−€14.99</b></div>
            <div class="nova-bill-row"><span class="nova-icon blue">${svg('bolt')}</span><span><strong>Utilities estimate</strong><small>27 Sep, estimate</small></span><b>−€113.01</b></div>
            <div class="nova-bill-row"><span class="nova-icon lavender">${svg('heart')}</span><span><strong>Emergency buffer</strong><small>28 Sep, planned saving</small></span><b>−€260.00</b></div>
          </div>
          <div class="nova-upcoming-total"><span>Reserved for the next 14 days</span><strong>${money(MODEL.committed)}</strong></div>
          <div class="nova-protection-note"><span class="nova-icon lavender">${svg('shield')}</span><div><strong>Your €500 buffer stays protected.</strong><p>Nova excludes it before showing the next-14-days safe-to-spend estimate.</p></div></div>
        </section>

        <section class="nova-card nova-transactions-card" aria-labelledby="transactions-title">
          <div class="nova-card-head"><h2 id="transactions-title">Recent transactions</h2><a href="app.html?screen=activity">See all</a></div>
          <div class="nova-txn-list">
            <a class="nova-txn-row risk" href="app.html?screen=transaction-detail" aria-label="Unusual card activity at ByteMart Online"><span class="nova-icon pink">${svg('bag')}</span><span><strong>Unusual card activity</strong><small>ByteMart Online, needs review</small></span><b>−€189.40</b></a>
            <div class="nova-txn-row"><span class="nova-icon">${svg('cart')}</span><span><strong>Greenline Market</strong><small>Today, 14:32, groceries</small></span><b>−€42.70</b></div>
            <div class="nova-txn-row positive"><span class="nova-icon mint">${svg('wallet')}</span><span><strong>Salary Deposit</strong><small>Today, 09:15, income</small></span><b>+€2,500.00</b></div>
            <div class="nova-txn-row"><span class="nova-icon">${svg('coffee')}</span><span><strong>Atelier Coffee</strong><small>Yesterday, 16:20, dining</small></span><b>−€6.40</b></div>
          </div>
        </section>

        <section class="nova-card nova-forecast-card fi-horizon" aria-labelledby="forecast-title">
          <div class="nova-card-head"><div><h2 id="forecast-title">Balance forecast</h2><p>Known payments, saving and expected income.</p></div><span class="nova-date-pill">15–30 Sep</span></div>
          <div class="nova-forecast-total"><strong>€3,900</strong><span>expected on 30 Sep</span></div>
          <div class="nova-forecast-wrap">
            <svg viewBox="0 0 760 190" preserveAspectRatio="none" role="img" aria-label="Balance forecast falls toward 1050 euros then rises to 3900 euros">
              <defs><linearGradient id="novaArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#aad3ff" stop-opacity=".55"/><stop offset="1" stop-color="#c8bdf1" stop-opacity=".06"/></linearGradient></defs>
              <g class="nova-gridlines"><path d="M0 34H760M0 78H760M0 122H760"/><path class="buffer" d="M0 166H760"/></g>
              <path class="nova-area" d="M8 48 L120 70 L230 83 L340 99 L450 126 L560 145 L660 94 L752 54 L752 190 L8 190 Z"/>
              <path class="nova-line" d="M8 48 L120 70 L230 83 L340 99 L450 126 L560 145 L660 94 L752 54"/>
            </svg>
          </div>
          <div class="nova-forecast-axis" aria-hidden="true"><span>15 Sep</span><span>21 Sep</span><span>27 Sep</span><span>30 Sep</span></div>
          <p class="nova-forecast-low">Lowest point <strong>€1,050</strong> on 27 Sep, still above your €500 buffer.</p>
        </section>

        <section class="nova-card nova-accounts-card" aria-labelledby="accounts-title">
          <div class="nova-card-head"><h2 id="accounts-title">Accounts</h2><a href="app.html?screen=cards">See all</a></div>
          <div class="nova-account-list">
            <a href="app.html?screen=cards" class="nova-account-row"><span class="nova-icon blue">${svg('wallet')}</span><span><strong>Current Account</strong><small>Nova Bank •••• 4421</small></span><b>€2,240.00</b></a>
            <a href="app.html?screen=savings" class="nova-account-row"><span class="nova-icon lavender">${svg('shield')}</span><span><strong>Savings Account</strong><small>4.2% APY</small></span><b>€500.00</b></a>
            <a href="app.html?screen=savings-detail" class="nova-account-row"><span class="nova-icon mint">${svg('leaf')}</span><span><strong>Holiday Fund</strong><small>64% of goal</small></span><b>€100.00</b></a>
          </div>
        </section>

        <section class="nova-card nova-bankcard-card" aria-labelledby="card-title">
          <div class="nova-card-head"><h2 id="card-title">Your card</h2><a href="app.html?screen=cards">Manage</a></div>
          <div class="nova-bankcard"><div class="nova-bankcard-top"><img src="assets/nova-mark.svg" alt=""><strong>Nova</strong></div><div class="nova-bankcard-bottom"><span>•••• 4821</span><small>Debit</small></div></div>
          <div class="nova-card-spend"><div><span>Spent this month</span><strong>€620.00</strong></div><div class="nova-card-meter"><span style="width:62%"></span></div><small>62% of your €1,000 limit</small></div>
        </section>

        <section class="nova-card nova-flow-card" aria-labelledby="flow-title">
          <div class="nova-card-head"><h2 id="flow-title">Money in and out</h2><span class="nova-date-pill">This month</span></div>
          <div class="nova-flow-summary">
            <div class="nova-kpi mint"><small>Money in</small><strong>€2,980</strong><span>12% more than last month</span></div>
            <div class="nova-kpi pink"><small>Money out</small><strong>€1,680</strong><span>8% more than last month</span></div>
          </div>
          <div class="nova-bars" role="img" aria-label="Income and expense bars from January to June">
            <span><i style="height:72%"></i><b style="height:43%"></b><em>Jan</em></span><span><i style="height:80%"></i><b style="height:48%"></b><em>Feb</em></span><span><i style="height:75%"></i><b style="height:39%"></b><em>Mar</em></span><span><i style="height:59%"></i><b style="height:38%"></b><em>Apr</em></span><span><i style="height:57%"></i><b style="height:34%"></b><em>May</em></span><span><i style="height:76%"></i><b style="height:41%"></b><em>Jun</em></span>
          </div>
          <div class="nova-chart-legend"><span><i class="mint-dot"></i>Income</span><span><i class="pink-dot"></i>Expenses</span></div>
        </section>

        <section class="nova-card nova-spending-card" aria-labelledby="spending-title">
          <div class="nova-card-head"><h2 id="spending-title">Spending by category</h2><span class="nova-date-pill">This month</span></div>
          <div class="nova-donut-layout"><div class="nova-donut" role="img" aria-label="1680 euros total spent"><span><strong>€1,680</strong><small>spent</small></span></div><div class="nova-category-list"><span><i class="c1"></i>Housing <b>€620</b></span><span><i class="c2"></i>Food and dining <b>€302</b></span><span><i class="c3"></i>Shopping <b>€202</b></span><span><i class="c4"></i>Transport <b>€168</b></span><span><i class="c5"></i>Entertainment <b>€134</b></span><span><i class="c6"></i>Other <b>€254</b></span></div></div>
        </section>

        <section class="nova-card nova-savings-card" aria-labelledby="savings-title">
          <div class="nova-card-head"><h2 id="savings-title">Savings progress</h2><a href="app.html?screen=savings">See all</a></div>
          <div class="nova-savings-layout"><div class="nova-progress-ring" role="img" aria-label="Holiday Fund 64 percent saved"><span><strong>64%</strong></span></div><div><h3>Holiday Fund</h3><p>€3,200 of €5,000 saved</p><span class="nova-date-pill">€1,800 to go</span></div></div>
        </section>
      </div>`;
  }

  function init() {
    enrichChrome();
    renderDenseHome();
    document.body.classList.add('nova-density-v2');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();