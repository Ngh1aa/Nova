# Nova — Runtime Architecture Evidence — 2026-09-30

## Status

`P2.1A — DONE_VERIFIED`

This pass consolidates Nova's **current/versioned renderer stack and the focused P0/P1 product-rule stack** without claiming that every historical foundation file in the repository has been deleted or that Nova is a production banking application.

Implementation PR: `#50 — refactor: consolidate Nova current renderer and product state runtime`

Verified on merged `main` commit:

`52419150cacbffbcc72d6ab2f80f0c01760586f7`

Verification chain:

- UIUX Factory Flow OS passed using pinned Factory commit `11003bf36909b08c3def617023dc8ecd9c3964fd`;
- generic rendered visual/Axe QA passed on PR #50;
- all existing transfer, Activity, Cards, Savings, passcode, recipient, accessibility and native-state regressions passed without weakening assertions;
- the new runtime-architecture regression passed;
- the full Nova Visual QA suite passed again on the merged `main` commit;
- GitHub Pages build and deployment passed on the same merged `main` commit.

## Problem before consolidation

The final visible/interactive Nova product was not owned by one clear current architecture. `app.html` loaded later files whose purpose was to override earlier runtime behavior:

- `nova-system-v3.js` replaced final Cards, Savings, Security and Settings surfaces;
- `nova-system-v4.js` replaced Pay / recipient selection and desktop sidebar behavior;
- `nova-system-v5.js` refined the already-replaced sidebar;
- `nova-product-rules.js` owned transfer integrity, Activity and detailed Card rules;
- `nova-transfer-impact.js` added live transfer consequences;
- `nova-passcode-recovery.js` repaired authentication recovery;
- `nova-savings-preview.js` replaced a toast-only savings action with real preview behavior;
- `nova-recipient-flow.js` made the v4 recipient UI functional and preserved recipient identity;
- `nova-native-states.js` owned native Empty / Loading / Edge lifecycle states.

The product worked because those files executed in the correct order. That is a fragile ownership model: changing script order or adding another patch could silently return stale behavior.

## Architecture after P2.1A

### Canonical renderer

Runtime owner:

`assets/nova-current-renderer.js`

It owns the verified current rendering/chrome work previously distributed across v3 → v4 → v5:

- Cards;
- Savings overview;
- Security;
- Settings;
- Pay / recipient surface;
- final desktop rail/chrome;
- renderer-level UI actions tied to those surfaces.

The current file intentionally preserves the previous v3 → v4 → v5 execution semantics internally so this architecture change does not become an unrequested visual redesign.

### Canonical interaction/state owner

Runtime owner:

`assets/nova-current-state.js`

It centralizes the verified product state/model and the P0/P1 interaction rules for:

- Safe-to-spend transfer validation;
- amount/reference persistence;
- above-Safe-to-spend acknowledgement;
- live transfer-impact preview;
- recovery/no-money-moved truth;
- Activity search, filters and empty results;
- Card payment preferences, authoritative freeze and Daily limit validation;
- Savings Money Horizon recomputation and shortfall states;
- passcode retry/recovery;
- recipient search/selection/continuity;
- native Empty / Loading / Error / Edge lifecycle-state ownership.

The current state owner exposes a runtime marker through `window.NovaCurrentRuntime.state` so architecture tests can verify which file actually owns the product state layer.

### Canonical current stylesheet

Runtime owner:

`assets/nova-current.css`

The prior `nova-system-v3.css` → `nova-system-v4.css` → `nova-system-v5.css` cascade is preserved inside one current stylesheet in the same order. This deliberately optimizes for **visual parity first** rather than using cleanup as an excuse to redesign or silently change component geometry.

## Retired from `app.html` runtime

The source files remain in Git history/repository for traceability, but `app.html` no longer loads these as independent runtime layers:

### JavaScript

- `nova-system-v3.js`
- `nova-system-v4.js`
- `nova-system-v5.js`
- `nova-product-rules.js`
- `nova-transfer-impact.js`
- `nova-passcode-recovery.js`
- `nova-savings-preview.js`
- `nova-recipient-flow.js`
- `nova-native-states.js`

### CSS

- `nova-system-v3.css`
- `nova-system-v4.css`
- `nova-system-v5.css`

## Architecture regression

`qa/runtime-consolidation.spec.mjs` prevents the cleanup from silently regressing.

It verifies that:

