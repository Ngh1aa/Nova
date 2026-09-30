# Nova Synthetic Dogfood — Round 01 Synthesis

> **Evidence class:** `SYNTHETIC_USER / AI_DOGFOOD`  
> **Human validation state:** unchanged — `PLANNED_VALIDATION / RECRUITING / 0 verified sessions`  
> **Use:** find defects, prioritize iteration, and stress-test product logic before human fieldwork.  
> **Do not use as:** `DIRECT_USER`, human quotes, usability percentages, measured confidence uplift, conversion/adoption/retention, or business impact.

## Sessions

| Synthetic session | Primary behavior | Main contribution |
|---|---|---|
| SYN-P01 | cautious mobile banking | transfer consequence sequence, mobile overlap, money-model question |
| SYN-P02 | fast scanner / frequent transfer | confirms S1 risk for speed-first behavior |
| SYN-P03 | security-sensitive | suspicious-payment action wording and consequence clarity |
| SYN-P04 | impatient recovery | biometric fallback strength; generic error recovery weakness |
| SYN-P05 | savings planner | buffer/savings/emergency-fund mental model and terminology consistency |

## Severity scale

- **P0:** blocks a critical task or can directly cause a materially wrong financial decision in the prototype's intended model.
- **P1:** meaningfully increases misinterpretation, unsafe sequencing, or recovery friction in a core task.
- **P2:** consistency/polish issue with lower immediate task risk.

Synthetic severity is a prioritization hypothesis, not measured human severity.

## Findings

### S1 — P1, promote to P0 if human testing shows premature confirmation
**Mobile transfer confirmation appears before consequence comprehension.**

On the 390px transfer-review rendering, recipient/amount/review actions appear before `Projected safe to spend` / Money Horizon. The UI therefore allows the primary confirmation CTA to win the scan before Nova's core safety consequence is visible.

Affected task: transfer with impact review.

Iteration requirement:
- surface the after-transfer safe-to-spend consequence before the confirmation action on narrow layouts;
- preserve the existing desktop side-by-side hierarchy;
- do not change the financial calculation.

Retest condition:
- a narrow-layout synthetic walkthrough must encounter the consequence before the confirm CTA in reading order;
- later human Round 01 must test the same task without moderator prompting.

### S2 — P1
**Persistent mobile bottom navigation collides with task-critical content/actions.**

Rendered 390px evidence shows the bottom nav covering portions of transaction-detail and transfer-review content, including the action region.

Affected tasks: suspicious transaction, transfer review/recovery.

Iteration requirement:
- reserve sufficient bottom space on mobile for the fixed navigation;
- ensure interactive controls and meaningful content cannot sit beneath it;
- account for device safe-area inset where available.

### S3 — P1
**Savings Account / Emergency buffer / Protected buffer relationship is under-explained.**

Users are shown `Savings Account €500`, `Protected buffer €500`, and `Emergency buffer €2,480 of €4,000` across Home/Savings without one direct relationship statement.

Affected tasks: interpret safe-to-spend, understand Money Horizon, savings planning.

Iteration requirement:
- explicitly state whether the protected €500 is a reserved amount within a savings/emergency-fund balance or a distinct modeled reserve;
- use one stable label for the same concept across Home, Savings and Money Horizon;
- never invent a banking relationship not supported by Nova's current model.

### S4 — P1 content clarity
**Suspicious-payment protective-action headline reads like portfolio rationale.**

Current: `Protect your card without pretending the payment disappears`.

Iteration direction:
- use direct user language such as `Freeze your card while you review`;
- state the consequence: new card payments are blocked while the existing transaction remains visible for investigation.

Affected task: suspicious transaction and protection.

### S5 — P1/P2 recovery clarity
**Generic transfer error preserves truth but lacks a concrete re-check target.**

The error correctly says no money moved and avoids inventing a cause. However, `Something changed before confirmation` does not tell a user what to inspect next.

Iteration direction:
- keep the unknown-cause boundary;
- tell the user to re-check amount and updated money state before retrying;
- preserve `No money moved` prominently.

Affected task: recover from a failed transfer.

### S6 — P2 terminology consistency
**Cards uses `Available to spend €1,300` while Home uses `Safe to spend €1,300`.**

If this is the same calculated value, use one label. If it is a card-specific value, explain the distinction.

## Positive patterns to preserve

- Home makes `Safe to spend` visually dominant.
- Suspicious transaction provides reasons, merchant/location/card context, reversible freeze and reporting paths.
- Transfer amount/review preserves recipient, amount, reference and projected consequence.
- Biometric failure explicitly says **no transfer has been made** and provides two recovery actions.
- Activity provides visible risk marking plus search/filter structure.
- Error state avoids falsely claiming a known cause.

## Iteration order

1. **S1 + S2 first** — mobile task safety/hierarchy.
2. **S3** — core Money Horizon mental model.
3. **S4 + S5** — product/recovery copy.
4. **S6** — terminology consistency.

## Research boundary after synthetic Round 01

Even if every synthetic retest passes:
- `verified_sessions` remains `0`;
- Human Gate #24 stays open;
- Figma `DIRECT_USER` stays empty;
- portfolio language may say `AI/synthetic-user dogfood informed prototype iteration`, but must still say human usability validation is recruiting/not measured.
