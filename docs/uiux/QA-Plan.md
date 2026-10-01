# NOVA — QA Contract & Current Evidence

Nova has an active cloud QA pipeline on `Ngh1aa/Nova`; the old “cloud checks remain due” phase is complete. This file now describes the continuing verification contract rather than a future-only plan.

## Canonical toolchain

`.github/workflows/nova-cloud-qa.yml` checks out the pinned `Ngh1aa/uiux-ai-workspace` revision and runs the canonical Flow OS against the **actual Nova repository**, not a Factory fixture.

Current Factory pin:

`11003bf36909b08c3def617023dc8ecd9c3964fd`

The workflow also verifies deterministic canonical-runtime generation before browser QA.

## Current evidence baseline

Before P2.3 began:

- P2.2 merged-main Nova Visual QA run `#313` / Actions run `36825048721`: `SUCCESS`.
- generated-runtime sync gate: `SUCCESS`.
- UIUX Factory Flow OS dogfood: `SUCCESS`.
- Nova product/regression/accessibility/rendered QA: `SUCCESS`.
- GitHub Pages build/deploy for the same merged main state: `SUCCESS`.
- Vercel commit status for the P2.2 merge: `SUCCESS`.

P2.3 is documentation/status work, so it does not create a new visual-quality claim. It must still rerun the normal PR/main workflow to prove that current-status cleanup did not break repository contracts or regression coverage.

## Representative routes

The cloud workflow covers primary product, lifecycle and evidence surfaces including:

- `/app.html?screen=home`
- `/app.html?screen=home&state=empty&pin=1`
- `/app.html?screen=home&state=loading&pin=1`
- `/app.html?screen=home&state=edge&pin=1`
- `/app.html?screen=error`
- `/app.html?screen=activity`
- `/app.html?screen=transaction-detail`
- `/app.html?screen=report-transaction`
- `/app.html?screen=cards`
- `/app.html?screen=transfer-recipient`
- `/app.html?screen=transfer-amount`
- `/app.html?screen=transfer-review`
- `/app.html?screen=biometric-failed`
- `/app.html?screen=offline`
- `/app.html?screen=transfer-success`
- `/app.html?screen=savings`
- `/app.html?screen=savings-detail`
- `/app.html?screen=kyc`
- `/recruiter-state-lab.html?state=empty`
- `/state-matrix.html`
- `/prototype.html`
- `/design-system.html`
- `/component-states.html`
- `/sitemap.html`
- `/user-flows.html`

## Protected product journeys

### Suspicious transaction / protection

1. Open Home.
2. Inspect unusual transaction.
3. Open Transaction Detail.
4. Verify Freeze and Report are distinct actions with explicit simulated/no-bank-contact boundaries.
5. Verify freeze state and recovery remain consistent across relevant card surfaces.

### Transfer

1. Search/select recipient.
2. Enter amount.
3. Verify live Safe-to-spend / balance impact.
4. Review recipient, amount, reference and protected-buffer rule.
5. Exercise biometric/passcode recovery or offline/revalidation path.
6. Verify no-money-moved truth until simulated confirmation.
7. Verify receipt preserves the reviewed identity and amount.

### Savings / Money Horizon

- validate contribution inputs;
- preview normal, paused and overcommitted states;
- preserve protected-buffer semantics;
- keep negative Safe-to-spend visible where the calculation is negative.

### Lifecycle / KYC

- direct Empty / Loading / Error / Edge routes;
- Empty and Loading recovery behavior;
- KYC capture retry/manual-review behavior.

## Accessibility evidence

The regression suite protects representative browser-assisted evidence for:

- Axe findings on configured routes;
- keyboard reachability through a critical transfer task;
- visible focus treatment;
- 200%-zoom-equivalent and root-text scaling reflow checks;
- reduced-motion behavior;
- representative Chromium Accessibility Tree semantics.

This is **not** a WCAG conformance certification and does not substitute for hands-on NVDA/JAWS/VoiceOver/TalkBack testing.

## Responsive / visual review rule

After a **material visual change**, inspect rendered evidence at representative desktop/tablet/mobile widths for hierarchy, overflow, clipping, media, state differentiation and interaction quality.

Documentation-only changes such as P2.3 do not require inventing new pixel claims, but the existing rendered QA still runs as a regression guard.

## Runtime / integrity gates

- regenerate canonical renderer/styles and fail on drift;
- no broken critical assets or uncaught exceptions;
- no unexpected document-level horizontal overflow on protected routes;
- critical controls remain reachable and named;
- canonical renderer/state/style owners remain unique;
- P2.2 Nova identity regression stays green;
- P2.3 current-status documents remain internally consistent.

## Research-truth gate

QA may verify that intended wording, states and evidence labels are implemented. QA must **not** promote research method or outcome claims.

Current research boundary:

- Round 01: 5 verified direct-user self-report records / 0 moderated sessions.
- Round 02: 5 NEW verified async retest self-report records / 0 moderated sessions.
- latest D-01…D-04 changes: implemented / not human-retested.
- no observed task-success/time-on-task improvement claim.
- no causal, conversion, retention or production-impact claim.

## Human visual veto

For material UI changes, review as Design Director / Senior Product Designer / recruiter / end user:

- Is Safe to spend the first decision visible?
- Does Money Horizon read as finance information rather than decoration?
- Is the suspicious-transaction flow urgent but calm?
- Are Freeze/Report consequences and simulated boundaries impossible to miss?
- Does transfer impact explain protected-buffer behavior without false certainty?
- Does desktop remain a consumer product rather than a generic dashboard?
- Are states visibly different without relying on color alone?
- Are text and controls readable on every representative surface/state?

Material REVISE/REMOVE findings return to the owning layer and require new evidence.
