# SYN-P05 — Savings planner / goals-focused user

> **Synthetic / AI dogfood only.** This is not a human participant, not `DIRECT_USER`, and must not increment Round 01 `verified_sessions`.

## Profile used for roleplay
- Age model: 21
- Device context: desktop first, mobile follow-up
- Banking behavior: actively saves toward goals; wants to understand which money is reserved, invested, or still spendable.
- Main risk: assuming the same money is counted twice or misunderstanding what the protected buffer represents.

## Task 1 — Understand current money state
**Synthetic outcome:** mixed.

Observed across Home/Savings:
- Home: `Safe to spend €1,300`.
- Home: `Protected buffer €500`.
- Home Accounts: `Savings Account €500`.
- Savings: primary goal `Emergency buffer €2,480 of €4,000`.
- Savings: copy says the protected buffer remains separate from safe-to-spend.
- Money Horizon: `Buffer €500`.

Roleplay observation:
- I understand that €1,300 is excluded from the protected amount.
- I cannot confidently tell whether the €500 protected buffer is the Savings Account balance, a reserved slice of the €2,480 Emergency buffer, or another money bucket.
- The repeated values make one interpretation feel likely, but product copy should not require inference for a financial concept.

Severity: **P1 mental-model clarity** because Money Horizon depends on this distinction.

## Task 2 — Suspicious transaction
**Synthetic outcome:** success.

No savings-specific blocker.

## Task 3 — Transfer consequence
**Synthetic outcome:** partial.

The Money Horizon consequence is conceptually useful, but because I am already unsure what `Protected buffer` represents, the projected safe-to-spend calculation feels less auditable than it should.

## Task 4 — Recovery
**Synthetic outcome:** success for no-money-moved truth.

No savings-specific recovery blocker.

## Additional card-page consistency check
The Cards page shows `Available to spend €1,300` while Home calls the same displayed value `Safe to spend €1,300`.

Roleplay observation:
- I would wonder whether `Available to spend` is a card limit, an account available balance, or the same safety calculation from Money Horizon.

Severity: **P2 terminology consistency**, potentially P1 if a real-user session shows misinterpretation.

## Findings contributed
- S3 — Savings Account / Emergency buffer / Protected buffer relationship is unclear.
- S6 — `Available to spend` vs `Safe to spend` uses two labels for an apparently matching value.

## Synthetic-only candidate utterance
> AI roleplay, not a participant quote: “Is the €500 buffer inside my €2,480 emergency fund, or is Nova reserving another €500 somewhere else?”
