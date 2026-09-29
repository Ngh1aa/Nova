# Nova — Synthetic Usability Round 01 — 2026-09-29

## What this is

This document presents the existing expert walkthrough through **five synthetic user lenses** so the findings are easier to communicate and compare.

These are **not real research participants**. No interview, moderated session, quote, preference or task-success claim should be attributed to a real person. The scenarios below are simulated from the product behavior already inspected in Nova.

Use the label:

> 5 synthetic user simulations derived from expert walkthrough and adversarial QA.

Do not use:

> Tested with 5 users.

## Synthetic user set

| ID | Synthetic user | Context | Primary need | Risk profile |
|---|---|---|---|---|
| SU-01 | Mai, 23 | First full-time job, checks spending daily | Understand what is actually safe to spend | Low tolerance for confusing money states |
| SU-02 | Huy, 29 | Freelancer with irregular income | Search/filter activity quickly | High dependence on transaction tools |
| SU-03 | Lan, 35 | Parent managing recurring expenses | Control card behavior and spending limits | High consequence if settings do not persist |
| SU-04 | Minh, 27 | Security-conscious digital banking user | Recover safely after biometric failure | High sensitivity to authentication shortcuts |
| SU-05 | An, 21 | New banking-app user saving toward a goal | Understand how savings choices affect available money | Needs clear cause-and-effect feedback |

---

## SU-01 — Mai, 23

### Scenario

Mai opens Nova before making a transfer. She wants to know whether sending money will affect bills, savings and the protected buffer.

### Simulated walkthrough

1. Reads `Safe to spend` on Home.
2. Opens Send Money.
3. Tries a normal amount.
4. Tries an amount above Safe to spend but below total balance.
5. Continues through review and biometric recovery.

### Findings assigned to SU-01

#### Finding A — Safe-to-spend integrity was previously contradictory

**Status:** fixed / verified.

The earlier prototype could allow a transfer beyond Safe to spend while still implying commitments and buffer remained covered.

Current behavior now surfaces the shortfall, requires acknowledgement and preserves that truth through recovery.

#### Finding B — Transfer preview is still not reactive while typing

**Priority:** P1.

On the amount screen, the impact panel does not fully recompute the projected Safe to spend in real time as the value changes.

**Why Mai would struggle:** the most important consequence is delayed until review instead of helping her decide before submit.

**Recommended fix:** update the preview live for normal, above-safe and above-balance values.

### Synthetic takeaway

> Mai can understand the final review state, but the decision support should happen earlier while she is entering the amount.

---

## SU-02 — Huy, 29

### Scenario

Huy has many transactions and wants to find a specific merchant, inspect suspicious activity and isolate pending or income entries.

### Simulated walkthrough

1. Opens Activity.
2. Types into transaction search.
3. Presses `Needs review`, `Pending` and `Income` filters.
4. Looks for a zero-result state.
5. Opens the unusual ByteMart transaction.

### Findings assigned to SU-02

#### Finding A — Activity search is visually present but functionally inert

**Priority:** P1.

The search field exists, but typing does not change the transaction list.

#### Finding B — Filter chips do not filter transactions

**Priority:** P1.

The chips update `aria-pressed` and show a toast, but the underlying rows remain unchanged.

#### Finding C — No native zero-result state from search/filter

**Priority:** P1.

Because the controls do not alter the list, the user cannot reach a meaningful no-results state from normal Activity behavior.

### Synthetic takeaway

> Huy sees controls that look production-ready, but they currently behave like presentation affordances rather than real transaction tools.

### Recommended fix

Implement search by merchant/category/amount, functional Needs review/Pending/Income filters, combined search + filter logic, dynamic result count and a clear zero-result state.

---

## SU-03 — Lan, 35

### Scenario

Lan wants to freeze her card after suspicious activity, disable online payments and reduce her daily purchase limit.

### Simulated walkthrough

1. Freezes the card.
2. Opens Card controls.
3. Changes Online payments / Contactless.
4. Navigates away and returns.
5. Edits the daily card limit with valid and invalid values.

### Findings assigned to SU-03

#### Finding A — Card control toggles do not persist

**Priority:** P1.

Controls emit a toast, but their values are initialized from hard-coded defaults on render.

