(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const surfaceSelector = [
    '.nova-card','.v3-surface','.v4-card','.decision-field','.fi-horizon','.context-panel',
    '.activity-header','.ledger-toolbar','.ledger','.dossier-hero','.evidence-panel','.protection-band',
    '.detail-grid','.card-quick','.goal-hero','.goal-ledger','.task-panel','.recipient-card',
    '.receipt-sheet','.document-sheet','.review-panel','.settings-panel','.notification-group',
    '.security-summary','.recurring-total','.impact-panel','.section','.callout','.empty-state',
    '.summary-card','.context-rail','.horizon'
  ].join(',');
  const rowSelector = [
    '.ledger-row','.control-row','.review-row','.goal-ledger-row','.detail-row','.upcoming-row','.list-row',
    '.v4-pay-list > div','.v4-transfer-list > a','.v4-context-grid > div','.v3-goal-row','.v3-device-row',
    '.v3-wallet-row','.v3-setting-row'
  ].join(',');

  let frame = 0;

  function markGroup(nodes, type) {
    nodes.forEach((node, index) => {
      if (!(node instanceof Element) || node.dataset.novaMotion) return;
      node.dataset.novaMotion = type;
      node.style.setProperty('--nova-motion-delay', `${Math.min(index, 5) * 34}ms`);
      if (reduced.matches) {
        node.classList.add('is-nova-motion-visible');
        return;
      }
      requestAnimationFrame(() => requestAnimationFrame(() => node.classList.add('is-nova-motion-visible')));
    });
  }

  function decorate(scope = document) {
    const surfaces = [];
    const rows = [];
    if (scope instanceof Element && scope.matches(surfaceSelector)) surfaces.push(scope);
    if (scope instanceof Element && scope.matches(rowSelector)) rows.push(scope);
    scope.querySelectorAll?.(surfaceSelector).forEach((node) => surfaces.push(node));
    scope.querySelectorAll?.(rowSelector).forEach((node) => rows.push(node));
    markGroup(surfaces, 'surface');
    markGroup(rows, 'row');
  }

  function schedule(scope = document) {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => decorate(scope));
  }

  function init() {
    document.documentElement.classList.add('nova-motion-enabled');
    schedule();

    const observer = new MutationObserver((mutations) => {
      const roots = [];
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) roots.push(node);
      }));
      if (!roots.length) return;
      requestAnimationFrame(() => roots.forEach((root) => decorate(root)));
    });
    observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });

    reduced.addEventListener?.('change', () => {
      if (!reduced.matches) return;
      document.querySelectorAll('[data-nova-motion]').forEach((node) => node.classList.add('is-nova-motion-visible'));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
