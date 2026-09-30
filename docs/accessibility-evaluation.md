# Nova — Targeted accessibility evaluation

## Evaluation status

`TARGETED_CRITICAL-FLOW_REVIEW / NOT_A_CONFORMANCE_CLAIM`

Date prepared: 2026-10-01  
Target: WCAG 2.2 Level AA input-assistance behavior for consequential financial actions  
Primary criteria: 3.3.1 Error Identification, 3.3.3 Error Suggestion, 3.3.4 Error Prevention (Legal, Financial, Data)  
Scope: Nova transfer amount → review → confirmation/failure/recovery, plus related sensitive-action recovery states.

This is a **source + interaction-design review**. It is not a complete WCAG-EM evaluation and does not justify wording such as `WCAG conformant` or `fully accessible`.

## Why this scope matters

WCAG 2.2 Guideline 3.3 aims to help users avoid and correct mistakes. SC 3.3.4 applies to web pages that cause legal commitments or financial transactions, modify/delete user-controllable stored data, or submit test responses; at least one of reversibility, checked input/correction, or review/confirm/correct must be available.

Nova is a simulated portfolio prototype, so no real financial transaction occurs. The evaluation therefore checks whether the **designed critical flow** follows the safety pattern expected for a financial action; it does not make a production-banking conformance claim.

## Representative critical process

1. Enter transfer amount.
2. Trigger invalid or unaffordable input.
3. Understand/correct the error.
4. Review recipient, amount, fee and financial impact.
5. Edit before confirmation if needed.
6. Confirm through simulated biometric control.
7. Inspect failed biometric/revalidation state.
8. Determine whether money moved and choose a safe recovery action.

## Source evidence reviewed

Current canonical runtime includes:
- amount input with a visible label, `min`, `step`, and `aria-describedby="amount-help amount-error"`;
- textual `amount-error` container;
- submit handling that sets `aria-invalid="true"`, writes a specific text error, reveals it and focuses the amount field;
- distinct errors for non-positive amount and balance exceeded;
- transfer review with recipient, amount, fee, impact calculation, expected arrival/reference and an `Edit transfer` action;
- explicit pre-confirmation copy: nothing moves until confirmation;
- failed biometric copy stating transfer was not submitted, no money moved and balance is unchanged;
- revalidation error copy stating no money moved and the transfer was not submitted;
- recovery actions rather than silent retry.

## Criterion review

### SC 3.3.1 — Error Identification (Level A)

**Current source status:** `SUPPORTED_IN_SOURCE / MANUAL_AT_VERIFICATION_REQUIRED`

Positive evidence:
- invalid amount is identified in text, not only with color;
- the relevant input receives `aria-invalid="true"`;
- the error is associated through `aria-describedby`;
- focus is returned/kept on the amount input after detection.

Open risk `A11Y-01`:
- `#amount-error` is dynamically populated but has no explicit `role="alert"`, `aria-live`, or persistent programmatic error-message relationship such as `aria-errormessage`.
- Re-focusing an already focused input may not reliably announce a newly inserted description across all browser/screen-reader combinations.

**Required verification before stronger claim:** keyboard + at least one relevant screen-reader/browser combination on the frozen Phase 3 build.

### SC 3.3.3 — Error Suggestion (Level AA)

**Current source status:** `SUPPORTED_IN_SOURCE`

Positive evidence:
- empty/non-positive amount: `Enter an amount greater than €0.`
- amount above balance: reports how much more would be needed to send that amount.

These messages identify a corrective direction rather than returning only a generic failure.

Open checks:
- verify the suggestion remains perceivable at zoom/reflow states;
- verify screen-reader announcement behavior together with SC 3.3.1;
- verify participants understand what to do without moderator coaching in Round 03 T-04.

### SC 3.3.4 — Error Prevention (Legal, Financial, Data) (Level AA)

**Current design-pattern status:** `REVIEW_CONFIRM_CORRECT_PATTERN_PRESENT / SIMULATED_FLOW`

Positive evidence:
- transfer is not finalized from the amount-entry screen;
- a separate review step exposes recipient, amount, fee and impact;
- the user can choose `Edit transfer` before confirmation;
- confirmation requires an explicit subsequent action;
- failed verification/revalidation states say that no money moved and provide recovery choices.

This aligns with the `Confirmed` option described by SC 3.3.4: a mechanism is available for reviewing, confirming and correcting information before finalizing the submission.

Boundary:
- Nova does not execute a real financial transaction; production back-end idempotency, reversal, duplicate-submission protection and server-side validation are not evaluated.

## Related sensitive action — card freeze

The prototype warns about consequences before Freeze/Unfreeze and provides a reversible state. This is useful safety behavior, but it is outside the narrow Round 03 F-02/F-03/F-04 measurement target and should not be generalized into a site-wide conformance claim.

## Phase 3 manual/AT checklist

Before closing the accessibility part of Phase 3:
- [ ] Tab/Shift+Tab through amount entry, review, edit and recovery controls.
- [ ] Trigger zero/negative/empty amount error by keyboard.
- [ ] Trigger amount-above-balance error by keyboard.
- [ ] Verify visible focus remains clear after error.
- [ ] Verify the error text is announced or otherwise programmatically discoverable with a screen reader.
- [ ] Verify the error suggestion is announced together with the affected field/context.
- [ ] Verify review data can be read in a logical order.
- [ ] Verify `Edit transfer` is reachable before confirm.
- [ ] Verify failed biometric/revalidation state communicates `no money moved` without relying on color/icon alone.
- [ ] Verify recovery actions have meaningful accessible names.
- [ ] Verify 200% zoom/reflow does not hide error/review/recovery content.
- [ ] Record browser/AT/version and exact build SHA.

## Remediation backlog

### A11Y-01 — Dynamic amount error announcement
Priority: `P1 before any conformance claim`

Candidate repair, subject to AT verification:
- make the error container a reliably announced error region (`role="alert"` or an equivalent tested pattern), and/or use `aria-errormessage` while preserving visible text;
- ensure the relationship only points to the active error when appropriate;
- retest with keyboard and screen reader.

Do not implement a pattern solely because it is common; verify it in the actual Nova runtime.

### A11Y-02 — Failed-state announcement on route transition
Priority: `P1 verification`

Verify that the page/heading/failure explanation is announced when navigating into biometric/revalidation failure. If route focus is not reliably managed, repair focus ownership at the canonical runtime layer and retest.

## Research handoff

Round 03 T-04 captures human evidence for whether error and review safety are understandable. Moderated participant evidence complements, but does not replace, technical accessibility evaluation.

## References

- W3C WCAG 2.2 — Input Assistance: https://www.w3.org/WAI/WCAG22/Understanding/input-assistance.html
- W3C SC 3.3.1 — Error Identification: https://www.w3.org/WAI/WCAG22/Understanding/error-identification
- W3C SC 3.3.3 — Error Suggestion: https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html
- W3C SC 3.3.4 — Error Prevention (Legal, Financial, Data): https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html

## Current conclusion

Nova already contains several strong error-prevention patterns in source: descriptive errors, correction guidance, a separate review/edit step, explicit confirmation and explicit no-money-moved recovery language. The remaining gap is not permission to declare accessibility success; it is **manual/assistive-technology verification plus Round 03 observed behavior**.