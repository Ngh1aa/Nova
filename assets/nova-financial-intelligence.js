(() => {
  'use strict';

  const screen = new URLSearchParams(location.search).get('screen') || 'home';

  function euro(value) {
    return `€${Number(value).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function forecastMarkup() {
    return `<section class="fi-horizon" aria-labelledby="fi-horizon-title">
      <div class="fi-horizon-head">
        <div>
          <h2 id="fi-horizon-title">Money Horizon</h2>
          <p>A 14-day forecast showing how known bills, saving and income change your available balance.</p>
        </div>
        <span class="fi-horizon-range">15–30 Sep</span>
      </div>
      <div class="fi-chart" role="img" aria-label="Projected account balance starts at €2,840, declines as rent, subscriptions, utilities and savings are paid, then rises after expected income on 30 September. Protected buffer remains €500.">
        <svg viewBox="0 0 900 258" aria-hidden="true" preserveAspectRatio="none">
          <line class="fi-grid-line" x1="20" y1="52" x2="880" y2="52" />
          <line class="fi-grid-line" x1="20" y1="104" x2="880" y2="104" />
          <line class="fi-grid-line" x1="20" y1="156" x2="880" y2="156" />
          <line class="fi-buffer-line" x1="20" y1="211" x2="880" y2="211" />
          <path class="fi-forecast-area" d="M28 48 L216 92 L336 101 L466 106 L610 124 L698 142 L870 34 L870 211 L28 211 Z" />
          <path class="fi-forecast-line" d="M28 48 L216 92 L336 101 L466 106 L610 124 L698 142 L870 34" />
          <circle class="fi-today-dot" cx="28" cy="48" r="5" />
          <circle class="fi-event-dot" cx="216" cy="92" r="5" />
          <circle class="fi-event-dot" cx="336" cy="101" r="5" />
          <circle class="fi-event-dot" cx="466" cy="106" r="5" />
          <circle class="fi-event-dot" cx="610" cy="124" r="5" />
          <circle class="fi-event-dot" cx="698" cy="142" r="5" />
          <circle class="fi-today-dot" cx="870" cy="34" r="5" />
          <text class="fi-chart-value" x="28" y="30">€2,840</text>
          <text class="fi-chart-value" x="808" y="22">€3,900 est.</text>
          <text class="fi-chart-label" x="28" y="246">Today</text>
          <text class="fi-chart-label" x="200" y="246">20 Sep</text>
          <text class="fi-chart-label" x="454" y="246">24 Sep</text>
          <text class="fi-chart-label" x="596" y="246">27 Sep</text>
          <text class="fi-chart-label" x="824" y="246">30 Sep</text>
          <text class="fi-chart-label" x="24" y="205">Protected buffer €500</text>
        </svg>
      </div>
      <div class="fi-events" aria-hidden="true">
        <div class="fi-event"><span>20 Sep</span><strong>Apartment rent</strong><b>−€620.00</b></div>
        <div class="fi-event"><span>22–24 Sep</span><strong>Subscriptions</strong><b>−€46.99</b></div>
        <div class="fi-event"><span>27–28 Sep</span><strong>Utilities + saving</strong><b>−€373.01</b></div>
        <div class="fi-event"><span>30 Sep</span><strong>Expected income</strong><b>+€2,100.00</b></div>
      </div>
      <div class="fi-horizon-foot"><span>Known commitments are already excluded from safe to spend.</span><span>Safe today <strong>€1,300.00</strong></span></div>
    </section>`;
  }

  function impactMarkup() {
    return `<div class="fi-impact-head"><p class="eyebrow">Next 14 days</p><h2>Upcoming impact</h2></div>
      <div class="fi-impact-total">−€1,040.00<small>known commitments and planned saving</small></div>
      <div class="fi-impact-list">
        <div class="fi-impact-item"><i></i><div><strong>Apartment rent</strong><span>20 Sep, bill</span></div><b>−€620.00</b></div>
        <div class="fi-impact-item"><i></i><div><strong>Mobile plan</strong><span>22 Sep, subscription</span></div><b>−€32.00</b></div>
        <div class="fi-impact-item"><i></i><div><strong>Streaming</strong><span>24 Sep, subscription</span></div><b>−€14.99</b></div>
        <div class="fi-impact-item"><i></i><div><strong>Utilities estimate</strong><span>27 Sep, estimate</span></div><b>−€113.01</b></div>
        <div class="fi-impact-item"><i></i><div><strong>Emergency buffer</strong><span>28 Sep, planned saving</span></div><b>−€260.00</b></div>
      </div>
      <div class="fi-impact-safe"><strong>Your €500 buffer stays protected.</strong>Nova excludes it from safe to spend before showing the €1,300 available today.</div>`;
  }

  function enhanceHome() {
    const kicker = document.querySelector('.home-kicker .eyebrow');
    if (kicker) kicker.textContent = 'Money overview';

    const heroEyebrow = document.querySelector('.decision-copy > .eyebrow');
    if (heroEyebrow) heroEyebrow.textContent = 'Available after planned commitments';

    const amount = document.querySelector('.money-amount');
    if (amount && !document.querySelector('.fi-delta')) {
      amount.insertAdjacentHTML('afterend', '<div class="fi-delta">€124 more available than last week</div>');
    }

    const label = document.querySelector('.decision-label');
    if (label) label.textContent = 'Safe to spend';

    const sub = document.querySelector('.money-sub');
    if (sub) {
      sub.innerHTML = '<span>Total balance €2,840.00</span><span>Protected buffer €500.00</span><span>Updated 09:42</span>';
    }

    const actions = [...document.querySelectorAll('.decision-action')];
    if (actions[0]) {
      const title = actions[0].querySelector('strong');
      const note = actions[0].querySelector('small');
      if (title) title.textContent = 'Send money';
      if (note) note.textContent = 'Preview balance impact';
    }
    if (actions[1]) {
      const title = actions[1].querySelector('strong');
      const note = actions[1].querySelector('small');
      if (title) title.textContent = 'Add to savings';
      if (note) note.textContent = 'Keep your plan on track';
    }

    const horizon = document.querySelector('.horizon');
    if (horizon) horizon.outerHTML = forecastMarkup();

    const context = document.querySelector('.context-panel');
    if (context) context.innerHTML = impactMarkup();

    const attention = document.querySelector('.attention-strip small');
    if (attention) attention.textContent = '€189.40 at ByteMart Online, Singapore — 02:14';
  }

  function enhanceActivity() {
    const eyebrow = document.querySelector('.activity-header .eyebrow');
    if (eyebrow) eyebrow.textContent = 'Account activity';
  }

  function enhanceTransaction() {
    const status = document.querySelector('.dossier-topline .status-risk');
    if (status) status.textContent = 'Needs review';
    const title = document.querySelector('.dossier-title');
    if (title) title.style.maxWidth = '16ch';
  }

  function enhanceTransferSuccess() {
    const heading = document.querySelector('.receipt h1');
    if (heading) heading.textContent = 'Transfer successful';
  }

  function enhanceSavings() {
    const eyebrow = document.querySelector('.goal-hero .eyebrow');
    if (eyebrow) eyebrow.textContent = 'Savings goal';
  }

  function init() {
    document.body.classList.add('nova-fi');
    if (screen === 'home') enhanceHome();
    if (screen === 'activity') enhanceActivity();
    if (screen === 'transaction-detail') enhanceTransaction();
    if (screen === 'transfer-success') enhanceTransferSuccess();
    if (screen === 'savings' || screen === 'savings-detail') enhanceSavings();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
