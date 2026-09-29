# Nova — Product Design Audit — 2026-09-29

## Audit intent

Audit Nova as a real Product Designer portfolio case without pretending commercial seniority or inventing validation, business impact, user quotes or production evidence.

Evidence states used here:

- `VERIFIED` — directly supported by repository implementation, test evidence or committed research artifacts.
- `INFERRED` — reasonable conclusion from evidence but not directly tested.
- `ASSUMED` — temporary product assumption.
- `UNKNOWN` — no reliable evidence exists yet.

Delivery states:

- `DONE_VERIFIED` — implemented and verified by committed evidence.
- `EXPERT_EVALUATED` — reviewed through expert walkthrough/adversarial QA, not direct-user research.
- `NOT_USER_VALIDATED` — no external participant evidence exists.

## Verification record

### 2026-09-29 — P0 technical remediation

The technical P0 work is merged into `main` and verified through repository QA.

Verified changes:

- PR #27 — transfer integrity, persisted amount/reference, explicit above-Safe-to-spend acknowledgement, measurement framework and regression coverage.
- PR #28 — truthful above-Safe-to-spend recovery state, explicit plan shortfall, and a visible “No transfer has been made” reassurance after failed authentication/offline recovery.
- `main` commit `945e8beadd05933f7b04865008c9221055a21553` — Nova Visual QA passed.
- GitHub Pages build and deployment for the same `main` commit passed.

### 2026-09-29 — validation strategy change

Because the current portfolio deadline does not allow a moderated external-user round, direct-user testing is no longer treated as a release blocker for this portfolio scope.

Instead Nova uses:

- expert product walkthrough;
- adversarial edge-case review;
- automated accessibility/render checks;
- browser regression testing;
- source/interaction-contract inspection.

This does **not** permit any claim that Nova has been validated with users. See `docs/uiux/EXPERT-WALKTHROUGH-2026-09-29.md`.

## Executive result

Nova has a coherent product thesis, IA, exception/recovery flows, state contracts, responsive QA, handoff documentation and technical product-integrity tests. The transfer P0s are repaired. The current work should be presented as an **expert-evaluated interactive prototype**, not a user-validated commercial product.

## P0

### P0.1 — Transfer must respect the Safe-to-spend decision model

**Evidence:** `VERIFIED`

Implemented behavior:

- amounts above total balance remain invalid;
- amounts above Safe to spend remain possible in the prototype but are explicitly flagged as using money allocated to commitments/buffer;
- user acknowledgement is required before biometric confirmation;
- review and recovery states show an explicit plan shortfall;
- failed-authentication/offline recovery states explicitly say no transfer has been made.

Status: `DONE_VERIFIED`

### P0.2 — Transfer receipt must preserve the reviewed amount

**Evidence:** `VERIFIED`

`amount entry -> review -> confirm -> receipt` preserves the same amount and reference.

Status: `DONE_VERIFIED`

### P0.3 — Validation evidence

**Evidence:** `EXPERT_EVALUATED` + `NOT_USER_VALIDATED`

External participant testing is intentionally not required for the current portfolio deadline.

Current evidence:

- expert walkthrough and adversarial QA;
- browser regression evidence;
- automated render/accessibility checks;
- explicit inspection of native interaction behavior.

Allowed claim:

> Nova was evaluated through an expert product walkthrough, adversarial edge-case review, automated accessibility/render checks and browser regression testing.

Forbidden claims:

- Nova was validated with users;
- users prefer Nova;
- Money Horizon improves user confidence;
- task success improved in real users;
- conversion, retention, adoption or fraud reduction improved.

Status: `EXPERT_EVALUATED / NOT_USER_VALIDATED`

The previous five-participant Round 01 is optional future research, not a current release gate.

### P0.4 — Metrics must be a framework, not fabricated impact

**Evidence:** `VERIFIED`

`docs/uiux/MEASUREMENT-FRAMEWORK.md` defines hypotheses, behavioral metrics, guardrails, prototype usability measures, event taxonomy and explicit `NOT_MEASURED` status for metrics without data.

Status: `DONE_VERIFIED`

## P1 — verified gaps from expert walkthrough

