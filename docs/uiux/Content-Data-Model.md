# NOVA — Prototype Content & Data Model

All values below are **Prototype data**. They are fictional and must never be presented as real customer/business metrics.

## Prototype account

```json
{
  "accountId": "NVA-4821-0915",
  "currency": "EUR",
  "balance": 2840.00,
  "committedBills": 780.00,
  "plannedGoalContribution": 260.00,
  "protectedBuffer": 500.00,
  "safeToSpend": 1300.00,
  "dataFreshness": "2026-09-15T09:42:00+02:00"
}
```

Formula shown in product:

`Safe to spend = available balance - known upcoming commitments - planned goal contribution - protected buffer`

Copy must clarify that unknown future spending can change this estimate.

## Upcoming commitments

| Item | Date | Amount | Type | State |
|---|---:|---:|---|---|
| Apartment rent | Sep 20 | €620.00 | recurring bill | upcoming |
| Mobile plan | Sep 22 | €32.00 | subscription | upcoming |
| Streaming service | Sep 24 | €14.99 | subscription | upcoming |
| Utilities estimate | Sep 27 | €113.01 | bill estimate | upcoming |

## Savings goal

```json
{
  "id": "goal-buffer-2026",
  "name": "Emergency buffer",
  "current": 2480,
  "target": 4000,
  "monthlyContribution": 260,
  "nextContributionDate": "2026-09-28",
  "status": "on_track"
}
```

## Suspicious transaction scenario

```json
{
  "id": "txn_NVA_9F2K7Q",
  "merchant": "ByteMart Online",
  "amount": 189.40,
  "currency": "EUR",
  "timestamp": "2026-09-15T02:14:00+02:00",
  "status": "completed",
  "channel": "online_card",
  "cardLast4": "4821",
  "location": "Singapore",
  "category": "Electronics",
  "riskState": "needs_review",
  "riskReasons": [
    "New merchant",
    "Higher than your usual online purchase"
  ]
}
```

The risk reasons are **SIMULATED prototype logic**, not a real fraud engine.

## Recent transaction sample

- Greenline Market — €42.70 — Groceries — completed
- Metro Transit — €18.00 — Transport — completed
- Cloudbox — €9.99 — Subscription — completed
- Atelier Coffee — €6.40 — Dining — completed
- ByteMart Online — €189.40 — Electronics — **needs review**
- Northstar Books — €28.50 — Shopping — pending
- River Gym — €34.00 — Subscription — completed
- Merchant refund — +€22.00 — Shopping — reversed/refund scenario

## Transfer scenario

Recipient:
- **Name:** Maya Chen
- **Bank:** Northfield Bank
- **Account label:** Personal •••• 2048
- **Amount:** €145.00
- **Fee:** €0.00 (prototype domestic scenario)
- **Arrival:** “Usually within minutes” (prototype copy, not a production promise)
- **Reference:** “September utilities”

After-transfer projected safe-to-spend: €1,155.00.

## Insufficient balance variant

- Attempted amount: €2,900.00
- Available balance: €2,840.00
- Required extra: €60.00 (or more if a fee scenario is enabled)

## KYC prototype person

Use clearly fictional identity fields and avoid “John Doe”. Example:
- Lina Moreau
- DOB: 14 Apr 2001
- Address: fictionalized placeholder not corresponding to a real household
- Document number: masked/sample format only

Do not persist real user data in the prototype.

## Notification examples

- “Unusual card activity needs review — €189.40 at ByteMart Online.”
- “Rent is due in 5 days — €620 is already included in your Money Horizon.”
- “Emergency buffer is on track — €260 planned for Sep 28.”
- “You’re offline — money actions are paused until you reconnect.”

Sensitive-preview setting can replace amounts/merchant names with “Open NOVA to review account activity.”
