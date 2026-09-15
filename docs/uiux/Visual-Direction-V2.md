# NOVA — Visual Direction V2

Skill lock: `221370ef294408f3f5a0c6a7fb0567c3db840c3e`

## Direction

**calm / assured / lucid / tactile-light / operational**

First three seconds:
> “I can see what is safe, what is coming, and where to act without feeling like I opened a trading app or a budgeting spreadsheet.”

## Visual signature

**Financial Runway** — the evolved Money Horizon.

If the NOVA logo disappears, the product should still be recognizable through a wide planning track that combines:
- safe-to-spend now;
- known commitments;
- protected buffer;
- dated near-future markers;
- a concise calculation disclosure.

This is a decision object, not a decorative chart.

## Layout grammar

### Mobile 390
- 18px horizontal content inset.
- Single reading lane.
- Home first viewport: greeting/context → safe-to-spend → 3 quick actions → Financial Runway → urgent review entry.
- Avoid wrapping each section in a surface.
- Bottom nav remains Home / Activity / Pay / Cards / Save.
- Flow CTAs become sticky only when a clear forward action is needed.

### Tablet 768
- Maintain mobile task order.
- Quick actions remain horizontal.
- Runway gets more room for labels and date markers.
- Detail/review screens may introduce 2-column facts when useful.

### Desktop 1024/1440
- 228–244px left navigation rail.
- Primary canvas max ~1120px.
- Home: open hero row, runway full width, then two-column operational lane; optional 300px context rail only when it adds a distinct decision aid.
- Do not turn whitespace into 4-up cards.
- Activity uses a broad feed with a narrow summary/filter rail.
- Transfer review uses primary review column + consequence/context column.

## Composition families

### Family A — Decision canvas
Roles: Home, Savings detail.
- First anchor: value + runway/progress decision object.
- Open background with sparse bounded surfaces.
- Primary CTA/action cluster near the value.

### Family B — Evidence/detail
Roles: Activity, transaction detail, notifications.
- First anchor: merchant/search/feed/status evidence.
- Dense but calm information hierarchy.
- Separators and grouping replace card grids.

### Family C — Task flow
Roles: transfer, KYC/onboarding, security controls.
- First anchor: current task/state.
- Narrower reading measure.
- Explicit progress, consequence and recovery.

### Family D — Object/control
Roles: Cards.
- First anchor: card object and state.
- Controls live beside/below it, not as promotional feature cards.

## Type

One family only: `Inter, ui-sans-serif, system-ui`.
- Display/value: 52–88px depending viewport; 650–720 weight; tabular numerals.
- H1: 32–52px / 680.
- H2: 20–28px / 680.
- Body: 16px mobile minimum, 1.5 line-height.
- Meta: 13–14px but must meet contrast.
- Mono only for transaction/reference IDs.

Reason: finance scanning and number stability matter more than an editorial pairing.

## Color roles

Working tokens; final values must be verified in rendered contrast checks.
- Canvas: `#F4F6F3`
- Surface: `#FFFFFF`
- Surface-subtle: `#EAEEEA`
- Ink: `#10211B`
- Ink-secondary: `#43544E`
- Muted: `#61716B`
- Line: `#D8E0DB`
- Primary: `#176B55`
- Primary-hover: `#10513F`
- Safe: `#2F8065`
- Safe-soft: `#DDEEE7`
- Commitment: `#B47B28`
- Commitment-soft: `#F4E8D3`
- Buffer: `#75847F`
- Buffer-soft: `#E5EAE8`
- Risk: `#B44D47`
- Risk-soft: `#F7E5E3`
- Focus: `#145FCC`

## Surface / border / radius language

- Base page has no shadow.
- True cards/objects: 16px radius.
- Controls: 10–12px.
- Status/chips may be pill.
- Dialog/sheet: 20px mobile, 16px desktop.
- Shadows only for floating layers/dialogs; ordinary content uses line + surface contrast.
- No glass/backdrop blur as visual identity. Sticky nav may use opaque/slightly translucent functional treatment only.

## Icon language

Use 20–22px inline SVG line icons, stroke ~1.8, rounded joins/caps.
High-risk actions always pair icon + text.
No decorative icon tiles unless the icon represents a real object/category in a list.

## Motion

- Runway widths/markers: 650–850ms cubic easing when user changes a commitment/buffer.
- Press/hover: 120–180ms.
- Sheets/dialogs: 180–240ms.
- No staggered page-load fade-up.
- No number rolling.
- `prefers-reduced-motion: reduce` makes layout/value state changes immediate.

## Page-role composition matrix

| Role | Entry question | First visual anchor | Top composition | Decision object | Primary action | Mobile transformation |
|---|---|---|---|---|---|---|
| Home | What is safe and what happens next? | Safe-to-spend | value + quick actions + runway | Financial Runway | Send / risk review | all critical items remain in first scroll sequence |
| Activity | What changed? | Search + current period | search/filter + chronological feed | Transaction row | Open transaction | filters horizontally scroll; feed remains primary |
| Transaction detail | Is this mine? | Merchant + amount + status | evidence stack + risk explanation | Payment facts | Freeze / recognize | actions become full-width consequence-aware buttons |
| Cards | Is my card safe? | Physical card object + state | card + controls | Card state/control list | Freeze/unfreeze | object first, controls below |
| Transfer | Am I sending correctly? | Recipient/amount | progressive task shell | Review summary + safe-to-spend delta | Confirm & send | single task lane, sticky confirm where needed |
| Savings | Am I on track? | Goal amount/progress | progress + contribution + runway effect | Goal progress | Adjust contribution | contribution impact shown immediately below |
| KYC | What do you need? | Current verification step | task guidance + capture frame | ID/selfie capture | Continue/retry | full-height one-task composition |
| Security | What can I protect? | Security status | grouped control rows | Security control | Change control | open list, no card grid |

## Do
- Make the first screen decision-oriented.
- Let separators/alignment create structure.
- Keep visible total-balance context but subordinate it to safe-to-spend.
- Keep risk language factual and reversible actions explicit.
- Make data visualizations answer a question.
- Use asymmetric desktop composition where it helps scan order.

## Do not
- Use a generic KPI dashboard.
- Put every section inside a rounded card.
- Add decorative donut/ring analytics.
- Apply luxury serif/cream treatment from the supplied CSS patch as a skin.
- Copy Monzo/Revolut/Apple visual identity.
- Hide prototype/system reality.

## Representative pre-code proofs

### Home
`Safe to spend + actions` → `14-day Financial Runway` → `risk entry` → `coming up + goal` → `unified activity`.

### Transaction detail
`status / merchant / amount` → `why this needs review` → `facts` → `recognize vs freeze` → `freeze consequence`.

### Transfer review
`recipient + amount` → `fee/ETA/source` → `after-transfer safe-to-spend` → `Financial Runway delta` → `authenticate & send`.

### KYC failure
`step progress` → `specific capture problem` → `how to fix` → `retry` → `alternate verification/manual review`.

Pre-code visual gate: PASSED for representative composition definition; rendered proof is DUE in implementation gate.
