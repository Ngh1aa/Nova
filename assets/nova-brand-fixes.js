(() => {
  'use strict';

  function polishBrand(root = document) {
    root.querySelectorAll('.brand').forEach((brand) => {
      brand.innerHTML = '<img class="brand-lockup" src="assets/nova-logo.svg" alt="Nova">';
      brand.setAttribute('aria-label', 'Nova home');
    });

    root.querySelectorAll('.page-heading .eyebrow, .dossier-hero .eyebrow').forEach((node) => {
      node.textContent = node.textContent.replace(/^Ledger\b/, 'Nova');
    });

    root.querySelectorAll('.card-brand').forEach((node) => {
      node.textContent = node.textContent.replace(/^Ledger\b/, 'Nova');
    });

    root.querySelectorAll('h1, h2, h3, p, span, strong').forEach((node) => {
      if (node.children.length) return;
      const text = node.textContent;
      if (text === 'Ledger noticed a pattern change') node.textContent = 'Nova noticed a pattern change';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => polishBrand(), { once: true });
  } else {
    polishBrand();
  }
})();
