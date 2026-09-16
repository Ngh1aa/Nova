(() => {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get('screen') || 'home';

  const stepper = document.querySelector('.stepper');
  if (stepper) {
    let max = 4;
    let now = 1;

    if (screen === 'kyc') {
      max = 3;
      const state = params.get('state') || 'intro';
      now = ({ intro: 1, capture: 2, failed: 2, manual: 3, review: 3 })[state] || 1;
    } else {
      now = ({
        'transfer-recipient': 1,
        'transfer-amount': 2,
        'transfer-review': 3,
        'biometric-failed': 3,
        offline: 3,
        'transfer-success': 4
      })[screen] || 1;
    }

    stepper.setAttribute('role', 'progressbar');
    stepper.setAttribute('aria-valuemin', '1');
    stepper.setAttribute('aria-valuemax', String(max));
    stepper.setAttribute('aria-valuenow', String(now));
    stepper.setAttribute('aria-valuetext', `Step ${now} of ${max}`);
  }

  const spendingPulse = document.querySelector('.pulse-bars');
  if (spendingPulse) {
    spendingPulse.setAttribute('role', 'img');
    spendingPulse.setAttribute(
      'aria-label',
      'Prototype seven-day spending comparison: Monday 33 percent, Tuesday 49 percent, Wednesday 28 percent, Thursday 65 percent, Friday 42 percent, today 78 percent, Sunday 18 percent of the visual scale.'
    );
  }

  // Later visual-system scripts render the Cards screen after this helper runs.
  // Repair decorative/network marks whenever that late DOM arrives so aria-label
  // is attached to a role that supports an accessible name.
  const repairLateAria = (root = document) => {
    root.querySelectorAll?.('.v3-network[aria-label]').forEach((node) => {
      node.setAttribute('role', 'img');
    });
  };
  repairLateAria();
  const ariaObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches?.('.v3-network[aria-label]')) node.setAttribute('role', 'img');
        repairLateAria(node);
      }
    }
  });
  ariaObserver.observe(document.documentElement, { childList: true, subtree: true });

  // Remove only the automatic page-load focus ring after render. Keyboard focus reached later,
  // including through the skip link, still uses the global focus-visible treatment.
  requestAnimationFrame(() => {
    const main = document.querySelector('#main');
    if (main && document.activeElement === main) main.blur();
  });
})();
