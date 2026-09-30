import fs from 'node:fs';

const path = 'assets/nova.js';
let source = fs.readFileSync(path, 'utf8');
const before = "Freeze changes only this prototype's local card state. It does not contact a bank or reverse the payment.";
const after = "Freeze changes only this prototype state. It does not contact a bank or reverse the payment.";

if (source.includes(after)) {
  console.log('Round 01 template syntax already repaired.');
} else if (source.includes(before)) {
  source = source.replace(before, after);
  fs.writeFileSync(path, source);
  console.log('Repaired apostrophe inside transaction-detail template expression.');
} else {
  throw new Error('Expected Round 01 transaction-detail copy not found.');
}
