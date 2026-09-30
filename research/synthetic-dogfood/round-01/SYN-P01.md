# SYN-P01 — Cautious mobile banking user

> **Synthetic / AI dogfood only.** This is not a human participant, not `DIRECT_USER`, and must not increment Round 01 `verified_sessions`.

## Profile used for roleplay
- Age model: 24
- Device context: mobile / 390px
- Banking behavior: checks balance daily; cautious before transfers; wants to know what remains safe after bills.
- Main risk: confirming a transfer before understanding downstream impact.

## Evidence basis
Walkthrough used rendered/browser-backed QA evidence from the pinned Nova baseline, including Home mobile, transfer review mobile, transaction detail mobile, biometric-failure and error states. Implementation source was not consulted while interpreting the tasks.

## Task 1 — Decide what is safe to spend
**Synthetic outcome:** success with one mental-model question.

Observed surface:
- Home makes `€1,300.00` visually dominant and labels it `Safe to spend`.
- Total balance (`€2,840`) and protected buffer (`€500`) are visible nearby.

Roleplay observation:
- I can identify €1,300 quickly as the intended answer.
- I am not yet sure whether the separate `Savings Account €500` shown lower on Home is the same €500 as the protected buffer or a different pot.

Implication: core number hierarchy works, but buffer/account relationship needs explicit language.

## Task 2 — Investigate a suspicious transaction
**Synthetic outcome:** success.

Observed surface:
- ByteMart Online is visibly marked `Needs review` / `Review`.
- Transaction detail shows merchant, amount, card, location, category, reference and two reasons for surfacing the payment.
- Protective actions include `Freeze card` and `Report transaction`.

Roleplay observation:
- I understand why the payment was surfaced.
- The protective-action headline sounds like design rationale rather than product language: `Protect your card without pretending the payment disappears`.

Implication: action and evidence are good; headline should become shorter and more user-directed.

## Task 3 — Send money and understand the impact before confirming
**Synthetic outcome:** **partial / safety concern**.

Observed surface at 390px:
- Review details are readable.
- `Confirm with biometrics` appears before the `Projected safe to spend €1,155.00` section in vertical reading order.
- Persistent bottom navigation visually overlaps the primary action area in rendered mobile evidence.

Synthetic behavior:
- As a cautious user I would scroll enough to discover the impact, but the interface does not force or naturally sequence that review before confirmation.
- A faster user could confirm without seeing the exact consequence that differentiates Nova from a standard transfer flow.

Severity: **P0/P1 candidate** because this can undermine the product's core financial-safety proposition.

## Task 4 — Recover from authentication / transfer failure
**Synthetic outcome:** success for biometric fallback; mixed for generic transfer error.

Observed surface:
- Biometric failure gives `Use passcode` and `Try biometrics again`.
- A strong statement says `No transfer has been made.`
- Generic error says `Something changed before confirmation` and asks the user to review the amount and try again.

Roleplay observation:
- I feel safe in the biometric fallback because money-movement status is explicit.
- In the generic error state I do not know what changed or which value I should inspect first.

## Findings contributed
- S1 — mobile impact appears after confirmation CTA.
- S2 — mobile bottom navigation collides with task-critical content/actions.
- S3 — savings/buffer relationship needs clarification.
- S4 — suspicious-payment action headline sounds like case-study rationale.
- S5 — generic transfer recovery lacks a concrete re-check target.

## Synthetic-only candidate utterance
> AI roleplay, not a participant quote: “I can see €1,300 is what Nova wants me to treat as safe, but before I send money I want the after-transfer number next to the confirm action, not below it.”
