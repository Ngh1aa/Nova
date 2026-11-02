# NOVA charcoal rebuild — inventory / brief

User direction: rebuild ALL product screens from the supplied charcoal financial dashboard reference. The explicit reference replaces the earlier mint/pastel direction. Product language stays English; data, URLs, financial semantics and existing interactions stay intact. No publication is authorized.

## Workflow and ownership
L / brownfield-redesign + UX structure/flow + visual direction + craft/visual QA + dashboard visualization + IA. Routing verified against GitHub WORKFLOWS.md on 2026-11-02; local toolkit supplies checkers and skills. Design direction chosen by user's attached reference; new implementation has not received human review.

CSS source order: tokens.css → shell.css → components.css → screens.css. Generated: assets/nova-current.css. Renderer source order: nova.js → nova-redesign.js → nova-financial-intelligence.js → accessibility.js → nova-ios26.js → nova-pastel-dashboard.js → nova-dashboard-v2.js → legacy/p2-1a-canonical/nova-current-renderer.p2-1a.js. Generated: nova-current-renderer.js. Generator: scripts/p2-1b-consolidate-runtime.mjs. State remains in nova-current-state.js; motion is separate. Do not hand-edit generated bundles.

Existing working tree was already modified. A byte-preserving pre-change source snapshot and original Git status are saved in task work/. No reset, commit, push or branch changes.

## Design / replacement decisions
Keep: Nova identity/mark geometry, local Inter font, tabular money, safe-to-spend thesis, demo boundaries, transaction identity and recovery paths. Replace at user's request: white rail, pastel surfaces, oversized rounding and old dashboard layout.

Direction A (chosen from user reference): persistent labelled charcoal sidebar; warm gradient money card; neutral panels; compact payments; quick-recipient transfer; forecast and ledger. Direction B (considered): retain pastel DNA and use a darker canvas. Rejected because the user explicitly asked for a full rebuild in the supplied style. Direction C (considered): dense analytics-first screen. Rejected because Nova's primary decision is safe-to-spend, not business analytics.

Visual plan: charcoal #1c1b22 canvas / #25242d panels / #2e2d37 inputs, warm white primary text, muted lavender-grey supporting text, amber-to-pink gradient reserved for selected navigation and primary financial actions. Radius 14px panels / 10px controls. 12-column desktop grid; mobile stacks decisions before detail with independent bottom navigation. Existing SVG icon family retained. No stock imagery needed for a money workspace. Motion is limited to brief feedback and respects reduced motion.

Replacement map: tokens → dark semantic system; shell → labelled rail + unified navigation; components → dark input/list/dialog/feedback/action system; Home renderer → new three-column decision composition; Activity → cash-flow summary rail + searchable statement; Savings → summary / goal ledger / plan; Subscriptions → summary / payment schedule; Cards → card / control / activity groups; Security and Settings → grouped workspaces; transfer/detail/KYC/error/lifecycle use corresponding task layouts and shared sources. Old Home composition CSS is removed, not loaded beneath a new stylesheet.

## Screen / state and behavior matrix
Roots: Home, Activity, Cards, Pay, Savings, Subscriptions, Notifications, Security, Settings. Detail/task: account, payment, transaction, report, card controls, savings detail, recipient, amount, review, success, onboarding, KYC. Recovery: offline, biometric failure, error. Lifecycle: empty/loading/edge. Each is captured at 1440 and 390 before/after; responsive checks also cover 320, 768, 1024 and 200% text.

Critical checks: suspicious transaction → freeze dialog → result / unfreeze; transfer recipient → amount → review → back/edit → confirmation → simulated receipt; insufficient amount → correction; biometric failure → passcode; offline → retry; create custom goal → correct detail; inbox and payment links preserve IDs. Existing QA is copied to isolated runner; behavior assertions remain, visual assertions tied to the old palette/layout are updated separately with reasons. No user research, real banking, real-device or full screen-reader validation is claimed.

## Updated visual assertions
dashboard-layout: 8 decision panels instead of former 9, no overlaps plus >=80% grid coverage rather than mandatory rectangle partition; labelled navigation has two intentional text roles; dates/totals checked directly after calendar removal. inbox-layout: 1280px workspace, scrollable short sidebar and focus reachability. nova-flow: 14px corner system replaces 24px. reference-frame: 212px labelled sidebar replaces 72px rail while full viewport remains required. product-style: charcoal canvas and fixed/reachable sidebar replace white/forced-distribution assertions. pastel-ux: updated CTA radius/foreground while hover, focus, click and all behavioral assertions stay intact. Existing identity-source assertion about an absent historical pattern heading was already failing before the redesign; retained and reported separately.

Final QA updates: adaptive visual test now checks unified Home header, tablet tabs, full-width mobile dock and dark sidebar. Figma semantic assertion uses case-insensitive /no bank/i for existing uppercase truth boundary. Historical identity test now asserts the existing visible Card protection heading rather than a removed earlier-iteration heading. No truth-boundary or financial behavior was removed. Reviewer findings led to concise KYC copy, mobile quick-transfer-before-bills and card-controls-before-wallet ordering.

## Delivery verification
101/101 regression tests pass. 46 captures across 23 routes, no console/document/stage overflow issues. 58 axe checks have no violations. Strict taste checks on four representative routes: 0 errors, 6 purposeful colour warnings. Overlay checker: 0 errors, 2 generated advisories. Generator reproducibility, JS syntax and git diff --check pass. Independent revision visual review: 4.13/5, lowest 3.8, no hard fail. KYC repetitive boundary copy and wide-screen density preference on mobile remain minor review observations. Browser evidence is not human/device/backend validation. No commit, push or deployment.
