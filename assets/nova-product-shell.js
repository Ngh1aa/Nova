/* Nova product shell — the one footer line every page carries, and the hidden
   demo tools. Demo tools (reset data, simulate a failed request, demo passcode)
   appear only after ?demo=1 (kept for the tab; ?demo=0 turns them off), see
   assets/nova-store.js. Loaded last so it runs after every renderer layer. */
(() => {
  'use strict';

  const CREDIT = 'Concept product designed by Đỗ Anh Nghĩa.';

  function footer() {
    if (document.querySelector('[data-nova-credit]')) return;
    const line = document.createElement('footer');
    line.className = 'nova-credit';
    line.dataset.novaCredit = 'true';
    line.innerHTML = `<p>${CREDIT}</p>`;
    const stage = document.querySelector('.app-stage') || document.querySelector('#app') || document.body;
    stage.appendChild(line);
  }

  function demoTools() {
    if (window.NovaDemoMode !== true || document.querySelector('[data-nova-demo-tools]')) return;
    const store = window.NovaStore;
    const mode = store ? store.failureMode() : 'off';
    const panel = document.createElement('details');
    panel.className = 'nova-demo-tools';
    panel.dataset.novaDemoTools = 'true';
    panel.innerHTML = `<summary>Demo tools</summary>
      <div class="nova-demo-tools-body">
        <label for="nova-demo-failure">Simulate a failed request</label>
        <select id="nova-demo-failure" data-wf-failure>${[['off', 'Off, requests succeed'], ['next', 'Fail the next request'], ['always', 'Fail every request']].map(([value, label]) => `<option value="${value}" ${value === mode ? 'selected' : ''}>${label}</option>`).join('')}</select>
        <button type="button" class="nova-demo-tools-button" data-wf="demo-reset">Reset demo data</button>
        <p>Passcode <strong>2468</strong>. Sign in as alex.nguyen@novamail.app.</p>
        <a href="${location.pathname.split('/').pop() || 'app.html'}?${(() => { const p = new URLSearchParams(location.search); p.set('demo', '0'); return p.toString(); })()}">Hide demo tools</a>
      </div>`;
    document.body.appendChild(panel);
    panel.querySelector('[data-wf-failure]').addEventListener('change', (event) => {
      store?.setFailureMode(event.target.value);
      const status = panel.querySelector('[role="status"]') || panel.querySelector('.nova-demo-tools-body').appendChild(Object.assign(document.createElement('p'), { role: 'status' }));
      status.setAttribute('role', 'status');
      status.textContent = event.target.value === 'off' ? 'Requests will succeed.' : event.target.value === 'next' ? 'The next request will fail once.' : 'Every request will fail until you turn this off.';
    });
  }

  function init() { footer(); demoTools(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
