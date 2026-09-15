# NOVA — Cloud-Only QA Plan

Target implementation now exists on `Ngh1aa/Nova` / `feat/nova-portfolio-grade`. Cloud checks remain due until GitHub Actions runs and evidence is inspected.

## Target toolchain

Use the `Cloud QA Toolchain` in `Ngh1aa/uiux-ai-workspace` against the **actual NOVA target repository/ref**.

Do not use the Factory fixture as product evidence.

## Planned representative routes

Implemented representative routes:

- `/prototype.html`
- `/app.html?screen=home`
- `/app.html?screen=transaction-detail`
- `/app.html?screen=card-frozen`
- `/app.html?screen=transfer-review`
- `/app.html?screen=transfer-success`
- `/app.html?screen=biometric-failed`
- `/app.html?screen=offline`
- `/app.html?screen=kyc`
- `/design-system.html`
- `/component-states.html`
- `/sitemap.html`
- `/user-flows.html`

## Playwright critical journeys

### Hero flow
1. Open Home.
2. Assert Money Horizon and “Needs review” alert visible.
3. Open suspicious transaction.
4. Open freeze action.
5. Verify consequence text exists.
6. Confirm freeze.
7. Assert card state is frozen globally.
8. Navigate Cards and confirm consistent frozen state.
9. Unfreeze recovery path with authentication.

### Transfer happy path
1. Home -> Pay.
2. Select recipient.
3. Enter valid amount.
4. Review details.
5. Trigger biometric success.
6. Assert success receipt and updated projected Money Horizon.

### Transfer failure variants
- insufficient balance -> edit amount -> recover;
- biometric failure -> passcode fallback -> success;
- offline -> confirm disabled/no success state -> reconnect -> explicit re-confirm.

### KYC
- successful simulated path;
- poor capture -> retry guidance;
- manual review/help path.

## Accessibility

Run axe-core across all representative routes/states.

Hard blockers:
- critical/serious automated findings not justified;
- invisible or missing focus;
- unlabeled inputs/buttons;
- status conveyed only by color;
- modal/dialog without safe keyboard behavior;
- touch target problems on primary controls;
- content hidden by motion/JS failure.

Automated checks do not justify a formal WCAG conformance claim by themselves.

## Responsive screenshots

Required after latest material visual change:

- 390 mobile: Home, transaction detail, freeze confirmation/frozen, transfer review, biometric failed, offline, KYC.
- 768: Home + transaction detail.
- 1024: Home + transfer.
- 1440: Home + design-system/component-states evidence.

Also create a cross-page montage/contact sheet for visual critique.

## Runtime/build

- syntax/build or static integrity check;
- no broken critical assets;
- no uncaught exceptions;
- no unexpected horizontal overflow;
- all interactive controls reachable;
- no dead links between portfolio evidence screens.

## Lighthouse

Use project-specific budgets after implementation baseline exists. Initial prototype targets (targets, not results):
- Accessibility ≥ 95
- Best Practices ≥ 90
- Performance ≥ 85 on representative static routes

A lower score is not automatically a product failure; inspect root cause and real visual/interaction quality.

## Human visual veto

Review as Design Director / Senior Product Designer / recruiter / end user:
- Is Safe to Spend the first decision visible?
- Does Money Horizon read as finance information rather than decoration?
- Is the suspicious-transaction flow urgent but calm?
- Are freeze consequences impossible to miss?
- Does desktop remain a consumer product rather than a generic dashboard?
- Is any “AI fintech template” smell present?
- Are states visibly different without overusing color?
- Are text and controls readable on every surface/state?

Material REVISE/REMOVE findings return to the owning layer and require new rendered evidence.
