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

### 2026-09-29 — P1.2 Activity interaction remediation

PR #34 replaced presentation-only Activity controls with native prototype behavior.

Verified on `main` commit `04c87a9cb8ba387808d6e4d4376c870fae86b3dc`:

- merchant/category/amount search changes the visible ledger;
- `Needs review`, `Recurring`, `Pending` and `Income` filters change the visible ledger;
- search and filters can be combined;
- transaction count updates with the result set;
- a native zero-result state appears when nothing matches;
- `Clear search and filters` returns to all 8 transactions;
- Nova Visual QA passed after merge;
- GitHub Pages build and deployment passed after merge.

### 2026-09-29 — P1.4 Card controls and Daily limit remediation

PR #36 replaced reset-on-render / toast-only card controls with persisted product state across the final Cards v3 surface and the detailed Card controls surface.

Verified on `main` commit `25279eeeb63bb1e409034e0e63b9113edf4cc70a`:

- Online payments, Contactless, Cash withdrawals and Magstripe preferences persist across navigation and reload;
- Cards quick controls and detailed Card controls read/write the same stored preferences;
- card freeze persists across reload and becomes authoritative by blocking payment-channel controls without erasing saved preferences;
- unfreezing restores the saved channel preferences;
- Daily card limit persists and is reflected back on the Cards overview;
- empty, non-numeric, zero/negative and values above €5,000 are rejected with inline accessible errors;
- valid values show inline success feedback and persist after reload;
- browser regression covers Cards v3 → detailed controls → reload → freeze → reload → unfreeze;
- Nova Visual QA passed after merge;
- GitHub Pages build and deployment passed after merge.

A runtime ownership issue was also exposed during this work: `nova-system-v3.js` replaces the base Cards renderer later in the script chain. P1.4 therefore repairs the final rendered Cards owner rather than masking the problem with another override layer. The broader runtime-layer consolidation remains P2.1.

### 2026-09-30 — P1.5 Savings Money Horizon remediation

PR #38 replaced the Savings `Preview change` toast-only behavior with a real preview calculation tied to the Money Horizon model.

Verified on `main` commit `d93abf44b06da1e3eaba921918d9265700750a77`:

- blank, non-numeric, negative and >€10,000 contribution values are rejected with inline accessible feedback;
- €0 is treated as an explicit paused-contribution preview rather than an error;
- fixed commitments remain €780 while the proposed savings contribution is recomputed into the committed amount;
- €500/month previews €1,280 committed and €1,060 Safe to spend;
- €0/month previews €780 committed and €1,560 Safe to spend;
- €1,600/month previews €2,380 committed, −€40 Safe to spend and an explicit €40 plan shortfall;
- the Money Horizon bar, legend, accessible label and explanatory note update together;
- the shortfall state says clearly that this is a preview and no money has moved;
- Savings detail was added to the rendered QA route set;
- dedicated Playwright regression coverage passed on the PR and again on merged `main`;
- Nova Visual QA passed after merge;
- GitHub Pages build and deployment passed after merge.

The focused P1 implementation uses a dedicated Savings preview rule module because the base renderer still owns a legacy toast handler. Consolidating these historical runtime layers into one canonical state/interaction owner remains part of P2.1 rather than being hidden by the P1 completion claim.

### 2026-09-30 — P1.6 Passcode recovery remediation

PR #40 replaced the prefilled biometric-fallback passcode with a truthful retryable recovery interaction.

Verified on `main` commit `199a00eddbb65e90fe3789e9ce8b6302d12567a0`:

- biometric failure continues to state that no transfer has been made;
- the passcode field starts empty rather than prefilled;
- the field is masked and constrained to a four-digit prototype format;
- the demo hint is outside the credential value and explicitly says no credential is stored;
- empty input is rejected inline;
- invalid length/format is rejected inline;
- a wrong four-digit code stays inside the recovery dialog instead of closing or completing the transfer;
- the user can correct the code and retry in the same recovery task;
- the correct prototype code completes only the simulated success path;
- cancel closes the dialog while leaving the transfer incomplete;
- `biometric-failed` was added to rendered QA routes;
- dedicated Playwright regression coverage passed on the PR and again on merged `main`;
- Nova Visual QA passed after merge;
- GitHub Pages build and deployment passed after merge.

