(() => {
  'use strict';

  const DEMO_PASSCODE = '2468';

  function addStyles() {
    if (document.querySelector('[data-nova-passcode-style]')) return;
    const style = document.createElement('style');
    style.dataset.novaPasscodeStyle = 'true';
    style.textContent = `
      .nova-passcode-hint{margin-top:10px;padding:10px 12px;border-radius:12px;background:#f4f7fb;color:#596579;line-height:1.45}
      .nova-passcode-error{margin-top:8px;color:#9d2436;font-weight:650;line-height:1.4}
      .nova-passcode-error[hidden]{display:none}
      .nova-passcode-input{letter-spacing:.28em;font-variant-numeric:tabular-nums}
    `;
    document.head.appendChild(style);
  }

  function openPasscodeDialog(trigger) {
    document.querySelector('[data-nova-passcode-dialog]')?.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'dialog-backdrop';
    backdrop.dataset.novaPasscodeDialog = 'true';
    backdrop.innerHTML = `
      <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="nova-passcode-title" aria-describedby="nova-passcode-copy" tabindex="-1">
        <h2 id="nova-passcode-title">Use passcode instead</h2>
        <p id="nova-passcode-copy">Biometrics failed before any money movement. Enter the prototype passcode to continue this simulated confirmation flow.</p>
        <form data-nova-passcode-form novalidate>
          <div class="field">
            <label for="nova-demo-passcode">Prototype passcode</label>
            <input
              id="nova-demo-passcode"
              class="input nova-passcode-input"
              type="password"
              inputmode="numeric"
              pattern="[0-9]{4}"
              maxlength="4"
              autocomplete="off"
              aria-describedby="nova-passcode-hint nova-passcode-error"
              aria-invalid="false"
            >
            <div id="nova-passcode-hint" class="nova-passcode-hint">Prototype hint: use <strong>2468</strong> to inspect the success path. No credential is stored.</div>
            <div id="nova-passcode-error" class="nova-passcode-error" role="alert" aria-live="assertive" hidden></div>
          </div>
          <div class="dialog-actions">
            <button class="btn btn-primary" type="submit">Confirm passcode</button>
            <button class="btn btn-secondary" type="button" data-nova-passcode-cancel>Cancel</button>
          </div>
        </form>
      </div>`;

    document.body.appendChild(backdrop);

    const dialog = backdrop.querySelector('.dialog');
    const form = backdrop.querySelector('[data-nova-passcode-form]');
    const input = backdrop.querySelector('#nova-demo-passcode');
    const error = backdrop.querySelector('#nova-passcode-error');
    const cancel = backdrop.querySelector('[data-nova-passcode-cancel]');

    const close = () => {
      document.removeEventListener('keydown', onKeydown);
      backdrop.remove();
      trigger?.focus?.();
    };

    const setError = (message) => {
      input.setAttribute('aria-invalid', 'true');
      error.hidden = false;
      error.textContent = message;
      input.focus();
      input.select();
    };

    const clearError = () => {
      input.setAttribute('aria-invalid', 'false');
      error.hidden = true;
      error.textContent = '';
    };

    const onKeydown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...backdrop.querySelectorAll('button,input,[href],[tabindex]:not([tabindex="-1"])')]
        .filter((node) => !node.disabled);
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

    input.addEventListener('input', clearError);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = input.value.trim();

      if (!value) {
        setError('Enter the 4-digit prototype passcode.');
        return;
      }

      if (!/^\d{4}$/.test(value)) {
        setError('Use exactly 4 numbers for the prototype passcode.');
        return;
      }

      if (value !== DEMO_PASSCODE) {
        setError('That prototype passcode does not match. Try again.');
        return;
      }

      clearError();
      close();
      location.href = 'app.html?screen=transfer-success';
    });

    cancel.addEventListener('click', close);
    backdrop.addEventListener('mousedown', (event) => {
      if (event.target === backdrop) close();
    });
    document.addEventListener('keydown', onKeydown);

    dialog.focus();
    requestAnimationFrame(() => input.focus());
  }

  function bind() {
    const trigger = document.querySelector('#use-passcode');
    if (!trigger) return;

    addStyles();
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      openPasscodeDialog(trigger);
    }, { capture: true });
  }

  bind();
})();
