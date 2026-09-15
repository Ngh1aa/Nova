# Ledger — Design Contract 2026

Skill lock: `Ngh1aa/uiux-ai-workspace@221370ef294408f3f5a0c6a7fb0567c3db840c3e`  
Branch: `feat/ledger-editorial-redesign`  
Project mode: `interactive_prototype`  
Responsive scope: `390 / 768 / 1024 / 1440`

## 1. Product thesis

> **Ledger helps digital-first account owners decide what money is genuinely safe to spend and act on financial exceptions by turning balances, commitments, savings and risk signals into one readable financial register.**

## 2. Owner / portfolio goal

The project must demonstrate senior-level product/UI craft in a high-trust consumer-finance context: product framing, IA, decision hierarchy, system states, error/recovery, responsive transformation, accessible interactions, coherent visual system and evidence-backed implementation/QA.

## 3. Primary users / JTBD

### Everyday account owner
“What can I safely spend now, after the things I already owe and the money I mean to protect?”

### Sender / planner
“Am I sending the correct amount to the correct person without weakening upcoming obligations?”

### Security-conscious owner
“Is this transaction mine, and what reversible protection should I apply right now?”

### Verification user
“What evidence is required, what went wrong, and how can I recover without restarting?”

## 4. Preserve / change

### Preserve
- Existing IA and functional route coverage.
- Safe-to-spend formula and disclosure.
- Money Horizon product concept.
- Hero unusual-transaction/freeze flow.
- Transfer, KYC, savings, subscriptions, card-control and security states.
- Simulated capability labels.

### Change
- Visible brand: `NOVA` -> `LEDGER`.
- Entire visual grammar from soft fintech UI to ruled accounting/editorial system.
- Desktop Home top composition to eliminate amount/action overlap.
- Shape system to square corners across UI.
- Elevation system to zero shadows.
- Status/filter/action treatment away from pills/cards toward rules, annotations and square controls.
- Evidence/design-system pages to match the product.

## 5. Art direction

### Name
**Modern Daybook**

### Three defining adjectives
**accountable / editorial / tactile**

### First-three-seconds test

> “This looks like a financial record I can trust and act on, not a generic fintech dashboard.”

## 6. Visual signature

### Ruled Money Ledger

If the logo is removed, Ledger should still be recognisable through:
- warm paper canvas;
- hairline rules that define sections and columns;
- large but bounded serif monetary figures;
- tabular/right-aligned values;
- compact uppercase sans labels;
- date gutters and statement-like entries;
- a Money Horizon rendered as a dated financial register rather than a floating card.

## 7. Shape / elevation contract

- `border-radius: 0` for layout surfaces, buttons, inputs, status labels, filters, dialogs, nav states and evidence cards.
- No decorative box shadows.
- Floating layers use border + stronger backdrop contrast, not shadow.
- Circles are permitted only when the semantic object is intrinsically circular (small status dot, timeline point, avatar), not as a default control shape.
- Physical debit card remains rectangular with square project styling; recognisable ratio is enough.

## 8. Color roles

- **Paper canvas:** `#F1EBDD`
- **Paper surface:** `#F8F3E7`
- **Ledger rule:** `#C8BFA9`
- **Strong rule:** `#1B211D`
- **Ink:** `#171B18`
- **Secondary ink:** `#4F514A`
- **Muted:** `#6E6B61`
- **Primary / forest ink:** `#1F5B45`
- **Safe annotation:** `#2F6F54`
- **Committed / ochre:** `#A66F25`
- **Protected / slate:** `#677276`
- **Risk / oxide:** `#923D30`
- **Focus:** `#145EA8`

Rules:
- Most surfaces stay paper/ink.
- Semantic color appears in thin rules, labels and limited fills.
- No gradient.
- No full-surface green dashboard wash.

## 9. Typography

### System stack
No render-blocking remote fonts.

