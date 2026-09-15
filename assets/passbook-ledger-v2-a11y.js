(() => {
  'use strict';

  function enhanceTableRegion(region) {
    if (!(region instanceof HTMLElement) || region.dataset.pbA11y === 'true') return;
    region.dataset.pbA11y = 'true';
    region.tabIndex = 0;
    region.setAttribute('role', 'region');
    const caption = region.querySelector('caption')?.textContent?.trim();
    region.setAttribute('aria-label', caption || 'Scrollable ledger table');
  }

  function enhance(root = document) {
    root.querySelectorAll?.('.pb-table-wrap').forEach(enhanceTableRegion);
  }

  function init() {
    enhance();
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches?.('.pb-table-wrap')) enhanceTableRegion(node);
          enhance(node);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
