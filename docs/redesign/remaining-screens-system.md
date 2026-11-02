# Apply the Home design system to remaining native screens

Use the existing Brownfield ownership map and approved Home direction. Owners remain tokens/components/screens, foundation nova.js, canonical renderer/state. No new stylesheet or UI framework.

Plan: Savings detail becomes form + allocation preview; subscriptions becomes summary + compact schedule; account/payment/report detail uses bounded single-panel width; Activity uses workspace width. KYC retains one named progress representation. Receipts, dialogs and lifecycle states consume shared padding/radius/type/metric tokens. Preserve all amounts, routes, form IDs, validations and demo safety statements.

Before: docs/redesign/system-10/after. After and route coverage: docs/redesign/system-11/after. Check 24 native routes, 8 states at390/1440 and pressure320. Validate savings recalculation, transfer review/recovery/receipt, subscription detail identity and KYC recovery.

## Coverage by screen family

| Family | Routes/states | Applied system contract |
| --- | --- | --- |
| Workspace | Home, Activity, Pay, Cards, Savings, Security, Settings | Existing Home palette,16px cards, bounded workspace widths, intrinsic supporting cards |
| Object detail | Current account, planned payment, transaction, card controls/frozen | Compact metrics,48px metadata rows, bounded single/detail panels, native controls |
| Transfer | Recipient, amount, review, receipt, biometric failure, offline |20px forms, task/context columns, shared48/44px action controls and recovery callouts |
| Savings | Emergency/Holiday/custom goal detail | Contribution form + mint allocation context; mobile stacks in reading order |
| Recurring | Subscriptions | Monthly summary + payment schedule; merchant-cancellation distinction retained |
| Identity | Onboarding; KYC intro/capture/failed/manual/review | Home typography/radii/padding; one named progress overview, existing recovery links |
| Lifecycle | Empty/loading/high-obligation/error | Shared card/control tokens and compact metric; no clipped negative amount |
| Overlay | Freeze, passcode, details/preferences dialogs | Shared24px radius,20px padding,17px heading, existing focus trap/validation preserved |

Rendered route inventory is the authoritative list of current native routes. Historical Figma capture and portfolio evidence pages are separate deliverables; no export or publication work is claimed.

## Flow-aligned fixes found during image review

KYC marks only earlier steps complete, exposes exactly one aria-current=step, and uses compact horizontal progress on phones. Capture/retry/review routes remain unchanged. Subscriptions belongs to Home in phone/tablet navigation and keeps its own desktop rail destination. Normal scheduled labels use neutral helper color; only an actual issue receives warning color. The high-obligation screen uses concise customer-facing explanation while preserving the negative amount, calculation inputs and demo/buffer boundary.

## Final verification
75native runtime tests passed;20post-review tests passed;3final geometry/flow tests passed.64captures cover24native routes and8states at390/1440 with no runtime errors or horizontal overflow. Visual checker0errors/2reviewed warnings for semantic card/callout radii and palette. Independent revision image review4.09/5, minimum3.8, zero hard failures; packet verification passed. Source syntax, diff whitespace, generator reproducibility and overlay checker passed (2generated-file advisories). No commit, push or deploy.
