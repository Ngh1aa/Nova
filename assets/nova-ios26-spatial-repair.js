(() => {
  'use strict';

  const screen = new URLSearchParams(location.search).get('screen') || 'home';

  function row(title, subtitle, value) {
    return `<div class="ios26-row"><div class="ios26-row-copy"><strong>${title}</strong><span>${subtitle}</span></div><div class="ios26-row-value">${value}</div></div>`;
  }

  function enrichPayContext() {
    if (screen !== 'transfer-recipient') return;
    const aside = document.querySelector('.ios26-pay-aside');
    if (!aside || aside.querySelector('.ios26-pay-history')) return;

    aside.insertAdjacentHTML('beforeend', `
      <section class="ios26-pay-history" aria-label="Recent transfers">
        <div class="ios26-pay-history-head"><strong>Recent transfers</strong><span>Prototype history</span></div>
        ${row('Maya Chen', '7 Sep – completed', '€85.00')}
        ${row('Sofia Andersson', '2 Sep – completed', '€42.00')}
        ${row('Noah Williams', '26 Aug – completed', '€120.00')}
      </section>`);
  }

  function init() {
    enrichPayContext();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
