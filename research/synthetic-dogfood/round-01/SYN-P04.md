# SYN-P04 — Impatient recovery user

> **Synthetic / AI dogfood only.** This is not a human participant, not `DIRECT_USER`, and must not increment Round 01 `verified_sessions`.

## Profile used for roleplay
- Age model: 26
- Device context: desktop and mobile
- Banking behavior: expects authentication to work fast; gets impatient when a transfer fails; wants one obvious recovery route.
- Main risk: retrying repeatedly without understanding whether money moved.

## Task 1 — Money state
**Synthetic outcome:** success.

No recovery-specific issue appears before transfer.

## Task 2 — Suspicious transaction
**Synthetic outcome:** success.

The reversible card-protection route is understandable, though the protective-action headline is wordier than necessary.

## Task 3 — Transfer review
**Synthetic outcome:** partial on mobile.

The projected safe-to-spend number is strong once visible, but the mobile sequence puts confirmation before the consequence block.

## Task 4A — Biometric failure
**Synthetic outcome:** success.

Roleplay observation:
- `Use passcode` is a clear fallback.
- `Try biometrics again` remains available.
- `No transfer has been made` removes the biggest uncertainty immediately.

This is a strong recovery pattern and should be preserved.

## Task 4B — Transfer revalidation error
**Synthetic outcome:** mixed.

Observed surface:
- heading: `Something changed before confirmation`;
- explanation: Nova could not revalidate the balance;
- actions: `Review again` and `Return home`;
- explicit statement: no money moved.

Roleplay observation:
- I know the transfer did not happen, which is good.
- I still do not know what I am expected to inspect when I choose `Review again`.
- The copy should not invent a cause, but it can name the concrete checks: amount, updated safe-to-spend/available money, and recipient/reference if relevant.

Severity: **P1/P2 recovery clarity**, not a transaction-integrity defect.

## Findings contributed
- S1 — consequence sequencing.
- S4 — over-explained protective-action copy.
- S5 — recovery state lacks a concrete re-check target.

## Synthetic-only candidate utterance
> AI roleplay, not a participant quote: “Good, I know no money moved. Now tell me what I’m supposed to re-check before I hit Review again.”