The focused recovery module intentionally owns this P1 interaction after the legacy base listener because the base `openDialog()` closes before validation can occur. That temporary ownership is explicit technical debt for P2.1 runtime consolidation, not hidden from the completion claim.

### 2026-09-30 — P1.3 Live transfer impact remediation

PR #42 made the amount-entry screen show transfer consequences before review instead of keeping Money Horizon visually stale while the user typed.

Verified on `main` commit `eb6edc171b5ac0c2161f7d25c1ec34de020c58c4`:

- the default €145 transfer previews €1,155 Safe to spend and €2,695 remaining balance;
- €500 previews €800 Safe to spend and updates the Money Horizon composition immediately;
- €1,300 is treated as the Safe-to-spend boundary and previews €0 without an over-plan warning;
- €1,400 shows a €100 plan shortfall before review while keeping total-balance sufficiency explicit;
- €3,000 shows a blocked preview because it exceeds the €2,840 balance by €160;
- the existing submit validation still blocks the above-balance amount, so the live preview does not weaken transfer-integrity rules;
- returning from a blocked amount to €145 restores the normal Horizon state;
- the preview updates its live status, bar, legend, accessible label and explanation together;
- dedicated Playwright regression coverage passed on the PR and again on merged `main`;
- Nova Visual QA passed after merge;
- GitHub Pages build and deployment passed after merge.

The focused transfer-impact module exists because the current runtime still separates base rendering from later product-rule ownership. Consolidating the transfer preview, submit rules and renderer into one canonical interaction owner remains P2.1 debt.

## Executive result

Nova has a coherent product thesis, IA, exception/recovery flows, state contracts, responsive QA, handoff documentation and technical product-integrity tests. Transfer P0s are repaired, transfer consequences now appear while the amount is being entered, Activity search/filter behavior is verified, card settings persist with authoritative freeze behavior and validated limits, Savings recomputes Money Horizon with truthful overcommitted states, and biometric fallback now has a believable retryable passcode recovery path. The current work should be presented as an **expert-evaluated interactive prototype**, not a user-validated commercial product.

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

**Evidence:** `VERIFIED`

Implemented:

- search by merchant/category/amount;
- functional `Needs review`, `Recurring`, `Pending` and `Income` filters;
- combined search + filter behavior;
- dynamic visible transaction count;
- native no-results state;
- clear/reset action returning to the full ledger.

Regression coverage verifies ByteMart search, Pending → Northstar Books, Income → Merchant refund, Needs review → ByteMart, Recurring → Cloudbox + River Gym, zero-result behavior and full reset.

Status: `DONE_VERIFIED`

### P1.3 — Transfer impact preview reacts before submit

**Evidence:** `VERIFIED`

Implemented:

- live projected Safe to spend while the amount changes;
- live remaining-balance feedback;
- normal Money Horizon recomposition for transfers within Safe to spend;
- explicit €0 boundary at the full Safe-to-spend amount;
- negative Safe-to-spend / plan-shortfall state before review;
- above-total-balance blocked preview before submit;
- synchronized live status, Horizon bar, legend, accessible label and explanation;
- preview-only wording that does not imply money movement.

Regression coverage verifies €145 baseline, €500 normal state, €1,300 boundary, €1,400 over-plan shortfall, €3,000 above-balance blocked state, submit blocking and recovery back to a normal amount.

Status: `DONE_VERIFIED`

### P1.4 — Card controls persistence + Daily limit validation

**Evidence:** `VERIFIED`

Implemented:

- persisted Online payments, Contactless, Cash withdrawals and Magstripe preferences;
- synchronized state between the final Cards v3 quick controls and detailed Card controls;
- persisted card freeze that disables payment channels while preserving their saved preferences;
- restored saved preferences after unfreeze;
- persisted Daily card limit reflected on the Cards overview;
- validation for empty, non-numeric, zero/negative and >€5,000 values;
- inline accessible error and success feedback.

