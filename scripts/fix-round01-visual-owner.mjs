import fs from 'node:fs';

function patch(path, before, after, label) {
  let source = fs.readFileSync(path, 'utf8');
  if (source.includes(after)) {
    console.log(`already applied: ${label}`);
    return;
  }
  if (!source.includes(before)) throw new Error(`Could not find visual owner source for ${label}`);
  source = source.replace(before, after);
  fs.writeFileSync(path, source);
  console.log(`applied: ${label}`);
}

patch(
  'assets/nova-dashboard-v2.js',
  '<div class="nova-hero-status"><span>↗ €124 more available than last week</span><strong>Safe to spend</strong><button type="button" aria-label="About safe to spend">i</button></div>',
  '<div class="nova-hero-status"><span>↗ €124 more available than last week</span><strong>Safe to spend · next 14 days</strong><button type="button" aria-label="About safe to spend">i</button></div>',
  'D-01 dashboard-v2 Safe-to-spend horizon'
);

patch(
  'assets/nova-dashboard-v2.js',
  'Nova excludes it before showing today’s safe-to-spend amount.',
  'Nova excludes it before showing the next-14-days safe-to-spend estimate.',
  'D-01 dashboard-v2 supporting horizon copy'
);

patch(
  'assets/nova-current-state.js',
  "notice.innerHTML=screen==='offline'?'<strong>No transfer has been made.</strong>Nova is offline and cannot safely confirm money movement. Reconnect, then review the transfer again before confirming.':'<strong>No transfer has been made.</strong>Biometric authentication failed before money movement. Retry biometrics or use PIN only when you are ready to continue.';",
  "notice.innerHTML=screen==='offline'?'<strong>No transfer has been made.</strong>Nova is offline and cannot safely confirm money movement. Reconnect, then review the transfer again before confirming.':'<strong>Biometric verification failed — no money moved.</strong>Your identity check did not complete, so the transfer was not submitted and your balance is unchanged. Retry biometrics or use PIN only when you are ready to continue.';",
  'D-04 canonical state recovery cause + consequence'
);
