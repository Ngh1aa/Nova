(() => {
  'use strict';

  const screen = new URLSearchParams(location.search).get('screen') || 'home';
  if (screen !== 'savings-detail') return;

  const MODEL = Object.freeze({
    balance: 2840,
    fixedCommitments: 780,
    defaultContribution: 260,
    protectedBuffer: 500,
    maxPreviewContribution: 10000
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

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function addStyles() {
    if (document.querySelector('[data-nova-savings-preview-style]')) return;
    const style = document.createElement('style');
    style.dataset.novaSavingsPreviewStyle = 'true';
    style.textContent = `
      .nova-savings-preview-status{margin-top:14px;padding:13px 15px;border:1px solid #b8d6c5;border-radius:14px;background:#f1faf5;color:#234c35;line-height:1.5}
      .nova-savings-preview-status[hidden]{display:none}
      .nova-savings-preview-status.is-warning{border-color:#e1a1aa;background:#fff3f5;color:#741f2c}
      .nova-savings-preview-status strong{display:block;margin-bottom:4px}
      .nova-savings-shortfall{width:100%;min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-radius:14px;background:#fff3f5;color:#741f2c;border:1px solid #e1a1aa;font-weight:750}
      .nova-savings-shortfall small{font-weight:600;color:#8d3a47;text-align:right}
    `;
    document.head.appendChild(style);
  }

  function ensureUi() {
    const input = document.querySelector('#contribution');
    const button = document.querySelector('#save-contribution');
    const field = input?.closest('.field');
    if (!input || !button || !field) return null;

    const hint = field.querySelector('.field-hint');
    if (hint) {
      hint.id = hint.id || 'contribution-hint';
      hint.textContent = `Preview only · Minimum €0 · Maximum ${money(MODEL.maxPreviewContribution)} · No money moves in this prototype.`;
    }

    let error = field.querySelector('#contribution-error');
    if (!error) {
      error = document.createElement('span');
      error.id = 'contribution-error';
      error.className = 'field-error';
      error.setAttribute('role', 'alert');
      error.hidden = true;
      field.appendChild(error);
    }

    const describedBy = new Set((input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    if (hint?.id) describedBy.add(hint.id);
    describedBy.add(error.id);
    input.setAttribute('aria-describedby', [...describedBy].join(' '));
    input.setAttribute('autocomplete', 'off');

    let status = document.querySelector('[data-nova-savings-preview-status]');
    if (!status) {
      status = document.createElement('div');
      status.className = 'nova-savings-preview-status';
      status.dataset.novaSavingsPreviewStatus = 'true';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.setAttribute('aria-atomic', 'true');
      status.hidden = true;
      button.insertAdjacentElement('afterend', status);
    }

    return { input, button, error, status };
  }

  function renderLegend(horizon, safe, committed) {
    const legend = horizon.querySelector('.horizon-legend');
    if (!legend) return;
    legend.innerHTML = `
      <div><span class="legend-key"><span class="legend-swatch" style="background:var(--safe)"></span>Safe now</span><strong data-nova-preview-safe>${money(safe, { signed: safe < 0 })}</strong></div>
      <div><span class="legend-key"><span class="legend-swatch" style="background:var(--committed)"></span>Committed incl. goal</span><strong data-nova-preview-committed>${money(committed)}</strong></div>
      <div><span class="legend-key"><span class="legend-swatch" style="background:var(--buffer)"></span>Protected buffer</span><strong>${money(MODEL.protectedBuffer)}</strong></div>`;
  }

  function renderHorizon(contribution) {
    const horizon = document.querySelector('.section .horizon');
    if (!horizon) return null;

    const committed = MODEL.fixedCommitments + contribution;
    const safe = MODEL.balance - committed - MODEL.protectedBuffer;
    const shortfall = Math.max(0, -safe);
    const bar = horizon.querySelector('.horizon-bar');
    const note = horizon.querySelector('.horizon-note');

    renderLegend(horizon, safe, committed);

    if (bar) {
      if (shortfall > 0) {
        bar.innerHTML = `<div class="nova-savings-shortfall" data-nova-savings-shortfall><span>Plan shortfall ${money(shortfall)}</span><small>Commitments + protected buffer exceed the current balance</small></div>`;
        bar.setAttribute('aria-label', `Plan shortfall ${money(shortfall)}. ${money(committed)} committed including the savings goal and ${money(MODEL.protectedBuffer)} protected buffer exceed the ${money(MODEL.balance)} balance.`);
      } else {
        const safePct = clamp((safe / MODEL.balance) * 100, 0, 100);
        const committedPct = clamp((committed / MODEL.balance) * 100, 0, 100);
        const bufferPct = clamp((MODEL.protectedBuffer / MODEL.balance) * 100, 0, 100);
        bar.innerHTML = `<div class="horizon-zone safe" style="width:${safePct}%">Safe now</div><div class="horizon-zone committed" style="width:${committedPct}%">Committed</div><div class="horizon-zone buffer" style="width:${bufferPct}%">Protected</div>`;
        bar.setAttribute('aria-label', `${money(safe)} safe to spend, ${money(committed)} committed including the savings contribution, ${money(MODEL.protectedBuffer)} protected buffer`);
      }
    }

    if (note) {
      note.textContent = shortfall > 0
        ? `Preview only: a ${money(contribution)} monthly contribution would make Safe to spend ${money(safe, { signed: true })}. The current plan is overcommitted by ${money(shortfall)}; no money has moved.`
        : `Preview only: with a ${money(contribution)} monthly contribution, Safe to spend becomes ${money(safe)} after ${money(committed)} of commitments and the ${money(MODEL.protectedBuffer)} protected buffer. No money has moved.`;
    }

    return { committed, safe, shortfall };
  }

  function fail(ui, message) {
    ui.input.setAttribute('aria-invalid', 'true');
    ui.error.textContent = message;
    ui.error.hidden = false;
    ui.status.classList.add('is-warning');
    ui.status.innerHTML = `<strong>Preview not updated</strong>${message}`;
    ui.status.hidden = false;
    ui.input.focus();
  }

  function handlePreview(event) {
    const button = event.target.closest?.('#save-contribution');
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const ui = ensureUi();
    if (!ui) return;

    const raw = ui.input.value.trim();
    const value = Number(raw);

    if (!raw) {
      fail(ui, 'Enter a monthly contribution to preview.');
      return;
    }
    if (!Number.isFinite(value)) {
      fail(ui, 'Enter a valid number for the monthly contribution.');
      return;
    }
    if (value < 0) {
      fail(ui, 'Monthly contribution cannot be negative. Use €0 to preview a paused contribution.');
      return;
    }
    if (value > MODEL.maxPreviewContribution) {
      fail(ui, `Monthly contribution cannot exceed ${money(MODEL.maxPreviewContribution)} in this prototype.`);
      return;
    }

    const normalized = Math.round(value * 100) / 100;
    ui.input.value = String(normalized);
    ui.input.removeAttribute('aria-invalid');
    ui.error.hidden = true;
    ui.error.textContent = '';

    const result = renderHorizon(normalized);
    if (!result) return;

    ui.status.classList.toggle('is-warning', result.shortfall > 0);
    ui.status.innerHTML = result.shortfall > 0
      ? `<strong>Overcommitted by ${money(result.shortfall)}</strong>${money(result.committed)} would be committed including this savings goal, leaving Safe to spend at ${money(result.safe, { signed: true })}. This is a preview only.`
      : `<strong>Preview updated</strong>${money(result.committed)} committed · ${money(result.safe)} Safe to spend · ${money(MODEL.protectedBuffer)} protected. No money has moved.`;
    ui.status.hidden = false;
  }

  function init() {
    addStyles();
    const ui = ensureUi();
    if (!ui) return;
    ui.input.value = String(MODEL.defaultContribution);
    renderHorizon(MODEL.defaultContribution);
  }

  document.addEventListener('click', handlePreview, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
