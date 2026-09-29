# Nova — P1.8 Accessibility Evidence — 2026-09-30

## Status

`DONE_VERIFIED`

This record closes P1.8 with browser-assisted evidence for keyboard use, visible focus, zoom/reflow, text scaling, reduced motion and accessibility-tree semantics.

It is **not** a WCAG conformance certification and it is **not** a claim that Nova was manually tested with NVDA, JAWS, VoiceOver or TalkBack. Screen-reader-related evidence below comes from the Chromium Accessibility Tree plus DOM roles/names and rendered interaction checks.

## Verification source

Implementation PR: `#46 — test: add P1.8 accessibility evidence and keyboard focus`

Verified on merged `main` commit:

`9204bc51aeb16dc855e166d58dc226b14302ffa4`

Evidence is produced by `qa/accessibility-evidence.spec.mjs` and stored with the Nova Visual QA artifact. The existing rendered/Axe checks and all prior product regressions run in the same gate.

Factory ownership classification: `PRODUCT / Nova evidence and focus baseline`.

The canonical UIUX Factory Flow OS passed on cross-project-verified Factory commit `11003bf36909b08c3def617023dc8ecd9c3964fd`. P1.8 did not expose a generic Factory defect.

## Lane 1 — Keyboard-only critical transfer path

### Scenario

The test completes the critical transfer path without mouse/pointer interaction:

1. Tab to the Skip link.
2. Tab to recipient search.
3. Type `Daniel`.
4. Tab to Daniel Lee and activate with Enter.
5. Tab to Amount.
6. Enter `€145`.
7. Tab to Reference and enter `Keyboard rent split`.
8. Tab to Review transfer and activate with Enter.
9. Tab to Confirm with biometrics and activate with Enter.
10. Confirm that the authentication dialog is available from the keyboard path.

### Result

`PASS`

Every inspected keyboard target was reachable and exposed a visible focus indicator.

A durable focus baseline now protects product and evidence surfaces:

- `3px` visible outline;
- `3px` outline offset;
- applied through `:focus-visible` so pointer use does not receive unnecessary focus decoration.

Evidence artifact:

`p1-8-keyboard-focus.json`

## Lane 2 — Focus order and focus visibility

### Result

`PASS` for the inspected critical transfer sequence.

The gate does not claim that every focusable element in every route has undergone a human audit. It verifies the representative money-transfer task and keeps the focus indicator as a regression-protected product rule.

The first CI attempt exposed a brittle test assumption: the test expected Review transfer to be exactly one Tab after Reference. The product remained keyboard reachable; the measurement was corrected to verify reachability in the logical sequence instead of hard-coding a one-tab distance.

This correction did not remove the keyboard or visible-focus acceptance criteria.

## Lane 3 — 200% zoom-equivalent reflow

### Routes inspected

- Home
- Activity
- Pay / recipient selection
- Transfer amount
- Cards
- Savings detail

### Method

For a desktop reference width of 1440 CSS px, the browser runs each representative route at 720 CSS px as a layout-width equivalent of 200% browser zoom.

The gate checks that the document does not require horizontal page scrolling.

### Result

`PASS`

No inspected route produced document-level horizontal overflow at the 200%-zoom-equivalent width.

Evidence artifact:

`p1-8-zoom-reflow.json`

## Lane 4 — 200% text scaling stress

### Method

The same representative routes are separately rendered with the root font size forced to 200% while keeping the 1440px layout viewport.

This is a stress test for enlarged text, separate from the zoom-equivalent reflow check.

### Result

`PASS`

No inspected route produced document-level horizontal overflow under the 200% root-text stress condition.

This does not claim conformance for every possible OS/browser text-scaling combination.

## Lane 5 — Reduced motion

### Method

Chromium is launched with `prefers-reduced-motion: reduce`.

The gate verifies:

- the media query is active;
- route-level app/sidebar animations are disabled;
- sampled motion-marked elements have no animation;
- sampled motion-marked elements remain visible rather than disappearing with the animation;
- transforms are removed;
- transition duration is reduced to effectively immediate behavior.

### Result

`PASS`

Content and interaction remain available with reduced motion enabled.

Evidence artifact:

`p1-8-reduced-motion.json`

## Lane 6 — Accessibility-tree semantics

### Recipient selection

Chromium Accessibility Tree evidence verifies representative semantics for:

- `main` landmark;
- `Who are you paying?` heading;
- named recipient searchbox;
- Daniel recipient link.

### Passcode recovery

After opening the biometric fallback and submitting a wrong prototype passcode, evidence verifies:

- named dialog: `Use passcode instead`;
- named passcode textbox;
- alert role for the invalid-code feedback;
- the error text is present in the accessibility tree.

