import fs from 'node:fs';

const path = 'assets/nova.js';
let source = fs.readFileSync(path, 'utf8');

function replaceOnce(oldText, newText, label) {
  if (source.includes(newText)) {
    console.log(`already applied: ${label}`);
    return;
  }
  if (!source.includes(oldText)) {
    throw new Error(`Round 01 transform could not find source for: ${label}`);
  }
  source = source.replace(oldText, newText);
  console.log(`applied: ${label}`);
}

replaceOnce(
  '<div class="decision-label">Safe to spend</div><div class="money-sub"><span>Total balance',
  '<div class="decision-label">Safe to spend · next 14 days</div><div class="money-sub"><span>Estimate through 30 Sep</span><span>Total balance',
  'D-01 attach horizon to Safe to spend'
);

replaceOnce(
  '<p>If you do not recognise this payment, freezing is a reversible first step while you investigate.</p>',
  '<div class="callout callout-warning" style="margin-top:14px"><strong>Demo-only protection</strong><p>Freeze changes only this prototype\'s local card state. It does not contact a bank or reverse the payment.</p></div><p>If you do not recognise this payment, freezing is a reversible first step while you investigate.</p>',
  'D-02 foreground simulated freeze boundary'
);

replaceOnce(
  '<button class="btn btn-risk" id="freeze-card">Freeze card</button>',
  '<button class="btn btn-risk" id="freeze-card">Freeze card in demo</button>',
  'D-02 label freeze as demo action'
);

replaceOnce(
  '<a class="btn btn-secondary" id="report-transaction" href="app.html?screen=report-transaction">Start report</a>',
  '<a class="btn btn-secondary" id="report-transaction" href="app.html?screen=report-transaction">Preview report steps</a>',
  'D-02 label reporting as preview'
);

replaceOnce(
  'Report flow is simulated. No bank case is created in this portfolio prototype.',
  'Demo only — report preview submits nothing. Freeze changes only this prototype state; neither action contacts a bank.',
  'D-02 make sensitive-action consequence explicit'
);

replaceOnce(
  "pageHeader('Report handoff preview', 'This prototype stops before any bank case is created.'",
  "pageHeader('Report preview complete — nothing submitted', 'This demo stops before any bank case is created.'",
  'D-02 handoff title consequence'
);

replaceOnce(
  "pageHeader('Report this transaction', 'Review the transaction and prototype boundary before continuing.'",
  "pageHeader('Preview a report — nothing submitted', 'Review what would be reported. This demo does not contact a bank or create a case.'",
  'D-02 report preview title consequence'
);

replaceOnce(
  '<h2>Report ${t.merchant}?</h2>',
  '<h2>Preview reporting ${t.merchant}</h2>',
  'D-02 report preview heading'
);

replaceOnce(
  '>Preview report handoff</a>',
  '>Preview bank handoff requirements</a>',
  'D-02 report handoff CTA'
);

replaceOnce(
  '<div class="review-row"><span>Fee</span><strong>${euro(DATA.recipient.fee)}</strong></div><div class="review-row"><span>Expected arrival</span>',
  '<div class="review-row"><span>Fee</span><strong>${euro(DATA.recipient.fee)}</strong></div><div class="review-row"><span>Impact calculation</span><strong>${euro(DATA.account.safe)} − ${euro(amount)} − ${euro(DATA.recipient.fee)} = ${euro(afterSafe)}<br><span class="meta">Protected buffer ${euro(DATA.account.buffer)} stays reserved</span></strong></div><div class="review-row"><span>Expected arrival</span>',
  'D-03 show transfer impact calculation'
);

replaceOnce(
  '<h2>Projected safe to spend</h2>',
  '<h2>Projected safe to spend · next 14 days</h2>',
  'D-01 repeat horizon in transfer impact'
);

replaceOnce(
  'Known bills and your protected buffer remain covered in this prototype estimate.',
  'Known bills remain included and the protected buffer stays reserved; Nova does not pull from it automatically.',
  'D-03 explain protected buffer consequence'
);

replaceOnce(
  '<strong>We couldn’t verify you</strong><p>Try biometric confirmation again or use your passcode. No transfer has been made.</p>',
  '<strong>Biometric verification failed — transfer not submitted</strong><p>Your identity check did not complete. No money moved and your balance is unchanged. Try biometrics again or use your passcode.</p>',
  'D-04 pair failure cause and safety consequence'
);

replaceOnce(
  'Ledger could not revalidate the balance. No money moved. Review the amount and try again.',
  'Balance revalidation failed before confirmation. No money moved and the transfer was not submitted. Review the amount and try again.',
  'D-04 explain generic transfer failure cause'
);

fs.writeFileSync(path, source);
