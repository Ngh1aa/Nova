(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  if (params.get('lab') === '1' || params.get('reviewer') !== '1') return;
  if (document.querySelector('[data-nova-state-lab-launcher]')) return;

  const style = document.createElement('style');
  style.textContent = `
    .nova-state-lab-launcher{position:fixed;right:18px;bottom:18px;z-index:9999;display:flex;align-items:center;gap:8px;padding:9px 12px;border:1px solid rgba(20,32,51,.18);border-radius:999px;background:rgba(255,255,255,.92);backdrop-filter:blur(16px);box-shadow:0 10px 30px rgba(20,32,51,.14);color:#142033;text-decoration:none;font:700 11px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.01em}.nova-state-lab-launcher:hover{transform:translateY(-1px);box-shadow:0 14px 34px rgba(20,32,51,.18)}.nova-state-lab-launcher:focus-visible{outline:3px solid #246bfd;outline-offset:3px}.nova-state-lab-launcher span:first-child{display:grid;place-items:center;width:18px;height:18px;border-radius:50%;background:#142033;color:#fff;font-size:10px}.nova-state-lab-launcher small{font:500 10px/1 Inter,ui-sans-serif,system-ui,sans-serif;color:#657085}@media(max-width:680px){.nova-state-lab-launcher{right:12px;bottom:88px;width:44px;height:44px;padding:0;justify-content:center;gap:0}.nova-state-lab-launcher span:nth-child(2),.nova-state-lab-launcher small{display:none}.nova-state-lab-launcher span:first-child{width:22px;height:22px}}
  `;
  document.head.appendChild(style);

  const link = document.createElement('a');
  link.href = 'recruiter-state-lab.html?state=normal';
  link.className = 'nova-state-lab-launcher';
  link.dataset.novaStateLabLauncher = 'true';
  link.setAttribute('aria-label', 'Open Recruiter State Lab to inspect empty, loading, error and edge-case states');
  link.innerHTML = '<span aria-hidden="true">◆</span><span>State Lab</span><small>Empty · Loading · Error · Edge</small>';
  document.body.appendChild(link);
})();
