(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  if ((params.get('screen') || 'home') !== 'transfer-amount') return;

  const MODEL = Object.freeze({
    balance: 2840,
    safeToSpend: 1300,
    knownCommitments: 1040,
    protectedBuffer: 500
  });

  function money(value, { signed = false } = {}) {
    const number = Number(value) || 0;
    const formatted = Math.abs(number).toLocaleString('en-IE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const sign = signed && number < 0 ? '−' : signed && number > 0 ? '+' : '';
    return `${sign}€${formatted}`;
  }

  function clampPct(value) {
    return Math.max(0, Math.min(100, value));
  }

  function addStyles() {
    if (document.querySelector('[data-nova-transfer-impact-style]')) return;
    const style = document.createElement('style');
    style.dataset.novaTransferImpactStyle = 'true';
    style.textContent = `
      .nova-transfer-impact-status{margin:10px 0 16px;padding:12px 14px;border:1px solid rgba(20,32,51,.12);border-radius:14px;background:rgba(255,255,255,.72);color:#435067;line-height:1.5}
      .nova-transfer-impact-status strong{color:#142033}
      .nova-transfer-impact-status.is-warning{border-color:#e8bd76;background:#fff8e8;color:#5f4314}
      .nova-transfer-impact-status.is-critical{border-color:#e1a1aa;background:#fff3f5;color:#741f2c}
      .nova-transfer-blocked{width:100%;min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-radius:14px;background:#fff3f5;color:#741f2c;border:1px solid #e1a1aa;font-weight:750}
      .nova-transfer-blocked small{font-weight:600;color:#8d3a47;text-align:right}
      .nova-transfer-impact-legend{width:100%;display:flex!important;justify-content:space-between;gap:14px;align-items:flex-start}
      .nova-transfer-impact-legend span{color:#657085}.nova-transfer-impact-legend strong{color:#142033}
      .nova-transfer-impact-legend.is-critical strong{color:#741f2c}
    `;
    document.head.appendChild(style);
  }

  function ensureStatus(panel) {
    let status = panel.querySelector('[data-nova-transfer-impact-status]');
    if (status) return status;
    status = document.createElement('div');
    status.className = 'nova-transfer-impact-status';
    status.dataset.novaTransferImpactStatus = 'true';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    const heading = panel.querySelector('h2');
    if (heading) heading.insertAdjacentElement('afterend', status);
    else panel.prepend(status);
    return status;
  }

  function renderNormal(horizon, status, amount) {
    const remainingBalance = MODEL.balance - amount;
    const projectedSafe = MODEL.safeToSpend - amount;
    const safePct = remainingBalance > 0 ? clampPct((projectedSafe / remainingBalance) * 100) : 0;
    const committedPct = remainingBalance > 0 ? clampPct((MODEL.knownCommitments / remainingBalance) * 100) : 0;
    const bufferPct = remainingBalance > 0 ? clampPct((MODEL.protectedBuffer / remainingBalance) * 100) : 0;

    status.className = 'nova-transfer-impact-status';
    status.innerHTML = amount > 0
      ? `<strong>${money(projectedSafe)} Safe to spend after sending.</strong> ${money(remainingBalance)} remains in the account after a ${money(amount)} transfer.`
      : `<strong>${money(MODEL.safeToSpend)} Safe to spend now.</strong> Enter an amount to preview the effect before review.`;

    const bar = horizon.querySelector('.horizon-bar');
    if (bar) {
      bar.innerHTML = `<div class="horizon-zone safe" style="width:${safePct}%">Safe now</div><div class="horizon-zone committed" style="width:${committedPct}%">Committed</div><div class="horizon-zone buffer" style="width:${bufferPct}%">Protected</div>`;
      bar.setAttribute('aria-label', `${money(projectedSafe)} safe to spend after transfer, ${money(MODEL.knownCommitments)} committed, ${money(MODEL.protectedBuffer)} protected buffer`);
    }

    const legend = horizon.querySelector('.horizon-legend');
    if (legend) {
      legend.innerHTML = `<div><span class="legend-key"><span class="legend-swatch" style="background:var(--safe)"></span>Safe after transfer</span><strong>${money(projectedSafe)}</strong></div><div><span class="legend-key"><span class="legend-swatch" style="background:var(--committed)"></span>Known commitments</span><strong>${money(MODEL.knownCommitments)}</strong></div><div><span class="legend-key"><span class="legend-swatch" style="background:var(--buffer)"></span>Protected buffer</span><strong>${money(MODEL.protectedBuffer)}</strong></div>`;
    }

    const note = horizon.querySelector('.horizon-note');
    if (note) {
      note.textContent = amount > 0
        ? `Preview only: Safe to spend starts at ${money(MODEL.safeToSpend)} and falls by the transfer amount before review. Known commitments and the protected buffer remain fully covered in this state.`
        : `Safe to spend = balance − known commitments − planned goal contribution − protected buffer. Enter an amount to preview the transfer consequence.`;
    }
  }

  function renderShortfall(horizon, status, amount) {
    const projectedSafe = MODEL.safeToSpend - amount;
    const shortfall = Math.abs(projectedSafe);
    const remainingBalance = MODEL.balance - amount;

    status.className = 'nova-transfer-impact-status is-warning';
    status.innerHTML = `<strong>Plan shortfall ${money(shortfall)}.</strong> The account has enough total balance for ${money(amount)}, but only ${money(remainingBalance)} would remain and the current commitments + protected buffer would no longer fully fit.`;

    const bar = horizon.querySelector('.horizon-bar');
    if (bar) {
      bar.innerHTML = `<div class="nova-safe-shortfall"><span>Plan shortfall ${money(shortfall)}</span><small>Commitments + full buffer no longer fit</small></div>`;
      bar.setAttribute('aria-label', `Plan shortfall ${money(shortfall)} after sending ${money(amount)}; projected safe to spend is negative ${money(shortfall)}`);
    }

    const legend = horizon.querySelector('.horizon-legend');
    if (legend) {
      legend.innerHTML = `<div class="nova-transfer-impact-legend is-critical"><span>Projected Safe to spend</span><strong>${money(projectedSafe, { signed: true })}</strong></div>`;
    }

    const note = horizon.querySelector('.horizon-note');
    if (note) {
      note.textContent = `This is still only a preview. Sending ${money(amount)} would put the current plan ${money(shortfall)} beyond Safe to spend, so Nova surfaces the trade-off before review instead of hiding it later.`;
    }
  }

  function renderBlocked(horizon, status, amount) {
    const needed = amount - MODEL.balance;

    status.className = 'nova-transfer-impact-status is-critical';
    status.innerHTML = `<strong>Transfer blocked in preview.</strong> ${money(amount)} is above the ${money(MODEL.balance)} available balance. You need ${money(needed)} more before this transfer could continue.`;

    const bar = horizon.querySelector('.horizon-bar');
    if (bar) {
      bar.innerHTML = `<div class="nova-transfer-blocked"><span>Cannot send this amount</span><small>${money(needed)} above available balance</small></div>`;
      bar.setAttribute('aria-label', `Transfer blocked; ${money(amount)} exceeds available balance by ${money(needed)}`);
    }

    const legend = horizon.querySelector('.horizon-legend');
    if (legend) {
      legend.innerHTML = `<div class="nova-transfer-impact-legend is-critical"><span>Available balance</span><strong>${money(MODEL.balance)}</strong></div>`;
    }

    const note = horizon.querySelector('.horizon-note');
    if (note) {
      note.textContent = `No review or money movement can continue with this amount. Reduce the transfer to ${money(MODEL.balance)} or less.`;
    }
  }

  function updatePreview(input, panel) {
    const horizon = panel.querySelector('.horizon');
    if (!horizon) return;
    const status = ensureStatus(panel);
    const raw = input.value.trim();
    const value = Number(raw);

    if (!raw || !Number.isFinite(value) || value <= 0) {
      renderNormal(horizon, status, 0);
      return;
    }

    if (value > MODEL.balance) {
      renderBlocked(horizon, status, value);
      return;
    }

    if (value > MODEL.safeToSpend) {
      renderShortfall(horizon, status, value);
      return;
    }

    renderNormal(horizon, status, value);
  }

  function init() {
    const input = document.querySelector('#amount');
    const panel = document.querySelector('.impact-panel');
    if (!input || !panel) return;

    addStyles();
    updatePreview(input, panel);
    input.addEventListener('input', () => updatePreview(input, panel));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
