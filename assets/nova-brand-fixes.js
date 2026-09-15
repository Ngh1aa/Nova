(() => {
  'use strict';

  function polishBrand(root = document) {
    root.querySelectorAll('.brand').forEach((brand) => {
      const mark = brand.querySelector('.brand-mark');
      if (mark) {
        mark.textContent = '';
        mark.setAttribute('aria-hidden', 'true');
      }
      const label = [...brand.children].find((child) => child !== mark);
      if (label && label.textContent.trim() !== 'Nova') label.textContent = 'Nova';
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