### P1.1 — Make state handling native rather than primarily recruiter-injected

The Recruiter State Lab has useful rendered QA, but some Empty/Loading/Edge behavior is still forced by a review wrapper instead of the core product state model.

### P1.2 — Activity search and filters must change results

`VERIFIED_GAP`: search is rendered but has no filtering behavior. Filter chips only toggle `aria-pressed` and emit a toast; transaction rows do not change.

Required:

- search merchant/category/amount;
- implement Needs review, Pending and Income filters;
- combine search + filters;
- show native zero-result state and visible count updates.

### P1.3 — Transfer impact preview should react before submit

The amount screen should recalculate projected Safe to spend as the amount changes, including the over-plan state before review.

### P1.4 — Card controls and limits need persistence + invalid input handling

`VERIFIED_GAP`: payment/security switches are hard-coded on render and only emit toasts. Daily limit Save emits a toast without validation or persistence.

Required:

- persist prototype preferences;
- make frozen/system-restricted state authoritative;
- validate empty/zero/negative/excessive/invalid limits;
- expose inline error and success states.

### P1.5 — Savings contribution preview should recompute Money Horizon

`VERIFIED_GAP`: “Preview change” currently shows a toast but does not alter the Horizon despite the UI promising that relationship.

Required:

- validate contribution input;
- recompute committed amount and Safe to spend;
- visibly update Horizon;
- support overcommitted/negative-safe state.

### P1.6 — Passcode recovery should not be prefilled

`EXPERT_FINDING`: biometric fallback currently opens with prototype passcode `4821` already in the input.

Required:

- empty masked field;
- format/length validation;
- invalid attempt state;
- keep any demo hint outside the credential value.

### P1.7 — Recipient search is a dead affordance

`VERIFIED_GAP`: recipient search is rendered but does not search the one-recipient prototype dataset.

Decision:

Implement a minimal recipient dataset/search or remove the search affordance for this scoped flow.

### P1.8 — Manual accessibility evidence

Automated checks are useful but not a conformance claim. Capture keyboard-only critical flows, focus order, zoom/text scaling, screen-reader semantics and reduced-motion behavior.

## P2 — cleanup / maintainability / portfolio clarity

### P2.1 — Collapse legacy visual override layers

`app.html` loads many historical CSS/JS passes. Collapse to one canonical current visual layer and one canonical interaction layer; archive experiments outside runtime.

### P2.2 — Remove source-level Nova/Ledger identity drift

Canonical renderer strings still contain Ledger while runtime scripts repair visible output. Move identity truth into canonical source.

### P2.3 — Refresh stale phase ledger language

Preserve history, but ensure superseded phase documents do not appear to describe current status.

### P2.4 — Add explicit design-decision / rejected-alternative evidence

Recruiter-visible material should show trade-offs such as balance-first vs Money Horizon, speed vs transfer review safety, protection vs recovery friction, and confidence vs false certainty.

## Category summary

| Area | Current state | Priority |
|---|---|---|
| Product thinking | Strong hypothesis + coherent financial model; expert-evaluated, not user-validated | P1 |
| UX states | Broad documented coverage; native ownership incomplete | P1 |
| Edge cases | Transfer/recovery P0 repaired; deeper control/input conflicts remain | P1 |
| Validation | Expert walkthrough + adversarial QA complete; no external participant claims | Current scope complete |
| Metrics | Canonical framework exists; outcomes remain `NOT_MEASURED` | P0 technical done |
| Accessibility | Automated/render checks strong; manual evidence incomplete | P1 |
| Handoff | Source-backed contract exists; runtime layering remains difficult | P2 |
| Prototype | Core transfer integrity repaired and regression-tested; several secondary controls remain shallow | P1 |

## Portfolio truth statement

Use:

> An independent consumer-finance product concept and interactive prototype. Product decisions are grounded in benchmark research and explicit hypotheses. The prototype has been evaluated through expert walkthrough, adversarial edge-case review, automated accessibility/render checks and browser regression testing. No direct-user or production-impact claims are made.

Do not convert this into a commercial impact case until real commercial/product evidence exists.