- **Financial/display serif:** `Georgia, "Times New Roman", serif`.
- **UI sans:** `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- **Reference mono:** system monospace only for exact IDs.

### Rules
- Monetary values and major totals use serif + tabular numerals.
- Core body/forms/nav stay sans.
- Desktop safe-to-spend amount: bounded to ~72–96px depending viewport, never allowed to collide with adjacent content.
- Mobile decision amount remains visually dominant but must fit 390px without horizontal overflow.
- Dense financial rows use aligned values and stable line-height before decorative typography.

## 10. Layout grammar

### Base rhythm
- Section separation: 1px rules; major totals/headers: 2px rules.
- Main spacing steps: 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Content width remains constrained; desktop is a personal money workspace, not a 12-column admin dashboard.

### 390
- Single reading column.
- Bottom navigation retained.
- Safe amount, label and formula context occupy first viewport without action-card collision.
- Quick actions become full-width ruled entries.
- Complex ledger rows collapse deliberately, preserving amount/status.

### 768
- One main column with selected 2-column substructures.
- Context panels move below the decision surface rather than compressing the primary figure.

### 1024 / 1440
- Left ledger index rail.
- Main reading column.
- Optional right note/context rail.
- Home decision region never uses a side-by-side amount + action-card composition.
- Quick actions sit in a ruled register beneath the figure or at the top of the context rail.

## 11. Page-role composition matrix

| Role | Entry question | First anchor | Composition family | Decision object | Mobile transformation |
|---|---|---|---|---|---|
| Home | What can I safely spend? | Safe amount + date | Daybook Decision | Ruled Money Horizon | amount -> action register -> horizon -> attention |
| Activity | What changed? | Month + in/out/net | Statement Ledger | transaction register | date + merchant + amount; metadata wraps below |
| Transaction detail | Is this mine? | merchant + amount | Payment Dossier | evidence + protective action | amount and status stay adjacent to merchant |
| Cards | Is my card safe? | card state | Control Register | card + control ledger | card -> state -> controls |
| Transfer | Am I sending this correctly? | recipient/amount | Transaction Worksheet | review + impact | one task per step, impact immediately below |
| Savings | Am I on track? | goal total | Goal Ledger | contribution schedule | total -> timeline -> contribution register |
| Subscriptions | What is already committed? | monthly total | Recurring Ledger | merchant schedule | grouped ruled rows |
| Security | Is my account protected? | protection status | Security Checklist | settings register | single checklist column |
| Notifications | What needs action? | action-required group | Priority Daybook | events | groups stack vertically |
| KYC | What do you need? | progress + document | Verification Checklist | capture requirement | vertical progress + document sheet |
| Evidence pages | What design thinking exists? | system statement | Specimen Ledger | tokens/states/flows | single editorial column |

## 12. Composition families

### A — Daybook Decision
Home / Savings.

```text
DATE / CONTEXT RULE
PRIMARY SERIF TOTAL
semantic label + calculation context
RULED ACTION REGISTER
DATED HORIZON / GOAL FIELD
exception / next-event entries
supporting ledger sections
```

### B — Statement Ledger
Activity / Transaction detail / Subscriptions / Notifications.

```text
PERIOD / OBJECT HEADER
TOTAL / STATUS
TOOLS OR EVIDENCE
RULED REGISTER
CONTEXTUAL ACTION
```

### C — Transaction Worksheet
Transfer / KYC / Security / Card controls.

```text
TASK STATE / PROGRESS
ONE WORKING AREA
CONSEQUENCE / IMPACT REGISTER
PRIMARY COMMIT ACTION
RECOVERY
```

## 13. Home root-cause repair

The existing overlap happens because the large serif amount and two quick-action cards are allowed to share the same desktop grid row.

Ledger changes the ownership of that layout:

1. `decision-top` becomes a single-column decision block at all viewports.
2. Safe-to-spend figure is bounded with `clamp()` and `max-inline-size`.
3. Quick actions move into a separate `.decision-actions` ruled register below the amount.
4. At desktop, the right context rail is independent of the amount width.
5. No absolute positioning is used for the primary figure/actions.

Pass condition: zero overlap / clipping / horizontal overflow at 390, 768, 1024 and 1440, including browser zoom pressure.

## 14. Component language

### Buttons
- Square corners.
- Primary: ink fill / paper text.
- Secondary: transparent paper with 1px strong rule.
- Risk: oxide fill, used only for risk action.
- Hover = underline/rule shift or fill inversion, not lift/shadow.

### Inputs
- Square, 1px rule, paper surface.
- Focus uses explicit blue outline.
- Error/success uses text + border + message.

### Status labels
- Square annotation labels, compact uppercase.
- No pill silhouette.
- Text is mandatory; optional small square/dot marker.

### Filters
- Square text tabs with border-bottom or ruled box.
- Active state uses ink fill or strong bottom rule.

### Switches
- Rectangular toggle track with square thumb treatment; never glossy/iOS-like.

### Dialogs / sheets
- Square bordered sheet.
- No shadow.
- Top 2–3px rule communicates layer hierarchy.

## 15. Money Horizon — Ledger edition

Keep the same computation but render it as a financial register:

- top rule + title + 14-day range;
- dated timeline ticks;
- safe / committed / protected columns/segments;
- serif values in a ruled legend beneath;
- next commitment marker attached to a rule, not a tooltip bubble;
- textual formula disclosure remains visible.

Motion is restrained to width/position updates; reduced motion is instant.

## 16. Motion

- 120–180ms state feedback.
- 450–650ms Horizon recomposition.
- No `translateY` hover lift as a default visual device.
- No staggered reveal, parallax, confetti, glow or money counting.
- `prefers-reduced-motion` short-circuits non-essential transitions.

## 17. Accessibility / trust

- WCAG 2.2 AA target where applicable; no formal conformance claim without evidence.
- 44px minimum hit area.
- Visible focus states.
- Status never color-only.
- Financial visuals have text equivalents.
- High-risk actions explain consequence before commit.
- Freeze != reverse transaction.
- Merchant block != subscription cancellation.
- Offline/biometric failure never implies money moved.

## 18. System reality

All banking, transfer, KYC, biometric, notification and risk behavior is `SIMULATED` or `STATIC`.

Visible copy must preserve prototype disclosure.

## 19. Do / do not

### Do
- use warm paper and ink sparingly;
- use serif figures as the strongest numeric hierarchy;
- let rules and alignment group content;
- preserve different page-role compositions;
- use domain artifacts structurally, not theatrically;
- show consequence near financial actions.

### Do not
- round cards, inputs, buttons or dialogs;
- add shadows;
- make every section a bordered rectangle;
- use paper texture, handwriting or vintage decoration;
- create a luxury wealth-management look;
- oversize figures beyond their container;
- copy Monzo/Wise/Revolut visual branding.

## 20. Acceptance criteria

Before PR:

- [ ] Visible product identity is Ledger across app + evidence pages.
- [ ] No user-facing rounded-corner component language remains except intrinsically circular markers/avatars.
- [ ] No decorative box-shadow remains.
- [ ] Home safe amount never overlaps quick actions.
- [ ] Home, Activity, Transaction Detail, Cards, Transfer, Savings and KYC have distinct first-screen compositions.
- [ ] Money Horizon remains understandable at 390 / 768 / 1024 / 1440.
- [ ] Existing critical flows pass.
- [ ] 23-route automated browser/a11y evidence remains green.
- [ ] Lighthouse project thresholds remain unchanged.
- [ ] Representative screenshots are manually opened and inspected.
- [ ] P0/P1 layout/craft issues are repaired and re-QA'd.
- [ ] Release scope stops at PR unless the user explicitly authorizes merge.

## Pre-code gate

`PASSED`

The direction has product truth, reference synthesis, artifact-transfer rationale, visual signature, responsive rules, component language, composition families, trust constraints and explicit do/do-not boundaries.