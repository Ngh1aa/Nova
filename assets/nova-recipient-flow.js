(() => {
  'use strict';

  const RECIPIENT = Object.freeze({
    id: 'maya-chen-2048',
    name: 'Maya Chen',
    bank: 'Northfield Bank',
    account: 'Personal •••• 2048'
  });
  const STORAGE_KEY = 'nova_transfer_recipient';
  const screen = new URLSearchParams(location.search).get('screen') || 'home';

  function saveRecipient() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(RECIPIENT)); } catch {}
  }

  function activeRecipient() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (stored && stored.id === RECIPIENT.id) return { ...RECIPIENT, ...stored };
    } catch {}
    return RECIPIENT;
  }

  function setRecipientValue(row, recipient, { includeBank = false } = {}) {
    const value = row?.querySelector('strong');
    if (!value) return;
    value.textContent = recipient.name;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = includeBank ? `${recipient.bank} · ${recipient.account}` : recipient.account;
    value.append(document.createElement('br'), meta);
  }

  function patchRecipientChooser() {
    if (screen !== 'transfer-recipient') return;

    document.querySelector('.search-wrap')?.remove();

    const title = document.querySelector('.task-panel > h2');
    if (title && !document.querySelector('[data-nova-recipient-scope]')) {
      const scope = document.createElement('div');
      scope.className = 'callout';
      scope.dataset.novaRecipientScope = 'true';
      scope.style.marginTop = '16px';
      scope.innerHTML = '<strong>One saved recipient in this prototype</strong><p>Choose Maya Chen to continue. Adding or verifying a new recipient is outside this portfolio scenario.</p>';
      title.insertAdjacentElement('afterend', scope);
    }

    const recentHeading = document.querySelector('.task-panel .section-head h2');
    if (recentHeading) recentHeading.textContent = 'Saved recipient';

    const card = document.querySelector('.recipient-card[href*="transfer-amount"]');
    if (card) {
      card.dataset.recipientId = RECIPIENT.id;
      card.setAttribute('aria-label', `${RECIPIENT.name}, ${RECIPIENT.bank}, account ending 2048`);
      card.addEventListener('click', saveRecipient, { capture: true });
    }

    const addButton = [...document.querySelectorAll('.task-panel button')]
      .find((button) => /add new recipient/i.test(button.textContent || ''));
    if (addButton) {
      const note = document.createElement('p');
      note.className = 'meta';
      note.dataset.novaRecipientBoundary = 'true';
      note.style.marginTop = '18px';
      note.textContent = 'New-recipient verification is intentionally outside this prototype flow.';
      addButton.replaceWith(note);
    }
  }

  function patchRecipientContinuity() {
    if (!['transfer-amount', 'transfer-review', 'biometric-failed', 'offline', 'transfer-success'].includes(screen)) return;
    const recipient = activeRecipient();

    if (screen === 'transfer-amount') {
      const heading = document.querySelector('.task-panel > h2');
      if (heading) heading.textContent = `Send to ${recipient.name}`;
      const card = document.querySelector('.task-panel .recipient-card');
      if (card) {
        const name = card.querySelector('strong');
        const detail = name?.parentElement?.querySelector('span:not(.avatar)');
        if (name) name.textContent = recipient.name;
        if (detail) detail.textContent = `${recipient.bank} · ${recipient.account}`;
      }
    }

    if (['transfer-review', 'biometric-failed', 'offline'].includes(screen)) {
      document.querySelectorAll('.review-row').forEach((row) => {
        if (row.querySelector('span')?.textContent?.trim() === 'Recipient') {
          setRecipientValue(row, recipient, { includeBank: true });
        }
      });
    }

    if (screen === 'transfer-success') {
      const rows = [...document.querySelectorAll('.receipt-sheet .review-row')];
      const toRow = rows.find((row) => row.querySelector('span')?.textContent?.trim() === 'To');
      if (toRow) {
        const value = toRow.querySelector('strong');
        if (value) value.textContent = recipient.name;
      }
      if (toRow && !document.querySelector('[data-nova-recipient-account]')) {
        const accountRow = document.createElement('div');
        accountRow.className = 'review-row';
        accountRow.dataset.novaRecipientAccount = 'true';
        accountRow.innerHTML = `<span>Recipient account</span><strong>${recipient.bank}<br><span class="meta">${recipient.account}</span></strong>`;
        toRow.insertAdjacentElement('afterend', accountRow);
      }
    }
  }

  patchRecipientChooser();
  patchRecipientContinuity();
})();
