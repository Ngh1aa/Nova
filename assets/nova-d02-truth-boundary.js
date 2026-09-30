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
    element.setAttribute('aria-label', result ? 'Demo result. No bank case created.' : 'Demo only. No bank contact.');
    element.innerHTML = `<strong>${result ? 'DEMO RESULT · NO BANK CASE CREATED' : 'DEMO ONLY · NO BANK CONTACT'}</strong><span>${detail}</span>`;
    return element;
  }

  function consequence({ changes, doesNot }) {
    const list = document.createElement('dl');
    list.className = 'nova-d02-consequence';
    list.innerHTML = `<div><dt>Changes</dt><dd>${changes}</dd></div><div><dt>Does not</dt><dd>${doesNot}</dd></div>`;
    return list;
  }

  function actionCard({ kind, label, copy, changes, doesNot, control }) {
    const card = document.createElement('section');
    card.className = `nova-d02-action-card nova-d02-action-card--${kind}`;
    card.dataset.novaD02Action = kind;

    const title = document.createElement('h3');
    title.className = 'nova-d02-action-label';
    title.textContent = label;

    const description = document.createElement('p');
    description.className = 'nova-d02-action-copy';
    description.id = `nova-d02-${kind}-copy`;
    description.textContent = copy;

    control.setAttribute('aria-describedby', description.id);
    card.append(title, description, consequence({ changes, doesNot }), control);
    return card;
  }

  function patchFreezeDialog() {
    const dialog = document.querySelector('.dialog-backdrop:last-of-type .dialog');
    if (!dialog || dialog.dataset.novaD02Dialog === 'true') return;
    dialog.dataset.novaD02Dialog = 'true';

    const title = dialog.querySelector('#dialog-title');
    if (title) title.textContent = 'Freeze demo card only — no bank contact';

    const badge = document.createElement('div');
    badge.className = 'nova-d02-dialog-boundary';
    badge.textContent = 'DEMO ONLY · NO BANK CONTACT';
    if (title) dialog.insertBefore(badge, title);
    else dialog.prepend(badge);

    const lead = dialog.querySelector('p');
    if (lead) lead.textContent = 'This changes only Nova’s prototype card state. It does not report ByteMart, reverse the payment, or contact a bank.';

    const primary = dialog.querySelector('[data-primary]');
    if (primary) {
      primary.textContent = 'Freeze demo card only';
      primary.setAttribute('aria-label', 'Freeze demo card only — no bank contact');
    }
  }

  function patchTransactionDetail() {
    if (screen !== 'transaction-detail') return;
    const band = document.querySelector('.protection-band');
    if (!band || band.dataset.novaD02TruthBoundary === 'true') return;
    band.dataset.novaD02TruthBoundary = 'true';

    const eyebrow = band.querySelector('.eyebrow');
    const heading = band.querySelector('h2');
    if (eyebrow) eyebrow.textContent = 'Sensitive action · simulated';
    if (heading) heading.textContent = 'Freeze card and Report do different things';

    const truth = boundary({ detail: 'Both choices stay inside this portfolio prototype.' });
    if (heading) heading.insertAdjacentElement('afterend', truth);
    else band.prepend(truth);

    const callout = band.querySelector('.callout');
    const isFrozen = !!callout?.classList.contains('callout-success');
    if (callout) {
      const title = callout.querySelector('strong');
      const copy = callout.querySelector('p');
      if (isFrozen) {
        if (title) title.textContent = 'Demo card state · Frozen';
        if (copy) copy.textContent = 'Only Nova’s prototype card state changed. No bank was contacted, no report was submitted, and the ByteMart payment was not reversed.';
      } else {
        if (title) title.textContent = 'No bank contact';
        if (copy) copy.textContent = 'Choose based on what you want to preview. Freeze changes the demo card state; Report only previews reporting requirements.';
      }
    }

    const intro = [...band.children].find((element) => element.tagName === 'P' && !element.classList.contains('eyebrow') && !element.matches('[data-report-boundary]'));
    if (intro) {
      intro.classList.add('nova-d02-intro');
      intro.textContent = 'Freeze is a reversible card-protection demo. Report is a no-submit preview. Neither action changes the completed ByteMart payment.';
    }

    const actions = band.querySelector('.action-stack');
    const report = band.querySelector('#report-transaction');
    if (!actions || !report) return;

    const freeze = band.querySelector('#freeze-card') || actions.querySelector('a.btn-primary[href*="screen=cards"]');
    if (!freeze) return;

    if (freeze.id === 'freeze-card') {
      freeze.textContent = 'Freeze card in demo — no bank contact';
      freeze.setAttribute('aria-label', 'Freeze card in demo — no bank contact');
      freeze.addEventListener('click', patchFreezeDialog);
    } else {
      freeze.textContent = 'Review demo-frozen card';
    }

    report.textContent = 'Preview report — no bank case created';
    report.setAttribute('aria-label', 'Preview report steps — no bank case created and no bank contact');

    const freezeCard = actionCard({
      kind: 'freeze',
      label: isFrozen ? 'Freeze card · demo state is active' : 'Freeze card in demo',
      copy: isFrozen
        ? 'The prototype card is currently frozen. You can review or reverse that simulated protection state from Cards.'
        : 'Use this when you want to preview protecting the card while you investigate the unusual payment.',
      changes: isFrozen ? 'Prototype card state remains Frozen.' : 'Prototype card state only.',
      doesNot: 'Report the transaction, reverse ByteMart, or contact a bank.',
      control: freeze
    });

    const reportCard = actionCard({
      kind: 'report',
      label: 'Report transaction preview',
      copy: 'Use this to inspect what a real reporting handoff would require before any submission could happen.',
      changes: 'Nothing in account or card state.',
      doesNot: 'Freeze the card, create a bank case, request a refund, or contact a bank.',
      control: report
    });

    actions.classList.add('nova-d02-action-grid');
    actions.replaceChildren(freezeCard, reportCard);

    const note = band.querySelector('[data-report-boundary]');
    if (note) {
      note.classList.add('nova-d02-boundary-note');
      note.innerHTML = '<strong>Neither action contacts a bank.</strong> Freeze does not report the transaction. Report preview does not freeze the card or create a bank case.';
    }
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
        ? 'Nothing was submitted and card protection did not change.'
        : 'This screen can preview reporting steps, but it cannot submit a report.'
    }));

    const eyebrow = panel.querySelector('.eyebrow');
    const heading = panel.querySelector('h2');
    const callout = panel.querySelector('.callout');
    const calloutTitle = callout?.querySelector('strong');
    const calloutCopy = callout?.querySelector('p');

    if (isHandoff) {
      if (eyebrow) eyebrow.textContent = 'Demo result · simulated support handoff';
      if (heading) heading.textContent = 'No bank case created';
      if (calloutTitle) calloutTitle.textContent = 'Nothing was submitted';
      if (calloutCopy) calloutCopy.textContent = 'This prototype result confirms the boundary: no bank was contacted, no dispute was created, no refund was requested, and card protection was not changed by this preview.';
    } else {
      if (eyebrow) eyebrow.textContent = 'Report preview · simulated';
      if (calloutTitle) calloutTitle.textContent = 'Nothing has been reported';
      if (calloutCopy) calloutCopy.textContent = 'This portfolio prototype can preview the reporting decision, but it cannot contact a bank, create a dispute, request a refund, or freeze the card.';
    }

    const actions = panel.querySelector('.action-stack');
    const primary = actions?.querySelector('.btn-primary');
    if (!isHandoff && primary) {
      primary.textContent = 'Preview bank handoff — no bank contact';
      primary.setAttribute('aria-label', 'Preview bank handoff requirements — no bank contact');
    }

    const note = document.createElement('div');
    note.className = 'nova-d02-report-note';
    note.innerHTML = isHandoff
      ? '<strong>Card protection is separate.</strong> This report preview did not freeze or unfreeze the card.'
      : '<strong>Report preview does not freeze the card.</strong> Card protection stays unchanged unless you separately choose the Freeze demo action.';

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
