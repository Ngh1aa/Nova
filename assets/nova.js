(() => {
  'use strict';

  const DATA = {
    account: { balance: 2840, committed: 780, goal: 260, buffer: 500, safe: 1300, currency: 'EUR', freshness: 'Updated 09:42 · Prototype data' },
    commitments: [
      ['Apartment rent','Sep 20',620,'Bill'],['Mobile plan','Sep 22',32,'Subscription'],['Streaming service','Sep 24',14.99,'Subscription'],['Utilities estimate','Sep 27',113.01,'Estimate']
    ],
    goal: { name:'Emergency buffer', current:2480, target:4000, contribution:260, next:'Sep 28', status:'On track' },
    suspicious: { id:'txn_NVA_9F2K7Q', merchant:'ByteMart Online', amount:189.40, timestamp:'Sep 15 · 02:14', status:'Completed', channel:'Online card', card:'•••• 4821', location:'Singapore', category:'Electronics', reasons:['New merchant','Higher than your usual online purchase'] },
    transactions: [
      ['Greenline Market','Groceries',-42.70,'completed'],['Metro Transit','Transport',-18,'completed'],['Cloudbox','Subscription',-9.99,'completed'],['Atelier Coffee','Dining',-6.40,'completed'],['ByteMart Online','Electronics',-189.40,'risk'],['Northstar Books','Shopping',-28.50,'pending'],['River Gym','Subscription',-34,'completed'],['Merchant refund','Shopping',22,'reversed']
    ],
    recipient: { name:'Maya Chen', bank:'Northfield Bank', account:'Personal •••• 2048', amount:145, fee:0, arrival:'Usually within minutes', reference:'September utilities', afterSafe:1155 }
  };

  const screens = {
    onboarding: renderOnboarding,
    kyc: renderKyc,
    home: renderHome,
    activity: renderActivity,
    'transaction-detail': renderTransactionDetail,
    cards: renderCards,
    'card-frozen': () => renderCards(true),
    'card-controls': renderCardControls,
    'transfer-recipient': renderTransferRecipient,
    'transfer-amount': renderTransferAmount,
    'transfer-review': renderTransferReview,
    'biometric-failed': () => renderTransferReview({ biometricFailed:true }),
    offline: () => renderTransferReview({ offline:true }),
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

  function euro(value, signed=false) {
    const abs = Math.abs(value).toLocaleString('en-IE',{minimumFractionDigits:2,maximumFractionDigits:2});
    const sign = signed ? (value > 0 ? '+' : value < 0 ? '−' : '') : '';
    return `${sign}€${abs}`;
  }

  function storageGet(key, fallback='false') {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  }
  function storageSet(key, value) {
    try { localStorage.setItem(key, String(value)); } catch {}
  }
  function isFrozen(forced=false) { return forced || storageGet('nova_card_frozen') === 'true'; }

  function icon(name) {
    const map = {home:'⌂',activity:'↕',pay:'→',cards:'▣',save:'◒',bell:'•',user:'N',shield:'◇',arrow:'›',back:'←',search:'⌕'};
    return map[name] || '•';
  }

  function activeFor(screen) {
    if (['home','notifications'].includes(screen)) return 'home';
    if (['activity','transaction-detail'].includes(screen)) return 'activity';
    if (screen.startsWith('transfer') || ['offline','biometric-failed','error'].includes(screen)) return 'pay';
    if (screen.startsWith('card')) return 'cards';
    if (screen.startsWith('saving') || screen === 'subscriptions') return 'save';
    return '';
  }

  function navLink(label, key, screen) {
    const active = activeFor(currentScreen) === key;
    return `<a href="app.html?screen=${screen}" class="${active?'active':''}" ${active?'aria-current="page"':''}><span class="nav-glyph" aria-hidden="true">${icon(key)}</span><span>${label}</span></a>`;
  }

  function shell(main, options={}) {
    const offline = !!options.offline;
    return `
      <div class="app-shell">
        <aside class="sidebar" aria-label="Primary navigation">
          <a class="brand" href="app.html?screen=home"><span class="brand-mark" aria-hidden="true">N</span><span>NOVA</span></a>
          <nav class="side-nav">
            ${navLink('Home','home','home')}${navLink('Activity','activity','activity')}${navLink('Pay','pay','transfer-recipient')}${navLink('Cards','cards','cards')}${navLink('Save','save','savings')}
          </nav>
          <div class="side-bottom">
            <nav class="side-nav">
              <a href="app.html?screen=security"><span aria-hidden="true">◇</span> Security</a>
              <a href="prototype.html"><span aria-hidden="true">↗</span> Prototype index</a>
            </nav>
            <p class="meta" style="padding:10px 11px 0">Prototype data · Simulated banking</p>
          </div>
        </aside>
        <header class="mobile-topbar">
          <a class="brand" href="app.html?screen=home"><span class="brand-mark" aria-hidden="true">N</span><span>NOVA</span></a>
          <div class="utility-actions">
            <a class="icon-btn" aria-label="Notifications" href="app.html?screen=notifications"><span aria-hidden="true">◦</span><span class="notification-dot" aria-hidden="true"></span></a>
            <a class="icon-btn" aria-label="Security and profile" href="app.html?screen=security"><span aria-hidden="true">N</span></a>
          </div>
        </header>
        <div>
          ${offline?'<div class="offline-banner" role="status">You’re offline. You can review details, but money actions are paused.</div>':''}
          ${main}
        </div>
        <nav class="bottom-nav" aria-label="Primary navigation">
          ${navLink('Home','home','home')}${navLink('Activity','activity','activity')}${navLink('Pay','pay','transfer-recipient')}${navLink('Cards','cards','cards')}${navLink('Save','save','savings')}
        </nav>
      </div>`;
  }

  function header(title, description='', back='') {
    return `<div class="page-heading"><div>${back?`<a class="text-link" href="${back}">${icon('back')} Back</a>`:''}<p class="eyebrow">NOVA · Prototype data</p><h1>${title}</h1>${description?`<p>${description}</p>`:''}</div><span class="prototype-label">SIMULATED</span></div>`;
  }

  function horizon(compact=false, safe=DATA.account.safe) {
    const committedCombined = DATA.account.committed + DATA.account.goal;
    const total = DATA.account.balance;
    const safePct = Math.max(0, Math.round(safe/total*100));
    const committedPct = Math.round(committedCombined/total*100);
    const bufferPct = Math.max(0,100-safePct-committedPct);
    return `<section class="horizon" aria-labelledby="horizon-title">
      <div class="horizon-top"><div><h2 id="horizon-title">Money Horizon</h2><p>${compact?'What remains after known commitments and your protected buffer.':'A planning estimate that separates money you can use now from known commitments and the buffer you asked NOVA to protect.'}</p></div><span class="status status-success">Estimate</span></div>
      <div class="horizon-bar" role="img" aria-label="${euro(safe)} safe to spend, ${euro(committedCombined)} committed to bills and goal contribution, ${euro(DATA.account.buffer)} protected buffer">
        <div class="horizon-zone safe" style="width:${safePct}%">Safe now</div>
        <div class="horizon-zone committed" style="width:${committedPct}%">Committed</div>
        <div class="horizon-zone buffer" style="width:${bufferPct}%">Buffer</div>
      </div>
      <div class="horizon-marker" aria-hidden="true"></div>
      <div class="horizon-legend">
        <div><span class="legend-key"><span class="legend-swatch" style="background:var(--safe)"></span>Safe now</span><strong>${euro(safe)}</strong></div>
        <div><span class="legend-key"><span class="legend-swatch" style="background:#d7af68"></span>Known commitments</span><strong>${euro(committedCombined)}</strong></div>
        <div><span class="legend-key"><span class="legend-swatch" style="background:#a8b4b3"></span>Protected buffer</span><strong>${euro(DATA.account.buffer)}</strong></div>
      </div>
      <p class="horizon-note">Safe to spend = balance − known commitments − planned goal contribution − protected buffer. Unknown future spending can change this estimate.</p>
    </section>`;
  }

  function commitmentList() {
    return `<div class="list">${DATA.commitments.map(([name,date,amount,type])=>`<div class="list-row"><div class="list-icon" aria-hidden="true">${type==='Subscription'?'↻':'⌁'}</div><div><div class="list-title">${name}</div><div class="list-sub">${type} · ${date}</div></div><div class="list-value">${euro(-amount,true)}<small>included</small></div></div>`).join('')}</div>`;
  }

  function transactionRows(limit=DATA.transactions.length) {
    return `<div class="list">${DATA.transactions.slice(0,limit).map(([name,cat,amount,status])=>{
      const risk = status==='risk'; const pending=status==='pending'; const reversed=status==='reversed';
      const href = risk?'app.html?screen=transaction-detail':'#';
      return `<a class="list-row ${risk?'is-risk':''}" href="${href}" ${href==='#'?'data-toast="Transaction detail is not expanded in this demo."':''}>
        <div class="list-icon" aria-hidden="true">${risk?'!':pending?'…':reversed?'↩':'·'}</div><div><div class="list-title">${name}</div><div class="list-sub">${cat} · ${risk?'Needs review':pending?'Pending':reversed?'Reversed':'Completed'}</div></div><div class="list-value">${euro(amount,true)}${risk?'<small>Review</small>':''}</div></a>`;
    }).join('')}</div>`;
  }

  function renderHome() {
    const frozen = isFrozen();
    const main = `<main id="main" class="main-wrap" tabindex="-1"><div class="page-grid has-context"><div>
      <section class="money-hero"><p class="eyebrow">Tuesday · Your money today</p><div class="money-amount">${euro(DATA.account.safe)}</div><div class="money-sub"><strong>Safe to spend</strong><span>Total balance ${euro(DATA.account.balance)}</span><span>${DATA.account.freshness}</span></div>${horizon()}</section>
      <section class="section"><div class="section-head"><h2>Needs your attention</h2><span class="status status-risk">1 review</span></div>
        <a class="alert-band" href="app.html?screen=transaction-detail"><span class="alert-icon" aria-hidden="true">!</span><span><strong>Unusual card activity</strong><span>${euro(DATA.suspicious.amount)} at ByteMart Online · Singapore</span></span><span class="chevron" aria-hidden="true">›</span></a>
        ${frozen?'<div class="callout callout-success" style="margin-top:12px"><strong>Card protection active</strong><p>Your card ending 4821 is frozen. Review or unfreeze it from Cards.</p></div>':''}
      </section>
      <section class="section"><div class="section-head"><h2>Coming up</h2><a class="text-link" href="app.html?screen=subscriptions">Subscriptions</a></div>${commitmentList()}</section>
      <section class="section"><div class="section-head"><h2>${DATA.goal.name}</h2><a class="text-link" href="app.html?screen=savings-detail">View goal</a></div><div class="progress-wrap"><div class="progress-meta"><strong>${euro(DATA.goal.current)} saved</strong><span>${Math.round(DATA.goal.current/DATA.goal.target*100)}%</span></div><div class="progress" role="progressbar" aria-label="Emergency buffer progress" aria-valuemin="0" aria-valuemax="4000" aria-valuenow="2480"><span style="width:${DATA.goal.current/DATA.goal.target*100}%"></span></div><div class="progress-caption">${euro(DATA.goal.contribution)} planned on ${DATA.goal.next} · ${DATA.goal.status}</div></div></section>
      <section class="section"><div class="section-head"><h2>Recent activity</h2><a class="text-link" href="app.html?screen=activity">See all</a></div>${transactionRows(5)}</section>
    </div><aside class="context-rail"><div class="section-head"><h2>Money health</h2></div><div class="insight-line"><strong>Subscriptions are stable</strong><p>3 recurring services are included in your current horizon.</p></div><div class="insight-line"><strong>Dining is up €34</strong><p>Compared with your recent weekly pattern. Prototype comparison only.</p></div><div class="insight-line"><strong>Buffer protected</strong><p>${euro(DATA.account.buffer)} is excluded from safe to spend.</p></div><div style="margin-top:18px"><a class="btn btn-secondary btn-wide" href="app.html?screen=savings">Review money health</a></div></aside></div></main>`;
    return shell(main);
  }

  function renderActivity() {
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('Activity','Search, filter and understand what changed—not just where money went.')}
      <section class="section"><div class="field"><label for="txn-search">Search transactions</label><input class="input" id="txn-search" type="search" placeholder="Merchant, category or amount"></div><div class="filter-row" aria-label="Transaction filters"><button class="chip" aria-pressed="true">All</button><button class="chip" aria-pressed="false">Needs review</button><button class="chip" aria-pressed="false">Subscriptions</button><button class="chip" aria-pressed="false">Pending</button><button class="chip" aria-pressed="false">Income</button></div></section>
      <section class="section"><div class="section-head"><h2>September</h2><span class="meta">8 transactions</span></div>${transactionRows()}</section></main>`;
    return shell(main);
  }

  function renderTransactionDetail() {
    const frozen = isFrozen();
    const t = DATA.suspicious;
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('Transaction detail','Understand why this needs attention before taking a protective action.','app.html?screen=activity')}
      <section class="detail-hero"><span class="status status-risk">Unusual activity · review</span><div class="merchant">${t.merchant}</div><div class="detail-amount">${euro(-t.amount,true)}</div><p class="meta">${t.timestamp} · ${t.status}</p><div class="risk-reasons">${t.reasons.map(r=>`<span class="risk-chip">${r}</span>`).join('')}</div></section>
      <section class="section"><div class="callout callout-risk"><strong>Why NOVA surfaced this</strong><p>This alert uses simulated prototype logic. It does not confirm fraud. Review the details and choose the protection that fits.</p></div></section>
      <section class="section"><div class="section-head"><h2>Payment details</h2></div><dl class="detail-grid"><div class="detail-row"><dt>Status</dt><dd><span class="status status-success">${t.status}</span></dd></div><div class="detail-row"><dt>Card</dt><dd>${t.card}</dd></div><div class="detail-row"><dt>Channel</dt><dd>${t.channel}</dd></div><div class="detail-row"><dt>Location</dt><dd>${t.location}</dd></div><div class="detail-row"><dt>Category</dt><dd>${t.category}</dd></div><div class="detail-row"><dt>Reference</dt><dd class="mono">${t.id}</dd></div></dl></section>
      <section class="section"><div class="section-head"><h2>Protect your card</h2></div>${frozen?'<div class="callout callout-success"><strong>Card frozen</strong><p>New card payments and ATM withdrawals are blocked. Already-authorized or offline transactions can still settle.</p></div>':'<p class="meta">If you don’t recognize this payment, freezing is a reversible first step while you investigate.</p>'}<div class="action-stack">${frozen?'<a class="btn btn-primary" href="app.html?screen=cards">Review frozen card</a>':'<button class="btn btn-risk" id="freeze-card">Freeze card</button>'}<button class="btn btn-secondary" data-toast="Reporting is a prototype entry point. No bank case is created.">Report transaction</button></div></section>
    </main>`;
    return shell(main);
  }

  function renderCards(forceFrozen=false) {
    const frozen = isFrozen(forceFrozen);
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('Cards','Fast protection first, granular controls second.')}
      <div class="card-grid"><section><div class="card-object ${frozen?'frozen':''}" aria-label="NOVA debit card ending 4821, ${frozen?'frozen':'active'}"><div class="card-top"><span class="card-brand">NOVA</span><span class="card-chip" aria-hidden="true"></span></div><div class="card-number">•••• &nbsp;•••• &nbsp;•••• &nbsp;4821</div><div class="card-bottom"><div><small>Cardholder</small><strong>Lina Moreau</strong></div><div><small>Expires</small><strong>09/29</strong></div></div></div><div class="card-state">${frozen?'<span class="status status-neutral">Frozen</span>':'<span class="status status-success">Active</span>'}</div></section>
      <section><div class="section-head"><h2>Quick controls</h2><a class="text-link" href="app.html?screen=card-controls">All controls</a></div><div class="control-list"><div class="control-row"><div><strong>${frozen?'Unfreeze card':'Freeze card'}</strong><p>${frozen?'Restore new card payments after authentication.':'Pause new payments and ATM withdrawals.'}</p></div><button class="btn ${frozen?'btn-primary':'btn-risk'}" id="card-freeze-toggle">${frozen?'Unfreeze':'Freeze'}</button></div><div class="control-row"><div><strong>Online payments</strong><p>Allow purchases where the card is not physically present.</p></div><label class="switch"><span class="sr-only">Online payments</span><input type="checkbox" checked data-control="Online payments"><span></span></label></div><div class="control-row"><div><strong>Contactless</strong><p>Tap-to-pay at supported terminals.</p></div><label class="switch"><span class="sr-only">Contactless</span><input type="checkbox" checked data-control="Contactless"><span></span></label></div></div></section></div>
      <section class="section"><div class="section-head"><h2>Recent card activity</h2><a class="text-link" href="app.html?screen=activity">All activity</a></div>${transactionRows(4)}</section></main>`;
    return shell(main);
  }

  function renderCardControls() {
    const frozen = isFrozen();
    const controls = [['Online payments','Allow card-not-present purchases.',true],['Contactless','Allow tap-to-pay transactions.',true],['Cash withdrawals','Allow ATM cash withdrawals.',true],['Magstripe','Use only when chip/contactless are unavailable.',false]];
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('Card controls','Controls are simulated locally in this prototype.','app.html?screen=cards')}
      ${frozen?'<div class="callout callout-warning"><strong>Card is frozen</strong><p>Control preferences are saved, but new card payments remain blocked until you unfreeze.</p></div>':''}
      <section class="section"><div class="control-list">${controls.map(([name,desc,on])=>`<div class="control-row"><div><strong>${name}</strong><p>${desc}</p></div><label class="switch"><span class="sr-only">${name}</span><input type="checkbox" ${on?'checked':''} data-control="${name}"><span></span></label></div>`).join('')}</div></section>
      <section class="section"><div class="section-head"><h2>Daily card limit</h2></div><div class="field"><label for="daily-limit">Card purchases</label><input class="input" id="daily-limit" inputmode="decimal" value="1200"><span class="field-hint">€ per day · Prototype setting</span></div><button class="btn btn-primary" data-toast="Daily limit saved in the prototype.">Save limit</button></section></main>`;
    return shell(main);
  }

  function renderTransferRecipient() {
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('Send money','Choose the recipient first. NOVA will show the impact before you confirm.')}
      <div class="stepper" aria-label="Transfer progress"><span class="done"></span><span></span><span></span><span></span></div>
      <section class="section"><div class="field"><label for="recipient-search">Search recipient</label><input class="input" id="recipient-search" type="search" placeholder="Name or account"></div><div class="section-head"><h2>Recent</h2></div><a class="recipient-card" href="app.html?screen=transfer-amount"><span class="avatar" aria-hidden="true">MC</span><span><strong>${DATA.recipient.name}</strong><span>${DATA.recipient.bank} · ${DATA.recipient.account}</span></span><span style="margin-left:auto" aria-hidden="true">›</span></a><button class="btn btn-secondary" style="margin-top:18px" data-toast="New-recipient verification is outside this portfolio flow.">Add new recipient</button></section></main>`;
    return shell(main);
  }

  function renderTransferAmount() {
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('How much?','NOVA checks the transfer against the current balance before review.','app.html?screen=transfer-recipient')}
      <div class="stepper" aria-label="Transfer progress"><span class="done"></span><span class="done"></span><span></span><span></span></div>
      <section class="section"><div class="recipient-card"><span class="avatar" aria-hidden="true">MC</span><span><strong>${DATA.recipient.name}</strong><span>${DATA.recipient.account}</span></span></div><form id="amount-form" style="margin-top:22px"><div class="field"><label for="amount">Amount</label><div class="amount-field"><span class="currency-prefix" aria-hidden="true">€</span><input class="input amount-input" id="amount" name="amount" type="number" min="1" step="0.01" value="145" aria-describedby="amount-help amount-error"></div><span id="amount-help" class="field-hint">Available balance ${euro(DATA.account.balance)} · Protected buffer is never pulled automatically.</span><span id="amount-error" class="field-error" hidden></span></div><div class="field"><label for="note">Reference</label><input class="input" id="note" value="${DATA.recipient.reference}"></div>${horizon(true)}<button class="btn btn-primary btn-wide" type="submit" style="margin-top:18px">Review transfer</button></form></section></main>`;
    return shell(main);
  }

  function renderTransferReview(options={}) {
    const offline = !!options.offline;
    const biometricFailed = !!options.biometricFailed;
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('Review transfer','Nothing moves until you confirm after this review.','app.html?screen=transfer-amount')}
      <div class="stepper" aria-label="Transfer progress"><span class="done"></span><span class="done"></span><span class="done"></span><span></span></div>
      <div class="transfer-grid"><section><div class="review-list"><div class="review-row"><span>Recipient</span><strong>${DATA.recipient.name}<br><span class="meta">${DATA.recipient.account}</span></strong></div><div class="review-row review-total"><span>Amount</span><strong>${euro(DATA.recipient.amount)}</strong></div><div class="review-row"><span>Fee</span><strong>${euro(DATA.recipient.fee)}</strong></div><div class="review-row"><span>Expected arrival</span><strong>${DATA.recipient.arrival}<br><span class="meta">Prototype scenario</span></strong></div><div class="review-row"><span>Reference</span><strong>${DATA.recipient.reference}</strong></div></div>
        ${biometricFailed?'<div class="callout callout-risk" style="margin-top:18px"><strong>We couldn’t verify you</strong><p>Try biometric confirmation again or use your passcode. No transfer has been made.</p></div>':''}
        ${offline?'<div class="callout callout-warning" style="margin-top:18px"><strong>Reconnect to continue</strong><p>Your review is preserved. NOVA will revalidate the balance before you can confirm again.</p></div>':''}
        <div class="action-stack">${biometricFailed?'<button class="btn btn-primary" id="use-passcode">Use passcode</button><button class="btn btn-secondary" id="retry-biometric">Try biometrics again</button>':`<button class="btn btn-primary" id="confirm-transfer" ${offline?'disabled aria-disabled="true" title="Reconnect to continue"':''}>Confirm with biometrics</button><a class="btn btn-secondary" href="app.html?screen=transfer-amount">Edit transfer</a>`}</div></section>
        <aside>${horizon(true,DATA.recipient.afterSafe)}<div class="callout" style="margin-top:14px"><strong>After this transfer</strong><p>Projected safe to spend becomes <strong>${euro(DATA.recipient.afterSafe)}</strong>. Known bills and your protected buffer remain covered in this prototype estimate.</p></div></aside></div></main>`;
    return shell(main,{offline});
  }

  function renderTransferSuccess() {
    const main = `<main id="main" class="main-wrap" tabindex="-1"><section class="receipt"><div class="receipt-mark" aria-hidden="true">✓</div><p class="eyebrow">SIMULATED TRANSFER</p><h1>Transfer prepared</h1><p>This portfolio prototype simulates a successful confirmation. No real money moved.</p><div class="specimen" style="max-width:520px;margin:0 auto;text-align:left"><div class="review-row"><span>To</span><strong>${DATA.recipient.name}</strong></div><div class="review-row"><span>Amount</span><strong>${euro(DATA.recipient.amount)}</strong></div><div class="review-row"><span>Reference</span><strong>${DATA.recipient.reference}</strong></div><div class="review-row"><span>Prototype receipt</span><strong class="mono">NVA-TX-0915-2048</strong></div></div><div class="action-stack" style="max-width:520px;margin:20px auto 0"><a class="btn btn-primary" href="app.html?screen=home">Done</a><button class="btn btn-secondary" data-toast="Receipt sharing is simulated in this prototype.">Share receipt</button></div></section></main>`;
    return shell(main);
  }

  function renderSavings() {
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('Save','Goals stay connected to everyday spending instead of living in a separate budget spreadsheet.')}
      <section class="money-hero"><p class="eyebrow">Across your goals</p><div class="money-amount">${euro(DATA.goal.current)}</div><div class="money-sub"><strong>Saved toward Emergency buffer</strong><span>${DATA.goal.status}</span></div></section>
      <section class="section"><a class="launch-card" href="app.html?screen=savings-detail" style="min-height:210px"><div><span class="status status-success">On track</span><h2 style="font-size:1.9rem;letter-spacing:-.04em;margin:18px 0 8px">Emergency buffer</h2><p>${euro(DATA.goal.current)} of ${euro(DATA.goal.target)} · ${euro(DATA.goal.contribution)} planned ${DATA.goal.next}</p></div><div class="progress"><span style="width:${DATA.goal.current/DATA.goal.target*100}%"></span></div><span class="launch-link">Open goal →</span></a></section>
      <section class="section"><div class="section-head"><h2>Money health connection</h2></div>${horizon(true)}</section></main>`;
    return shell(main);
  }

  function renderSavingsDetail() {
    const pct=Math.round(DATA.goal.current/DATA.goal.target*100);
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header(DATA.goal.name,'A goal contribution is treated as a commitment in Money Horizon.','app.html?screen=savings')}
      <section class="money-hero"><p class="eyebrow">${pct}% complete</p><div class="money-amount">${euro(DATA.goal.current)}</div><div class="money-sub"><span>Target ${euro(DATA.goal.target)}</span><span>${euro(DATA.goal.target-DATA.goal.current)} remaining</span></div><div class="progress" style="margin-top:20px"><span style="width:${pct}%"></span></div></section>
      <section class="section"><div class="field"><label for="contribution">Monthly contribution</label><input class="input" id="contribution" value="260" inputmode="decimal"><span class="field-hint">Changing this updates the Money Horizon estimate; it does not move money in this prototype.</span></div><button class="btn btn-primary" id="save-contribution">Preview change</button></section>
      <section class="section">${horizon()}</section></main>`;
    return shell(main);
  }

  function renderSubscriptions() {
    const rows=[['Mobile plan','Sep 22',32,'Monthly'],['Streaming service','Sep 24',14.99,'Monthly'],['River Gym','Oct 02',34,'Monthly']];
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('Subscriptions','Recurring payments are visible as future commitments, but bank controls do not pretend to cancel merchant contracts.')}
      <section class="section"><div class="callout"><strong>Included in Money Horizon</strong><p>Known recurring payments are reflected in safe-to-spend when they fall inside the planning horizon.</p></div><div class="list" style="margin-top:18px">${rows.map(([name,date,amount,cycle])=>`<div class="list-row"><div class="list-icon" aria-hidden="true">↻</div><div><div class="list-title">${name}</div><div class="list-sub">${cycle} · next ${date}</div></div><div class="list-value">${euro(-amount,true)}<small>scheduled</small></div></div>`).join('')}</div></section>
      <section class="section"><div class="callout callout-warning"><strong>Blocking is not cancellation</strong><p>A bank-level merchant/card block can stop future card attempts, but the merchant may still consider the subscription active. Cancel with the merchant when you intend to end the service.</p></div></section></main>`;
    return shell(main);
  }

  function renderSecurity() {
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('Security center','High-consequence settings are explicit, reversible where possible, and explain what they protect.')}
      <section class="section"><div class="control-list"><div class="control-row"><div><strong>Biometric confirmation</strong><p>Confirm transfers and card-security changes with device biometrics.</p></div><label class="switch"><span class="sr-only">Biometric confirmation</span><input type="checkbox" checked data-control="Biometric confirmation"><span></span></label></div><div class="control-row"><div><strong>Hide sensitive notification previews</strong><p>Show “Open NOVA to review account activity” instead of merchant and amount.</p></div><label class="switch"><span class="sr-only">Hide sensitive notification previews</span><input type="checkbox" data-control="Sensitive previews"><span></span></label></div><div class="control-row"><div><strong>Login alerts</strong><p>Notify when a new device signs in.</p></div><label class="switch"><span class="sr-only">Login alerts</span><input type="checkbox" checked data-control="Login alerts"><span></span></label></div></div></section>
      <section class="section"><div class="section-head"><h2>Account access</h2></div><button class="btn btn-secondary" data-toast="Passcode change is simulated in this prototype.">Change passcode</button><button class="btn btn-secondary" style="margin-left:8px" data-toast="Device management is a prototype entry point.">Trusted devices</button></section>
      <section class="section"><div class="callout callout-risk"><strong>Lost access?</strong><p>Freeze the card separately from account-access recovery. The prototype keeps these consequences distinct.</p></div></section></main>`;
    return shell(main);
  }

  function renderNotifications() {
    const notices=[['action','Unusual card activity needs review','€189.40 at ByteMart Online · 02:14','app.html?screen=transaction-detail'],['info','Rent is due in 5 days','€620 is already included in your Money Horizon.','app.html?screen=home'],['success','Emergency buffer is on track','€260 planned for Sep 28.','app.html?screen=savings-detail']];
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('Notifications','Urgent enough to act, restrained enough not to overclaim.')}
      <section class="section"><div class="list">${notices.map(([type,title,sub,href])=>`<a class="list-row ${type==='action'?'is-risk':''}" href="${href}"><div class="list-icon" aria-hidden="true">${type==='action'?'!':type==='success'?'✓':'·'}</div><div><div class="list-title">${title}</div><div class="list-sub">${sub}</div></div><span class="chevron" aria-hidden="true">›</span></a>`).join('')}</div></section></main>`;
    return shell(main);
  }

  function renderOnboarding() {
    const main = `<main id="main" class="main-wrap" tabindex="-1"><section class="onboarding-hero"><div><p class="eyebrow">NOVA · Personal Banking & Money Health</p><h1 style="font-size:clamp(3.2rem,14vw,7rem);line-height:.9;letter-spacing:-.075em;margin:14px 0 18px">See what’s truly safe to spend.</h1><p style="font-size:1.05rem;color:var(--ink-2);max-width:52ch">NOVA combines your balance, known bills, planned savings and protected buffer into one calm decision view.</p></div><div class="onboarding-art" aria-hidden="true"><div class="orbit"><span class="orbit-dot"></span></div></div><div><div class="callout"><strong>Portfolio prototype</strong><p>Identity checks, balances and money movement are simulated. No real banking service is connected.</p></div><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=kyc">Get started</a><a class="btn btn-secondary" href="app.html?screen=home">Explore demo account</a></div></div></section></main>`;
    return shell(main);
  }

  function renderKyc() {
    const state = new URLSearchParams(location.search).get('state') || 'intro';
    const states = {
      intro:`<div class="kyc-capture"><div class="capture-frame"><div><strong>Before you begin</strong><p>Have a valid photo ID, good lighting and a few minutes. We’ll explain each step and why it’s needed.</p></div></div></div><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=kyc&state=capture">Continue to ID check</a><button class="btn btn-secondary" data-toast="Help and alternate verification are prototype entry points.">I need help</button></div>`,
      capture:`<div class="kyc-capture"><div class="capture-frame"><div><strong>Position your ID inside the frame</strong><p>Keep all four edges visible and avoid glare.</p></div></div></div><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=kyc&state=review">Use this capture</a><a class="btn btn-secondary" href="app.html?screen=kyc&state=failed">Simulate quality issue</a></div>`,
      failed:`<div class="callout callout-risk"><strong>We couldn’t read the document clearly</strong><p>The image was too reflective around the document number. Move away from direct light and keep the card flat.</p></div><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=kyc&state=capture">Try again</a><a class="btn btn-secondary" href="app.html?screen=kyc&state=manual">Request another verification option</a></div>`,
      manual:`<div class="callout"><strong>Manual review requested</strong><p>A real service would explain expected timing and support options here. This prototype does not submit identity data.</p></div><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=home">Continue demo</a><a class="btn btn-secondary" href="app.html?screen=kyc&state=capture">Back to capture</a></div>`,
      review:`<div class="callout callout-success"><strong>Capture ready for review</strong><p>In a production flow, NOVA would show the extracted identity fields for correction before submission.</p></div><dl class="detail-grid" style="margin-top:16px"><div class="detail-row"><dt>Name</dt><dd>Lina Moreau</dd></div><div class="detail-row"><dt>Date of birth</dt><dd>14 Apr 2001</dd></div><div class="detail-row"><dt>Document</dt><dd>Sample ID •••• 7231</dd></div><div class="detail-row"><dt>Status</dt><dd>SIMULATED</dd></div></dl><div class="action-stack"><a class="btn btn-primary" href="app.html?screen=home">Submit demo & continue</a><a class="btn btn-secondary" href="app.html?screen=kyc&state=capture">Retake</a></div>`
    };
    const steps={intro:1,capture:2,failed:2,manual:3,review:3}; const step=steps[state]||1;
    const main = `<main id="main" class="main-wrap" tabindex="-1">${header('Verify your identity','Clear guidance, recovery and truthful simulated status.','app.html?screen=onboarding')}<div class="stepper" aria-label="Identity verification progress"><span class="done"></span><span class="${step>=2?'done':''}"></span><span class="${step>=3?'done':''}"></span></div><section class="section">${states[state]||states.intro}</section></main>`;
    return shell(main);
  }

  function renderError() {
    const main = `<main id="main" class="main-wrap" tabindex="-1"><section class="empty-state"><div class="empty-mark" aria-hidden="true">!</div><p class="eyebrow">TRANSFER NOT COMPLETED</p><h1>Something changed before confirmation</h1><p>NOVA could not revalidate the balance. No money moved. Review the amount and try again.</p><div class="action-stack" style="max-width:460px;margin:20px auto 0"><a class="btn btn-primary" href="app.html?screen=transfer-review">Review again</a><a class="btn btn-secondary" href="app.html?screen=home">Return home</a></div></section></main>`;
    return shell(main);
  }

  function openDialog({title, body, primaryLabel='Continue', primaryClass='btn-primary', onPrimary, secondaryLabel='Cancel', onSecondary}) {
    const backdrop=document.createElement('div');
    backdrop.className='dialog-backdrop';
    backdrop.innerHTML=`<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabindex="-1"><h2 id="dialog-title">${title}</h2>${body}<div class="dialog-actions"><button class="btn ${primaryClass}" data-primary>${primaryLabel}</button><button class="btn btn-secondary" data-secondary>${secondaryLabel}</button></div></div>`;
    document.body.appendChild(backdrop);
    const dialog=backdrop.querySelector('.dialog');
    const primary=backdrop.querySelector('[data-primary]');
    const secondary=backdrop.querySelector('[data-secondary]');
    const close=()=>{backdrop.remove();document.removeEventListener('keydown',keyHandler)};
    const keyHandler=(e)=>{
      if(e.key==='Escape'){e.preventDefault();close();return;}
      if(e.key==='Tab'){
        const focusable=[...backdrop.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')];
        const first=focusable[0],last=focusable[focusable.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    };
    document.addEventListener('keydown',keyHandler);
    primary.addEventListener('click',()=>{close();onPrimary&&onPrimary();});
    secondary.addEventListener('click',()=>{close();onSecondary&&onSecondary();});
    backdrop.addEventListener('mousedown',e=>{if(e.target===backdrop)close();});
    dialog.focus();
  }

  function toast(message) {
    document.querySelector('.toast')?.remove();
    const node=document.createElement('div'); node.className='toast'; node.setAttribute('role','status'); node.textContent=message; document.body.appendChild(node);
    setTimeout(()=>node.remove(),3200);
  }

  function bindInteractions() {
    document.querySelectorAll('[data-toast]').forEach(el=>el.addEventListener('click',e=>{if(el.getAttribute('href')==='#')e.preventDefault();toast(el.dataset.toast);}));
    document.querySelectorAll('[data-control]').forEach(input=>input.addEventListener('change',()=>toast(`${input.dataset.control} ${input.checked?'enabled':'disabled'} · prototype state.`)));
    document.querySelectorAll('.chip').forEach(chip=>chip.addEventListener('click',()=>{document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed','false'));chip.setAttribute('aria-pressed','true');toast(`${chip.textContent.trim()} filter applied in the prototype.`)}));

    const freeze=document.querySelector('#freeze-card');
    if(freeze) freeze.addEventListener('click',()=>openDialog({title:'Freeze card ending 4821?',body:'<p>This is reversible. New card payments and ATM withdrawals will be blocked.</p><ul class="dialog-list"><li>Already-authorized or offline payments can still settle.</li><li>Refunds can still return to your account.</li><li>Freezing does not cancel a merchant subscription.</li></ul>',primaryLabel:'Freeze card',primaryClass:'btn-risk',onPrimary:()=>{storageSet('nova_card_frozen','true');toast('Card frozen. New card payments and ATM withdrawals are blocked.');setTimeout(()=>location.href='app.html?screen=transaction-detail',350)}}));

    const toggle=document.querySelector('#card-freeze-toggle');
    if(toggle) toggle.addEventListener('click',()=>{
      const frozen=isFrozen();
      openDialog({title:frozen?'Unfreeze card?':'Freeze card?',body:`<p>${frozen?'New card payments will be restored after this simulated authentication.':'New card payments and ATM withdrawals will be blocked. Already-authorized payments can still settle.'}</p>`,primaryLabel:frozen?'Authenticate & unfreeze':'Freeze card',primaryClass:frozen?'btn-primary':'btn-risk',onPrimary:()=>{storageSet('nova_card_frozen',String(!frozen));toast(frozen?'Card active again.':'Card frozen.');setTimeout(()=>location.href='app.html?screen=cards',300)}});
    });

    const amountForm=document.querySelector('#amount-form');
    if(amountForm) amountForm.addEventListener('submit',e=>{
      e.preventDefault(); const input=amountForm.querySelector('#amount'); const err=amountForm.querySelector('#amount-error'); const val=Number(input.value);
      if(!val||val<=0){input.setAttribute('aria-invalid','true');err.hidden=false;err.textContent='Enter an amount greater than €0.';input.focus();return;}
      if(val>DATA.account.balance){input.setAttribute('aria-invalid','true');err.hidden=false;err.textContent=`You need ${euro(val-DATA.account.balance)} more to send this amount.`;input.focus();return;}
      storageSet('nova_transfer_amount',val); location.href='app.html?screen=transfer-review';
    });

    const confirm=document.querySelector('#confirm-transfer');
    if(confirm) confirm.addEventListener('click',()=>openDialog({title:'Confirm with biometrics',body:'<p>A real mobile app would now invoke the device biometric prompt. Choose a prototype outcome to inspect the flow.</p><p class="prototype-label">Prototype control</p>',primaryLabel:'Approve demo',onPrimary:()=>{location.href='app.html?screen=transfer-success'},secondaryLabel:'Simulate failure',onSecondary:()=>{location.href='app.html?screen=biometric-failed'}}));

    const retry=document.querySelector('#retry-biometric'); if(retry) retry.addEventListener('click',()=>location.href='app.html?screen=transfer-review');
    const passcode=document.querySelector('#use-passcode'); if(passcode) passcode.addEventListener('click',()=>openDialog({title:'Passcode fallback',body:'<p>Fallback preserves the user’s ability to finish the task without implying biometrics are mandatory.</p><div class="field"><label for="demo-passcode">Prototype passcode</label><input id="demo-passcode" class="input" inputmode="numeric" value="4821" aria-describedby="passcode-hint"><span id="passcode-hint" class="field-hint">Demo only. No credential is stored.</span></div>',primaryLabel:'Confirm demo passcode',onPrimary:()=>location.href='app.html?screen=transfer-success'}));

    const contribution=document.querySelector('#save-contribution'); if(contribution) contribution.addEventListener('click',()=>{toast('Contribution preview updated. Money Horizon would glide to the new composition.');});
  }

  function render() {
    const renderScreen=screens[currentScreen]||screens.home;
    app.innerHTML=renderScreen();
    document.title=`NOVA — ${currentScreen.replaceAll('-',' ')} · Personal Banking`;
    bindInteractions();
    requestAnimationFrame(()=>document.querySelector('#main')?.focus({preventScroll:true}));
  }

  render();
})();
