# SYN-P03 — Security-sensitive banking user

> **Synthetic / AI dogfood only.** This is not a human participant, not `DIRECT_USER`, and must not increment Round 01 `verified_sessions`.

## Profile used for roleplay
- Age model: 22
- Device context: mobile
- Banking behavior: checks notifications quickly; cautious about unfamiliar card payments; prefers reversible actions before permanent reporting.
- Main risk: freezing too late or misunderstanding whether a suspicious payment disappears.

## Task 1 — Money state
**Synthetic outcome:** success.

The safe-to-spend hierarchy is understandable enough for this task and does not create a security-specific blocker.

## Task 2 — Suspicious transaction and card protection
**Synthetic outcome:** success with content friction.

Observed surface:
- ByteMart is marked `Needs review`.
- Reasons are explicit: `New merchant` and `Higher than your usual online purchase`.
- The transaction remains visible as completed prototype data.
- Actions include `Freeze card` and `Report transaction`.

Roleplay observation:
- I understand why I should investigate and I can find a reversible protective action.
- The headline `Protect your card without pretending the payment disappears` feels like an explanation written for a portfolio reviewer, not a banking user.
- What I want is a direct consequence statement: freeze blocks new card payments while this transaction stays visible for review.

Severity: **P1 content/decision clarity**.

## Task 3 — Transfer review
**Synthetic outcome:** partial on mobile.

I value the projected money impact, but it appears below the confirm action in mobile reading order. Even though this profile is cautious, the product should not rely on caution to expose a safety-critical consequence.

## Task 4 — Biometric failure
**Synthetic outcome:** success.

Observed surface:
- `Use passcode` and `Try biometrics again` are obvious alternatives.
- `No transfer has been made` is the strongest reassurance in the flow.

Roleplay observation:
- This is a good reversible-recovery pattern.
- The green treatment of the no-money-moved message could read as success at a glance, but the text itself prevents a serious misread.

## Findings contributed
- S1 — transfer consequence sequencing on mobile.
- S4 — protective-action copy needs product language.
- S5 — recovery copy should remain concrete about what did/did not happen.

## Synthetic-only candidate utterance
> AI roleplay, not a participant quote: “Tell me what freezing does right now; don’t explain the design philosophy to me.”
