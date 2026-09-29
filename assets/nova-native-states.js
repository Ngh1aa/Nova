(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const screen = params.get('screen') || 'home';
  const state = params.get('state') || 'normal';
  const main = document.querySelector('#main');

  if (!main) return;

  const injectStyles = () => {
    if (document.querySelector('style[data-nova-native-states]')) return;
    const style = document.createElement('style');
    style.dataset.novaNativeStates = 'true';
    style.textContent = `
      .nova-native-state-page{min-height:calc(100vh - 110px)}
      .nova-native-state-shell{min-height:520px;display:grid;place-items:center;padding:42px 22px}
      .nova-native-state-card{width:min(920px,100%);padding:clamp(26px,4vw,48px);border:1px solid rgba(17,19,24,.07);border-radius:30px;background:rgba(255,255,255,.96);box-shadow:0 18px 48px rgba(52,65,86,.09)}
      .nova-native-state-card .nova-state-eyebrow{margin:0 0 10px;color:#667085;font-size:11px;font-weight:750;letter-spacing:.08em;text-transform:uppercase}
      .nova-native-state-card h1{margin:0;color:#111318;font-size:clamp(2.15rem,5vw,4.8rem);line-height:.98;letter-spacing:-.055em}
      .nova-native-state-card>p{max-width:66ch;margin:14px 0 0;color:#667085;font-size:14px;line-height:1.65}
      .nova-native-state-actions{margin-top:26px;display:flex;flex-wrap:wrap;gap:10px}
      .nova-native-state-actions a{min-height:46px;display:inline-flex;align-items:center;justify-content:center;padding:0 16px;border-radius:16px;font-size:12px;font-weight:750;text-decoration:none}
      .nova-native-state-actions .primary{background:#111318;color:#fff}
      .nova-native-state-actions .secondary{border:1px solid rgba(17,19,24,.11);background:#f7f9fc;color:#29313d}
      .nova-native-state-note{margin-top:22px;padding:14px 16px;border-radius:18px;background:#f5f8fc;color:#526071;font-size:12px;line-height:1.55}
      .nova-native-empty-mark{width:54px;height:54px;margin-bottom:20px;display:grid;place-items:center;border-radius:18px;background:#e9f4ff;color:#287bdb;font-size:28px;font-weight:500}
      .nova-native-empty-grid{margin-top:24px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .nova-native-empty-grid div{padding:14px;border-radius:18px;background:#f8fafc}
      .nova-native-empty-grid small{display:block;color:#7b8799;font-size:10px}
      .nova-native-empty-grid strong{display:block;margin-top:5px;color:#1d222a;font-size:13px}
      .nova-native-loading{aria-busy:true}
      .nova-native-loading-row{margin-top:24px;display:grid;gap:12px}
      .nova-native-skeleton{height:18px;border-radius:10px;background:linear-gradient(90deg,#edf1f6 25%,#f8fafc 45%,#edf1f6 65%);background-size:220% 100%;animation:novaNativeShimmer 1.1s linear infinite}
      .nova-native-skeleton.amount{height:74px;width:min(420px,72%);border-radius:18px}
      .nova-native-skeleton.medium{width:62%}.nova-native-skeleton.short{width:38%}.nova-native-skeleton.bar{height:86px;width:100%;margin-top:8px;border-radius:22px}
      .nova-native-loading-meta{margin-top:18px;display:flex;gap:8px;align-items:center;color:#667085;font-size:12px}
      .nova-native-loading-meta span{width:8px;height:8px;border-radius:50%;background:#5fa8ff;box-shadow:0 0 0 5px #e9f4ff}
      .nova-native-edge .nova-edge-amount{margin-top:10px;color:#a52d3c;font-size:clamp(3rem,7vw,6.4rem);font-weight:850;line-height:.92;letter-spacing:-.065em;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
      .nova-native-edge .nova-edge-status{margin-top:13px;display:inline-flex;padding:8px 11px;border-radius:999px;background:#fff0f2;color:#8e2734;font-size:11px;font-weight:800}
      .nova-native-edge-grid{margin-top:24px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
      .nova-native-edge-grid div{padding:14px;border-radius:18px;background:#f8fafc}
      .nova-native-edge-grid small{display:block;color:#7b8799;font-size:9px;text-transform:uppercase;letter-spacing:.05em}
      .nova-native-edge-grid strong{display:block;margin-top:5px;color:#1d222a;font-size:14px;font-variant-numeric:tabular-nums}
      .nova-native-edge-alert{margin-top:18px;padding:16px 18px;border:1px solid #edc2c8;border-radius:20px;background:#fff6f7;color:#6f1f2a;line-height:1.55}
      .nova-native-edge-alert strong{display:block;margin-bottom:4px;font-size:13px}.nova-native-edge-alert span{font-size:12px}
      @keyframes novaNativeShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      @media(max-width:760px){.nova-native-state-shell{min-height:440px;padding:24px 0}.nova-native-state-card{border-radius:24px}.nova-native-empty-grid,.nova-native-edge-grid{grid-template-columns:1fr 1fr}.nova-native-state-actions{display:grid}.nova-native-state-actions a{width:100%}}
      @media(max-width:440px){.nova-native-empty-grid,.nova-native-edge-grid{grid-template-columns:1fr}}
      @media(prefers-reduced-motion:reduce){.nova-native-skeleton{animation:none}}
    `;
    document.head.appendChild(style);
  };

  const setAccountSummary = (value) => {
    document.querySelectorAll('.sidebar-account strong').forEach((node) => { node.textContent = value; });
  };

  const setStateMain = (name, html) => {
    injectStyles();
    document.body.dataset.productState = name;
    main.dataset.nativeProductState = name;
    main.className = 'main-wrap home-page nova-native-state-page';
    main.innerHTML = `<div class="nova-native-state-shell">${html}</div>`;
  };

  const renderEmpty = () => {
    setAccountSummary('—');
    setStateMain('empty', `
      <section class="nova-native-state-card nova-native-empty" aria-labelledby="nova-empty-title">
        <div class="nova-native-empty-mark" aria-hidden="true">+</div>
        <p class="nova-state-eyebrow">First-use account state</p>
        <h1 id="nova-empty-title">Safe to spend unavailable</h1>
        <p>No accounts are connected yet, so Nova will not guess a spendable amount. Connect a demo account to calculate balance, known commitments, planned saving and the protected buffer.</p>
        <div class="nova-native-empty-grid" aria-label="Unavailable planning inputs">
          <div><small>Balance</small><strong>Not connected</strong></div>
          <div><small>Known commitments</small><strong>Waiting for account data</strong></div>
          <div><small>Safe to spend</small><strong>Not calculated</strong></div>
        </div>
        <div class="nova-native-state-actions">
          <a class="primary" href="app.html?screen=home">Connect demo account</a>
          <a class="secondary" href="app.html?screen=onboarding">Review onboarding</a>
        </div>
        <div class="nova-native-state-note" role="note">Prototype boundary: this action loads Nova’s demo account only. No real bank connection or credential exchange occurs.</div>
      </section>`);
    document.title = 'Nova — No linked accounts';
  };

  const renderLoading = () => {
    setAccountSummary('Updating…');
    setStateMain('loading', `
      <section class="nova-native-state-card nova-native-loading" aria-labelledby="nova-loading-title" aria-busy="true" aria-live="polite">
        <p class="nova-state-eyebrow">Recalculating Money Horizon</p>
        <h1 id="nova-loading-title">Calculating what is safe to spend…</h1>
        <p>Nova is checking the latest balance, known commitments, planned saving and protected buffer before showing a spendable amount.</p>
        <div class="nova-native-loading-row" aria-hidden="true">
          <div class="nova-native-skeleton amount"></div>
          <div class="nova-native-skeleton medium"></div>
          <div class="nova-native-skeleton short"></div>
          <div class="nova-native-skeleton bar"></div>
        </div>
        <div class="nova-native-loading-meta"><span aria-hidden="true"></span>Money actions remain unavailable until this calculation completes.</div>
      </section>`);
    document.title = 'Nova — Updating Money Horizon';

    if (!params.has('pin')) {
      window.setTimeout(() => {
        const next = new URL(location.href);
        next.searchParams.delete('state');
        next.searchParams.delete('pin');
        location.replace(next.pathname + next.search + next.hash);
      }, 1200);
    }
  };

  const renderEdge = () => {
    const scenario = {
      balance: 2840,
      fixedCommitments: 780,
      goalContribution: 260,
      protectedBuffer: 500,
      annualTaxPayment: 9720
    };
    const safe = scenario.balance - scenario.fixedCommitments - scenario.goalContribution - scenario.protectedBuffer - scenario.annualTaxPayment;
    const euro = (value) => `${value < 0 ? '−' : ''}€${Math.abs(value).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    setAccountSummary(euro(scenario.balance));
    setStateMain('edge', `
      <section class="nova-native-state-card nova-native-edge" aria-labelledby="nova-edge-title">
        <p class="nova-state-eyebrow">Money Horizon · high-obligation scenario</p>
        <h1 id="nova-edge-title">Your plan needs attention</h1>
        <div class="nova-edge-amount">${euro(safe)}</div>
        <div class="nova-edge-status">Overcommitted — not safe to spend</div>
        <p>Known obligations exceed the money available after Nova preserves the protected buffer. The negative value stays visible instead of being clipped to €0.</p>
        <div class="nova-native-edge-grid" aria-label="Overcommitted Money Horizon calculation">
          <div><small>Balance</small><strong>${euro(scenario.balance)}</strong></div>
          <div><small>Existing commitments + saving</small><strong>${euro(scenario.fixedCommitments + scenario.goalContribution)}</strong></div>
          <div><small>Annual tax payment</small><strong>${euro(scenario.annualTaxPayment)}</strong></div>
          <div><small>Protected buffer</small><strong>${euro(scenario.protectedBuffer)}</strong></div>
        </div>
        <div class="nova-native-edge-alert" role="status"><strong>Future obligations exceed available balance by ${euro(Math.abs(safe))}.</strong><span>This is a simulated stress scenario. No money has moved, and the €500 protected buffer remains reserved.</span></div>
        <div class="nova-native-state-actions">
          <a class="primary" href="app.html?screen=subscriptions">Review commitments</a>
          <a class="secondary" href="app.html?screen=savings-detail">Adjust savings preview</a>
          <a class="secondary" href="app.html?screen=home">Return to normal demo</a>
        </div>
      </section>`);
    document.title = 'Nova — Money Horizon needs attention';
  };

  if (screen === 'error') {
    document.body.dataset.productState = 'error';
    main.dataset.nativeProductState = 'error';
    return;
  }

  if (screen !== 'home') return;
  if (state === 'empty') renderEmpty();
  if (state === 'loading') renderLoading();
  if (state === 'edge') renderEdge();
})();
