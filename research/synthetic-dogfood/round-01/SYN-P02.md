# SYN-P02 — Fast scanner / frequent transfer user

> **Synthetic / AI dogfood only.** This is not a human participant, not `DIRECT_USER`, and must not increment Round 01 `verified_sessions`.

## Profile used for roleplay
- Age model: 28
- Device context: mobile first, occasional desktop
- Banking behavior: transfers often; scans headings, numbers and primary actions; rarely reads explanatory copy unless blocked.
- Main risk: acting on the first obvious CTA before reading secondary context.

## Task 1 — Decide what is safe to spend
**Synthetic outcome:** success on headline value; mixed on composition.

Roleplay observation:
- `€1,300.00` + `Safe to spend` is scannable.
- `Total balance €2,840`, `Protected buffer €500`, `Savings Account €500`, and the later Savings page's `Emergency buffer` introduce overlapping money concepts.
- I would likely assume the two €500 values are identical, but Nova never tells me that relationship directly on Home.

## Task 2 — Find suspicious activity
**Synthetic outcome:** success.

Roleplay observation:
- Activity makes ByteMart visually stand out and gives an explicit `Review` signal.
- Search/filter controls are easy to understand from their labels.

## Task 3 — Transfer quickly
**Synthetic outcome:** **failure of intended review sequence**.

Roleplay behavior:
- I scan recipient → amount → confirm CTA.
- On mobile, the after-transfer Money Horizon sits below the confirmation controls, so I can reach the irreversible-looking action before seeing the projected safe-to-spend consequence.
- The persistent bottom nav competes with the confirmation region and further weakens the hierarchy.

Severity: **P0/P1 candidate**. This profile is exactly the type likely to bypass explanatory content.

## Task 4 — Recover from failure
**Synthetic outcome:** partial.

Roleplay observation:
- `No transfer has been made` is excellent reassurance.
- `Something changed before confirmation` is too generic for a scanner; I want a concrete next check such as `Review amount and updated available money`.

## Findings contributed
- S1 — impact after confirm CTA on mobile.
- S2 — bottom-nav collision.
- S3 — overlapping savings/buffer terminology.
- S5 — generic recovery language.

## Synthetic-only candidate utterance
> AI roleplay, not a participant quote: “If I’m moving fast, I’m going to hit Confirm before I ever reach the €1,155 consequence.”
