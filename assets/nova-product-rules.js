(() => {
  'use strict';

  // P0 product-integrity rules for the current static prototype data model.
  // These values mirror assets/nova.js DATA.account and must move into the
  // canonical shared state model during the P1 state-architecture cleanup.
  const MODEL = Object.freeze({
    balance: 2840,
    safeToSpend: 1300
  });

  const params = new URLSearchParams(location.search);
  const screen = params.get('screen') || 'home';

  function money(value, { signed = false } = {}) {
    const number = Number(value) || 0;
    const formatted = Math.abs(number).toLocaleString('en-IE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const sign = signed && number < 0 ? '−' : signed && number > 0 ? '+' : '';
    return `${sign}€${formatted}`;
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, String(value)); } catch {}
  }

  function storageGet(key, fallback = '') {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  }

  function addStyles() {
    if (document.querySelector('[data-nova-product-rules-style]')) return;
    const style = document.createElement('style');
    style.dataset.novaProductRulesStyle = 'true';
    style.textContent = `
      .nova-safe-warning{margin-top:12px;padding:12px 14px;border:1px solid #e8bd76;border-radius:14px;background:#fff8e8;color:#5f4314;line-height:1.45}
      .nova-safe-warning[hidden]{display:none}.nova-safe-warning strong{display:block;margin-bottom:4px}
      .nova-safe-warning.is-critical{border-color:#e1a1aa;background:#fff3f5;color:#741f2c}
      .nova-safe-ack-backdrop{position:fixed;inset:0;z-index:10050;display:grid;place-items:center;padding:20px;background:rgba(14,23,38,.46);backdrop-filter:blur(8px)}
      .nova-safe-ack{width:min(520px,100%);border:1px solid rgba(20,32,51,.15);border-radius:24px;background:#fff;color:#142033;padding:24px;box-shadow:0 24px 70px rgba(14,23,38,.28)}
      .nova-safe-ack h2{margin:0 0 10px;font-size:1.45rem}.nova-safe-ack p{margin:0 0 14px;color:#566276;line-height:1.55}.nova-safe-ack strong{color:#142033}
      .nova-safe-ack-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.nova-safe-ack-actions button{min-height:44px}
    `;
    document.head.appendChild(style);
  }

  function ensureAmountWarning(input) {
    const field = input.closest('.field') || input.parentElement;
    if (!field) return null;
    let warning = field.querySelector('#safe-spend-warning');
    if (!warning) {
      warning = document.createElement('div');
      warning.id = 'safe-spend-warning';
      warning.className = 'nova-safe-warning';
      warning.setAttribute('role', 'status');
      warning.setAttribute('aria-live', 'polite');
      warning.hidden = true;
      field.appendChild(warning);
      const describedBy = new Set((input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
      describedBy.add(warning.id);
      input.setAttribute('aria-describedby', [...describedBy].join(' '));
    }
    return warning;
  }

  function renderAmountWarning(input) {
    const warning = ensureAmountWarning(input);
    if (!warning) return;
    const value = Number(input.value);
    warning.classList.remove('is-critical');

    if (!Number.isFinite(value) || value <= 0) {
      warning.hidden = true;
      warning.textContent = '';
      return;
    }

    if (value > MODEL.balance) {
      warning.hidden = false;
      warning.classList.add('is-critical');
      warning.innerHTML = `<strong>Above available balance</strong>You need ${money(value - MODEL.balance)} more to send this amount. No transfer can continue.`;
      return;
    }

    if (value > MODEL.safeToSpend) {
      const above = value - MODEL.safeToSpend;
      warning.hidden = false;
      warning.innerHTML = `<strong>${money(above)} above Safe to spend</strong>The account has enough total balance, but this amount uses money currently allocated to known commitments or the protected buffer. Nova will ask you to acknowledge that trade-off before confirmation.`;
      return;
    }

    warning.hidden = true;
    warning.textContent = '';
  }

  function handleAmountSubmit(event) {
    const form = event.target.closest?.('#amount-form');
    if (!form) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const input = form.querySelector('#amount');
    const error = form.querySelector('#amount-error');
    const note = form.querySelector('#note');
    const value = Number(input?.value);

    const fail = (message) => {
      if (!input || !error) return;
      input.setAttribute('aria-invalid', 'true');
      error.hidden = false;
      error.textContent = message;
      input.focus();
    };

    if (!Number.isFinite(value) || value <= 0) {
      fail('Enter an amount greater than €0.');
      return;
    }

    if (value > MODEL.balance) {
      fail(`You need ${money(value - MODEL.balance)} more to send this amount.`);
      return;
    }

    input?.removeAttribute('aria-invalid');
    if (error) {
      error.hidden = true;
      error.textContent = '';
    }

    storageSet('nova_transfer_amount', value);
    storageSet('nova_transfer_reference', note?.value?.trim() || 'September utilities');
    storageSet('nova_transfer_over_safe', value > MODEL.safeToSpend ? 'true' : 'false');
    storageSet('nova_transfer_above_safe_by', Math.max(0, value - MODEL.safeToSpend));
    location.href = 'app.html?screen=transfer-review';
  }

  function patchReference(root = document) {
    const reference = storageGet('nova_transfer_reference', 'September utilities');
    root.querySelectorAll('.review-row').forEach((row) => {
      const label = row.querySelector('span')?.textContent?.trim();
      if (label === 'Reference') {
        const value = row.querySelector('strong');
        if (value) value.textContent = reference;
      }
    });
  }

  function addReviewWarning() {
    const amount = Number(storageGet('nova_transfer_amount', '145')) || 145;
    const above = Math.max(0, amount - MODEL.safeToSpend);
    if (above <= 0) return;

    const actions = document.querySelector('#confirm-transfer')?.closest('.action-stack');
    if (!actions || document.querySelector('[data-nova-safe-review-warning]')) return;

    const warning = document.createElement('div');
    warning.className = 'nova-safe-warning is-critical';
    warning.dataset.novaSafeReviewWarning = 'true';
    warning.setAttribute('role', 'alert');
    warning.innerHTML = `<strong>This transfer is ${money(above)} above Safe to spend.</strong>Total balance is sufficient, but completing it means the current plan can no longer claim all known commitments and the protected buffer remain covered. Review the trade-off before authentication.`;
    actions.before(warning);

    document.querySelectorAll('.impact-panel p').forEach((node) => {
      if (/known bills.*protected buffer.*remain covered/i.test(node.textContent || '')) {
        node.textContent = `After this transfer, projected Safe to spend is ${money(MODEL.safeToSpend - amount, { signed: true })}. Known commitments or the protected buffer would need to change for the plan to become safe again.`;
      }
    });

    const projected = document.querySelector('.impact-panel .goal-amount');
    if (projected) {
      const remaining = MODEL.safeToSpend - amount;
      projected.textContent = money(remaining, { signed: true });
      projected.setAttribute('aria-label', `${remaining < 0 ? 'Negative ' : ''}projected safe to spend ${money(remaining)}`);
    }
  }

  function openSafeAcknowledgement(confirmButton) {
    const amount = Number(storageGet('nova_transfer_amount', '145')) || 145;
    const above = Math.max(0, amount - MODEL.safeToSpend);
    const lastFocus = document.activeElement;
    const backdrop = document.createElement('div');
    backdrop.className = 'nova-safe-ack-backdrop';
    backdrop.innerHTML = `
      <div class="nova-safe-ack" role="dialog" aria-modal="true" aria-labelledby="nova-safe-ack-title" aria-describedby="nova-safe-ack-copy" tabindex="-1">
        <h2 id="nova-safe-ack-title">Review the planning trade-off</h2>
        <p id="nova-safe-ack-copy">This transfer is <strong>${money(above)} above Safe to spend</strong>. Your total balance can cover the payment, but Nova's current plan cannot truthfully say all known commitments and the protected buffer remain covered afterward.</p>
        <p>Continue only if you intentionally want to inspect this prototype path. A production product would revalidate live balances and commitments before money movement.</p>
        <div class="nova-safe-ack-actions">
          <button class="btn btn-risk" type="button" data-ack>Continue to biometric review</button>
          <button class="btn btn-secondary" type="button" data-edit>Edit amount</button>
          <button class="btn btn-secondary" type="button" data-cancel>Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);

    const dialog = backdrop.querySelector('.nova-safe-ack');
    const close = () => {
      document.removeEventListener('keydown', trap);
      backdrop.remove();
      lastFocus?.focus?.();
    };
    const trap = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...backdrop.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    backdrop.querySelector('[data-ack]').addEventListener('click', () => {
      confirmButton.dataset.safeSpendAcknowledged = 'true';
      close();
      confirmButton.click();
    });
    backdrop.querySelector('[data-edit]').addEventListener('click', () => {
      location.href = 'app.html?screen=transfer-amount';
    });
    backdrop.querySelector('[data-cancel]').addEventListener('click', close);
    backdrop.addEventListener('mousedown', (event) => {
      if (event.target === backdrop) close();
    });
    document.addEventListener('keydown', trap);
    dialog.focus();
  }

  function handleConfirmCapture(event) {
    const button = event.target.closest?.('#confirm-transfer');
    if (!button) return;
    const amount = Number(storageGet('nova_transfer_amount', '145')) || 145;
    if (amount <= MODEL.safeToSpend || button.dataset.safeSpendAcknowledged === 'true') return;

    event.preventDefault();
    event.stopImmediatePropagation();
    openSafeAcknowledgement(button);
  }

  function patchSuccessReceipt() {
    const amount = Number(storageGet('nova_transfer_amount', '145')) || 145;
    document.querySelectorAll('.receipt-sheet .review-row').forEach((row) => {
      const label = row.querySelector('span')?.textContent?.trim();
      if (label === 'Amount') {
        const value = row.querySelector('strong');
        if (value) value.textContent = money(amount);
      }
    });
    patchReference();
  }

  function init() {
    addStyles();

    if (screen === 'transfer-amount') {
      const input = document.querySelector('#amount');
      if (input) {
        renderAmountWarning(input);
        input.addEventListener('input', () => renderAmountWarning(input));
      }
    }

    if (screen === 'transfer-review' || screen === 'biometric-failed' || screen === 'offline') {
      patchReference();
      addReviewWarning();
    }

    if (screen === 'transfer-success') patchSuccessReceipt();
  }

  // Capture-phase handlers intentionally own the high-consequence transfer rules
  // until the P1 state-model refactor moves these rules into the canonical renderer.
  document.addEventListener('submit', handleAmountSubmit, true);
  document.addEventListener('click', handleConfirmCapture, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
