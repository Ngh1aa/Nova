/* Nova v6 — Money Horizon split on the Home hero.
   Shows how the total balance divides into Safe to spend, known commitments and
   the protected buffer, so the formula is visible instead of hidden behind "i".
   Values mirror the simulated MODEL in assets/nova-current-state.js. Only runs on
   the normal Home state; empty/loading/edge states keep their own hero. */
(() => {
  'use strict';

  const screen = new URLSearchParams(location.search).get('screen') || 'home';

  const MODEL = Object.freeze({ balance: 2840, committed: 1040, buffer: 500, safe: 1300 });
  const money = (value) => `€${value.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  function addHorizonSplit() {
    const hero = document.querySelector('#main .nova-hero-card');
    if (!hero || hero.querySelector('.v6-horizon')) return;
    const amount = hero.querySelector('.money-amount');
    if (!amount || amount.textContent.trim() !== money(MODEL.safe)) return;
    const footer = hero.querySelector('.nova-hero-footer');
    if (!footer) return;

    const pct = (value) => `${(value / MODEL.balance) * 100}%`;
    const split = document.createElement('div');
    split.className = 'v6-horizon';
    split.innerHTML = `
      <div class="v6-horizon-bar" role="img" aria-label="${money(MODEL.balance)} total balance: ${money(MODEL.safe)} safe to spend, ${money(MODEL.committed)} known commitments, ${money(MODEL.buffer)} protected buffer">
        <i class="safe" style="width:${pct(MODEL.safe)}"></i><i class="committed" style="width:${pct(MODEL.committed)}"></i><i class="buffer" style="width:${pct(MODEL.buffer)}"></i>
      </div>
      <ul class="v6-horizon-legend">
        <li class="safe"><span>Safe now</span><strong>${money(MODEL.safe)}</strong></li>
        <li class="committed"><span>Bills and saving</span><strong>${money(MODEL.committed)}</strong></li>
        <li class="buffer"><span>Protected buffer</span><strong>${money(MODEL.buffer)}</strong></li>
        <li class="total"><span>Total balance</span><strong>${money(MODEL.balance)}</strong></li>
      </ul>`;
    footer.insertAdjacentElement('beforebegin', split);
  }

  // Upcoming bills: show the total those bills reserve, which is the
  // "Bills and saving" part of the split above.
  function addUpcomingTotal() {
    const card = document.querySelector('#main .nova-upcoming-card');
    const list = card?.querySelector('.nova-bill-list');
    if (!list || card.querySelector('.v6-upcoming-total')) return;
    const total = [...list.querySelectorAll('.nova-bill-row b')]
      .map((node) => Number((node.textContent || '').replace(/[^0-9.]/g, '')) || 0)
      .reduce((sum, value) => sum + value, 0);
    if (!total) return;
    const row = document.createElement('div');
    row.className = 'v6-upcoming-total';
    row.innerHTML = `<span>Reserved for the next 14 days</span><strong>${money(total)}</strong>`;
    list.insertAdjacentElement('afterend', row);
  }

  // Every screen: say in the top bar that the figures are simulated.
  function addSimulatedMarker() {
    const actions = document.querySelector('.ios26-nav-actions');
    if (!actions || actions.querySelector('.v6-sim-pill')) return;
    const pill = document.createElement('span');
    pill.className = 'v6-sim-pill';
    pill.textContent = 'Simulated data';
    actions.prepend(pill);
  }

  // Phones: draw the whole 14-day line at card width and move the labels to HTML,
  // so nothing is clipped and the text stays readable.
  function fitForecast() {
    const wrap = document.querySelector('#main .nova-forecast-wrap');
    const svg = wrap?.querySelector('svg');
    if (!svg || wrap.parentElement.querySelector('.v6-forecast-axis')) return;
    svg.setAttribute('preserveAspectRatio', 'none');
    const dates = [...svg.querySelectorAll('.nova-axis text')].map((node) => node.textContent).filter((text) => /^\d+ [A-Z][a-z]+$/.test(text));
    const axis = document.createElement('div');
    axis.className = 'v6-forecast-axis';
    axis.setAttribute('aria-hidden', 'true');
    axis.innerHTML = dates.map((text) => `<span>${text}</span>`).join('');
    wrap.insertAdjacentElement('afterend', axis);
    const low = svg.querySelector('.nova-chart-label text')?.textContent;
    if (low) {
      const note = document.createElement('p');
      note.className = 'v6-forecast-low';
      note.innerHTML = `Lowest point <strong>${low}</strong> before it rises again`;
      axis.insertAdjacentElement('afterend', note);
    }
  }

  const run = () => {
    addSimulatedMarker();
    if (screen !== 'home') return;
    addHorizonSplit(); addUpcomingTotal(); fitForecast();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
  window.addEventListener('load', run, { once: true });
  const root = document.getElementById('app');
  if (root) new MutationObserver(run).observe(root, { childList: true, subtree: true });
})();
