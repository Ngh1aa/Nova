(() => {
  'use strict';

  const screen = new URLSearchParams(location.search).get('screen') || 'home';
  const replacements = [
    [/\bLedger\b/g, 'Nova'],
    [/ \u00b7 /g, ' – '],
    [/LDG_/g, 'NVA_']
  ];

  function rewriteText(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    for (const textNode of nodes) {
      const parent = textNode.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) continue;
      let value = textNode.nodeValue;
      for (const [pattern, next] of replacements) value = value.replace(pattern, next);
      textNode.nodeValue = value;
    }

    root.querySelectorAll('[aria-label],[title]').forEach((element) => {
      for (const attr of ['aria-label', 'title']) {
        if (!element.hasAttribute(attr)) continue;
        let value = element.getAttribute(attr) || '';
        for (const [pattern, next] of replacements) value = value.replace(pattern, next);
        element.setAttribute(attr, value);
      }
    });

    document.title = document.title.replace(/\bLedger\b/g, 'Nova').replace(/ \u00b7 /g, ' – ');
  }

  function refineScreenCopy() {
    if (screen === 'biometric-failed') {
      const heading = document.querySelector('.page-heading h1');
      const description = document.querySelector('.page-heading p:not(.eyebrow)');
      const calloutTitle = document.querySelector('.callout-risk strong');
      const calloutBody = document.querySelector('.callout-risk p');
      if (heading) heading.textContent = "Fingerprint didn't match";
      if (description) description.textContent = 'Use your PIN to continue. No transfer has been made.';
      if (calloutTitle) calloutTitle.textContent = "Fingerprint didn't match";
      if (calloutBody) calloutBody.textContent = 'For your security, use the passcode fallback after repeated biometric failures.';
    }

    if (screen === 'offline') {
      const heading = document.querySelector('.page-heading h1');
      const description = document.querySelector('.page-heading p:not(.eyebrow)');
      const calloutTitle = document.querySelector('.callout-warning strong');
      const calloutBody = document.querySelector('.callout-warning p');
      if (heading) heading.textContent = "You're offline";
      if (description) description.textContent = 'Recent balance data may not be current. Your review is preserved.';
      if (calloutTitle) calloutTitle.textContent = 'Reconnect to confirm';
      if (calloutBody) calloutBody.textContent = 'Nova will revalidate your balance and Money Horizon before allowing the transfer.';
    }

    if (screen === 'transfer-success') {
      const heading = document.querySelector('.receipt h1');
      if (heading) heading.textContent = 'Transfer confirmed';
    }

    if (screen === 'transaction-detail') {
      const status = document.querySelector('.dossier-topline .status-risk');
      if (status) status.textContent = 'Needs review';
    }
  }

  function enhanceDialog(dialog) {
    if (!dialog || dialog.dataset.novaEnhanced === 'true') return;
    const title = dialog.querySelector('h2')?.textContent?.toLowerCase() || '';
    if (!title.includes('biometric')) return;

    dialog.dataset.novaEnhanced = 'true';
    dialog.classList.add('biometric-dialog');
    const amount = document.querySelector('.review-total strong')?.textContent?.trim() || '€145.00';
    const frame = document.createElement('div');
    frame.className = 'biometric-frame';
    frame.setAttribute('aria-hidden', 'true');
    frame.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 11a4 4 0 0 1 8 0v2"/><path d="M6 12v1c0 4 2 7 6 8"/><path d="M18 12v2c0 3-1 5-3 7"/><path d="M9 14c0 2 .7 3.5 2 4.5"/><path d="M15 14c0 1.5-.3 2.7-1 3.8"/><path d="M12 3a8 8 0 0 0-8 8"/><path d="M20 11a8 8 0 0 0-8-8"/></svg>';
    const heading = dialog.querySelector('h2');
    heading?.insertAdjacentElement('afterend', frame);

    const amountNode = document.createElement('div');
    amountNode.className = 'goal-amount biometric-amount';
    amountNode.textContent = amount;
    frame.insertAdjacentElement('afterend', amountNode);

    const bodyParagraph = dialog.querySelector('p');
    if (bodyParagraph) bodyParagraph.textContent = 'Touch to confirm this transfer. You can use your PIN instead if biometrics are unavailable.';
  }

  function handleMutations(mutations) {
    for (const mutation of mutations) {
      for (const added of mutation.addedNodes) {
        if (!(added instanceof Element)) continue;
        if (added.matches('.dialog')) enhanceDialog(added);
        added.querySelectorAll?.('.dialog').forEach(enhanceDialog);
        rewriteText(added);
      }
    }
  }

  function init() {
    rewriteText();
    refineScreenCopy();
    document.querySelectorAll('.dialog').forEach(enhanceDialog);
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
