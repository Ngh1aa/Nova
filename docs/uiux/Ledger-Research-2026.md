# Ledger — Research-led Redesign Benchmark 2026

Research date: 2026-09-15  
Skill lock: `Ngh1aa/uiux-ai-workspace@221370ef294408f3f5a0c6a7fb0567c3db840c3e`  
Target repository: `Ngh1aa/Nova`  
Project mode: `interactive_prototype`  
Responsive scope: `390 / 768 / 1024 / 1440`

## Decision problem

The existing product logic is strong enough to preserve, but the rendered UI still reads as a generic clean-fintech dashboard and the desktop Home composition can let the safe-to-spend amount collide with quick actions. The redesign must fix the root layout issue and produce a recognizable visual language that remains trustworthy in a high-consequence money context.

The user-directed concept is **Ledger**: warm paper, serif financial figures, square corners, no shadows, and sections separated by ruled lines like a real financial ledger.

## Preserve

- Safe-to-spend before raw account balance.
- Money Horizon planning model.
- Home -> unusual transaction -> transaction detail -> freeze -> recovery.
- Recipient -> amount -> review -> authentication -> transfer receipt.
- KYC quality-failure and alternate verification paths.
- Savings, subscriptions, cards, security and notification states.
- Simulated-system disclosure and calm, non-alarmist risk language.
- Keyboard/focus, reduced motion and 44px interaction targets.

## Change

- Rename the visible product identity to **Ledger**.
- Replace rounded containers/pills/shadows with square ruled structure.
- Replace oversized desktop amount typography with bounded editorial hierarchy that cannot overlap adjacent actions.
- Replace quick-action cards with a ruled action register.
- Recompose Home, Activity, Transaction Detail, Cards, Transfer, Savings, KYC and evidence pages around ledger-specific roles.
- Make numeric columns feel accounting-native through serif figures + tabular numerals + right alignment.
- Treat color as annotation/state, not container decoration.

## Current product/category evidence

### Monzo — left-to-spend planning

`VERIFIED` from official help material: Trends Balance estimates money left to spend using upcoming payments; Trends Target subtracts scheduled payments/included categories from balance. This supports keeping Ledger's safe-to-spend decision and near-term commitments in the same primary view.

Sources:
- https://monzo.com/help/budgeting-overdrafts-savings/web-the-differences-between-Summary-and-Trends
- https://monzo.com/help/budgeting-overdrafts-savings/trends-left-to-spend-web
- https://monzo.com/help/budgeting-overdrafts-savings/trends-spending-and-balance-web

### YNAB — scheduled transactions + targets

`VERIFIED` from current official help: scheduled transactions are visible while planning and can show the amount remaining after upcoming expenses; targets keep future needs visible and make underfunding explicit. Ledger should therefore keep upcoming obligations and goal contributions legible without hiding them inside analytics.

Sources:
- https://support.ynab.com/scheduled-transactions-a-guide-BygrAIFA9
- https://support.ynab.com/en_us/getting-started-with-targets-ryAEP08xC

### Actual Budget — register / schedules / local control

`VERIFIED` from official docs: schedules are a proactive planning tool for bills, subscriptions and recurring income; the product emphasizes user control and a fast uncluttered interface. This supports statement/register structure and explicit future events rather than decorative KPI cards.

Sources:
- https://actualbudget.org/docs/schedules/
- https://actualbudget.org/
- https://actualbudget.org/docs/vision/

### Wise — review before money movement

`VERIFIED` from official help: send flow keeps recipient/amount, fees and delivery information visible before commit; scheduled transfers have explicit timing. Ledger keeps recipient identity and transfer impact visible through review.

Sources:
- https://wise.com/help/articles/2977959/how-do-i-send-money-with-wise
- https://wise.com/help/articles/2978063/what-are-scheduled-transfers/mysql.tar.gz

### Revolut — subscription/payment blocking distinction

`VERIFIED` from official help: blocking a merchant/subscription payment does not cancel the underlying merchant subscription. Ledger must preserve this consequence copy and avoid implying cancellation.

Source:
- https://help.revolut.com/help/card-payments-withdrawals/subscriptions/

## Domain-artifact inventory

| Artifact | User familiarity | Task relevance | Transfer | Fidelity | Decision |
|---|---:|---:|---|---|---|
| General ledger / account register | High | Very high | structural + information | L2 | ADOPT |
| Bank statement | High | Very high | structural | L2 | ADOPT |
| Daybook / journal | Medium | High | section rhythm + date gutter | L1-L2 | ADAPT |
| Monthly planner | High | High | event sequence / due dates | L1-L2 | ADAPT |
| Receipt/payment slip | High | High | detail anatomy | L2 | ADAPT |
| Cheque register | Medium | Medium | running balance alignment | L1 | ADAPT selectively |
| Physical debit card | High | High on Cards only | direct form | L3 | ADOPT only on Cards |
| Paper texture / handwriting / stamps | Variable | Low | decorative | L3-L4 | REJECT |

## Artifact synthesis

### General ledger / statement

Keep:
- ruled rows and columns;
- date gutter;
- aligned debit/credit amounts;
- period headers;
- right-aligned numeric values;
- strong top/bottom rules for totals;
- annotation-like status labels.

Reject:
- fake aging, paper stains, handwriting, rubber stamps;
- tiny accounting type that hurts readability;
- literal double-entry bookkeeping where the product model does not support it.

### Planner

Keep:
- due-date sequence;
- visual anticipation of near-term commitments;
- compact date markers.

Reject:
- universal calendar-grid UI;
- decorative diary motifs.

### Receipt/payment slip

Keep:
- merchant / amount / status / reference hierarchy;
- concise evidence before action.

Reject:
- perforation, receipt-paper silhouette, thermal-printer styling.

## Opportunity statement

**Ledger can feel materially more ownable than a generic banking dashboard by behaving like a modern financial register: one primary decision, ruled evidence, aligned figures and explicit future commitments — without importing the friction or nostalgia of literal paper accounting.**

## Visual attributes

1. **Accountable** — values align, totals reconcile visually, consequences sit near actions.
2. **Editorial** — typography and rules create hierarchy instead of card chrome.
3. **Tactile** — warm paper and ink roles, but no fake texture.
4. **Measured** — restrained state color and motion.
5. **Readable** — financial figures scan at a glance across desktop and mobile.

## Anti-template / anti-skeuomorphism rules

Do not use:
- rounded cards or pill-first component language;
- drop shadows;
- glass, blur-as-decoration or glow;
- giant amount text that competes with actions;
- dashboard KPI card grids;
- faux paper grain, handwriting, stamps or perforations;
- odometer money animation;
- serif for dense helper text/forms;
- color-only status semantics.

## Research limits

- No production analytics or real user interview evidence exists for this prototype.
- Competitor documentation validates capability/mental models, not usability superiority.
- Ledger banking/KYC/biometric/risk/payment behavior remains simulated.

## Research gate

`PASSED_FOR_LEDGER_DESIGN_CONTRACT`

The benchmark covers product truth, domain artifacts, reference roles, do-not-copy boundaries, responsive scope and high-trust system-reality constraints.