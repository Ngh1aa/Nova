(() => {
  'use strict';

  const RECIPIENTS = Object.freeze({
    '2048': Object.freeze({ id: 'maya-chen-2048', name: 'Maya Chen', bank: 'Northfield Bank', account: 'Personal •••• 2048' }),
    '7184': Object.freeze({ id: 'daniel-lee-7184', name: 'Daniel Lee', bank: '', account: '•••• 7184' }),
    '3052': Object.freeze({ id: 'an-nguyen-3052', name: 'An Nguyen', bank: '', account: '•••• 3052' }),
    '6610': Object.freeze({ id: 'natalie-6610', name: 'Natalie', bank: '', account: '•••• 6610' })
  });
  const DEFAULT_RECIPIENT = RECIPIENTS['2048'];
  const STORAGE_KEY = 'nova_transfer_recipient';
  const screen = new URLSearchParams(location.search).get('screen') || 'home';

  function accountSuffix(text = '') {
    return Object.keys(RECIPIENTS).find((suffix) => String(text).includes(suffix)) || '';
  }

  function recipientFromNode(node) {
    if (!node) return null;
    const suffix = accountSuffix(node.textContent || '');
    if (suffix) return RECIPIENTS[suffix];
    const name = (node.querySelector('strong')?.textContent || '').trim().toLowerCase();
    return Object.values(RECIPIENTS).find((recipient) => recipient.name.toLowerCase().startsWith(name)) || null;
  }

  function saveRecipient(recipient) {
    if (!recipient) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(recipient)); } catch {}
  }

  function activeRecipient() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      const known = Object.values(RECIPIENTS).find((recipient) => recipient.id === stored?.id);
      if (known) return { ...known, ...stored };
    } catch {}
    return DEFAULT_RECIPIENT;
  }

  function recipientDetail(recipient) {
    return recipient.bank ? `${recipient.bank} · ${recipient.account}` : recipient.account;
  }

  function setRecipientValue(row, recipient) {
    const value = row?.querySelector('strong');
    if (!value) return;
    value.textContent = recipient.name;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = recipientDetail(recipient);
    value.append(document.createElement('br'), meta);
  }

  function focusRecipientSearch(event) {
    event?.preventDefault();
    const input = document.querySelector('#pay-recipient-search');
    input?.focus();
    input?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function patchRenderedRecipientChooser() {
    if (screen !== 'transfer-recipient') return false;
    const panel = document.querySelector('.v4-pay-search');
    const input = panel?.querySelector('#pay-recipient-search');
    const chips = [...(panel?.querySelectorAll('.v4-recipient-chips a') || [])];
    if (!panel || !input || !chips.length) return false;

    input.placeholder = 'Search name or account';
    input.setAttribute('aria-label', 'Search recipient by name or account');

    const addButton = panel.querySelector('[aria-label="Add new recipient"]');
    if (addButton) {
      const scope = document.createElement('span');
      scope.className = 'v4-status blue';
      scope.dataset.novaRecipientScope = 'true';
      scope.textContent = 'Saved recipients only';
      addButton.replaceWith(scope);
    }

    if (!panel.querySelector('[data-nova-recipient-boundary]')) {
      const note = document.createElement('p');
      note.className = 'meta';
      note.dataset.novaRecipientBoundary = 'true';
      note.textContent = 'Adding or verifying a new recipient is outside this portfolio scenario.';
      input.closest('.v4-search-box')?.insertAdjacentElement('afterend', note);
    }

    const chipGrid = panel.querySelector('.v4-recipient-chips');
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.dataset.novaRecipientEmpty = 'true';
    empty.hidden = true;
    empty.setAttribute('role', 'status');
    empty.innerHTML = '<strong>No saved recipient found</strong><p>Try another name or account ending.</p><button type="button" class="btn secondary" data-clear-recipient-search>Clear search</button>';
    chipGrid?.insertAdjacentElement('afterend', empty);

    chips.forEach((chip) => {
      const recipient = recipientFromNode(chip);
      if (!recipient) return;
      chip.dataset.recipientId = recipient.id;
      chip.setAttribute('aria-label', `${recipient.name}, account ending ${recipient.account.slice(-4)}`);
      chip.addEventListener('click', () => saveRecipient(recipient), { capture: true });
    });

    function applyFilter() {
      const query = input.value.trim().toLowerCase();
      let visible = 0;
      chips.forEach((chip) => {
        const recipient = recipientFromNode(chip);
        const haystack = `${recipient?.name || ''} ${recipient?.account || ''}`.toLowerCase();
        const matches = !query || haystack.includes(query);
        chip.hidden = !matches;
        if (matches) visible += 1;
      });
      empty.hidden = visible !== 0;
      chipGrid?.setAttribute('aria-label', `${visible} saved recipient${visible === 1 ? '' : 's'} shown`);
    }

    input.addEventListener('input', applyFilter);
    empty.querySelector('[data-clear-recipient-search]')?.addEventListener('click', () => {
      input.value = '';
      applyFilter();
      input.focus();
    });

    document.querySelectorAll('.v4-transfer-list a').forEach((row) => {
      const recipient = recipientFromNode(row);
      if (!recipient) return;
      row.dataset.recipientId = recipient.id;
      row.addEventListener('click', () => saveRecipient(recipient), { capture: true });
    });

    const mayaAction = document.querySelector('.v4-full-action');
    if (mayaAction) mayaAction.addEventListener('click', () => saveRecipient(DEFAULT_RECIPIENT), { capture: true });

    const newTransfer = document.querySelector('.v4-dark-pill');
    if (newTransfer) {
      newTransfer.href = '#pay-recipient-search';
      newTransfer.childNodes[0].textContent = 'Choose recipient ';
      newTransfer.addEventListener('click', focusRecipientSearch);
    }
    const sendMoney = document.querySelector('.v4-action.blue');
    if (sendMoney) {
      sendMoney.href = '#pay-recipient-search';
      sendMoney.addEventListener('click', focusRecipientSearch);
    }

    applyFilter();
    return true;
  }

  function patchLegacyRecipientChooser() {
    if (screen !== 'transfer-recipient') return;
    const card = document.querySelector('.recipient-card[href*="transfer-amount"]');
    if (!card) return;
    card.dataset.recipientId = DEFAULT_RECIPIENT.id;
    card.addEventListener('click', () => saveRecipient(DEFAULT_RECIPIENT), { capture: true });
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
        if (detail) detail.textContent = recipientDetail(recipient);
      }
    }

    if (['transfer-review', 'biometric-failed', 'offline'].includes(screen)) {
      document.querySelectorAll('.review-row').forEach((row) => {
        if (row.querySelector('span')?.textContent?.trim() === 'Recipient') setRecipientValue(row, recipient);
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
        const label = document.createElement('span');
        label.textContent = 'Recipient account';
        const value = document.createElement('strong');
        value.textContent = recipientDetail(recipient);
        accountRow.append(label, value);
        toRow.insertAdjacentElement('afterend', accountRow);
      }
    }
  }

  if (!patchRenderedRecipientChooser()) patchLegacyRecipientChooser();
  patchRecipientContinuity();
})();