- `nova-current-renderer.js` loads exactly once;
- `nova-current-state.js` loads exactly once;
- `nova-current.css` loads exactly once;
- all retired v3/v4/v5 and focused P1 script owners above are absent from the live runtime;
- retired v3/v4/v5 stylesheets are absent from the live runtime;
- the runtime owner markers identify the canonical renderer and canonical interaction/state layer;
- the final Cards surface still renders;
- the final v5-refined desktop rail still renders from the canonical renderer;
- the final Pay surface still renders;
- the verified saved-recipient behavior remains present.

This architecture test runs beside the existing behavior regressions rather than replacing them.

## Behavior preservation evidence

The consolidation was accepted only because the existing regression suite remained green without reducing assertions.

The protected scenarios include:

- transfer amount/reference continuity and Safe-to-spend integrity;
- live transfer consequences at normal, boundary, over-plan and above-balance values;
- Activity search/filter/no-result/reset behavior;
- Card preference persistence, Daily limit validation and freeze hierarchy;
- Savings preview recomputation, including negative Safe-to-spend;
- biometric fallback / passcode retry;
- recipient selection continuity through recovery and receipt;
- keyboard, focus, scaling, reduced-motion and accessibility-tree browser evidence;
- direct native Empty / Loading / Error / Edge state routes.

No visual or product-behavior regression was accepted as part of this cleanup.

## Five simulated-user re-tests after the architecture change

These are **simulated users**, not external participants. Their scenarios reuse the already-defined regression-sensitive product tasks to confirm that an internal refactor did not alter customer-facing behavior.

### SU-01 — Mai, 23 — transfer planning

Scenario: enters €500, €1,400 and an above-balance transfer after consolidation.

Simulated comment:

> “Mình vẫn thấy ngay gửi xong còn bao nhiêu, vượt mức an toàn thì được báo trước, còn vượt luôn số dư thì app chặn.”

Result: `PASS — regression-backed`.

### SU-02 — Huy, 29 — Activity lookup

Scenario: searches ByteMart and uses Pending / Recurring filters.

Simulated comment:

> “Tìm giao dịch với lọc vẫn ra đúng như trước, không có kết quả thì vẫn có nút xoá để quay lại.”

Result: `PASS — regression-backed`.

### SU-03 — Lan, 35 — Card controls

Scenario: changes payment preferences, reloads, freezes/unfreezes and saves a Daily limit.

Simulated comment:

> “Mấy cài đặt thẻ mình đổi vẫn được nhớ, khoá thẻ thì các cách thanh toán bị chặn, mở lại thì lựa chọn cũ vẫn còn.”

Result: `PASS — regression-backed`.

### SU-04 — Minh, 27 — security recovery

Scenario: biometric failure → wrong prototype passcode → retry → success path.

Simulated comment:

> “Nhập sai thì mình vẫn ở bước xác nhận để nhập lại, và app vẫn nói rõ tiền chưa chuyển trước khi xác nhận xong.”

Result: `PASS — regression-backed`.

### SU-05 — An, 21 — savings planning

Scenario: previews €500 and an aggressive €1,600 monthly contribution.

Simulated comment:

> “Tăng tiền tiết kiệm thì số tiền còn lại vẫn đổi theo, nếu kế hoạch bị âm thì app vẫn hiện số âm chứ không giấu.”

Result: `PASS — regression-backed`.

## Remaining P2.1B boundary

P2.1A does **not** claim that every older foundation pass has been eliminated from `app.html`.

The following earlier foundations remain runtime dependencies and need a separate dependency/parity pass before removal or absorption:

- base `nova.js` renderer/data foundation;
- redesign / financial-intelligence transformations;
- iOS26 navigation foundation;
- pastel/dashboard foundations;
- brand repair layer;
- older foundational CSS chain used by screens that have not yet been rebuilt into the canonical current stylesheet.

Cross-cutting accessibility and motion layers should be evaluated separately rather than mechanically folded into product state just to reduce file count.

Therefore the accurate architecture status is:

- **P2.1A — current/versioned renderer + P0/P1 state ownership: `DONE_VERIFIED`**
- **P2.1B — older foundation dependency cleanup: `OPEN`**

This distinction keeps the portfolio evidence honest: Nova now has one canonical owner for the previously fragmented current/P1 stack, while deeper historical foundations still require a separate safe consolidation pass.
