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

  const MODEL = Object.freeze({
    balance: window.NovaProduct.data.account.balance, committed: window.NovaProduct.data.account.committed + window.NovaProduct.data.account.goal, buffer: window.NovaProduct.data.account.buffer, safe: window.NovaProduct.data.account.safe,
    snapshot: '2026-09-15',
    bills: [
      { name: 'Apartment rent', day: 20, type: 'bill', amount: 620, icon: 'home' },
      { name: 'Mobile plan', day: 22, type: 'subscription', amount: 32, icon: 'phone' },
      { name: 'Streaming service', day: 24, type: 'subscription', amount: 14.99, icon: 'play' },
      { name: 'Utilities estimate', day: 27, type: 'estimate', amount: 113.01, icon: 'bolt' },
      { name: 'Emergency buffer', day: 28, type: 'planned saving', amount: 260, icon: 'heart' }
    ]
  });
  const money = (value) => `€${value.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const transactions = window.NovaProduct.data.transactions;
  const income = transactions.reduce((sum, row) => sum + Math.max(0, row[2]), 0);
  const expenses = transactions.reduce((sum, row) => sum + Math.max(0, -row[2]), 0);
  const categoryNames = { Groceries: 'Food and dining', Dining: 'Food and dining', Electronics: 'Shopping', Shopping: 'Shopping', Transport: 'Transport', Subscription: 'Subscriptions', Transfer: 'Transfers' };
  const categories = Object.entries(transactions.filter(row => row[2] < 0).reduce((totals, row) => {
    const name = categoryNames[row[1]] || row[1]; totals[name] = (totals[name] || 0) - row[2]; return totals;
  }, {}));
  categories.sort((a,b) => b[1] - a[1]);
  const forecast = [{ day: 15, balance: MODEL.balance }];
  for (const bill of MODEL.bills) forecast.push({ day: bill.day, balance: forecast.at(-1).balance - bill.amount });
  forecast.push({ day: 30, balance: forecast.at(-1).balance });
  const forecastX = day => 8 + (day - 15) / 15 * 744;
  const forecastY = balance => 180 - balance / 4000 * 160;
  const forecastPath = `M8 ${forecastY(MODEL.balance)}` + forecast.slice(1).map(point => ` H${forecastX(point.day)} V${forecastY(point.balance)}`).join('');
  const share = (value) => `${(value / MODEL.balance) * 100}%`;

  function renderForecastPanel() {
    return `<section class="nova-card nova-forecast-card fi-horizon" aria-labelledby="forecast-title" data-nova-panel="forecast"><div class="nova-card-head"><h2 id="forecast-title" tabindex="-1">Balance forecast</h2><span class="nova-date-pill">15–30 Sep 2026</span></div><div class="nova-panel-body">${params.get('panel') === 'forecast-error' ? forecastError() : forecastBody()}</div></section>`;
  }

  function forecastBody() {
    return `<div class="nova-forecast-total"><strong>${money(forecast.at(-1).balance)}</strong><span>projected on 30 Sep</span></div><div class="nova-forecast-wrap"><svg viewBox="0 0 760 190" preserveAspectRatio="none" role="img" aria-label="Balance forecast based on planned payments: 2840 euros now, 1800 euros on 30 September"><defs><linearGradient id="nova-forecast-stroke"><stop stop-color="#ffe294"/><stop offset="1" stop-color="#f85abc"/></linearGradient><linearGradient id="nova-forecast-area" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f893b7" stop-opacity=".16"/><stop offset="1" stop-color="#f893b7" stop-opacity="0"/></linearGradient></defs><g class="nova-gridlines"><path d="M0 20H760M0 60H760M0 100H760M0 140H760M0 180H760"/><path class="buffer" d="M0 160H760"/></g><path class="nova-area" d="${forecastPath} L752 180 L8 180 Z"/><path class="nova-line" d="${forecastPath}"/></svg></div><div class="nova-forecast-axis" aria-hidden="true"><span>15 Sep</span><span>21 Sep</span><span>27 Sep</span><span>30 Sep</span></div><p class="nova-forecast-low">Based on planned payments. Future spending may change this.</p><div class="sr-only"><table><caption>Demo balance forecast, based on known payments</caption><thead><tr><th scope="col">Date</th><th scope="col">Balance</th></tr></thead><tbody><tr><th scope="row">15 Sep</th><td>${money(MODEL.balance)}</td></tr>${forecast.slice(1).map(point=>`<tr><th scope="row">${point.day} Sep</th><td>${money(point.balance)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function forecastError() {
    return `<div class="nova-forecast-error" role="status"><strong>Forecast unavailable</strong><p>Your balances and planned payments are still available.</p><button class="btn btn-secondary" type="button" data-nova-retry="forecast">Try again</button></div>`;
  }

  function enrichChrome() {
    const actions = document.querySelector('.ios26-nav-actions');
    if (actions && !actions.querySelector('.nova-profile-chip')) {
      actions.innerHTML = `
        <span class="v6-sim-pill">Demo account</span>
        <a class="nova-search-chip" href="app.html?screen=activity" aria-label="Search activity">${svg('search')}<span>Search</span></a>
        <a class="nova-bell-chip" href="app.html?screen=notifications" aria-label="Notifications">${svg('bell')}<i aria-hidden="true"></i></a>
        <a class="nova-profile-chip" href="app.html?screen=security" aria-label="AN, Good morning Alex, security and profile"><span class="nova-avatar">AN</span><span><small>Personal account</small><strong>Alex Nguyen</strong></span></a>`;
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

    const { account, goals, recipient } = window.NovaProduct.data;
    const txnIcon = category => ({Groceries:'cart',Dining:'coffee',Income:'wallet',Electronics:'bag',Transport:'card',Subscription:'play',Transfer:'arrow'}[category] || 'bag');
    const recent = [transactions.find(row => row[3] === 'risk'), ...transactions.filter(row => row[3] !== 'risk').slice(0, 3)].filter(Boolean);
    main.innerHTML = `
      <nav class="nova-home-tabs" aria-label="Primary sections">${[['Overview','home'],['Activity','activity'],['Pay','transfer-recipient'],['Cards','cards'],['Savings','savings']].map(([label,route])=>`<a href="app.html?screen=${route}" ${route==='home'?'aria-current="page"':''}>${label}</a>`).join('')}</nav><header class="nova-dashboard-intro"><div><h1>Overview</h1><p>Welcome back, Alex. Here’s your money at a glance.</p></div>${window.NovaProduct.components.accountActions()}<span class="nova-snapshot-label sr-only">Demo snapshot <time datetime="2026-09-15T09:42:00">15 Sep 2026, 09:42</time></span></header>
      ${params.get('panel') === 'forecast-error' ? renderForecastPanel() : ''}
      <div class="nova-density-dashboard ${params.get('panel') === 'forecast-error' ? 'is-forecast-error' : ''}">
        <section class="nova-card nova-hero-card" aria-labelledby="nova-safe-title">
          <div class="nova-money-face"><p class="nova-label" id="nova-safe-label"><span>Safe to spend</span><span>Next 14 days</span></p><h2 id="nova-safe-title" class="money-amount" aria-describedby="nova-safe-label">${money(MODEL.safe)}</h2><p>Excludes bills, savings and buffer</p><div class="nova-card-identity"><span>Current account •••• 4421</span><strong>nova</strong></div></div>
          <div class="nova-horizon-split"><div class="nova-allocation-total"><span>Total balance</span><strong>${money(MODEL.balance)}</strong></div><div class="nova-horizon-split-bar" role="img" aria-label="${money(MODEL.balance)} total balance: ${money(MODEL.safe)} safe to spend, ${money(MODEL.committed)} known commitments, ${money(MODEL.buffer)} protected buffer"><i class="safe" style="width:${share(MODEL.safe)}"></i><i class="committed" style="width:${share(MODEL.committed)}"></i><i class="buffer" style="width:${share(MODEL.buffer)}"></i></div><ul class="nova-horizon-split-legend"><li><span>Bills and savings</span><strong>${money(MODEL.committed)}</strong></li><li><span>Protected buffer</span><strong>${money(MODEL.buffer)}</strong></li></ul></div>
        </section>
        <section class="nova-card nova-upcoming-card" aria-labelledby="bills-title"><div class="nova-card-head"><h2 id="bills-title">Upcoming payments</h2><a href="app.html?screen=subscriptions">View all</a></div><div class="nova-bill-list">${MODEL.bills.map(bill=>`<a class="nova-bill-row" href="app.html?screen=payment-detail&payment=${window.NovaProduct.components.transactionId(bill.name)}"><span class="nova-icon">${svg(bill.icon)}</span><span><strong>${bill.name}</strong><small>${bill.day} Sep · ${bill.type}</small></span><b>${money(bill.amount)}</b></a>`).join('')}</div><div class="nova-upcoming-total"><span>5 planned payments</span><strong>${money(MODEL.committed)}</strong></div></section>
        <section class="nova-card nova-quick-card" aria-labelledby="quick-title"><div class="nova-card-head"><h2 id="quick-title">Quick transfer</h2><a href="app.html?screen=transfer-recipient">View all</a></div><div class="nova-recipient-list">${window.NovaProduct.data.recipients.slice(0,3).map(person=>`<a href="app.html?screen=transfer-amount&recipient=${person.id}" title="Send money to ${person.name}"><span class="nova-avatar" aria-hidden="true">${person.name.split(' ').map(part=>part[0]).join('')}</span><span>${person.name.split(' ')[0]}<span class="sr-only"> ${person.name.split(' ').slice(1).join(' ')}</span></span></a>`).join('')}<a href="app.html?screen=transfer-recipient" aria-label="More recipients"><span class="nova-avatar" aria-hidden="true">${svg('plus')}</span><span>More</span></a></div><p>Continue with ${recipient.name}</p><div class="nova-transfer-preview"><strong>${money(recipient.amount)}</strong><small>EUR</small></div><a class="btn btn-primary" href="app.html?screen=transfer-amount&recipient=maya-chen-2048">Send money ${svg('arrow')}</a><p class="nova-quick-note">Review the amount and impact before confirming.</p></section>
        <section class="nova-card nova-transactions-card" aria-labelledby="transactions-title"><div class="nova-card-head"><h2 id="transactions-title">Recent transactions</h2><a href="app.html?screen=activity">View all</a></div><div class="nova-txn-list">${recent.map(([name,category,amount,state,date])=>`<a class="nova-txn-row ${state==='risk'?'risk':amount>0?'positive':''}" href="app.html?screen=transaction-detail&transaction=${window.NovaProduct.components.transactionId(name)}"><span class="nova-icon">${svg(txnIcon(category))}</span><span><strong>${name}</strong><small>${state==='risk'?'Needs review':date+' · '+category}</small></span><b>${amount<0?'−':'+'}${money(Math.abs(amount))}</b></a>`).join('')}</div><div class="nova-flow-summary"><div class="nova-kpi mint"><small>Money in</small><strong>${money(income)}</strong></div><div class="nova-kpi pink"><small>Money out</small><strong>${money(expenses)}</strong></div></div></section>
        ${params.get('panel') === 'forecast-error' ? '' : renderForecastPanel()}
        <section class="nova-card nova-accounts-card" aria-labelledby="accounts-title"><div class="nova-card-head"><h2 id="accounts-title">Your accounts</h2><a href="app.html?screen=account-detail">Details</a></div><a class="nova-account-row" href="app.html?screen=account-detail"><span class="nova-icon">${svg('wallet')}</span><span><strong>Current account</strong><small>•••• 4421</small></span><b>${money(account.balance)}</b></a><a class="nova-account-row" href="app.html?screen=savings"><span class="nova-icon">${svg('leaf')}</span><span><strong>Savings</strong><small>Across ${goals.length} goals</small></span><b>${money(goals.reduce((sum,goal)=>sum+goal.current,0))}</b></a><a class="text-link" href="app.html?screen=cards">Manage your debit card ${svg('arrow')}</a></section>
        <section class="nova-card nova-spending-card" aria-labelledby="spending-title"><div class="nova-card-head"><h2 id="spending-title">Spending breakdown</h2><span class="meta">September</span></div><div class="nova-spending-total"><strong>${money(expenses)}</strong><span>Total spent</span></div><ol class="nova-category-bars">${categories.map(([name,amount])=>`<li class="nova-category-row"><div><span>${name}</span><b>${money(amount)}</b></div><span class="nova-category-track" aria-hidden="true"><i style="width:${amount/expenses*100}%"></i></span></li>`).join('')}</ol></section>
        <section class="nova-card nova-savings-card" aria-labelledby="savings-title"><div class="nova-card-head"><h2 id="savings-title">Savings goals</h2><a href="app.html?screen=savings">View</a></div><div class="nova-goals-list">${goals.map(goal=>`<a class="nova-goal-summary" href="app.html?screen=savings-detail&goal=${goal.id}"><div><strong>${goal.name}</strong><span>${Math.round(goal.current/goal.target*100)}%</span></div><p>${money(goal.current)} of ${money(goal.target)}</p><div class="nova-mini-progress" role="progressbar" aria-label="${goal.name} progress" aria-valuemin="0" aria-valuemax="${goal.target}" aria-valuenow="${goal.current}"><span style="width:${Math.min(100,goal.current/goal.target*100)}%"></span></div></a>`).join('')}</div></section>
      </div>`;
    // The chrome owner stays in the top bar on every viewport.

  }

  function init() {
    enrichChrome();
    renderDenseHome();
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-nova-retry="forecast"]');
      if (!button) return;
      const panel = button.closest('[data-nova-panel="forecast"]');
      panel.querySelector('.nova-panel-body').innerHTML = forecastBody();
      const grid = document.querySelector('.nova-density-dashboard');
      grid.classList.remove('is-forecast-error');
      grid.querySelector('.nova-transactions-card').insertAdjacentElement('afterend', panel);
      panel.querySelector('h2').focus();
    });
    document.body.classList.add('nova-density-v2');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
