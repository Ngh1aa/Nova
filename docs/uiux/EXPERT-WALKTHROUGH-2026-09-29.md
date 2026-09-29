# Nova — Expert Walkthrough & Adversarial QA — 2026-09-29

## Purpose

Evaluate Nova without external participants because the current portfolio deadline does not allow a full moderated usability round.

This is **not direct-user research**. It is an expert product-design evaluation using repository behavior, state logic, browser regression evidence, edge-case inspection and interaction-contract review.

## Evidence labels

- `VERIFIED_IMPLEMENTATION` — directly visible in source or automated behavior.
- `VERIFIED_GAP` — a control or product promise exists, but its intended behavior is absent/incomplete in the current prototype.
- `EXPERT_FINDING` — product/UX risk identified through expert walkthrough and adversarial review.
- `NOT_USER_VALIDATED` — no external participant evidence exists.

## Walkthrough scope

The review covered:

1. Home / Money Horizon mental model.
2. Activity search, filtering and suspicious transaction review.
3. Card freeze/unfreeze, card controls and daily limits.
4. Send-money flow from amount entry through review, biometric recovery and receipt.
5. Savings contribution preview and Money Horizon relationship.
6. Offline/recovery behavior and accessibility-relevant interaction semantics.
7. Source/runtime consistency and handoff clarity.

## Findings

### F01 — Activity search is visually present but functionally inert

**Priority:** P1  
**Evidence:** `VERIFIED_GAP`

`#txn-search` is rendered with a real search label and placeholder, but the current interaction binding does not attach filtering/search behavior to the field.

Risk:

- user expects direct manipulation but receives no result change;
- a recruiter can interpret the control as decorative rather than product-complete;
- no zero-result state can be exercised from the native Activity screen.

Required fix:

- search merchant, category and amount;
- update visible count;
- show a deliberate zero-result state;
- allow clearing the query without navigation.

### F02 — Activity filter chips acknowledge clicks but do not filter data

**Priority:** P1  
**Evidence:** `VERIFIED_GAP`

Filter chips only update `aria-pressed` and emit a toast. Transaction rows do not change.

Risk:

- misleading affordance;
- prototype appears interactive while the underlying decision state is unchanged.

Required fix:

Implement at least `Needs review`, `Pending` and `Income` against the native transaction data model, then combine filters with search.

### F03 — Card toggles do not persist

**Priority:** P1  
**Evidence:** `VERIFIED_GAP`

Online payments, Contactless, Cash withdrawals, Magstripe and Security toggles currently emit prototype toasts but are initialized from hard-coded values on render.

Risk:

- state is lost on navigation/reload;
- frozen-card versus channel-preference conflicts cannot be reviewed honestly;
- the current copy says preferences are saved even though the values are not persisted.

Required fix:

Persist prototype settings and make frozen-card state authoritative over payment-channel preferences.

### F04 — Daily card limit has no validation or persistence

**Priority:** P1  
**Evidence:** `VERIFIED_GAP`

The limit field accepts free numeric-looking input and the Save action only emits a toast.

Adversarial cases to support:

- empty value;
- zero;
- negative value;
- decimal value when policy expects whole euros;
- extremely high value;
- non-numeric pasted content;
- save while card is frozen/system-restricted.

Required fix:

Define a prototype policy, validate against it, expose inline error state, persist valid values and keep the consequence clear.

### F05 — Savings “Preview change” does not recompute Money Horizon

**Priority:** P1  
**Evidence:** `VERIFIED_GAP`

The UI explicitly says changing the monthly contribution updates the Money Horizon estimate, but the button currently only displays a toast. The Horizon component remains unchanged.

Risk:

This weakens Nova's main product thesis because the prototype explains a causal financial model without demonstrating the causal change.

Required fix:

- validate contribution input;
- recompute committed amount and Safe to spend;
- update Horizon visibly before any save/money movement;
- show overcommitted state if the contribution causes Safe to spend to go below zero.

### F06 — Passcode recovery is prefilled with `4821`

**Priority:** P1  
**Evidence:** `VERIFIED_IMPLEMENTATION` + `EXPERT_FINDING`

The biometric-failure fallback opens a passcode field already containing `4821`.

Risk:

- undermines the mental model of authentication;
- makes the recovery path feel like a demo shortcut rather than a product interaction;
- the field has no invalid-attempt state.

Required fix:

Use an empty masked field, prototype hint outside the credential value, length/format validation, error messaging, and a clear retry path.

### F07 — Recipient search is a dead-end affordance

**Priority:** P1/P2  
**Evidence:** `VERIFIED_GAP`

The Send Money recipient screen exposes a search box, but only one hard-coded recent recipient is actionable and the search field has no behavior.

Decision:

Either implement minimal search over a small prototype recipient dataset or remove the search affordance for this scoped flow. A visible non-working search field is weaker than an intentionally scoped recent-recipient pattern.

### F08 — Nova/Ledger identity still drifts in canonical source

**Priority:** P2  
**Evidence:** `VERIFIED_IMPLEMENTATION`

`app.html` is branded Nova while canonical renderer strings and title generation still contain Ledger. Runtime brand-fix layers repair visible output.

Risk:

- handoff ownership is unclear;
- source-of-truth is harder to audit;
- future changes can reintroduce identity drift.

Required fix:

Remove runtime repair as the source of identity truth and migrate canonical product strings to Nova.

### F09 — Runtime layering is too deep for clean handoff

**Priority:** P2  
**Evidence:** `VERIFIED_IMPLEMENTATION`

`app.html` loads many historical CSS and JS override layers.

Risk:

- higher regression risk;
- hard to identify the owning layer for a visual or interaction behavior;
- recruiter-visible polish can pass while implementation quality remains difficult to explain.

Required fix:

Collapse to one canonical visual system and one canonical interaction layer; archive historical experiments outside the runtime path.

## What passed the walkthrough

The expert review did **not** reopen the repaired transfer P0s:

- above-balance amounts are blocked;
- above-Safe-to-spend transfer consequences are explicit;
- plan shortfall is preserved through recovery;
- failed authentication states state that no transfer has been made;
- custom amount/reference continuity through receipt is regression-covered;
- offline confirmation is disabled and review is preserved.

These remain technical/product-integrity strengths of the prototype.

## Current validation statement

Use this wording for the current portfolio scope:

> Nova was evaluated through an expert product walkthrough, adversarial edge-case review, automated accessibility/render checks and browser regression testing. No direct-user usability claims or production impact claims are made.

Do **not** say:

- “validated with users”;
- “users preferred”;
- “confidence improved”;
- “task success increased”;
- any production conversion/retention/fraud-reduction outcome.

## Priority order after this walkthrough

### P0

No new technical P0 was found in this walkthrough. Existing transfer-integrity P0s remain closed and verified.

### P1

1. Functional Activity search + filters + zero-result state.
2. Persist Card/Security controls and validate daily limits.
3. Make Savings contribution preview actually recompute Money Horizon.
4. Replace prefilled passcode demo with a truthful recovery interaction.
5. Resolve recipient-search dead affordance.
6. Add manual keyboard/focus/zoom/reduced-motion evidence.

### P2

1. Remove Nova/Ledger source drift.
2. Collapse legacy runtime CSS/JS layers.
3. Keep rejected alternatives/trade-offs recruiter-visible.

## Validation boundary

External moderated testing is intentionally **not required for the current portfolio deadline**. This decision reduces evidence strength, so the portfolio must present the work as expert-evaluated rather than user-validated.
