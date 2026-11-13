/* Nova workflow layer — completes the prototype's create / view / edit / delete
   flows on top of the canonical renderer and state owner:
     payees, scheduled and recurring transfers, card replacement / PIN / limits,
     savings goals, subscriptions, notifications, profile and region settings,
     trusted devices and passcode, transaction dispute drafts, demo-data tools.
   Data: window.NovaStore (sessionStorage, seeded from assets/nova-demo-data.js).
   Every action is local to the tab: no bank, card network or merchant is
   contacted and no money moves. Loaded before the renderer so nova.js can compose the
   workflow screens inside the shared shell; behaviour binds on DOMContentLoaded. */
(() => {
  'use strict';

  const store = window.NovaStore;
  if (!store) return;
  const params = new URLSearchParams(location.search);
  const screen = params.get('screen') || 'home';
  const lifecycle = params.get('state') || '';
  const TODAY = store.seed.today;
  const SAFE_TO_SPEND = 1300;
  const BALANCE = 2840;
  const DEMO_PASSCODE = '2468';
  const DEMO_PIN = '7302';
  const demoOn = () => window.NovaDemoMode === true;
  const FREQUENCY = { once: 'One-off', weekly: 'Every week', monthly: 'Every month' };
  const DISPUTE_REASONS = { duplicate: 'Charged twice', amount: 'Wrong amount', 'not-received': 'Goods or service not received', refund: 'Refund not received', other: 'Something else' };
  const REPLACE_REASONS = { damaged: 'Damaged card', lost: 'Lost card', stolen: 'Stolen card', expiring: 'Card expiring soon' };
  const NAME_PATTERN = /^[\p{L} .'-]{2,40}$/u;
  const BANK_PATTERN = /^[\p{L}0-9 .'-]{0,40}$/u;

  /* ---------- Small helpers ---------- */
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const euro = (value, signed = false) => {
    const number = Number(value) || 0;
    const abs = Math.abs(number).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${signed ? (number > 0 ? '+' : number < 0 ? '−' : '') : ''}€${abs}`;
  };
  const initials = (name) => String(name).trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const shortDate = (iso) => { const [, month, day] = String(iso).split('-').map(Number); return `${day} ${MONTHS[month - 1]}`; };
  const longDate = (iso) => `${shortDate(iso)} ${String(iso).slice(0, 4)}`;
  const addDays = (iso, days) => { const date = new Date(`${iso}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + days); return date.toISOString().slice(0, 10); };
  const roundMoney = (value) => Math.round(value * 100) / 100;
  const parseAmount = (raw) => { const text = String(raw).trim().replace(/[€\s]/g, '').replace(/,/g, '.'); return /^\d+(\.\d{1,2})?$/.test(text) ? Number(text) : NaN; };
  const route = (name, extra = '') => `app.html?screen=${name}${extra}`;
  const svg = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const ICON = {
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    arrow: svg('<path d="M5 12h14"/><path d="m14 7 5 5-5 5"/>'),
    phone: svg('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10 18h4"/>'),
    laptop: svg('<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 19h20"/>'),
    tablet: svg('<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M11 18h2"/>')
  };

  function iban(value) { return String(value || '').replace(/\s+/g, '').toUpperCase(); }
  function ibanValid(value) {
    const compact = iban(value);
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(compact)) return false;
    const rearranged = compact.slice(4) + compact.slice(0, 4);
    let remainder = 0;
    for (const char of rearranged) {
      const digits = /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char;
      for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
    }
    return remainder === 1;
  }
  const formatIban = (value) => iban(value).replace(/(.{4})/g, '$1 ').trim();

  /* ---------- Feedback ---------- */
  function toast(message) {
    document.querySelector('.toast[data-nova-wf-toast]')?.remove();
    const node = document.createElement('div');
    node.className = 'toast'; node.dataset.novaWfToast = 'true';
    node.setAttribute('role', 'status'); node.setAttribute('aria-live', 'polite');
    node.textContent = message; document.body.appendChild(node);
    clearTimeout(toast.timer); toast.timer = setTimeout(() => node.remove(), 4200);
  }
  const FLASH_KEY = 'nova_demo_flash';
  function flash(message) { try { sessionStorage.setItem(FLASH_KEY, message); } catch {} }
  function showFlash() { let message = ''; try { message = sessionStorage.getItem(FLASH_KEY) || ''; sessionStorage.removeItem(FLASH_KEY); } catch {} if (message) toast(message); }
  function go(href, message) { if (message) flash(message); location.href = href; }

  function setBusy(button, busy, label) {
    if (!button) return;
    if (busy) { button.dataset.idleLabel = button.textContent; button.textContent = label || 'Saving…'; button.setAttribute('aria-busy', 'true'); button.disabled = true; }
    else { button.removeAttribute('aria-busy'); button.disabled = false; if (label) button.textContent = label; else if (button.dataset.idleLabel) button.textContent = button.dataset.idleLabel; }
  }

  function setFieldError(form, name, message) {
    const input = form.querySelector(`[name="${name}"]`);
    if (!input) return;
    const field = input.closest('.field') || input.closest('fieldset') || input.parentElement;
    const errorId = `${input.id || name}-error`;
    let error = field.querySelector(`#${CSS.escape(errorId)}`);
    if (!error) { error = document.createElement('span'); error.className = 'field-error'; error.id = errorId; field.appendChild(error); }
    error.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    const describedBy = new Set((input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean)); describedBy.add(errorId);
    input.setAttribute('aria-describedby', [...describedBy].join(' '));
  }
  function clearFieldErrors(form) {
    form.querySelectorAll('[aria-invalid="true"]').forEach((input) => input.setAttribute('aria-invalid', 'false'));
    form.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
  }
  const values = (form) => Object.fromEntries(new FormData(form).entries());

  /* Shared dialog: same markup and classes as NovaProduct.components.openDialog,
     plus form validation, a busy state and a recoverable error with retry. */
  function openForm({ title, body, submitLabel = 'Save', submitClass = 'btn-primary', busyLabel = 'Saving…', cancelLabel = 'Cancel', validate, perform, done, onOpen }) {
    document.querySelector('[data-nova-wf-dialog]')?.remove();
    const lastFocus = document.activeElement;
    const backdrop = document.createElement('div');
    backdrop.className = 'dialog-backdrop'; backdrop.dataset.novaWfDialog = 'true';
    backdrop.innerHTML = `<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="nova-wf-dialog-title" tabindex="-1"><h2 id="nova-wf-dialog-title">${title}</h2><form novalidate>${body}<div class="nova-wf-alert" role="alert" data-wf-dialog-error hidden></div><div class="dialog-actions">${submitLabel ? `<button class="btn ${submitClass}" type="submit" data-primary>${submitLabel}</button>` : ''}${cancelLabel ? `<button class="btn btn-secondary" type="button" data-secondary>${cancelLabel}</button>` : ''}</div></form></div>`;
    document.body.appendChild(backdrop);
    const dialog = backdrop.querySelector('.dialog');
    const form = backdrop.querySelector('form');
    const primary = backdrop.querySelector('[data-primary]');
    const alert = backdrop.querySelector('[data-wf-dialog-error]');
    let busy = false;
    const close = () => { if (!backdrop.isConnected) return; document.removeEventListener('keydown', onKey); backdrop.remove(); if (lastFocus?.isConnected) lastFocus.focus(); };
    const onKey = (event) => {
      if (event.key === 'Escape' && !busy) { event.preventDefault(); close(); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...backdrop.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter((node) => !node.disabled && node.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (busy) return;
      clearFieldErrors(form); alert.hidden = true;
      const data = validate ? validate(form, values(form)) : values(form);
      if (!data) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
      if (!perform) { close(); done?.(data); return; }
      busy = true; setBusy(primary, true, busyLabel);
      try {
        const result = await store.request(() => perform(data));
        busy = false; close(); done?.(result, data);
      } catch (error) {
        busy = false; setBusy(primary, false, 'Try again');
        alert.innerHTML = `<div><strong>Couldn’t complete this</strong><p>${esc(error.message)}</p></div>`;
        alert.hidden = false; primary?.focus();
      }
    });
    backdrop.querySelector('[data-secondary]')?.addEventListener('click', () => { if (!busy) close(); });
    backdrop.addEventListener('mousedown', (event) => { if (event.target === backdrop && !busy) close(); });
    document.addEventListener('keydown', onKey);
    onOpen?.(dialog, close);
    const firstField = dialog.querySelector('input:not([type=hidden]):not([disabled]),select,textarea');
    (firstField || dialog).focus();
    return { dialog, close };
  }
  const confirmAction = ({ title, body, confirmLabel, danger = true, busyLabel = 'Working…', perform, done }) =>
    openForm({ title, body, submitLabel: confirmLabel, submitClass: danger ? 'btn-risk' : 'btn-primary', busyLabel, perform, done });

  /* ---------- Async regions: loading → content | empty | recoverable error ---------- */
  const skeleton = (rows = 3) => `<div class="nova-wf-skeleton" aria-hidden="true">${'<i></i>'.repeat(rows)}</div><p class="sr-only">Loading…</p>`;
  const emptyState = (title, copy, action = '') => `<div class="nova-wf-empty" role="status"><strong>${title}</strong><p>${copy}</p>${action}</div>`;
  function hydrate(region, load, render) {
    if (!region) return;
    region.setAttribute('aria-busy', 'true'); region.innerHTML = skeleton(Number(region.dataset.rows) || 3);
    if (lifecycle === 'loading' && params.has('pin')) return;
    const forcedError = lifecycle === 'error';
    store.request(() => { if (forcedError) throw Object.assign(new Error('Nova didn’t respond. Nothing was changed. Try again.'), { simulated: true }); return load(); }, { delay: 260 })
      .then((data) => { region.removeAttribute('aria-busy'); region.innerHTML = render(data); bindRegion(region); })
      .catch((error) => {
        region.removeAttribute('aria-busy');
        region.innerHTML = `<div class="nova-wf-alert" role="alert"><div><strong>Couldn’t load this list</strong><p>${esc(error.message)}</p></div><button class="nova-wf-small-btn" type="button" data-wf-retry>Try again</button></div>`;
        region.querySelector('[data-wf-retry]').addEventListener('click', () => { if (forcedError) { const next = new URL(location.href); next.searchParams.delete('state'); location.replace(next); return; } hydrate(region, load, render); });
      });
  }
  const regionBinders = [];
  function bindRegion(region) { regionBinders.forEach((bind) => bind(region)); }

  /* =====================================================================
     Screens composed by nova.js inside the shared shell.
     ===================================================================== */
  const head = (title, action = '', lede = '') => `<header class="v3-page-head"><div><h1>${title}</h1>${lede ? `<p class="nova-wf-lede">${lede}</p>` : ''}</div>${action}</header>`;
  const notFound = (ctx, title, copy, back, backLabel) => `<main id="main" class="main-wrap task-shell nova-wf-page" tabindex="-1" data-nova-wf-state="not-found">${ctx.pageHeader(title, copy, back)}<section class="task-panel nova-wf-empty" role="status"><strong>${title}</strong><p>${copy}</p><a class="btn btn-primary" href="${back}">${backLabel}</a></section></main>`;

  function payeeLine(payee) { return [payee.bank, payee.account].filter(Boolean).join(' · '); }

  function payeesScreen(ctx) {
    const id = params.get('payee');
    if (id) {
      const payee = store.find('payees', id);
      if (!payee) return notFound(ctx, 'Payee not found', 'This payee may have been deleted.', route('payees'), 'Back to payees');
      return `<main id="main" class="main-wrap task-shell nova-wf-page" tabindex="-1" data-nova-wf="payee-detail" data-id="${esc(payee.id)}">${ctx.pageHeader(esc(payee.name), '', route('payees'))}<section class="task-panel" data-nova-wf-region="payee-detail" data-rows="4"></section></main>`;
    }
    return `<main id="main" class="main-wrap nova-wf-page" tabindex="-1" data-nova-wf="payees">${head('Payees', `<button class="v3-pill-btn" type="button" data-wf="payee-add">${ICON.plus}<span>Add payee</span></button>`, 'People and accounts you can send money to.')}<section class="v3-surface nova-wf-card"><div class="v3-section-title"><h2>Saved payees</h2><span class="meta" data-wf-count></span></div><div class="nova-wf-search"><label class="sr-only" for="nova-wf-payee-search">Search payees</label><input class="input" id="nova-wf-payee-search" type="search" placeholder="Search name, bank or account" autocomplete="off"></div><div data-nova-wf-region="payees"></div></section></main>`;
  }

  function scheduledScreen(ctx) {
    const id = params.get('transfer');
    if (id) {
      const item = store.find('scheduled', id);
      if (!item) return notFound(ctx, 'Scheduled transfer not found', 'It may have been removed.', route('scheduled'), 'Back to scheduled transfers');
      const payee = store.find('payees', item.payeeId);
      return `<main id="main" class="main-wrap task-shell nova-wf-page" tabindex="-1" data-nova-wf="scheduled-detail" data-id="${esc(item.id)}">${ctx.pageHeader(`${euro(item.amount)} to ${esc(payee?.name || 'deleted payee')}`, '', route('scheduled'))}<section class="task-panel" data-nova-wf-region="scheduled-detail" data-rows="4"></section></main>`;
    }
    return `<main id="main" class="main-wrap nova-wf-page" tabindex="-1" data-nova-wf="scheduled">${head('Scheduled transfers', `<button class="v3-pill-btn" type="button" data-wf="scheduled-add">${ICON.plus}<span>New scheduled transfer</span></button>`, 'Future and recurring transfers you plan in Nova.')}<section class="v3-surface nova-wf-card"><div class="v3-section-title"><h2>Upcoming</h2><span class="meta" data-wf-count></span></div><div data-nova-wf-region="scheduled"></div></section></main>`;
  }

  function disputesScreen(ctx) {
    const id = params.get('dispute');
    if (id) {
      const item = store.find('disputes', id);
      if (!item) return notFound(ctx, 'Dispute draft not found', 'It may have been deleted.', route('disputes'), 'Back to dispute drafts');
      return `<main id="main" class="main-wrap task-shell nova-wf-page" tabindex="-1" data-nova-wf="dispute-detail" data-id="${esc(item.id)}">${ctx.pageHeader(`Dispute draft: ${esc(item.merchant)}`, '', route('disputes'))}<section class="task-panel" data-nova-wf-region="dispute-detail" data-rows="4"></section></main>`;
    }
    return `<main id="main" class="main-wrap nova-wf-page" tabindex="-1" data-nova-wf="disputes">${head('Dispute drafts', `<a class="v3-pill-btn" href="${route('activity')}">Choose a transaction</a>`, 'Prepare the details our team will ask for. Drafts stay private until you submit them.')}<section class="v3-surface nova-wf-card"><div class="v3-section-title"><h2>Your drafts</h2><span class="meta" data-wf-count></span></div><div data-nova-wf-region="disputes"></div></section></main>`;
  }

  window.NovaWorkflows = Object.freeze({ screens: Object.freeze({ payees: payeesScreen, scheduled: scheduledScreen, disputes: disputesScreen }) });

  /* =====================================================================
     Payees
     ===================================================================== */
  const payeeForm = (payee = {}) => `
    <div class="field"><label for="wf-payee-name">Full name</label><input class="input" id="wf-payee-name" name="name" maxlength="40" autocomplete="off" value="${esc(payee.name || '')}" aria-describedby="wf-payee-name-hint"><span class="field-hint" id="wf-payee-name-hint">As it appears on their account.</span></div>
    <div class="field"><label for="wf-payee-iban">IBAN</label><input class="input mono" id="wf-payee-iban" name="iban" maxlength="42" autocomplete="off" spellcheck="false" value="${esc(payee.iban || '')}" aria-describedby="wf-payee-iban-hint"><span class="field-hint" id="wf-payee-iban-hint">For example IE26 NRTH 9300 1520 4820 48. Checked for format only.</span></div>
    <div class="field"><label for="wf-payee-bank">Bank (optional)</label><input class="input" id="wf-payee-bank" name="bank" maxlength="40" autocomplete="off" value="${esc(payee.bank || '')}"></div>
    <div class="field"><label for="wf-payee-nickname">Nickname (optional)</label><input class="input" id="wf-payee-nickname" name="nickname" maxlength="24" autocomplete="off" value="${esc(payee.nickname || '')}"></div>
    <div class="field"><label for="wf-payee-category">Category</label><select class="input" id="wf-payee-category" name="category">${['Friends & family', 'Bills & utilities', 'Business', 'Other'].map((option) => `<option ${option === (payee.category || 'Friends & family') ? 'selected' : ''}>${esc(option)}</option>`).join('')}</select></div>
    <p class="field-hint">We confirm the name with their bank before your first payment.</p>`;

  function validatePayee(form, data, currentId = '') {
    let ok = true;
    const name = data.name.trim().replace(/\s+/g, ' ');
    const compact = iban(data.iban);
    if (!name) { setFieldError(form, 'name', 'Enter the payee’s full name.'); ok = false; }
    else if (!NAME_PATTERN.test(name)) { setFieldError(form, 'name', 'Use 2–40 letters, spaces, apostrophes, full stops or hyphens.'); ok = false; }
    if (!compact) { setFieldError(form, 'iban', 'Enter an IBAN.'); ok = false; }
    else if (!ibanValid(compact)) { setFieldError(form, 'iban', 'This IBAN doesn’t look right. Check the country code and digits.'); ok = false; }
    else if (store.list('payees').some((payee) => iban(payee.iban) === compact && payee.id !== currentId)) { setFieldError(form, 'iban', 'You already have a payee with this IBAN.'); ok = false; }
    if (!BANK_PATTERN.test(data.bank.trim())) { setFieldError(form, 'bank', 'Use letters, numbers, spaces, full stops or hyphens.'); ok = false; }
    if (data.nickname.trim().length > 24) { setFieldError(form, 'nickname', 'Keep the nickname to 24 characters.'); ok = false; }
    return ok ? { name, iban: formatIban(compact), bank: data.bank.trim(), nickname: data.nickname.trim(), category: data.category, account: `•••• ${compact.slice(-4)}` } : null;
  }

  function addPayee(after) {
    openForm({
      title: 'Add a payee', body: payeeForm(), submitLabel: 'Save payee',
      validate: (form, data) => validatePayee(form, data),
      perform: (payee) => store.upsert('payees', { id: store.uid('payee'), lastPaid: '', ...payee }),
      done: (payee) => { if (after) after(payee); else go(route('payees', `&payee=${payee.id}`), `${payee.name} saved as a payee.`); }
    });
  }
  function editPayee(id) {
    const payee = store.find('payees', id); if (!payee) return;
    openForm({
      title: `Edit ${esc(payee.name)}`, body: payeeForm(payee), submitLabel: 'Save changes',
      validate: (form, data) => validatePayee(form, data, id),
      perform: (changes) => store.upsert('payees', { id, ...changes }),
      done: (saved) => go(location.href, `${saved.name} updated.`)
    });
  }
  function deletePayee(id) {
    const payee = store.find('payees', id); if (!payee) return;
    const planned = store.list('scheduled').filter((item) => item.payeeId === id && item.status === 'scheduled');
    confirmAction({
      title: `Delete ${esc(payee.name)}?`, confirmLabel: 'Delete payee', busyLabel: 'Deleting…',
      body: `<p>${esc(payee.name)} will be removed from your saved payees.${planned.length ? ` ${planned.length} scheduled transfer${planned.length === 1 ? '' : 's'} to them will be cancelled.` : ''}</p><p class="field-hint">Past transactions stay in Activity.</p>`,
      perform: () => { store.remove('payees', id); store.set('scheduled', store.list('scheduled').map((item) => item.payeeId === id && item.status === 'scheduled' ? { ...item, status: 'cancelled' } : item)); },
      done: () => go(route('payees'), `${payee.name} deleted.`)
    });
  }

  function renderPayeeRows(payees) {
    if (!payees.length) return emptyState('No saved payees yet', 'Add someone you pay often to send money or schedule a transfer in a couple of taps.', `<button class="btn btn-primary" type="button" data-wf="payee-add">Add payee</button>`);
    return `<div class="nova-wf-list" data-wf-payee-list>${payees.map((payee) => `<div class="nova-wf-row" data-wf-search-text="${esc(`${payee.name} ${payee.nickname} ${payee.bank} ${payee.account}`.toLowerCase())}"><a class="nova-wf-row-main" href="${route('payees', `&payee=${esc(payee.id)}`)}"><span class="nova-wf-avatar" aria-hidden="true">${esc(initials(payee.name))}</span><span><strong>${esc(payee.name)}${payee.nickname ? ` <span class="meta">(${esc(payee.nickname)})</span>` : ''}</strong><small>${esc(payeeLine(payee))}</small></span></a><div class="nova-wf-row-actions"><a class="nova-wf-small-btn" href="${route('transfer-amount', `&recipient=${esc(payee.id)}`)}" aria-label="Send money to ${esc(payee.name)}">Send</a></div></div>`).join('')}</div><div data-wf-search-empty hidden>${emptyState('No payees match your search', 'Try another name, bank or account ending.', '<button class="nova-wf-small-btn" type="button" data-wf="payee-search-clear">Clear search</button>')}</div>`;
  }

  function initPayees() {
    const main = document.querySelector('[data-nova-wf="payees"]');
    if (main) {
      const region = main.querySelector('[data-nova-wf-region="payees"]');
      const search = main.querySelector('#nova-wf-payee-search');
      const count = main.querySelector('[data-wf-count]');
      const filter = () => {
        const query = search.value.trim().toLowerCase();
        const rows = [...region.querySelectorAll('[data-wf-search-text]')];
        let visible = 0;
        rows.forEach((row) => { const match = !query || row.dataset.wfSearchText.includes(query); row.hidden = !match; if (match) visible++; });
        const empty = region.querySelector('[data-wf-search-empty]'); if (empty) empty.hidden = !rows.length || visible > 0;
      };
      search.addEventListener('input', filter);
      regionBinders.push(() => filter());
      hydrate(region, () => store.list('payees'), (payees) => { count.textContent = `${payees.length} saved`; search.closest('.nova-wf-search').hidden = !payees.length; return renderPayeeRows(payees); });
    }
    const detail = document.querySelector('[data-nova-wf="payee-detail"]');
    if (detail) {
      const id = detail.dataset.id;
      hydrate(detail.querySelector('[data-nova-wf-region]'), () => ({ payee: store.find('payees', id), planned: store.list('scheduled').filter((item) => item.payeeId === id && item.status === 'scheduled') }), ({ payee, planned }) => `
        <div class="nova-wf-row"><span class="nova-wf-avatar" aria-hidden="true">${esc(initials(payee.name))}</span><span><strong>${esc(payee.name)}</strong><small>${esc(payee.category)}</small></span></div>
        <dl class="detail-grid">${[['Nickname', payee.nickname || '—'], ['Bank', payee.bank || 'Not provided'], ['IBAN', `<span class="mono">${esc(payee.iban)}</span>`], ['Last paid', payee.lastPaid || 'Not paid yet']].map(([label, value]) => `<div class="detail-row"><dt>${label}</dt><dd>${label === 'IBAN' ? value : esc(value)}</dd></div>`).join('')}</dl>
        <h2 class="nova-wf-group-label">Scheduled to ${esc(payee.name.split(' ')[0])}</h2>
        ${planned.length ? `<div class="nova-wf-list">${planned.map((item) => `<a class="nova-wf-row nova-wf-row-main" href="${route('scheduled', `&transfer=${esc(item.id)}`)}"><span class="nova-wf-date">${shortDate(item.date).split(' ')[1]}<span>${shortDate(item.date).split(' ')[0]}</span></span><span><strong>${euro(item.amount)}</strong><small>${FREQUENCY[item.frequency]}${item.reference ? ` · ${esc(item.reference)}` : ''}</small></span></a>`).join('')}</div>` : `<p class="meta">No scheduled transfers.</p>`}
        <div class="nova-wf-actions"><a class="btn btn-primary" href="${route('transfer-amount', `&recipient=${esc(payee.id)}`)}">Send money</a><a class="btn btn-secondary" href="${route('scheduled', `&new=1&payee=${esc(payee.id)}`)}">Schedule a transfer</a><button class="btn btn-secondary" type="button" data-wf="payee-edit" data-id="${esc(payee.id)}">Edit payee</button><button class="btn btn-risk" type="button" data-wf="payee-delete" data-id="${esc(payee.id)}">Delete payee</button></div>
        <p class="nova-wf-boundary"><strong>Saved payee.</strong> We check the name with their bank each time you send money.</p>`);
    }
  }

  /* Pay page: empty state when every payee has been deleted. */
  function initPayPage() {
    if (screen !== 'transfer-recipient') return;
    const chips = document.querySelector('.v4-recipient-chips');
    if (chips && !chips.querySelector('a')) {
      chips.insertAdjacentHTML('afterend', emptyState('No saved payees', 'Add a payee to send money from Nova.', `<a class="btn btn-primary" href="${route('payees')}">Add a payee</a>`));
      document.querySelector('[data-nova-recipient-empty]')?.remove();
    }
  }

  /* =====================================================================
     Scheduled and recurring transfers
     ===================================================================== */
  const scheduledForm = (item = {}) => {
    const payees = store.list('payees');
    const selected = item.payeeId || params.get('payee') || payees[0]?.id || '';
    return `
    <div class="field"><label for="wf-sch-payee">Pay to</label><select class="input" id="wf-sch-payee" name="payeeId">${payees.map((payee) => `<option value="${esc(payee.id)}" ${payee.id === selected ? 'selected' : ''}>${esc(payee.name)} · ${esc(payee.account)}</option>`).join('')}</select></div>
    <div class="field"><label for="wf-sch-amount">Amount (€)</label><input class="input" id="wf-sch-amount" name="amount" inputmode="decimal" autocomplete="off" value="${item.amount ?? ''}" aria-describedby="wf-sch-amount-hint"><span class="field-hint" id="wf-sch-amount-hint">€0.01 to ${euro(BALANCE)}. Safe to spend today is ${euro(SAFE_TO_SPEND)}.</span></div>
    <div class="field"><label for="wf-sch-date">${item.id ? 'Next transfer date' : 'First transfer date'}</label><input class="input" id="wf-sch-date" name="date" type="date" min="${addDays(TODAY, 1)}" max="${addDays(TODAY, 365)}" value="${item.date || addDays(TODAY, 7)}"></div>
    <div class="field"><label for="wf-sch-frequency">Repeat</label><select class="input" id="wf-sch-frequency" name="frequency">${Object.entries(FREQUENCY).map(([value, label]) => `<option value="${value}" ${value === (item.frequency || 'once') ? 'selected' : ''}>${label}</option>`).join('')}</select></div>
    <div class="field"><label for="wf-sch-reference">Reference (optional)</label><input class="input" id="wf-sch-reference" name="reference" maxlength="35" autocomplete="off" value="${esc(item.reference || '')}"></div>
    <p class="field-hint">We send it on the date you choose and remind you the day before.</p>`;
  };
  function validateScheduled(form, data) {
    let ok = true;
    const amount = parseAmount(data.amount);
    if (!store.find('payees', data.payeeId)) { setFieldError(form, 'payeeId', 'Choose a saved payee.'); ok = false; }
    if (!String(data.amount).trim()) { setFieldError(form, 'amount', 'Enter an amount.'); ok = false; }
    else if (!Number.isFinite(amount)) { setFieldError(form, 'amount', 'Enter an amount like 25 or 25.50.'); ok = false; }
    else if (amount <= 0) { setFieldError(form, 'amount', 'Enter an amount greater than €0.'); ok = false; }
    else if (amount > BALANCE) { setFieldError(form, 'amount', `That is above your ${euro(BALANCE)} balance.`); ok = false; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date || '')) { setFieldError(form, 'date', 'Choose a date.'); ok = false; }
    else if (data.date <= TODAY) { setFieldError(form, 'date', 'Choose a date after today (15 Sep 2026).'); ok = false; }
    else if (data.date > addDays(TODAY, 365)) { setFieldError(form, 'date', 'Choose a date within the next 12 months.'); ok = false; }
    if (!FREQUENCY[data.frequency]) { setFieldError(form, 'frequency', 'Choose how often it repeats.'); ok = false; }
    return ok ? { payeeId: data.payeeId, amount: roundMoney(amount), date: data.date, frequency: data.frequency, reference: data.reference.trim() } : null;
  }
  function addScheduled() {
    if (!store.list('payees').length) {
      openForm({ title: 'Add a payee first', body: '<p>Scheduled transfers go to a saved payee. Add one, then come back to schedule.</p>', submitLabel: 'Add a payee', done: () => go(route('payees')) });
      return;
    }
    openForm({
      title: 'Schedule a transfer', body: scheduledForm(), submitLabel: 'Schedule transfer', busyLabel: 'Scheduling…',
      validate: validateScheduled,
      perform: (item) => store.upsert('scheduled', { id: store.uid('sch'), status: 'scheduled', ...item }),
      done: (item) => go(route('scheduled', `&transfer=${item.id}`), `Transfer scheduled for ${longDate(item.date)}.`)
    });
  }
  function editScheduled(id) {
    const item = store.find('scheduled', id); if (!item) return;
    openForm({
      title: 'Edit scheduled transfer', body: scheduledForm(item), submitLabel: 'Save changes',
      validate: validateScheduled,
      perform: (changes) => store.upsert('scheduled', { id, ...changes }),
      done: () => go(location.href, 'Scheduled transfer updated.')
    });
  }
  function cancelScheduled(id) {
    const item = store.find('scheduled', id); if (!item) return;
    const payee = store.find('payees', item.payeeId);
    confirmAction({
      title: item.frequency === 'once' ? 'Cancel this transfer?' : 'Cancel all future transfers?', confirmLabel: 'Cancel transfer', busyLabel: 'Cancelling…',
      body: `<p>${euro(item.amount)} to ${esc(payee?.name || 'this payee')} on ${longDate(item.date)}${item.frequency === 'once' ? '' : `, then ${FREQUENCY[item.frequency].toLowerCase()}`} will no longer be planned.</p><p class="field-hint">You can restore it from the cancelled list.</p>`,
      perform: () => store.upsert('scheduled', { id, status: 'cancelled' }),
      done: () => go(location.href, 'Scheduled transfer cancelled.')
    });
  }
  function restoreScheduled(button) {
    const id = button.dataset.id;
    runInline(button, 'Restoring…', () => { const item = store.find('scheduled', id); const date = item.date <= TODAY ? addDays(TODAY, 7) : item.date; store.upsert('scheduled', { id, status: 'scheduled', date }); }, () => go(location.href, 'Scheduled transfer restored.'));
  }
  function deleteScheduled(id) {
    confirmAction({ title: 'Remove from history?', confirmLabel: 'Remove', busyLabel: 'Removing…', body: '<p>This cancelled transfer will be removed from the list.</p>', perform: () => store.remove('scheduled', id), done: () => go(route('scheduled'), 'Removed from cancelled transfers.') });
  }

  const scheduledRow = (item) => {
    const payee = store.find('payees', item.payeeId);
    const [day, month] = shortDate(item.date).split(' ');
    return `<a class="nova-wf-row nova-wf-row-main" href="${route('scheduled', `&transfer=${esc(item.id)}`)}"><span class="nova-wf-date" aria-hidden="true">${month}<span>${day}</span></span><span><strong>${esc(payee?.name || 'Deleted payee')}</strong><small>${longDate(item.date)} · ${FREQUENCY[item.frequency]}${item.reference ? ` · ${esc(item.reference)}` : ''}</small></span><b>${euro(-item.amount, true)}</b></a>`;
  };
  function initScheduled() {
    const main = document.querySelector('[data-nova-wf="scheduled"]');
    if (main) {
      const count = main.querySelector('[data-wf-count]');
      hydrate(main.querySelector('[data-nova-wf-region]'), () => store.list('scheduled').sort((a, b) => a.date.localeCompare(b.date)), (items) => {
        const upcoming = items.filter((item) => item.status === 'scheduled');
        const cancelled = items.filter((item) => item.status === 'cancelled');
        count.textContent = `${upcoming.length} planned`;
        const total = upcoming.reduce((sum, item) => sum + item.amount, 0);
        return `${upcoming.length ? `<div class="nova-wf-list">${upcoming.map(scheduledRow).join('')}</div><p class="meta nova-wf-section-gap">Next ${upcoming.length === 1 ? 'transfer' : `${upcoming.length} transfers`}: ${euro(total)} in total.</p>` : emptyState('Nothing scheduled', 'Plan a one-off or recurring transfer to a saved payee.', '<button class="btn btn-primary" type="button" data-wf="scheduled-add">Schedule a transfer</button>')}
          ${cancelled.length ? `<h2 class="nova-wf-group-label">Cancelled</h2><div class="nova-wf-list">${cancelled.map((item) => `<div class="nova-wf-row"><span class="nova-wf-row-main"><span><strong>${esc(store.find('payees', item.payeeId)?.name || 'Deleted payee')} · ${euro(item.amount)}</strong><small>Was ${longDate(item.date)} · ${FREQUENCY[item.frequency]}</small></span></span><div class="nova-wf-row-actions">${store.find('payees', item.payeeId) ? `<button class="nova-wf-small-btn" type="button" data-wf="scheduled-restore" data-id="${esc(item.id)}">Restore</button>` : ''}<button class="nova-wf-small-btn is-risk" type="button" data-wf="scheduled-delete" data-id="${esc(item.id)}" aria-label="Remove cancelled transfer to ${esc(store.find('payees', item.payeeId)?.name || 'deleted payee')}">Remove</button></div></div>`).join('')}</div>` : ''}`;
      });
      if (params.get('new') === '1') setTimeout(addScheduled, 0);
    }
    const detail = document.querySelector('[data-nova-wf="scheduled-detail"]');
    if (detail) {
      const id = detail.dataset.id;
      hydrate(detail.querySelector('[data-nova-wf-region]'), () => store.find('scheduled', id), (item) => {
        const payee = store.find('payees', item.payeeId);
        const live = item.status === 'scheduled';
        return `<p class="eyebrow">${live ? 'Scheduled' : 'Cancelled'}</p><div class="goal-amount">${euro(item.amount)}</div>
        <dl class="detail-grid">${[['To', payee ? `<a href="${route('payees', `&payee=${esc(payee.id)}`)}">${esc(payee.name)}</a> · ${esc(payee.account)}` : 'Deleted payee'], ['From', 'Current account · •••• 4421'], [live ? 'Next date' : 'Was planned for', longDate(item.date)], ['Repeats', FREQUENCY[item.frequency]], ['Reference', esc(item.reference || '—')], ['Status', live ? '<span class="status status-pending">Planned</span>' : '<span class="status status-neutral">Cancelled</span>']].map(([label, value]) => `<div class="detail-row"><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>
        ${live && item.amount > SAFE_TO_SPEND ? `<div class="nova-wf-note is-warning" role="note">This is above today’s ${euro(SAFE_TO_SPEND)} Safe to spend. Nova would check your plan again before the date.</div>` : ''}
        <div class="nova-wf-actions">${live ? `<button class="btn btn-secondary" type="button" data-wf="scheduled-edit" data-id="${esc(item.id)}">Edit transfer</button><button class="btn btn-risk" type="button" data-wf="scheduled-cancel" data-id="${esc(item.id)}">Cancel transfer</button>` : `${payee ? `<button class="btn btn-primary" type="button" data-wf="scheduled-restore" data-id="${esc(item.id)}">Restore transfer</button>` : ''}<button class="btn btn-risk" type="button" data-wf="scheduled-delete" data-id="${esc(item.id)}">Remove from history</button>`}</div>
        <p class="nova-wf-boundary"><strong>Scheduled.</strong> We’ll remind you the day before. Make sure the money is in your account by then.</p>`;
      });
    }
  }

  /* =====================================================================
     Dispute drafts (never submitted — respects the D-02 report boundary)
     ===================================================================== */
  const transactionsById = () => Object.fromEntries((window.NovaProduct?.data?.transactions || []).map(([name, category, amount, status, date]) => [window.NovaProduct.components.transactionId(name), { name, category, amount, status, date }]));
  const disputeForm = (draft, maxAmount) => `
    <fieldset class="nova-wf-choices"><legend>What went wrong?</legend>${Object.entries(DISPUTE_REASONS).map(([value, label], index) => `<label class="nova-wf-choice"><input type="radio" name="reason" value="${value}" ${(draft.reason ? draft.reason === value : index === 0) ? 'checked' : ''}><span>${label}</span></label>`).join('')}</fieldset>
    <div class="field"><label for="wf-dispute-amount">Amount in question (€)</label><input class="input" id="wf-dispute-amount" name="amount" inputmode="decimal" autocomplete="off" value="${draft.amount ?? maxAmount}" aria-describedby="wf-dispute-amount-hint"><span class="field-hint" id="wf-dispute-amount-hint">Up to ${euro(maxAmount)}, the transaction amount.</span></div>
    <div class="field"><label for="wf-dispute-details">What happened?</label><textarea class="input" id="wf-dispute-details" name="details" maxlength="500" rows="4" aria-describedby="wf-dispute-details-hint">${esc(draft.details || '')}</textarea><span class="field-hint" id="wf-dispute-details-hint">At least 10 characters. Include dates and any contact with the merchant.</span></div>
    <p class="nova-wf-boundary"><strong>Draft only.</strong> Our team sees a dispute only once you submit it.</p>`;
  function validateDispute(form, data, maxAmount) {
    let ok = true;
    const amount = parseAmount(data.amount);
    if (!DISPUTE_REASONS[data.reason]) { setFieldError(form, 'reason', 'Choose what went wrong.'); ok = false; }
    if (!Number.isFinite(amount)) { setFieldError(form, 'amount', 'Enter an amount like 12 or 12.50.'); ok = false; }
    else if (amount <= 0) { setFieldError(form, 'amount', 'Enter an amount greater than €0.'); ok = false; }
    else if (amount > maxAmount) { setFieldError(form, 'amount', `The amount can’t be more than the ${euro(maxAmount)} transaction.`); ok = false; }
    const details = data.details.trim();
    if (details.length < 10) { setFieldError(form, 'details', 'Describe what happened in at least 10 characters.'); ok = false; }
    return ok ? { reason: data.reason, amount: roundMoney(amount), details } : null;
  }
  function draftDispute(transactionId) {
    const txn = transactionsById()[transactionId]; if (!txn) return;
    const maxAmount = Math.abs(txn.amount);
    openForm({
      title: `Draft a dispute for ${esc(txn.name)}`, body: disputeForm({}, maxAmount), submitLabel: 'Save draft',
      validate: (form, data) => validateDispute(form, data, maxAmount),
      perform: (draft) => store.upsert('disputes', { id: store.uid('dispute'), transactionId, merchant: txn.name, date: txn.date, transactionAmount: txn.amount, updated: 'Today', ...draft }),
      done: (draft) => go(route('disputes', `&dispute=${draft.id}`), 'Dispute draft saved.')
    });
  }
  function editDispute(id) {
    const draft = store.find('disputes', id); if (!draft) return;
    const maxAmount = Math.abs(draft.transactionAmount);
    openForm({
      title: 'Edit dispute draft', body: disputeForm(draft, maxAmount), submitLabel: 'Save changes',
      validate: (form, data) => validateDispute(form, data, maxAmount),
      perform: (changes) => store.upsert('disputes', { id, updated: 'Today', ...changes }),
      done: () => go(location.href, 'Dispute draft updated.')
    });
  }
  function deleteDispute(id) {
    confirmAction({ title: 'Delete this draft?', confirmLabel: 'Delete draft', busyLabel: 'Deleting…', body: '<p>The draft will be deleted. It was never submitted, so there is nothing to withdraw.</p>', perform: () => store.remove('disputes', id), done: () => go(route('disputes'), 'Dispute draft deleted.') });
  }
  function initDisputes() {
    const main = document.querySelector('[data-nova-wf="disputes"]');
    if (main) {
      const count = main.querySelector('[data-wf-count]');
      hydrate(main.querySelector('[data-nova-wf-region]'), () => store.list('disputes'), (drafts) => {
        count.textContent = `${drafts.length} draft${drafts.length === 1 ? '' : 's'}`;
        return drafts.length ? `<div class="nova-wf-list">${drafts.map((draft) => `<a class="nova-wf-row nova-wf-row-main" href="${route('disputes', `&dispute=${esc(draft.id)}`)}"><span><strong>${esc(draft.merchant)}</strong><small>${DISPUTE_REASONS[draft.reason]} · Draft, not sent</small></span><b>${euro(draft.amount)}</b></a>`).join('')}</div>` : emptyState('No dispute drafts', 'Open a card payment in Activity and choose “Draft a dispute” to prepare the details a bank would ask for.', `<a class="btn btn-primary" href="${route('activity')}">Go to Activity</a>`);
      });
    }
    const detail = document.querySelector('[data-nova-wf="dispute-detail"]');
    if (detail) {
      const id = detail.dataset.id;
      hydrate(detail.querySelector('[data-nova-wf-region]'), () => store.find('disputes', id), (draft) => `<p class="eyebrow">Draft · not sent</p><div class="goal-amount">${euro(draft.amount)}</div>
        <dl class="detail-grid">${[['Transaction', `<a href="${route('transaction-detail', `&transaction=${esc(draft.transactionId)}`)}">${esc(draft.merchant)}</a> · ${esc(draft.date)} · ${euro(draft.transactionAmount, true)}`], ['Reason', DISPUTE_REASONS[draft.reason]], ['What happened', esc(draft.details)], ['Last edited', esc(draft.updated)], ['Bank case', 'Not created']].map(([label, value]) => `<div class="detail-row"><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>
        <div class="nova-wf-actions"><button class="btn btn-secondary" type="button" data-wf="dispute-edit" data-id="${esc(draft.id)}">Edit draft</button><button class="btn btn-risk" type="button" data-wf="dispute-delete" data-id="${esc(draft.id)}">Delete draft</button></div>
        <p class="nova-wf-boundary"><strong>Not submitted yet.</strong> Once submitted, our team reviews the dispute, may ask for evidence and decides any refund.</p>`);
    }
  }
  function initTransactionDispute() {
    if (screen !== 'transaction-detail') return;
    const main = document.querySelector('#main[data-transaction-id]');
    if (!main) return;
    const id = main.dataset.transactionId;
    const amount = Number(main.dataset.transactionAmount);
    const actions = main.querySelector('.action-stack');
    if (!actions || !(amount < 0) || main.dataset.transactionStatus === 'reversed') return;
    const existing = store.list('disputes').find((draft) => draft.transactionId === id);
    if (existing) actions.insertAdjacentHTML('beforebegin', `<div class="nova-wf-note" role="note">You have a dispute draft for this payment. It hasn’t been sent. <a href="${route('disputes', `&dispute=${esc(existing.id)}`)}">Open draft</a></div>`);
    else actions.insertAdjacentHTML('afterbegin', `<button class="btn btn-primary" type="button" data-wf="dispute-add" data-id="${esc(id)}">Draft a dispute</button>`);
  }
  function initActivityLinks() {
    if (screen !== 'activity') return;
    const header = document.querySelector('.activity-heading-row');
    if (!header) return;
    const drafts = store.list('disputes').length;
    header.insertAdjacentHTML('beforeend', `<a class="nova-wf-inline-link" href="${route('disputes')}">Dispute drafts${drafts ? ` (${drafts})` : ''}</a>`);
  }

  /* =====================================================================
     Savings goals
     ===================================================================== */
  const goalFields = (goal = {}) => `
    <div class="field"><label for="goal-name">Goal name</label><input class="input" id="goal-name" name="name" maxlength="40" autocomplete="off" placeholder="e.g. New laptop" value="${esc(goal.name || '')}"></div>
    <div class="field"><label for="goal-target">Target (€)</label><input class="input" id="goal-target" name="target" inputmode="decimal" autocomplete="off" value="${goal.target ?? ''}"></div>
    ${goal.id ? `<div class="field"><label for="goal-contribution">Monthly contribution (€)</label><input class="input" id="goal-contribution" name="contribution" inputmode="decimal" autocomplete="off" value="${goal.contribution ?? 0}"><span class="field-hint">€0 pauses the plan.</span></div>` : ''}
    <p class="field-hint">You can add money to the goal at any time.</p>`;
  function validateGoal(form, data, goal = null) {
    let ok = true;
    const name = data.name.trim().replace(/\s+/g, ' ');
    const target = parseAmount(data.target);
    if (!name) { setFieldError(form, 'name', 'Give the goal a name.'); ok = false; }
    else if (name.length > 40) { setFieldError(form, 'name', 'Keep the name to 40 characters.'); ok = false; }
    if (!String(data.target).trim()) { setFieldError(form, 'target', 'Enter a target amount.'); ok = false; }
    else if (!Number.isFinite(target) || target < 1) { setFieldError(form, 'target', 'Enter a target of at least €1.'); ok = false; }
    else if (target > 1000000) { setFieldError(form, 'target', 'Enter a target up to €1,000,000.'); ok = false; }
    else if (goal && target < goal.current) { setFieldError(form, 'target', `The target can’t be below the ${euro(goal.current)} already saved. Withdraw first.`); ok = false; }
    let contribution = goal ? goal.contribution : 0;
    if (goal) {
      contribution = parseAmount(data.contribution);
      if (!Number.isFinite(contribution) || contribution < 0) { setFieldError(form, 'contribution', 'Enter €0 or more.'); ok = false; }
      else if (contribution > 10000) { setFieldError(form, 'contribution', 'Enter up to €10,000 a month.'); ok = false; }
    }
    return ok ? { name, target: roundMoney(target), contribution: roundMoney(contribution) } : null;
  }
  function createGoal() {
    openForm({
      title: 'Create savings goal', body: goalFields(), submitLabel: 'Create goal', busyLabel: 'Creating…',
      validate: (form, data) => validateGoal(form, data),
      perform: (goal) => store.upsert('goals', { id: `custom-${Date.now().toString(36)}`, current: 0, next: 'Not scheduled', status: 'New goal', ...goal }),
      done: (goal) => go(route('savings-detail', `&goal=${goal.id}`), `${goal.name} created.`)
    });
  }
  function editGoal(id) {
    const goal = store.find('goals', id); if (!goal) return;
    openForm({
      title: 'Edit goal', body: goalFields(goal), submitLabel: 'Save changes',
      validate: (form, data) => validateGoal(form, data, goal),
      perform: (changes) => store.upsert('goals', { id, ...changes, next: changes.contribution > 0 ? (goal.next === 'Not scheduled' ? '28 Sep' : goal.next) : 'Not scheduled' }),
      done: () => go(location.href, 'Goal updated.')
    });
  }
  function moveGoalMoney(id, direction) {
    const goal = store.find('goals', id); if (!goal) return;
    const adding = direction === 'add';
    const room = roundMoney(goal.target - goal.current);
    if (adding && room <= 0) { toast('This goal has reached its target. Raise the target to keep saving.'); return; }
    const limit = adding ? Math.min(SAFE_TO_SPEND, room) : goal.current;
    if (!adding && limit <= 0) { toast('There is nothing to withdraw from this goal yet.'); return; }
    openForm({
      title: adding ? `Add money to ${esc(goal.name)}` : `Withdraw from ${esc(goal.name)}`,
      body: `<div class="field"><label for="wf-goal-amount">Amount (€)</label><input class="input" id="wf-goal-amount" name="amount" inputmode="decimal" autocomplete="off" aria-describedby="wf-goal-amount-hint"><span class="field-hint" id="wf-goal-amount-hint">${adding ? `Up to ${euro(limit)}${limit === SAFE_TO_SPEND ? ' (your Safe to spend)' : ' to reach the target'}.` : `Up to ${euro(limit)} saved in this goal.`}</span></div><p class="nova-wf-boundary"><strong>Instant.</strong> Money moves between your current account and this goal straight away.</p>`,
      submitLabel: adding ? 'Add money' : 'Withdraw', busyLabel: adding ? 'Adding…' : 'Withdrawing…',
      validate: (form, data) => {
        const amount = parseAmount(data.amount);
        if (!String(data.amount).trim()) { setFieldError(form, 'amount', 'Enter an amount.'); return null; }
        if (!Number.isFinite(amount) || amount <= 0) { setFieldError(form, 'amount', 'Enter an amount greater than €0, like 50 or 50.25.'); return null; }
        if (amount > limit) { setFieldError(form, 'amount', adding ? `Enter ${euro(limit)} or less.` : `You can withdraw up to ${euro(limit)}.`); return null; }
        return { amount: roundMoney(amount) };
      },
      perform: ({ amount }) => {
        const fresh = store.find('goals', id);
        const current = roundMoney(fresh.current + (adding ? amount : -amount));
        store.upsert('goals', { id, current, status: current >= fresh.target ? 'Target reached' : fresh.status === 'Target reached' ? 'In progress' : fresh.status });
        store.set('goalActivity', [{ id: store.uid('ga'), goalId: id, type: adding ? 'Added' : 'Withdrawn', amount, when: 'Today' }, ...store.list('goalActivity')]);
        return amount;
      },
      done: (amount) => go(location.href, `${euro(amount)} ${adding ? 'added to' : 'withdrawn from'} ${goal.name}.`)
    });
  }
  function deleteGoal(id) {
    const goal = store.find('goals', id); if (!goal) return;
    confirmAction({
      title: `Delete ${esc(goal.name)}?`, confirmLabel: 'Delete goal', busyLabel: 'Deleting…',
      body: `<p>The goal${goal.current > 0 ? ` and its ${euro(goal.current)} balance` : ''} will be removed. Any balance goes back to your current account.</p>`,
      perform: () => { store.remove('goals', id); store.set('goalActivity', store.list('goalActivity').filter((entry) => entry.goalId !== id)); },
      done: () => go(route('savings'), `${goal.name} deleted.`)
    });
  }
  function initSavingsPages() {
    if (screen === 'savings') {
      const button = document.querySelector('.v3-add-goal');
      if (button) { button.removeAttribute('data-v3-toast'); button.dataset.wf = 'goal-add'; }
      const list = document.querySelector('.v3-goals-card');
      if (list && !list.querySelector('.v3-goal-row')) list.querySelector('.v3-section-title')?.insertAdjacentHTML('afterend', emptyState('No savings goals yet', 'Create a goal to see progress and plan a monthly contribution.', '<button class="btn btn-primary" type="button" data-wf="goal-add">Create a goal</button>'));
    }
    if (screen === 'savings-detail') {
      const main = document.querySelector('#main[data-goal]');
      if (!main) return;
      const goal = store.find('goals', main.dataset.goal); if (!goal) return;
      const activity = store.list('goalActivity').filter((entry) => entry.goalId === goal.id);
      const panel = document.createElement('section');
      panel.className = 'v3-surface nova-wf-card';
      panel.setAttribute('aria-labelledby', 'nova-wf-goal-manage');
      panel.innerHTML = `<div class="v3-section-title"><h2 id="nova-wf-goal-manage">Manage goal</h2><span class="v3-status ${goal.current >= goal.target ? 'safe' : 'live'}">${esc(goal.status)}</span></div>
        <div class="nova-wf-actions"><button class="btn btn-primary" type="button" data-wf="goal-add-money" data-id="${esc(goal.id)}">Add money</button><button class="btn btn-secondary" type="button" data-wf="goal-withdraw" data-id="${esc(goal.id)}">Withdraw</button><button class="btn btn-secondary" type="button" data-wf="goal-edit" data-id="${esc(goal.id)}">Edit goal</button><button class="btn btn-risk" type="button" data-wf="goal-delete" data-id="${esc(goal.id)}">Delete goal</button></div>
        <h3 class="nova-wf-group-label">Goal activity</h3>${activity.length ? `<div class="nova-wf-list">${activity.slice(0, 6).map((entry) => `<div class="nova-wf-row"><span class="nova-wf-row-main"><span><strong>${entry.type}</strong><small>${esc(entry.when)}</small></span></span><b>${euro(entry.type === 'Added' ? entry.amount : -entry.amount, true)}</b></div>`).join('')}</div>` : '<p class="meta">No money added or withdrawn yet.</p>'}
        <p class="nova-wf-boundary"><strong>Goal money is yours.</strong> Withdraw it to your current account at any time.</p>`;
      (main.querySelector('.savings-detail-grid') || main).insertAdjacentElement('afterend', panel);
    }
  }

  /* =====================================================================
     Subscriptions: pause / resume / cancel / restore
     ===================================================================== */
  function setSubscription(id, status, button, message) {
    runInline(button, 'Saving…', () => store.upsert('subscriptions', { id, status }), () => go(location.href, message));
  }
  function pauseSubscription(id) {
    const sub = store.find('subscriptions', id); if (!sub) return;
    confirmAction({
      title: `Pause ${esc(sub.name)} payments?`, confirmLabel: 'Pause payments', danger: false, busyLabel: 'Pausing…',
      body: `<p>Nova will leave the ${euro(sub.amount)} ${sub.cadence.toLowerCase()} payment out of your plan and decline new charges from ${esc(sub.merchant)} until you resume.</p><p class="field-hint">Pausing is not cancelling: your agreement with ${esc(sub.merchant)} continues and they may still ask you to pay.</p>`,
      perform: () => store.upsert('subscriptions', { id, status: 'paused' }),
      done: () => go(location.href, `${sub.name} payments paused.`)
    });
  }
  function cancelSubscription(id) {
    const sub = store.find('subscriptions', id); if (!sub) return;
    openForm({
      title: `Cancel ${esc(sub.name)}?`, submitLabel: 'Cancel subscription', submitClass: 'btn-risk', busyLabel: 'Cancelling…', cancelLabel: 'Keep subscription',
      body: `<p>To end the contract, cancel with ${esc(sub.merchant)} directly. Freezing a card does not cancel it.</p><p>After you confirm, Nova removes the ${euro(sub.amount)} ${sub.cadence.toLowerCase()} payment from your plan and declines future charges from ${esc(sub.merchant)}.</p><label class="nova-wf-check"><input type="checkbox" name="confirmed" value="yes" id="wf-sub-confirm"><span>I’ve cancelled with ${esc(sub.merchant)} or I will do it now.</span></label>`,
      validate: (form, data) => { if (data.confirmed !== 'yes') { setFieldError(form, 'confirmed', `Confirm you’ve cancelled with ${sub.merchant} first.`); return null; } return data; },
      perform: () => store.upsert('subscriptions', { id, status: 'cancelled' }),
      done: () => go(route('subscriptions'), `${sub.name} cancelled in Nova. Remember to cancel with ${sub.merchant}.`)
    });
  }
  function initSubscriptions() {
    if (screen === 'payment-detail') {
      const main = document.querySelector('#main[data-payment-id]');
      const sub = main && store.find('subscriptions', main.dataset.paymentId);
      const panel = main?.querySelector('.task-panel');
      if (!sub || !panel) return;
      const label = { active: '<span class="status status-success">Active</span>', paused: '<span class="status status-pending">Paused</span>', cancelled: '<span class="status status-neutral">Cancelled</span>' }[sub.status];
      const actions = sub.status === 'active'
        ? `<button class="btn btn-secondary" type="button" data-wf="sub-pause" data-id="${esc(sub.id)}">Pause payments</button><button class="btn btn-risk" type="button" data-wf="sub-cancel" data-id="${esc(sub.id)}">Cancel subscription</button>`
        : sub.status === 'paused'
          ? `<button class="btn btn-primary" type="button" data-wf="sub-resume" data-id="${esc(sub.id)}">Resume payments</button><button class="btn btn-risk" type="button" data-wf="sub-cancel" data-id="${esc(sub.id)}">Cancel subscription</button>`
          : `<button class="btn btn-primary" type="button" data-wf="sub-restore" data-id="${esc(sub.id)}">Restore subscription</button>`;
      panel.querySelector('.detail-grid')?.insertAdjacentHTML('beforeend', `<div class="detail-row"><dt>Merchant</dt><dd>${esc(sub.merchant)}</dd></div><div class="detail-row"><dt>Status</dt><dd>${label}</dd></div>`);
      panel.querySelector('.action-stack')?.insertAdjacentHTML('beforebegin', `<div class="nova-wf-actions" aria-label="Subscription actions">${actions}</div>`);
      return;
    }
    if (screen !== 'subscriptions') return;
    const schedule = document.querySelector('.subscription-schedule');
    if (!schedule) return;
    const subs = store.list('subscriptions');
    const ledger = schedule.querySelector('.ledger');
    if (ledger && !ledger.children.length) ledger.insertAdjacentHTML('afterend', emptyState('No active subscriptions', 'Cancelled subscriptions are listed below. Restore one to add it back to your plan.'));
    const cancelled = subs.filter((sub) => sub.status === 'cancelled');
    if (cancelled.length) schedule.insertAdjacentHTML('beforeend', `<h3 class="nova-wf-group-label">Cancelled in Nova</h3><div class="nova-wf-list">${cancelled.map((sub) => `<div class="nova-wf-row"><span class="nova-wf-row-main"><span><strong>${esc(sub.name)}</strong><small>${esc(sub.merchant)} · ${euro(sub.amount)} ${esc(sub.cadence.toLowerCase())}</small></span></span><div class="nova-wf-row-actions"><button class="nova-wf-small-btn" type="button" data-wf="sub-restore" data-id="${esc(sub.id)}" aria-label="Restore ${esc(sub.name)}">Restore</button></div></div>`).join('')}</div>`);
  }

  /* =====================================================================
     Cards: PIN reveal, replacement, extra limits
     ===================================================================== */
  function revealPin(trigger) {
    openForm({
      title: 'Show card PIN', submitLabel: 'Show PIN', busyLabel: 'Checking…',
      body: `<p>Enter your passcode to see the PIN for the card ending ${store.get('card').last4}.</p><div class="field"><label for="wf-pin-passcode">Passcode</label><input class="input nova-passcode-input" id="wf-pin-passcode" name="passcode" type="password" inputmode="numeric" maxlength="4" autocomplete="off" aria-describedby="wf-pin-hint"><span class="nova-passcode-hint" id="wf-pin-hint">${demoOn() ? `Demo passcode: <strong>${DEMO_PASSCODE}</strong>` : 'Your 4-digit Nova passcode.'}</span></div>`,
      validate: (form, data) => {
        if (!/^\d{4}$/.test(data.passcode)) { setFieldError(form, 'passcode', 'Enter your 4-digit passcode.'); return null; }
        if (data.passcode !== DEMO_PASSCODE) { setFieldError(form, 'passcode', 'That passcode doesn’t match. Try again.'); return null; }
        return data;
      },
      perform: () => DEMO_PIN,
      done: (pin) => {
        let seconds = 10;
        const { dialog, close } = openForm({ title: 'Your card PIN', submitLabel: '', cancelLabel: 'Hide PIN', body: `<div class="nova-wf-pin" role="status"><strong aria-label="PIN ${pin.split('').join(' ')}">${pin}</strong><small data-wf-pin-timer>Hides in ${seconds} seconds</small></div><p class="field-hint">Never share your PIN, not even with Nova.</p>` });
        const timerNode = dialog.querySelector('[data-wf-pin-timer]');
        const timer = setInterval(() => { seconds -= 1; if (!dialog.isConnected) { clearInterval(timer); return; } if (seconds <= 0) { clearInterval(timer); close(); toast('PIN hidden.'); return; } timerNode.textContent = `Hides in ${seconds} seconds`; }, 1000);
      }
    });
  }
  function replaceCard() {
    const card = store.get('card');
    const profile = store.get('profile');
    openForm({
      title: `Replace card ending ${card.last4}`, submitLabel: 'Order replacement', busyLabel: 'Ordering…',
      body: `<fieldset class="nova-wf-choices"><legend>Why do you need a new card?</legend>${Object.entries(REPLACE_REASONS).map(([value, label], index) => `<label class="nova-wf-choice"><input type="radio" name="reason" value="${value}" ${index === 0 ? 'checked' : ''}><span>${label}<small>${value === 'lost' || value === 'stolen' ? 'The current card is frozen straight away and won’t work again.' : 'Your current card keeps working until the new one is activated.'}</small></span></label>`).join('')}</fieldset><div class="detail-grid nova-wf-section-gap"><div class="detail-row"><dt>Delivery address</dt><dd>${esc(profile.address)}</dd></div><div class="detail-row"><dt>Expected</dt><dd>5–7 working days</dd></div><div class="detail-row"><dt>Fee</dt><dd>€0.00</dd></div></div><p class="nova-wf-boundary"><strong>Delivery address.</strong> Change the address in Settings before you order.</p>`,
      validate: (form, data) => REPLACE_REASONS[data.reason] ? data : (setFieldError(form, 'reason', 'Choose a reason.'), null),
      perform: ({ reason }) => {
        const freeze = reason === 'lost' || reason === 'stolen';
        if (freeze) sessionStorage.setItem('nova_card_frozen', 'true');
        store.set('card', { ...store.get('card'), replacement: { reason, ordered: '15 Sep 2026', eta: '22–24 Sep 2026', froze: freeze } });
        return freeze;
      },
      done: (froze) => go(location.href, froze ? 'Replacement ordered and current card frozen.' : 'Replacement ordered.')
    });
  }
  function cancelReplacement() {
    confirmAction({ title: 'Cancel the replacement?', confirmLabel: 'Cancel replacement', busyLabel: 'Cancelling…', body: '<p>The replacement order will be cancelled. If your card was frozen because it was lost or stolen, it stays frozen until you unfreeze it.</p>', perform: () => store.set('card', { ...store.get('card'), replacement: null }), done: () => go(location.href, 'Replacement cancelled.') });
  }
  function initCards() {
    const card = store.get('card');
    if (screen === 'cards' || screen === 'card-frozen') {
      const column = document.querySelector('.v3-card-instrument') || document.querySelector('#main');
      const limits = document.querySelector('.v3-limits-card');
      if (limits) {
        const rows = [...limits.querySelectorAll('.v3-limit-row')];
        const cash = rows.find((row) => /cash/i.test(row.textContent)); if (cash) cash.querySelector('strong').textContent = `${euro(card.atmMonthly).replace('.00', '')} / month`;
        const tap = rows.find((row) => /contactless/i.test(row.textContent)); if (tap) tap.querySelector('strong').textContent = euro(card.contactlessTap).replace('.00', '');
      }
      if (!column) return;
      const services = document.createElement('section');
      services.className = 'v3-surface v3-settings-card nova-wf-card nova-wf-card-services';
      services.setAttribute('aria-labelledby', 'nova-wf-card-services');
      const replacement = card.replacement;
      services.innerHTML = `<div class="v3-section-title"><h2 id="nova-wf-card-services">Card services</h2>${replacement ? '<span class="v3-status live">Replacement ordered</span>' : ''}</div>
        ${replacement ? `<div class="nova-wf-note" role="status">New card ordered on ${esc(replacement.ordered)} (${esc(REPLACE_REASONS[replacement.reason].toLowerCase())}). Expected ${esc(replacement.eta)}.</div>` : ''}
        <button class="v3-settings-link" type="button" data-wf="card-pin"><span><strong>Show PIN</strong><small>Confirm with your passcode first</small></span><b aria-hidden="true">›</b></button>
        ${replacement ? `<button class="v3-settings-link danger" type="button" data-wf="card-replace-cancel"><span><strong>Cancel replacement</strong><small>Keep using the current card</small></span><b aria-hidden="true">›</b></button>` : `<button class="v3-settings-link" type="button" data-wf="card-replace"><span><strong>Replace card</strong><small>Damaged, lost, stolen or expiring</small></span><b aria-hidden="true">›</b></button>`}
        <a class="v3-settings-link" href="${route('card-controls')}"><span><strong>Limits and controls</strong><small>Daily spend, cash and contactless</small></span><b aria-hidden="true">›</b></a>`;
      column.appendChild(services);
    }
    if (screen === 'card-controls') {
      const sections = [...document.querySelectorAll('#main > .section')];
      const anchor = sections[sections.length - 1] || document.querySelector('#main');
      const extra = document.createElement('section');
      extra.className = 'section';
      extra.setAttribute('aria-labelledby', 'nova-wf-other-limits');
      extra.innerHTML = `<div class="section-head"><h2 id="nova-wf-other-limits">Other limits</h2></div><form data-wf-limits novalidate><div class="field"><label for="wf-atm-limit">Cash withdrawals per month (€)</label><input class="input" id="wf-atm-limit" name="atmMonthly" inputmode="decimal" autocomplete="off" value="${card.atmMonthly}" aria-describedby="wf-atm-hint"><span class="field-hint" id="wf-atm-hint">€0 to €1,000. €0 blocks cash withdrawals.</span></div><div class="field"><label for="wf-tap-limit">Single contactless payment (€)</label><input class="input" id="wf-tap-limit" name="contactlessTap" inputmode="decimal" autocomplete="off" value="${card.contactlessTap}" aria-describedby="wf-tap-hint"><span class="field-hint" id="wf-tap-hint">€0 to €100. Larger payments ask for your PIN.</span></div><div class="nova-wf-alert" role="alert" data-wf-limits-error hidden></div><button class="btn btn-primary nova-wf-section-gap" type="submit">Save cash and contactless limits</button></form>`;
      anchor.insertAdjacentElement('afterend', extra);
      const form = extra.querySelector('form');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearFieldErrors(form);
        const data = values(form);
        const atm = parseAmount(data.atmMonthly), tap = parseAmount(data.contactlessTap);
        let ok = true;
        if (!Number.isFinite(atm) || atm < 0 || atm > 1000) { setFieldError(form, 'atmMonthly', 'Enter an amount from €0 to €1,000.'); ok = false; }
        if (!Number.isFinite(tap) || tap < 0 || tap > 100) { setFieldError(form, 'contactlessTap', 'Enter an amount from €0 to €100.'); ok = false; }
        if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
        const button = form.querySelector('button[type=submit]');
        const alert = form.querySelector('[data-wf-limits-error]');
        alert.hidden = true;
        runInline(button, 'Saving…', () => store.set('card', { ...store.get('card'), atmMonthly: roundMoney(atm), contactlessTap: roundMoney(tap) }), () => { toast(`Limits saved: ${euro(atm)} cash a month, ${euro(tap)} per contactless payment.`); }, alert);
      });
    }
  }

  /* =====================================================================
     Notifications: read state, dismiss, unread badge
     ===================================================================== */
  const notificationState = () => Object.fromEntries(store.list('notifications').map((item) => [item.id, item]));
  function markNotification(id, changes) { const item = store.find('notifications', id); if (item) store.upsert('notifications', { id, ...changes }); }
  function updateUnreadBadges() {
    const unread = store.list('notifications').filter((item) => !item.read && !item.dismissed).length;
    document.querySelectorAll('.nova-bell-chip,.icon-btn[aria-label^="Notifications"],.ios26-nav a[href*="screen=notifications"]').forEach((link) => {
      link.dataset.unread = String(unread);
      link.setAttribute('aria-label', unread ? `Notifications, ${unread} unread` : 'Notifications');
    });
    // The rail link keeps its exact name "Notifications"; the count is a description.
    document.querySelectorAll('.v4-rail-nav a[href*="screen=notifications"]').forEach((link) => { link.title = unread ? `${unread} unread` : 'Notifications'; });
  }
  function initNotifications() {
    if (screen !== 'notifications') return;
    const list = document.querySelector('.notification-list');
    if (!list) return;
    const opened = params.get('notification');
    if (opened && !params.has('keep')) markNotification(opened, { read: true });
    const state = notificationState();
    list.querySelectorAll('[data-notification-preview]').forEach((item) => {
      const record = state[item.dataset.notificationPreview];
      if (!record) return;
      item.classList.toggle('is-unread', !record.read);
      if (!record.read) item.querySelector('strong')?.insertAdjacentHTML('beforeend', '<span class="sr-only"> (unread)</span>');
      item.addEventListener('click', () => markNotification(item.dataset.notificationPreview, { read: true }), { capture: true });
    });
    const records = store.list('notifications').filter((item) => !item.dismissed);
    const unread = records.filter((item) => !item.read).length;
    document.querySelector('.notifications-page .v3-page-head')?.insertAdjacentHTML('beforeend', `<div class="nova-wf-inbox-tools"><span class="meta">${unread ? `${unread} unread` : 'All read'}</span><button class="nova-wf-small-btn" type="button" data-wf="notif-read-all" ${unread ? '' : 'disabled'}>Mark all as read</button></div>`);
    const preferences = list.querySelector('.notification-preferences');
    if (preferences) preferences.setAttribute('href', 'app.html?screen=settings#notification-preferences');
    if (!records.length) {
      list.querySelector('h2')?.insertAdjacentHTML('afterend', emptyState('You’re all caught up', 'New alerts about payments, bills and savings will appear here.', '<button class="nova-wf-small-btn" type="button" data-wf="notif-restore">Show dismissed alerts</button>'));
      return;
    }
    const preview = document.querySelector('.notification-preview');
    const selected = list.querySelector('[data-notification-preview].is-selected');
    if (preview && selected) {
      const id = selected.dataset.notificationPreview;
      (preview.querySelector('.notification-next') || preview).insertAdjacentHTML('beforebegin', `<div class="nova-wf-preview-actions"><button class="nova-wf-small-btn" type="button" data-wf="notif-toggle" data-id="${esc(id)}">${state[id]?.read ? 'Mark as unread' : 'Mark as read'}</button><button class="nova-wf-small-btn" type="button" data-wf="notif-dismiss" data-id="${esc(id)}">Dismiss</button></div>`);
    }
  }


  /* =====================================================================
     Settings: profile, date format, notification anchor, demo data tools
     ===================================================================== */
  function editProfile() {
    const profile = store.get('profile');
    openForm({
      title: 'Edit profile', submitLabel: 'Save changes',
      body: `<div class="field"><label for="profile-name">Name</label><input id="profile-name" class="input" name="name" maxlength="60" autocomplete="name" value="${esc(profile.name)}"></div><div class="field"><label for="profile-email">Email</label><input id="profile-email" class="input" name="email" type="email" maxlength="80" autocomplete="email" value="${esc(profile.email)}"></div><div class="field"><label for="profile-phone">Mobile number</label><input id="profile-phone" class="input" name="phone" type="tel" maxlength="20" autocomplete="tel" value="${esc(profile.phone)}" aria-describedby="profile-phone-hint"><span class="field-hint" id="profile-phone-hint">Include the country code, for example +353 87 555 0142.</span></div><div class="field"><label for="profile-address">Card delivery address</label><input id="profile-address" class="input" name="address" maxlength="80" autocomplete="street-address" value="${esc(profile.address)}"></div><p class="field-hint">We use these details for statements and card delivery.</p>`,
      validate: (form, data) => {
        let ok = true;
        const name = data.name.trim().replace(/\s+/g, ' ');
        const email = data.email.trim();
        const phone = data.phone.trim();
        const address = data.address.trim();
        if (!name) { setFieldError(form, 'name', 'Enter your name.'); ok = false; }
        else if (!/^[\p{L} .'-]{2,60}$/u.test(name)) { setFieldError(form, 'name', 'Use letters, spaces, apostrophes, full stops or hyphens.'); ok = false; }
        if (!email) { setFieldError(form, 'email', 'Enter your email address.'); ok = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setFieldError(form, 'email', 'Enter an email like name@novamail.app.'); ok = false; }
        if (phone && !/^\+\d[\d ]{7,17}$/.test(phone)) { setFieldError(form, 'phone', 'Start with + and the country code, then 7–15 digits.'); ok = false; }
        if (address.length < 5) { setFieldError(form, 'address', 'Enter a delivery address of at least 5 characters.'); ok = false; }
        return ok ? { name, email, phone, address } : null;
      },
      perform: (profile) => store.set('profile', profile),
      done: () => { document.dispatchEvent(new CustomEvent('nova:profile-changed')); toast('Profile saved.'); }
    });
  }
  function chooseDateFormat() {
    const current = store.get('settings').dateFormat;
    const options = { 'DD MMM YYYY': '15 Sep 2026', 'DD/MM/YYYY': '15/09/2026', 'YYYY-MM-DD': '2026-09-15' };
    openForm({
      title: 'Date format', submitLabel: 'Save format',
      body: `<fieldset class="nova-wf-choices"><legend>Show dates as</legend>${Object.entries(options).map(([value, example]) => `<label class="nova-wf-choice"><input type="radio" name="format" value="${value}" ${value === current ? 'checked' : ''}><span>${example}<small>${value}</small></span></label>`).join('')}</fieldset><p class="field-hint">Applies to dates in Settings and your statements.</p>`,
      validate: (form, data) => options[data.format] ? data : null,
      perform: ({ format }) => store.set('settings', { ...store.get('settings'), dateFormat: format }),
      done: (settings) => { const small = document.querySelector('[data-wf="date-format"] small'); if (small) small.textContent = settings.dateFormat; toast('Date format saved.'); }
    });
  }
  function resetDemo() {
    confirmAction({
      title: 'Reset demo data?', confirmLabel: 'Reset demo data', busyLabel: 'Resetting…',
      body: '<p>Payees, scheduled transfers, goals, subscriptions, card settings, notifications, devices, dispute drafts and preferences go back to the original data.</p><p class="field-hint">Only this browser tab is affected.</p>',
      perform: () => { store.reset(); },
      done: () => go(location.href, 'Demo data reset.')
    });
  }
  function signOut() {
    confirmAction({
      title: 'Sign out of Nova?', confirmLabel: 'Sign out', danger: false, busyLabel: 'Signing out…',
      body: '<p>You’ll need your email and passcode to sign in again.</p>',
      perform: () => {},
      done: () => { try { sessionStorage.setItem('nova_signed_out', '1'); } catch {} location.href = 'signin.html'; }
    });
  }
  function initSettings() {
    if (screen !== 'settings') return;
    const profileButton = document.querySelector('.v3-settings-profile button');
    if (profileButton) { profileButton.removeAttribute('data-v3-toast'); profileButton.dataset.wf = 'profile-edit'; profileButton.setAttribute('aria-label', 'Edit profile'); }
    const profile = store.get('profile');
    const profileText = document.querySelector('.v3-settings-profile p');
    if (profileText) profileText.textContent = profile.email;
    const dateButton = [...document.querySelectorAll('.v3-settings-link')].find((button) => /Date format/.test(button.textContent));
    if (dateButton) { dateButton.removeAttribute('data-v3-toast'); dateButton.dataset.wf = 'date-format'; const small = dateButton.querySelector('small'); if (small) small.textContent = store.get('settings').dateFormat; }
    const notificationsCard = [...document.querySelectorAll('.v3-settings-card')].find((card) => card.querySelector('h2')?.textContent.trim() === 'Notifications');
    if (notificationsCard) notificationsCard.id = 'notification-preferences';
    const layout = document.querySelector('.v3-settings-layout');
    if (layout && !layout.querySelector('[data-wf="sign-out"]')) {
      layout.insertAdjacentHTML('beforeend', `<section class="v3-surface v3-settings-card nova-wf-card" aria-labelledby="nova-wf-session-title"><div class="v3-section-title"><div><h2 id="nova-wf-session-title">Session</h2></div></div><p class="meta">Signed in as ${esc(profile.email)} on this device.</p><div class="nova-wf-actions"><button class="btn btn-secondary" type="button" data-wf="sign-out">Sign out</button></div></section>`);
    }
    if (location.hash === '#notification-preferences') document.querySelector('#notification-preferences')?.scrollIntoView({ block: 'start' });
  }

  /* =====================================================================
     Security: trusted devices, sign-out, passcode change, activity log
     ===================================================================== */
  function logSecurity(what, detail) { store.set('securityLog', [{ when: 'Just now', what, detail }, ...store.list('securityLog')].slice(0, 8)); }
  function deviceDetail(id) {
    const device = store.find('devices', id); if (!device) return;
    openForm({ title: esc(device.name), submitLabel: device.current ? '' : 'Sign out this device', submitClass: 'btn-risk', busyLabel: 'Signing out…', cancelLabel: 'Close',
      body: `<dl class="detail-grid">${[['Last active', device.lastActive], ['Location', device.location], ['Type', device.kind[0].toUpperCase() + device.kind.slice(1)], ['Status', device.current ? 'This device' : 'Trusted']].map(([label, value]) => `<div class="detail-row"><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><p class="field-hint">Don’t recognise this device? Sign it out and change your passcode.</p>`,
      perform: () => { store.remove('devices', id); logSecurity('Device signed out', device.name); },
      done: () => go(location.href, `${device.name} signed out.`) });
  }
  function signOutDevice(id) {
    const device = store.find('devices', id); if (!device || device.current) return;
    confirmAction({ title: `Sign out ${esc(device.name)}?`, confirmLabel: 'Sign out', busyLabel: 'Signing out…', body: `<p>${esc(device.name)} will need your passcode to sign in again. Card and account settings don’t change.</p>`,
      perform: () => { store.remove('devices', id); logSecurity('Device signed out', device.name); },
      done: () => go(location.href, `${device.name} signed out.`) });
  }
  function signOutOthers() {
    const others = store.list('devices').filter((device) => !device.current);
    confirmAction({ title: `Sign out ${others.length} other device${others.length === 1 ? '' : 's'}?`, confirmLabel: 'Sign out all others', busyLabel: 'Signing out…', body: `<p>${others.map((device) => esc(device.name)).join(', ')} will need your passcode to sign in again. This device stays signed in.</p>`,
      perform: () => { store.set('devices', store.list('devices').filter((device) => device.current)); logSecurity('Other devices signed out', `${others.length} device${others.length === 1 ? '' : 's'}`); },
      done: () => go(location.href, 'All other devices signed out.') });
  }
  function changePasscode() {
    openForm({ title: 'Change passcode', submitLabel: 'Change passcode', busyLabel: 'Updating…',
      body: `<div class="field"><label for="wf-pc-current">Current passcode</label><input class="input nova-passcode-input" id="wf-pc-current" name="current" type="password" inputmode="numeric" maxlength="4" autocomplete="off" aria-describedby="wf-pc-hint">${demoOn() ? `<span class="nova-passcode-hint" id="wf-pc-hint">Demo passcode: <strong>${DEMO_PASSCODE}</strong></span>` : '<span class="nova-passcode-hint" id="wf-pc-hint">The passcode you use to confirm transfers.</span>'}</div><div class="field"><label for="wf-pc-new">New passcode</label><input class="input nova-passcode-input" id="wf-pc-new" name="next" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></div><div class="field"><label for="wf-pc-confirm">Confirm new passcode</label><input class="input nova-passcode-input" id="wf-pc-confirm" name="confirm" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></div><p class="field-hint">Use 4 numbers that aren’t all the same or in sequence.</p>`,
      validate: (form, data) => {
        let ok = true;
        if (data.current !== DEMO_PASSCODE) { setFieldError(form, 'current', /^\d{4}$/.test(data.current) ? 'That isn’t your current passcode.' : 'Enter your current 4-digit passcode.'); ok = false; }
        if (!/^\d{4}$/.test(data.next)) { setFieldError(form, 'next', 'Use exactly 4 numbers.'); ok = false; }
        else if (data.next === data.current) { setFieldError(form, 'next', 'Choose a passcode different from the current one.'); ok = false; }
        else if (/^(\d)\1{3}$/.test(data.next) || '0123456789'.includes(data.next) || '9876543210'.includes(data.next)) { setFieldError(form, 'next', 'Avoid repeated or sequential numbers like 1111 or 1234.'); ok = false; }
        if (ok && data.confirm !== data.next) { setFieldError(form, 'confirm', 'The passcodes don’t match.'); ok = false; }
        return ok ? {} : null;
      },
      perform: () => { store.set('passcodeChanged', 'just now'); logSecurity('Passcode changed', 'This device'); },
      done: () => go(location.href, 'Passcode changed.') });
  }
  function initSecurity() {
    if (screen !== 'security') return;
    const passcodeTile = [...document.querySelectorAll('.v3-action-tile')].find((tile) => /Change passcode/.test(tile.textContent));
    if (passcodeTile) { passcodeTile.removeAttribute('data-v3-toast'); passcodeTile.dataset.wf = 'passcode-change'; const note = passcodeTile.querySelector('span'); if (note) note.textContent = `Last changed ${store.get('passcodeChanged')}`; }
    const devicesCard = document.querySelector('.v3-devices-card');
    if (devicesCard) {
      const devices = store.list('devices');
      const others = devices.filter((device) => !device.current);
      devicesCard.innerHTML = `<div class="v3-section-title"><div><h2>Trusted devices</h2></div>${others.length ? `<button class="v3-text-button" type="button" data-wf="device-signout-all">Sign out all others</button>` : ''}</div>${devices.map((device) => `<div class="v3-device-row"><span class="v3-icon ${device.current ? 'blue' : 'lavender'}">${ICON[device.kind] || ICON.phone}</span><div><strong>${esc(device.name)}</strong><small>${esc(device.location)} · ${esc(device.lastActive)}</small></div>${device.current ? '<span class="v3-status safe">This device</span>' : `<div class="nova-wf-row-actions"><button class="v3-text-button" type="button" data-wf="device-detail" data-id="${esc(device.id)}" aria-label="Review ${esc(device.name)}">Review</button><button class="v3-text-button" type="button" data-wf="device-signout" data-id="${esc(device.id)}" aria-label="Sign out ${esc(device.name)}">Sign out</button></div>`}</div>`).join('')}${others.length ? '' : '<p class="meta">Only this device is signed in.</p>'}`;
    }
    const log = document.querySelector('.v3-security-log');
    if (log) {
      log.querySelectorAll('.v3-log-row').forEach((row) => row.remove());
      log.insertAdjacentHTML('beforeend', store.list('securityLog').map((entry) => `<div class="v3-log-row"><span>${esc(entry.when)}</span><strong>${esc(entry.what)}</strong><small>${esc(entry.detail)}</small></div>`).join(''));
    }
  }

  /* =====================================================================
     Former toast-only placeholders: receipt sharing and identity-check help
     ===================================================================== */
  function shareReceipt() {
    const rows = [...document.querySelectorAll('.receipt-sheet .review-row')].map((row) => [row.querySelector('span')?.textContent.trim(), row.querySelector('strong')?.textContent.trim()]).filter(([label, value]) => label && value);
    const text = ['Nova transfer receipt', ...rows.map(([label, value]) => `${label}: ${value}`)].join('\n');
    openForm({
      title: 'Share receipt', submitLabel: 'Copy receipt text', busyLabel: 'Copying…', cancelLabel: 'Close',
      body: `<dl class="detail-grid">${rows.map(([label, value]) => `<div class="detail-row"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><p class="nova-wf-boundary"><strong>Transfer receipt.</strong> Share it with the recipient as confirmation.</p>`,
      perform: () => text,
      done: async (copied) => { try { await navigator.clipboard.writeText(copied); toast('Receipt text copied.'); } catch { toast('Copying isn’t available in this browser. Select the details to copy them.'); } }
    });
  }
  function kycHelp() {
    openForm({
      title: 'Help with the identity check', submitLabel: '', cancelLabel: 'Close',
      body: `<ul class="dialog-list"><li>Use a passport, national ID card or driving licence that hasn’t expired.</li><li>Lay it flat in good light and keep all four edges in the frame.</li><li>If capture keeps failing, ask for another way to verify.</li></ul><div class="nova-wf-actions"><a class="btn btn-secondary" href="${route('kyc', '&state=manual')}">Request another verification option</a></div><p class="field-hint">Our support team replies within one business day.</p>`
    });
  }
  function initPlaceholders() {
    document.querySelectorAll('[data-toast]').forEach((node) => {
      if (/receipt sharing|ready to share/i.test(node.dataset.toast)) { node.removeAttribute('data-toast'); node.dataset.wf = 'receipt-share'; }
      if (/alternate verification|verify you another way/i.test(node.dataset.toast)) { node.removeAttribute('data-toast'); node.dataset.wf = 'kyc-help'; }
    });
  }

  /* ---------- Inline (non-dialog) async actions ---------- */
  function runInline(button, busyLabel, action, after, alertNode) {
    if (button?.getAttribute('aria-busy') === 'true') return;
    setBusy(button, true, busyLabel);
    store.request(action).then((result) => { setBusy(button, false); after?.(result); }).catch((error) => {
      setBusy(button, false, 'Try again');
      if (alertNode) { alertNode.innerHTML = `<div><strong>Couldn’t save</strong><p>${esc(error.message)}</p></div>`; alertNode.hidden = false; }
      else toast(`Couldn’t complete this. ${error.message}`);
    });
  }

  /* ---------- Delegated actions ---------- */
  const ACTIONS = {
    'payee-add': () => addPayee(), 'payee-edit': (el) => editPayee(el.dataset.id), 'payee-delete': (el) => deletePayee(el.dataset.id),
    'payee-search-clear': () => { const input = document.querySelector('#nova-wf-payee-search'); input.value = ''; input.dispatchEvent(new Event('input')); input.focus(); },
    'scheduled-add': () => addScheduled(), 'scheduled-edit': (el) => editScheduled(el.dataset.id), 'scheduled-cancel': (el) => cancelScheduled(el.dataset.id),
    'scheduled-restore': (el) => restoreScheduled(el), 'scheduled-delete': (el) => deleteScheduled(el.dataset.id),
    'dispute-add': (el) => draftDispute(el.dataset.id), 'dispute-edit': (el) => editDispute(el.dataset.id), 'dispute-delete': (el) => deleteDispute(el.dataset.id),
    'goal-add': () => createGoal(), 'goal-edit': (el) => editGoal(el.dataset.id), 'goal-delete': (el) => deleteGoal(el.dataset.id),
    'goal-add-money': (el) => moveGoalMoney(el.dataset.id, 'add'), 'goal-withdraw': (el) => moveGoalMoney(el.dataset.id, 'withdraw'),
    'sub-pause': (el) => pauseSubscription(el.dataset.id), 'sub-cancel': (el) => cancelSubscription(el.dataset.id),
    'sub-resume': (el) => setSubscription(el.dataset.id, 'active', el, 'Payments resumed.'), 'sub-restore': (el) => setSubscription(el.dataset.id, 'active', el, 'Subscription restored to your plan.'),
    'card-pin': (el) => revealPin(el), 'card-replace': () => replaceCard(), 'card-replace-cancel': () => cancelReplacement(),
    'notif-read-all': (el) => runInline(el, 'Saving…', () => store.set('notifications', store.list('notifications').map((item) => ({ ...item, read: true }))), () => go(location.href, 'All notifications marked as read.')),
    'notif-toggle': (el) => runInline(el, 'Saving…', () => { const item = store.find('notifications', el.dataset.id); store.upsert('notifications', { id: el.dataset.id, read: !item.read }); return !item.read; }, (read) => go(route('notifications', `&notification=${el.dataset.id}${read ? '' : '&keep=1'}`), read ? 'Marked as read.' : 'Marked as unread.')),
    'notif-dismiss': (el) => runInline(el, 'Dismissing…', () => markNotification(el.dataset.id, { dismissed: true, read: true }), () => go(route('notifications'), 'Notification dismissed.')),
    'notif-restore': (el) => runInline(el, 'Restoring…', () => store.set('notifications', store.list('notifications').map((item) => ({ ...item, dismissed: false }))), () => go(route('notifications'), 'Dismissed notifications restored.')),
    'profile-edit': () => editProfile(), 'date-format': () => chooseDateFormat(), 'demo-reset': () => resetDemo(), 'sign-out': () => signOut(),
    'device-detail': (el) => deviceDetail(el.dataset.id), 'device-signout': (el) => signOutDevice(el.dataset.id), 'device-signout-all': () => signOutOthers(),
    'passcode-change': () => changePasscode(), 'receipt-share': () => shareReceipt(), 'kyc-help': () => kycHelp()
  };
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest?.('[data-wf]');
    if (!trigger || !ACTIONS[trigger.dataset.wf] || trigger.disabled) return;
    event.preventDefault(); event.stopImmediatePropagation();
    ACTIONS[trigger.dataset.wf](trigger);
  }, true);

  function init() {
    initPayees(); initPayPage(); initScheduled(); initDisputes(); initTransactionDispute(); initActivityLinks();
    initSavingsPages(); initSubscriptions(); initCards(); initNotifications(); initSettings(); initSecurity();
    initPlaceholders(); updateUnreadBadges(); showFlash();
    if (window.NovaWorkflows.screens[screen]) document.title = `Nova — ${document.querySelector('#main h1')?.textContent.trim() || 'Nova'}`;
  }
  // Loaded before the renderer: always wait until every deferred runtime has rendered.
  if (document.readyState === 'complete') init(); else document.addEventListener('DOMContentLoaded', init, { once: true });
})();
