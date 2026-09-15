# NOVA — IA and User Flows

## Information architecture

```text
NOVA
├── Home
│   ├── Money Health
│   │   ├── Money Horizon detail
│   │   ├── Upcoming commitments
│   │   └── Insight detail
│   ├── Recent Transactions
│   ├── Savings snapshot
│   └── Notifications / unusual activity
├── Activity / Transactions
│   ├── Search & Filters
│   ├── Transaction Detail
│   │   ├── Status / merchant / payment details
│   │   ├── Category / recurring classification
│   │   ├── Report issue
│   │   └── Freeze card (contextual)
│   └── Subscriptions
├── Pay
│   ├── Transfer
│   ├── Recipients
│   ├── Amount
│   ├── Review
│   ├── Authentication
│   └── Success / Error
├── Cards
│   ├── Card Detail
│   ├── Freeze / Unfreeze
│   ├── Spending Controls
│   ├── Limits
│   └── Card Activity
├── Save
│   ├── Goals
│   ├── Goal Detail
│   ├── Contribution settings
│   └── Goal activity
├── Insights (contextual from Home)
│   ├── Spending
│   ├── Categories / Merchants
│   └── Month comparison
└── Profile
    ├── Personal details
    ├── Security Center
    │   ├── Biometrics / passcode
    │   ├── Devices / sessions
    │   ├── Notification privacy
    │   └── Secure account / emergency actions
    └── Help
```

## Navigation roles

- **Global mobile nav:** Home / Activity / Pay / Cards / Save.
- **Global desktop nav:** same five destinations in a rail.
- **Utilities:** profile, notifications, help.
- **Contextual nav:** Money Health -> Insights; suspicious transaction -> detail/security; card transaction -> card controls.
- **Primary CTA:** changes by task; there is no universal “Get started” CTA inside authenticated product UI.
- **Destructive/high-risk CTA:** report transaction, replace card, secure account. Freeze is protective/reversible and should not be styled identically to irreversible destruction.

---

## Flow A — Hero flow: suspicious transaction -> freeze card

```text
Trigger
Push/in-app alert: “Unusual card activity needs review”
↓
Entry
Home — alert appears directly below Money Horizon
↓
Decision
User opens transaction
↓
Transaction Detail
Merchant + amount + time + card + location + status
Why flagged: “New merchant + unusually high online purchase” (SIMULATED)
↓
Decision
Recognize transaction?
├── Yes -> Mark as recognized -> alert resolves -> optional category correction
└── No / unsure -> Freeze card
             ↓
Impact confirmation
“Freezing blocks new card payments and ATM withdrawals. Pending/offline transactions may still settle; refunds can still arrive.”
             ↓
Action
Confirm Freeze
             ↓
System feedback
Card status becomes FROZEN; persistent badge on Cards and transaction detail
             ↓
Next choices
Report transaction / Replace card / Review other activity / Unfreeze if later recognized
```

### Happy path
Unrecognized -> freeze -> confirmation -> card frozen -> report issue entry point.

### Recovery path
User later recognizes merchant -> transaction detail -> unfreeze -> biometric/passcode confirm -> card active.

### Error/edge states
- Already-frozen card -> no duplicate freeze action; show “Card already frozen”.
- Offline -> freeze action cannot be presented as completed; queue is **not** simulated as server success. Offer retry when connected.
- Pending suspicious transaction -> clarify pending may still settle even after freeze.
- Card was system-restricted -> user may not be allowed to self-unfreeze; route to support (SIMULATED restriction state).

---

## Flow B — Secondary: transfer

```text
Trigger
User taps Pay
↓
Entry
Transfer start / recent recipients
↓
Recipient
Choose existing or add new
↓
Amount
Enter amount + optional note
System shows impact on safe-to-spend
↓
Decision
Sufficient available balance?
├── No -> Insufficient balance state -> Edit amount / Cancel
└── Yes -> Review
            ↓
Review
Recipient + amount + fee (if any) + ETA + source account + after-transfer safe-to-spend
            ↓
Authenticate
Biometric prompt
├── Success -> Simulated transfer processing -> Success receipt
└── Failed -> Try again / Use passcode
                         ├── Pass -> Success receipt
                         └── Fail/Cancel -> No transfer, return to review
```

### Success screen
- “Transfer scheduled/sent” only according to simulated scenario label.
- Receipt/reference.
- Recipient and amount.
- Expected arrival.
- Updated Money Horizon preview.
- Done / Share receipt (prototype action).

### Critical safety rule
No UI state may imply money moved after biometric failure, offline state, or cancelled confirmation.

---

## Flow C — Exception: insufficient balance

```text
Amount entered
↓
System computes total + fee/commitment impact
↓
Insufficient
↓
Inline error: “You need €84 more for this transfer.”
↓
Options
Edit amount / choose another source / cancel
↓
Recovery
Valid amount -> Review
```

Do not silently pull from protected savings or buffer.

---

## Flow D — Recovery: offline during transfer

```text
Connection lost
↓
Persistent offline banner
↓
Current entered recipient/amount retained locally in prototype state
↓
Review remains readable
↓
Primary confirm disabled with reason “Reconnect to continue”
↓
Connection restored
↓
Revalidate recipient/amount/balance
↓
User explicitly confirms again
```

No auto-send on reconnection.

---

## Flow E — Security/permission: biometric failure

```text
High-risk action requires confirmation
↓
Biometric prompt
↓
Failure
↓
Explain: “We couldn’t verify you.”
↓
Options
Try biometric again / Use passcode / Cancel
↓
Passcode success -> continue action
Passcode fail/cancel -> action not performed
```

This covers the required permission/authentication behavior without inventing an internal admin role.

---

## KYC onboarding flow

```text
Welcome / value proposition
↓
What you’ll need + why we ask
↓
Phone/email verification (SIMULATED)
↓
Legal name / DOB / address / tax-residency placeholders as applicable
↓
Choose ID type
↓
ID capture guidance
↓
Selfie/liveness guidance
↓
Review submitted data
↓
Verification status
├── Approved (SIMULATED) -> create security passcode -> Home
├── Capture quality failed -> specific retry guidance
├── More information required -> document request state
└── Manual review -> expected-status explanation + support path
```

Accessibility/support copy must acknowledge camera/verification barriers and provide a help path; do not imply every user can complete the exact same capture method.

## Prototype demo path for recruiters

1. Start at `prototype.html`.
2. Launch Home at 390px primary mobile composition.
3. Observe Money Horizon and alert.
4. Complete suspicious transaction -> freeze flow.
5. Return Home; Money Horizon and card state remain consistent.
6. Complete transfer, including biometric-failed fallback variant.
7. Inspect design-system/component-states/flows pages.