**Why it matters:** the UI says preferences are saved, but navigation/reload can restore the old state.

#### Finding B — Frozen-card hierarchy is not fully modeled

**Priority:** P1.

The prototype explains that the frozen state should override channel preferences, but the deeper interaction model is not fully represented.

#### Finding C — Daily limit lacks validation and persistence

**Priority:** P1.

The field currently does not demonstrate robust empty/zero/negative/excessive/invalid handling and does not persist a saved value.

### Synthetic takeaway

> Lan can understand the intended controls, but she cannot trust them until state survives navigation and invalid limits are handled explicitly.

### Recommended fix

Persist card preferences, make freeze state authoritative, define a prototype limit policy, add inline errors and persist successful changes.

---

## SU-04 — Minh, 27

### Scenario

Minh is cautious about security. He confirms a transfer, intentionally triggers biometric failure and then uses fallback recovery.

### Simulated walkthrough

1. Reviews a transfer.
2. Starts biometric confirmation.
3. Simulates biometric failure.
4. Checks whether money moved.
5. Opens passcode fallback.

### Findings assigned to SU-04

#### Finding A — Recovery reassurance is now explicit

**Status:** fixed / verified.

The recovery state clearly says `No transfer has been made`, preserving trust after failed authentication.

#### Finding B — Passcode fallback is prefilled with `4821`

**Priority:** P1.

The credential field is already populated.

**Why Minh would distrust this:** it turns authentication into a demo shortcut and removes the possibility of a meaningful invalid-entry state.

### Synthetic takeaway

> Recovery messaging is strong, but the prefilled credential breaks the otherwise careful security mental model.

### Recommended fix

Use an empty masked field, keep any demo hint outside the credential value, validate length/format, show invalid-attempt feedback and retain a clear retry path.

---

## SU-05 — An, 21

### Scenario

An is building an emergency fund and wants to understand how increasing the monthly contribution changes the amount available for everyday spending.

### Simulated walkthrough

1. Opens Emergency buffer.
2. Opens contribution adjustment.
3. Changes the monthly contribution.
4. Presses `Preview change`.
5. Checks Money Horizon for the consequence.

### Findings assigned to SU-05

#### Finding A — Savings preview does not recompute Money Horizon

**Priority:** P1.

The UI promises that changing the contribution updates the Money Horizon estimate, but the action currently only shows a toast.

#### Finding B — Overcommitted savings state is not natively demonstrated

**Priority:** P1.

The flow should show what happens when a proposed contribution makes Safe to spend negative or creates a planning shortfall.

### Synthetic takeaway

> An understands the concept, but the most important learning moment — seeing savings change available money — is not yet demonstrated interactively.

### Recommended fix

Validate the contribution, recompute committed amount and Safe to spend, update the Horizon immediately and support an explicit overcommitted state.

---

## Cross-user synthesis

| Pattern | Synthetic users affected | Priority | Current status |
|---|---|---:|---|
| Product promises should change visible state, not just show toasts | SU-02, SU-03, SU-05 | P1 | Open |
| Decision consequences should appear before commitment | SU-01, SU-05 | P1 | Open |
| Persistent settings must actually persist | SU-03 | P1 | Open |
| Security recovery must preserve trust | SU-04 | P1 | Partially fixed |
| Search/filter affordances must be functional or removed | SU-02 | P1 | Open |
| High-consequence transfer truth must remain consistent | SU-01, SU-04 | P0 | Fixed / verified |

## Synthesis conclusion

Across the five synthetic lenses, the remaining weakness is not visual quality. It is **interaction depth**: several controls communicate production-like intent while still behaving as prototype-only toasts or hard-coded states.

The highest-value next fixes are:

1. Activity search + filters + zero-result state.
2. Card/Security state persistence + daily-limit validation.
3. Savings contribution -> real Money Horizon recomputation.
4. Passcode recovery without prefilled credential.
5. Live transfer-impact preview while entering the amount.

## Portfolio-safe wording

Recommended:

> I stress-tested Nova through five synthetic user simulations covering money planning, transaction review, card controls, security recovery and savings behavior. These simulations were derived from expert walkthrough and adversarial QA, then used to prioritize interaction gaps before final prototype QA.

Avoid:

> I tested Nova with five users.

or any sentence implying these five synthetic profiles were real participants.