Regression coverage verifies persistence through navigation/reload, all four channel states, invalid and valid limit values, freeze hierarchy, frozen reload and preference restoration after unfreeze.

Status: `DONE_VERIFIED`

### P1.5 — Savings contribution preview recomputes Money Horizon

**Evidence:** `VERIFIED`

Implemented:

- contribution input validation for blank, non-numeric, negative and >€10,000 values;
- €0 pause preview;
- recomputed committed amount from fixed commitments + proposed goal contribution;
- recomputed Safe to spend from balance − commitments − protected buffer;
- synchronized Money Horizon bar, legend, accessible label and explanatory note;
- explicit negative Safe-to-spend / overcommitted shortfall state;
- preview-only wording that does not imply money movement.

Regression coverage verifies the baseline €260 state, invalid inputs, €500 normal recomposition, €0 pause state and €1,600 overcommitted state with a €40 shortfall.

Status: `DONE_VERIFIED`

### P1.6 — Passcode recovery is empty, masked and retryable

**Evidence:** `VERIFIED`

Implemented:

- empty masked prototype passcode field;
- four-digit format/length validation;
- wrong-code state that stays inside the recovery dialog;
- retry after a failed attempt without losing the recovery task;
- prototype guidance outside the input value;
- explicit no-credential-stored copy;
- cancel path that leaves the transfer incomplete.

Regression coverage verifies biometric failure → no-money-moved reassurance → empty passcode → invalid input → wrong code → retry → correct prototype code → simulated transfer success, plus a cancel path that never completes the transfer.

Status: `DONE_VERIFIED`

### P1.7 — Recipient search is a dead affordance

`VERIFIED_GAP`: recipient search is rendered but does not search the one-recipient prototype dataset.

Decision:

Implement a minimal recipient dataset/search or remove the search affordance for this scoped flow.

### P1.8 — Manual accessibility evidence

Automated checks are useful but not a conformance claim. Capture keyboard-only critical flows, focus order, zoom/text scaling, screen-reader semantics and reduced-motion behavior.

## P2 — cleanup / maintainability / portfolio clarity

### P2.1 — Collapse legacy visual override layers

`app.html` loads many historical CSS/JS passes. Collapse to one canonical current visual layer and one canonical interaction layer; archive experiments outside runtime.

P1.4 confirmed this is not cosmetic debt: the final Cards UI is owned by `nova-system-v3.js`, which replaces the earlier base Cards renderer. P1.5 needs a focused Savings rule layer to override a legacy toast-only handler. P1.6 needs a focused Passcode recovery layer because the base dialog closes before inline validation can occur. P1.3 now also uses a focused transfer-impact owner so the live Horizon can stay consistent with the later submit/review rules. These P1 fixes make final rendered behavior truthful, but one canonical state/interaction owner is still required during P2 cleanup.

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
| Edge cases | Transfer/recovery P0 repaired; live transfer impact, Activity, card-control, Savings and passcode integrity verified | P1 |
| Validation | Expert walkthrough + adversarial QA complete; no external participant claims | Current scope complete |
| Metrics | Canonical framework exists; outcomes remain `NOT_MEASURED` | P0 technical done |
| Accessibility | Automated/render checks strong; manual evidence incomplete | P1 |
| Handoff | Source-backed contract exists; runtime layering remains difficult | P2 |
| Prototype | Transfer amount/review/recovery, Activity, card controls, Savings preview and passcode recovery are regression-tested; recipient-search depth remains | P1 |

## Portfolio truth statement

Use:

> An independent consumer-finance product concept and interactive prototype. Product decisions are grounded in benchmark research and explicit hypotheses. The prototype has been evaluated through expert walkthrough, adversarial edge-case review, automated accessibility/render checks and browser regression testing. No direct-user or production-impact claims are made.

Do not convert this into a commercial impact case until real commercial/product evidence exists.
