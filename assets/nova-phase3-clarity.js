/* Nova Phase 3 clarity iteration
   Evidence-informed by Round 02 verified async self-report.
   This layer changes product copy/hierarchy only; it does not claim validated improvement. */
(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const screen = params.get('screen') || 'home';
  const MONEY = Object.freeze({ balance: '€2,840.00', buffer: '€500.00' });

  const exactText = (root, value) => [...root.querySelectorAll('span,small,p,div,strong,h1,h2,h3')]
    .find((node) => node.children.length === 0 && (node.textContent || '').trim().toLowerCase() === value.toLowerCase());

  function patchAmountErrorAnnouncement() {
    if (screen !== 'transfer-amount') return;
    const error = document.querySelector('#amount-error');
    if (!error) return;
    error.setAttribute('role', 'alert');
    error.setAttribute('aria-live', 'assertive');
    error.setAttribute('aria-atomic', 'true');
  }

  function patchFourteenDayLanguage() {
    document.querySelectorAll('.horizon-range').forEach((node) => {
      node.textContent = 'Next 14 days';
      node.classList.add('nova-phase3-horizon-label');
    });

    if (screen === 'home') {
      const label = document.querySelector('.decision-label') || exactText(document.querySelector('#main') || document, 'Safe to spend');
      if (label && !/14 days/i.test(label.textContent || '')) label.textContent = 'Safe to spend · next 14 days';
    }

    if (['transfer-amount', 'transfer-review', 'biometric-failed', 'offline'].includes(screen)) {
      const panel = document.querySelector('.impact-panel');
      const heading = panel?.querySelector('h2');
      if (heading && !/14 days/i.test(heading.textContent || '')) {
        heading.textContent = screen === 'transfer-amount'
          ? 'Money after sending · next 14 days'
          : 'Safe to spend after transfer · next 14 days';
      }
    }
  }

  function ensureBufferDecisionNote() {
    if (!['transfer-amount', 'transfer-review'].includes(screen)) return;
    if (document.querySelector('[data-nova-phase3-buffer-note]')) return;

    const note = document.createElement('div');
    note.className = 'nova-phase3-decision-note nova-phase3-buffer-note';
    note.dataset.novaPhase3BufferNote = 'true';
    note.setAttribute('role', 'note');
    note.innerHTML = `<strong>Protected buffer stays reserved</strong>This transfer does not use the ${MONEY.buffer} protected buffer. It remains set aside unless you explicitly change your plan.`;

    if (screen === 'transfer-review') {
      const actions = document.querySelector('.task-panel .action-stack');
      const reviewList = document.querySelector('.task-panel .review-list');
      if (actions) actions.insertAdjacentElement('beforebegin', note);
      else reviewList?.insertAdjacentElement('afterend', note);
      return;
    }

    const status = document.querySelector('[data-nova-transfer-impact-status]');
    const horizon = document.querySelector('.impact-panel .horizon');
    if (status) status.insertAdjacentElement('afterend', note);
    else horizon?.insertAdjacentElement('beforebegin', note);
  }

  function patchRecoveryCauseCopy() {
    if (screen === 'biometric-failed') {
      const callout = document.querySelector('.callout-risk');
      if (callout) {
        const title = callout.querySelector('strong');
        const copy = callout.querySelector('p');
        if (title) title.textContent = 'Why it stopped: biometric verification failed';
        if (copy) copy.textContent = 'The identity check did not complete before submission. Choose a recovery option only when you are ready to try again.';
      }
    }
    if (screen === 'offline') {
      const callout = document.querySelector('.callout-warning');
      if (callout) {
        const title = callout.querySelector('strong');
        const copy = callout.querySelector('p');
        if (title) title.textContent = 'Why it stopped: Nova is offline';
        if (copy) copy.textContent = 'Confirmation is unavailable while disconnected. Reconnect, review the transfer again, then choose whether to confirm.';
      }
    }
  }

  function ensureDominantRecoveryBanner() {
    if (!['biometric-failed', 'offline', 'error'].includes(screen)) return;
    if (document.querySelector('[data-nova-phase3-recovery]')) return;

    document.querySelectorAll('.nova-recovery-reassurance').forEach((node) => node.remove());
    patchRecoveryCauseCopy();

    const banner = document.createElement('section');
    banner.className = 'nova-phase3-recovery-banner';
    banner.dataset.novaPhase3Recovery = 'true';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-atomic', 'true');
    banner.setAttribute('tabindex', '-1');

    const cause = screen === 'biometric-failed'
      ? 'Biometric verification failed before the transfer was submitted.'
      : screen === 'offline'
        ? 'Nova lost its connection before the transfer could be confirmed.'
        : 'Balance revalidation failed before confirmation.';

    banner.innerHTML = `<span class="nova-phase3-status">Transfer stopped safely</span><strong>No money moved</strong><p>${cause}</p><p class="nova-phase3-balance">Balance unchanged · ${MONEY.balance}</p>`;

    if (screen === 'error') {
      const state = document.querySelector('#main .empty-state') || document.querySelector('#main');
      const eyebrow = state?.querySelector('.eyebrow');
      const heading = state?.querySelector('h1');
      const copy = state?.querySelector('p:not(.eyebrow)');
      if (eyebrow) eyebrow.textContent = 'Transfer stopped before submission';
      if (heading) heading.textContent = 'No money moved';
      if (copy) copy.textContent = `Balance revalidation failed before confirmation. The transfer was not submitted and the balance remains ${MONEY.balance}.`;
      const primary = state?.querySelector('.action-stack .btn-primary');
      if (primary) primary.textContent = 'Review transfer again';
      state?.insertAdjacentElement('afterbegin', banner);
    } else {
      const task = document.querySelector('.task-panel') || document.querySelector('#main');
      task?.insertAdjacentElement('afterbegin', banner);
    }

    requestAnimationFrame(() => banner.focus({ preventScroll: false }));
  }

  function markEvidenceBoundary() {
    document.documentElement.dataset.novaPhase3Evidence = 'round02-informed-not-moderated';
  }

  function applyPhase3Clarity() {
    patchAmountErrorAnnouncement();
    patchFourteenDayLanguage();
    ensureBufferDecisionNote();
    ensureDominantRecoveryBanner();
    markEvidenceBoundary();
  }

  applyPhase3Clarity();
  requestAnimationFrame(applyPhase3Clarity);
})();
