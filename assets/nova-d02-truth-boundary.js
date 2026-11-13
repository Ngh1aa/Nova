/* Nova D-02 — sensitive-action truth boundary
   Evidence-informed by verified Round 02 async self-report.
   This layer separates Freeze from Report at the decision/result surface and
   keeps the prototype/no-bank-contact boundary explicit. It is not a retest. */
(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const screen = params.get('screen') || 'home';
  const reportState = params.get('state') || 'review';

  function boundary({ result = false, detail = '' } = {}) {
    const element = document.createElement('div');
    element.className = `nova-d02-boundary${result ? ' nova-d02-boundary--result' : ''}`;
    element.setAttribute('role', 'note');
    element.setAttribute('aria-label', result ? 'Report received.' : 'Report not sent yet.');
    element.innerHTML = `<strong>${result ? 'REPORT RECEIVED' : 'NOT SENT YET'}</strong><span>${detail}</span>`;
    return element;
  }

  function consequence({ changes, doesNot }) {
    const list = document.createElement('dl');
    list.className = 'nova-d02-consequence';
    list.innerHTML = `<div><dt>Changes</dt><dd>${changes}</dd></div><div><dt>Does not</dt><dd>${doesNot}</dd></div>`;
    return list;
  }

  function actionCard({ kind, label, changes, doesNot, control }) {
    const card = document.createElement('section');
    card.className = `nova-d02-action-card nova-d02-action-card--${kind}`;
    card.dataset.novaD02Action = kind;

    const title = document.createElement('h3');
    title.className = 'nova-d02-action-label';
    title.textContent = label;

    const effects = consequence({ changes, doesNot });
    effects.id = `nova-d02-${kind}-effects`;
    control.setAttribute('aria-describedby', effects.id);
    card.append(title, effects, control);
    return card;
  }

  function patchFreezeDialog() {
    const dialog = document.querySelector('.dialog-backdrop:last-of-type .dialog');
    if (!dialog || dialog.dataset.novaD02Dialog === 'true') return;
    dialog.dataset.novaD02Dialog = 'true';

    const title = dialog.querySelector('#dialog-title');
    if (title) title.textContent = 'Freeze card ending 4821?';

    const badge = document.createElement('div');
    badge.className = 'nova-d02-dialog-boundary';
    badge.textContent = 'FREEZE ONLY · PAYMENT NOT REPORTED';
    if (title) dialog.insertBefore(badge, title);
    else dialog.prepend(badge);

    const lead = dialog.querySelector('p');
    if (lead) lead.textContent = 'New card payments and ATM withdrawals pause until you unfreeze. This doesn’t report ByteMart or reverse the payment.';

    const primary = dialog.querySelector('[data-primary]');
    if (primary) {
      primary.textContent = 'Freeze card';
      primary.setAttribute('aria-label', 'Freeze card');
    }
  }

  function patchTransactionDetail() {
    if (screen !== 'transaction-detail') return;
    const band = document.querySelector('.protection-band');
    if (!band || band.dataset.novaD02TruthBoundary === 'true') return;
    band.dataset.novaD02TruthBoundary = 'true';

    // One idea per line: the heading, one "No bank contact" status, two action cards.
    band.querySelector('.eyebrow')?.remove();
    const heading = band.querySelector('h2');
    if (heading) heading.textContent = 'Card protection';

    const callout = band.querySelector('.callout');
    const isFrozen = !!callout?.classList.contains('callout-success');
    if (callout) {
      callout.classList.add('nova-d02-status');
      callout.setAttribute('role', 'note');
      const title = callout.querySelector('strong');
      if (title) title.textContent = isFrozen ? 'Card frozen, payment not reported' : 'Not reported yet';
      callout.querySelector('p')?.remove();
    }

    [...band.children]
      .filter((element) => element.tagName === 'P' && !element.classList.contains('eyebrow'))
      .forEach((element) => element.remove());

    const actions = band.querySelector('.action-stack');
    const report = band.querySelector('#report-transaction');
    if (!actions || !report) return;

    const freeze = band.querySelector('#freeze-card') || actions.querySelector('a.btn-primary[href*="screen=cards"]');
    if (!freeze) return;

    if (freeze.id === 'freeze-card') {
      freeze.textContent = 'Freeze card';
      freeze.setAttribute('aria-label', 'Freeze card');
      freeze.addEventListener('click', patchFreezeDialog);
    } else {
      freeze.textContent = 'View frozen card';
    }

    report.textContent = 'Report payment';
    report.setAttribute('aria-label', 'Report payment');

    const freezeCard = actionCard({
      kind: 'freeze',
      label: 'Freeze card',
      changes: isFrozen ? 'Card is frozen.' : 'Pauses new card payments.',
      doesNot: 'Reverse this payment or report it.',
      control: freeze
    });

    const reportCard = actionCard({
      kind: 'report',
      label: 'Report transaction',
      changes: 'Sends the payment to our team for review.',
      doesNot: 'Freeze your card.',
      control: report
    });

    actions.classList.add('nova-d02-action-grid');
    actions.replaceChildren(freezeCard, reportCard);

    band.querySelector('[data-report-boundary]')?.remove();
  }

  function patchReportScreen() {
    if (screen !== 'report-transaction') return;
    const panel = document.querySelector('.task-panel');
    if (!panel || panel.dataset.novaD02TruthBoundary === 'true') return;
    panel.dataset.novaD02TruthBoundary = 'true';

    const isHandoff = reportState === 'handoff';
    panel.prepend(boundary({
      result: isHandoff,
      detail: isHandoff
        ? 'We’ll review it within 2 business days. Card protection did not change.'
        : 'Check the details, then send the report.'
    }));

    const eyebrow = panel.querySelector('.eyebrow');
    const heading = panel.querySelector('h2');
    const callout = panel.querySelector('.callout');
    const calloutTitle = callout?.querySelector('strong');
    const calloutCopy = callout?.querySelector('p');

    if (isHandoff) {
      if (eyebrow) eyebrow.textContent = 'Reference NVA-R-20915';
      if (heading) heading.textContent = 'Under review';
      if (calloutTitle) calloutTitle.textContent = 'Review within 2 business days';
      if (calloutCopy) calloutCopy.textContent = 'We’ll message you here if we need more details.';
    } else {
      if (eyebrow) eyebrow.textContent = 'Report payment';
      if (calloutTitle) calloutTitle.textContent = 'Not sent yet';
      if (calloutCopy) calloutCopy.textContent = 'Check the details, then send the report. A refund isn’t guaranteed until the review is complete.';
    }

    const actions = panel.querySelector('.action-stack');
    const primary = actions?.querySelector('.btn-primary');
    if (!isHandoff && primary) {
      primary.textContent = 'Send report';
      primary.setAttribute('aria-label', 'Send report');
    }

    const note = document.createElement('div');
    note.className = 'nova-d02-report-note';
    note.innerHTML = isHandoff
      ? '<strong>Card protection is separate.</strong> Reporting did not freeze or unfreeze the card.'
      : '<strong>Your card stays unchanged.</strong> Freeze it separately if needed.';

    if (actions) actions.insertAdjacentElement('beforebegin', note);
    else panel.append(note);
  }

  function markEvidenceBoundary() {
    document.documentElement.dataset.novaD02Evidence = 'round02-informed-not-retested';
  }

  function apply() {
    patchTransactionDetail();
    patchReportScreen();
    markEvidenceBoundary();
  }

  apply();
  requestAnimationFrame(apply);
})();
