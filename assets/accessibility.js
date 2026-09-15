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

  // Home intentionally leads with the primary decision amount as the page heading.
  if (screen === 'home') {
    const amount = document.querySelector('.money-hero .money-amount');
    if (amount && amount.tagName !== 'H1') {
      const heading = document.createElement('h1');
      heading.className = amount.className;
      heading.innerHTML = amount.innerHTML;
      amount.replaceWith(heading);
    }
  }
})();
