# Nova — iOS 26 Financial Workspace Design Contract

Status: active source of truth for the 2026 visual reset.

## Product thesis

Nova helps digital-first young adults understand what is safe to spend after known commitments, preserve a protected buffer, handle unusual payments, move money and manage savings with clear consequences.

System reality remains simulated. The redesign must never imply real banking, real fraud detection, real KYC or real payment movement.

## Why this contract exists

The previous warm-ledger / editorial direction became visually dominant enough to make the product feel old and narrow at desktop widths. The user explicitly rejected that result and requested a full redesign with an iOS visual language. Per the UIUX Factory operating contract, this is an art-direction reset, not a local CSS patch.

## Art direction

**Native · Calm · Precise · Fluid · Premium**

First-three-seconds test:

> “This feels like a modern personal finance product built with Apple-platform discipline, not a themed banking dashboard.”

## Reference behavior

Adopt current Apple-platform principles rather than imitating screenshots literally:

- Content remains the visual focus.
- Liquid Glass is reserved for functional chrome such as navigation and the floating tab bar.
- Navigation is predictable and uses standard icon placement.
- Root screens use large titles that collapse as content scrolls.
- Controls use grouped surfaces, system spacing and clear hierarchy.
- Color is restrained and semantic.
- Desktop layouts adapt like a spacious responsive financial workspace instead of stretching an iPhone column across a monitor.

## Visual system

### Canvas
- Cool neutral system background: `#F5F5F7`.
- Primary content surfaces: white.
- Avoid beige, cream, ochre and paper metaphors as default UI surfaces.
- No paper texture, red ledger rules or vintage editorial decoration.

### Type
- System stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif`.
- All money values use tabular numerals.
- No serif typography in primary product UI.
- Root title: 32–42px depending on viewport.
- Section title: 20–24px.
- Core body: 14–17px.

### Color roles
- Ink: `#1C1C1E`.
- Secondary: `#636366`.
- Tertiary: `#8E8E93`.
- Separator: `rgba(60,60,67,.16)`.
- iOS action blue: `#007AFF`.
- Success/saving: `#30A46C` / system green where appropriate.
- Warning/commitment: `#FF9F0A`.
- Destructive/risk: `#FF3B30`.
- Status never relies on color alone.

### Shape and depth
- Grouped content surfaces: 16–30px radius depending on scale.
- Main content cards use subtle depth only where useful.
- Modal and navigation glass may use stronger blur/elevation.
- Avoid “soft card everywhere” composition; whitespace and hierarchy remain primary.

## Signature moments

### 1. Safe-to-spend hero
A dark, premium content card anchors Home. It contains:
- Safe-to-spend amount.
- Plain-language explanation.
- Total balance / protected buffer / freshness.
- Two immediate actions: Send money and Add to savings.

The hero is content, not Liquid Glass.

### 2. Money Horizon
A blue 14-day forecast visualization replaces the ledger metaphor as the portfolio signature.
- Forecast line + area.
- Event points.
- Protected buffer reference.
- Four compact upcoming-event summaries.
- Transparent explanation of how the estimate is calculated.

### 3. Floating tab bar
Home / Activity / Pay / Cards / Save.
- Fixed above the safe area.
- Centered and width-constrained on large screens.
- Nearly edge-to-edge on small phones.
- Liquid Glass treatment with a clear selected state.
- Never clips labels/icons.

## Responsive composition

### 1440 / 1024
- Content max width about 1180px.
- Home uses two columns: decision content + compact upcoming-impact rail.
- Cards uses card object + controls side by side.
- Transaction detail uses primary evidence + secondary explanation rail.
- Activity uses a wide grouped transaction surface.
- Bottom navigation remains a compact floating dock centered in the viewport.

### 768
- Major two-column layouts collapse to one column.
- Content width remains generous; no desktop rail.
- Tab bar remains floating.

### 390
- Single-column layout.
- 12px edge inset for primary content.
- Safe-to-spend amount stays inside viewport.
- Tab bar fits inside `100vw - 18px`.
- Horizontal scroll is allowed only for deliberately scrollable compact event groups, never for the page document.

## Screen contracts

### Home
Order:
1. Large navigation title.
2. Safe-to-spend hero.
3. Money Horizon.
4. Unusual-payment attention row.
5. Upcoming commitments.
6. Emergency buffer.
7. Recent activity.
8. Desktop-only/desktop-secondary upcoming-impact rail.

### Activity
- 3-part cashflow summary.
- Search field.
- iOS-style segmented filtering.
- Grouped transaction list.
- Risk row uses tint + text label.

### Cards
- Nova debit card is the visual anchor.
- Card remains recognizable at a physical-card ratio.
- Card status sits directly beneath it.
- Quick controls use grouped rows.
- Switches use 51×31 iOS proportions.
- Freeze is a destructive text action, not an oversized red button.

### Transfer
- Focused task canvas.
- One decision per screen.
- Large amount and clear remaining-safe-to-spend consequence.
- Review screen exposes recipient, amount, fee, timing and impact before confirmation.

### Savings
- Goal amount and progress are primary.
- Upcoming contribution is tied back to Money Horizon.
- No ledger styling.

### Transaction detail / Security / KYC / Notifications
- Grouped content surfaces.
- Direct plain language.
- Back navigation in the glass navigation layer.
- Risk/destructive actions stay explicit and reversible where the product model allows.

## Motion
- Navigation title collapse: ~220ms.
- Tab press scale: ~180ms.
- Switch state: ~200ms.
- Forecast draw/entry motion may use ~400–700ms when subtle.
- `prefers-reduced-motion` reduces all nonessential motion to effectively instant.

## Accessibility
- WCAG 2.2 AA as practical baseline.
- Visible focus.
- Minimum 44×44 interactive targets for navigation/action controls.
- Text contrast verified on actual rendered surfaces.
- Labels preserved for switches/search/icons.
- No status communicated by color alone.

## Anti-template rules

Reject:
- beige or paper-first banking themes;
- faux ledgers / red accounting margins;
- serif money typography in the product UI;
- narrow 760px desktop columns surrounded by empty space;
- full-width desktop tab bars;
- generic SaaS sidebars;
- nested glass cards;
- gradients used as decoration without hierarchy purpose;
- oversized pills everywhere;
- dashboard grids made only from interchangeable cards.

## Verification

Representative routes:
- Home
- Activity
- Transaction detail
- Cards
- Transfer review
- Savings
- KYC failure/recovery

Required viewports:
- 1440
- 1024
- 768
- 390

Pass requires:
- no document-level horizontal overflow;
- floating tab bar visible and unclipped;
- responsive layout transformation matches this contract;
- core protection and transfer flows work;
- automated accessibility baseline passes;
- screenshots are opened and visually reviewed after the latest material change;
- material visual regressions are repaired before merge.