### Result

`PASS`

The first CI attempt assumed Chromium would place the live-error text directly in the alert node's accessible name. Chromium exposed the alert container and its error text as separate accessibility-tree nodes. The measurement was corrected to verify both the alert role and the error text independently.

This remains browser accessibility-tree evidence, **not spoken-output evidence from a real screen reader**.

Evidence artifact:

`p1-8-accessibility-tree.json`

---

# Tested with 5 simulated users — accessibility walkthrough

These are the same five synthetic Nova users used in the product walkthrough. The comments below are simulated customer reactions derived from the verified P1.8 scenarios. They are not real research participants.

## SU-01 — Mai, 23 — keyboard-only transfer

### What she tries

Mai completes the transfer path using only the keyboard: recipient → amount → reference → review → confirmation.

### Simulated comment

> “Mình không dùng chuột mà vẫn đi qua được từng chỗ, chọn Daniel, nhập tiền rồi tới bước xác nhận. Không bị mắc ở đoạn nào.”

### Result

`DONE_VERIFIED`

Backed by the keyboard-only browser regression and visible-focus evidence.

## SU-02 — Huy, 29 — enlarged content

### What he tries

Huy views the main money, activity, payment, card and savings screens with content enlarged to approximately 200% conditions.

### Simulated comment

> “Mình phóng nội dung lên lớn hơn mà vẫn đọc được, không phải kéo ngang cả trang để tìm nút hay thông tin.”

### Result

`DONE_VERIFIED`

Backed by 200%-zoom-equivalent reflow and separate 200% root-text stress checks on representative routes.

## SU-03 — Lan, 35 — knowing where keyboard focus is

### What she tries

Lan uses Tab through interactive controls and watches where the keyboard is currently positioned.

### Simulated comment

> “Mỗi lần bấm Tab mình thấy rõ đang đứng ở đâu, nên không bị kiểu bấm tiếp mà không biết nút nào sắp chạy.”

### Result

`DONE_VERIFIED`

Backed by the global visible-focus baseline and critical-flow focus evidence.

## SU-04 — Minh, 27 — understanding security recovery

### What he tries

Minh opens passcode recovery after biometric failure, enters a wrong code and checks whether the recovery step and error remain understandable to assistive technology.

### Simulated comment

> “Bước nhập mã có tên rõ, nhập sai thì có thông báo ngay trong bước đó. Mình vẫn biết mình đang ở phần xác nhận chứ không bị nhảy đi đâu.”

### Result

`DONE_VERIFIED`

Backed by Chromium Accessibility Tree roles/names and live-error semantics. This is **not** evidence of actual spoken output from NVDA, JAWS, VoiceOver or TalkBack.

## SU-05 — An, 21 — reduced motion

### What she tries

An enables reduced-motion preference and opens Nova.

### Simulated comment

> “Mình bật giảm chuyển động thì app đứng yên hơn, nhưng nội dung vẫn hiện đủ và mình vẫn dùng bình thường.”

### Result

`DONE_VERIFIED`

Backed by the Chromium reduced-motion emulation regression.

## Cross-user synthesis

| Pattern | Synthetic users | Evidence | Status |
|---|---|---|---|
| Critical transfer can be completed by keyboard | SU-01 | Keyboard regression | `VERIFIED` |
| Keyboard position remains visually identifiable | SU-01, SU-03 | Focus evidence + focus CSS baseline | `VERIFIED` |
| Representative routes tolerate enlarged layout/text without page-level horizontal overflow | SU-02 | 200% reflow + text stress | `VERIFIED` |
| Security recovery exposes useful roles/names/error semantics | SU-04 | Chromium Accessibility Tree | `VERIFIED` |
| Reduced-motion preference suppresses motion without removing content | SU-05 | Reduced-motion regression | `VERIFIED` |

## Portfolio-safe wording

Use:

> Nova's critical flows were accessibility-stress-tested with keyboard-only navigation, visible-focus checks, 200% zoom/text-scaling scenarios, reduced-motion emulation and Chromium accessibility-tree inspection. The results were then re-run through five simulated customer scenarios.

Also acceptable:

> Tested with 5 simulated users, supported by browser accessibility evidence.

Do not use:

- “WCAG compliant”;
- “screen-reader tested” without naming and actually using the assistive technology;
- “validated with 5 users”;
- “5 users completed the task” when the five users are synthetic.

## Remaining boundary

A future stronger accessibility round may include hands-on NVDA/JAWS/VoiceOver/TalkBack testing and additional manual checks across every route. That work is not required to truthfully close the current portfolio P1.8 scope.
