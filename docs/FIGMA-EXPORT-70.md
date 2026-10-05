# Nova HTML to Figma export

Audited source: `a9d1a53da61b38db423250d6d02629ca593932b2`. Inventory follows the agreed 70-screen list from chat `6ac344e5-67f8-83ec-ac9a-c0d08065b7c2`.

## Audit

- 28 entries reuse existing native URLs/screens (some are regions of a shared screen, not distinct state queries).
- 11 entries existed only after interaction or persisted state.
- 31 entries needed a new screen/state composition.

`audit.existing_route` gives the actual baseline route. `audit.query_state_supported` identifies whether the old runtime understood the named state query. The export wrapper understands every manifest state.

## Ownership and architecture

- `assets/nova.js` exposes existing product data and composition helpers as `NovaProduct`; the standard generator produces `nova-current-renderer.js`.
- `assets/nova-current-state.js` remains the native interaction owner.
- `figma-export/manifest.json` owns the catalogue, route, viewport, fixture and source-audit inventory.
- `scripts/build-figma-export.mjs` builds one wrapper from canonical `app.html` and one browser catalogue; no 70 independent screen implementations.
- `assets/nova-figma-export-bootstrap.js` resolves the capture URL before rendering, pins queries and shadows storage with a document-local memory map. Browser storage is never cleared or changed.
- `assets/nova-figma-export-states.js` composes missing screens from the canonical data/helpers and final card markup. New profile/KYC forms and comparison fixtures are explicitly fictional, capture-only scenarios. They do not claim new production flows.
- `assets/nova-figma-export.css` owns fixed capture motion, content labels and layouts for the added compositions.
- `/figma-export/` provides search, grouping, copy URL and viewport instructions.
- Vercel rewrites numbered paths to the shared wrapper. `scripts/serve-figma-export.mjs` mirrors that rewrite locally for tests. Manifest/static assets keep their own paths.

## Product regressions discovered by export QA

1. Hidden Activity/recipient rows stayed visible because author CSS overrode the native hidden attribute. Canonical state now enforces hidden semantics.
2. Mobile dock positioning switched to left/right insets but kept a historical translateX(-50%) transform, moving half the navigation offscreen. The owning responsive stylesheet now clears that transform and is regenerated.

## Validation

- All 70 captures rendered at 1440 and 390; no page errors, broken images or document overflow in the checked captures.
- Seven representative screens at 1440 / 1024 / 768 / 390: 28 responsive captures.
- Additional all-mobile coverage brings the responsive matrix to 91 checks.
- Nova's 61-test suite passed after the hidden-state repair. After the dock repair, 24 affected export/native flow/accessibility/foundation tests passed, including the new dock-position assertion.
- Export tests assert intended states, frozen/restricted consequences, insufficient/offline disabled actions, real storage isolation, pinned loading/processing, unknown-ID failure and index coverage.
- Human visual inspection includes representative Home, transfer, cards and KYC screenshots. This is expert QA, not user research.
- Figma import quality remains UNVERIFIED until a converter/plugin import is inspected. HTML capture readiness does not prove native Figma variables, components, variants or prototype connections.

## Reproduce

`node scripts/p2-1b-consolidate-runtime.mjs`

`node scripts/build-figma-export.mjs`

`node scripts/serve-figma-export.mjs`

Run `qa/figma-export.spec.mjs` through the existing Factory QA workspace, with `QA_TARGET_DIR` set to this Nova checkout. Cloud QA does this automatically.

## Deployment boundary

The expected production origin is `https://nova-gamma-eosin.vercel.app`. These are expected production URLs until main is merged/deployed. A branch preview can be deployed and verified independently. The source manifest does not infer deployment from local QA. Actual public URLs, provider SHA/status and anonymous observations belong to deployment evidence. No merge to main is required for preview delivery.

When a preview is protected, the handoff can include a temporary Vercel share link. The index accepts `#capture_share=<share parameter>` so Open and Copy URL preserve the temporary access for a fresh converter browser. The parameter stays in document memory and is never committed or persisted. A generated HTML snapshot package provides an alternative after the share link expires.

## Inventory

| # | Screen | Export path | Baseline route | Before audit | Export state | Local ready |
|---|---|---|---|---|---|---|
| 1 | Home — Default / populated | /figma-export/01-home-default | app.html?screen=home | EXISTING_URL | home / normal | true |
| 2 | Home — Empty / chưa liên kết account | /figma-export/02-home-empty | app.html?screen=home&state=empty | EXISTING_URL | home / empty | true |
| 3 | Home — Loading / Money Horizon calculating | /figma-export/03-home-loading | app.html?screen=home&state=loading | EXISTING_URL | home / loading | true |
| 4 | Home — Negative safe-to-spend / edge case | /figma-export/04-home-negative | app.html?screen=home&state=edge | EXISTING_URL | home / edge | true |
| 5 | Home — Stale data / offline | /figma-export/05-home-stale | Interaction or missing | MISSING_SCREEN_OR_STATE | home / stale | true |
| 6 | Money Horizon — Detail | /figma-export/06-money-horizon | Interaction or missing | MISSING_SCREEN_OR_STATE | home / horizon | true |
| 7 | Upcoming Commitments | /figma-export/07-upcoming-commitments | Interaction or missing | MISSING_SCREEN_OR_STATE | subscriptions / commitments | true |
| 8 | Insight Detail | /figma-export/08-insight-detail | Interaction or missing | MISSING_SCREEN_OR_STATE | home / insight-detail | true |
| 9 | Notifications / Unusual Activity | /figma-export/09-notifications | app.html?screen=notifications | EXISTING_URL | notifications / normal | true |
| 10 | Activity — Transaction List | /figma-export/10-activity-list | app.html?screen=activity | EXISTING_URL | activity / normal | true |
| 11 | Activity — Search | /figma-export/11-activity-search | Interaction or missing | EXISTING_INTERACTION_ONLY | activity / search | true |
| 12 | Activity — Filters | /figma-export/12-activity-filters | Interaction or missing | EXISTING_INTERACTION_ONLY | activity / filters | true |
| 13 | Transaction Detail — Normal | /figma-export/13-transaction-normal | Interaction or missing | MISSING_SCREEN_OR_STATE | transaction-detail / normal-payment | true |
| 14 | Transaction Detail — Suspicious / needs review | /figma-export/14-transaction-suspicious | app.html?screen=transaction-detail | EXISTING_URL | transaction-detail / normal | true |
| 15 | Transaction Recognition Decision | /figma-export/15-transaction-recognition | Interaction or missing | MISSING_SCREEN_OR_STATE | transaction-detail / recognition | true |
| 16 | Freeze Card — Impact Confirmation | /figma-export/16-freeze-confirmation | Interaction or missing | EXISTING_INTERACTION_ONLY | transaction-detail / freeze-confirmation | true |
| 17 | Card Frozen — Result | /figma-export/17-card-frozen-result | Interaction or missing | EXISTING_INTERACTION_ONLY | cards / frozen-result | true |
| 18 | Report Transaction / Issue | /figma-export/18-report-transaction | app.html?screen=report-transaction&state=review | EXISTING_URL | report-transaction / review | true |
| 19 | Unfreeze — Authentication | /figma-export/19-unfreeze-auth | Interaction or missing | EXISTING_INTERACTION_ONLY | cards / unfreeze-auth | true |
| 20 | Unfreeze — Successful recovery | /figma-export/20-unfreeze-success | Interaction or missing | EXISTING_INTERACTION_ONLY | cards / unfreeze-success | true |
| 21 | Transaction — Already frozen edge state | /figma-export/21-transaction-already-frozen | Interaction or missing | EXISTING_INTERACTION_ONLY | transaction-detail / already-frozen | true |
| 22 | Transaction — Restricted card / cannot self-unfreeze | /figma-export/22-transaction-restricted | Interaction or missing | MISSING_SCREEN_OR_STATE | transaction-detail / restricted | true |
| 23 | Subscriptions / Recurring Payments | /figma-export/23-subscriptions | app.html?screen=subscriptions | EXISTING_URL | subscriptions / normal | true |
| 24 | Pay — Transfer Start / Recent Recipients | /figma-export/24-pay-start | app.html?screen=transfer-recipient | EXISTING_URL | transfer-recipient / normal | true |
| 25 | Recipient Selection | /figma-export/25-recipient-selection | app.html?screen=transfer-recipient | EXISTING_URL | transfer-recipient / selection | true |
| 26 | Add New Recipient | /figma-export/26-add-recipient | Interaction or missing | MISSING_SCREEN_OR_STATE | transfer-recipient / add-recipient | true |
| 27 | Transfer — Amount | /figma-export/27-transfer-amount | app.html?screen=transfer-amount | EXISTING_URL | transfer-amount / normal | true |
| 28 | Transfer — Insufficient Balance Error | /figma-export/28-transfer-insufficient | Interaction or missing | EXISTING_INTERACTION_ONLY | transfer-amount / insufficient | true |
| 29 | Transfer — Impact / Review | /figma-export/29-transfer-review | app.html?screen=transfer-review | EXISTING_URL | transfer-review / normal | true |
| 30 | Authentication — Biometric | /figma-export/30-biometric-auth | Interaction or missing | EXISTING_INTERACTION_ONLY | transfer-review / biometric | true |
| 31 | Authentication — Biometric Failed | /figma-export/31-biometric-failed | app.html?screen=biometric-failed | EXISTING_URL | biometric-failed / normal | true |
| 32 | Authentication — Passcode Fallback | /figma-export/32-passcode-fallback | Interaction or missing | EXISTING_INTERACTION_ONLY | biometric-failed / passcode | true |
| 33 | Transfer — Offline / confirmation disabled | /figma-export/33-transfer-offline | app.html?screen=offline | EXISTING_URL | offline / normal | true |
| 34 | Transfer — Reconnected / revalidation | /figma-export/34-transfer-revalidated | Interaction or missing | MISSING_SCREEN_OR_STATE | transfer-review / revalidated | true |
| 35 | Transfer — Processing | /figma-export/35-transfer-processing | Interaction or missing | MISSING_SCREEN_OR_STATE | transfer-review / processing | true |
| 36 | Transfer — Success Receipt | /figma-export/36-transfer-success | app.html?screen=transfer-success | EXISTING_URL | transfer-success / normal | true |
| 37 | Transfer — Failure / cancelled, no money moved | /figma-export/37-transfer-cancelled | Interaction or missing | MISSING_SCREEN_OR_STATE | transfer-review / cancelled | true |
| 38 | Cards — Overview | /figma-export/38-cards-overview | app.html?screen=cards | EXISTING_URL | cards / normal | true |
| 39 | Card Detail — Active | /figma-export/39-card-active | Interaction or missing | MISSING_SCREEN_OR_STATE | cards / active-detail | true |
| 40 | Card Detail — Frozen | /figma-export/40-card-frozen | Interaction or missing | EXISTING_INTERACTION_ONLY | cards / frozen-detail | true |
| 41 | Card Detail — Restricted | /figma-export/41-card-restricted | Interaction or missing | MISSING_SCREEN_OR_STATE | cards / restricted | true |
| 42 | Spending Controls | /figma-export/42-spending-controls | app.html?screen=card-controls | EXISTING_URL | card-controls / normal | true |
| 43 | Card Limits | /figma-export/43-card-limits | app.html?screen=card-controls | EXISTING_URL | card-controls / limits | true |
| 44 | Card Activity | /figma-export/44-card-activity | Interaction or missing | MISSING_SCREEN_OR_STATE | activity / card-activity | true |
| 45 | Save — Goals Overview | /figma-export/45-savings-overview | app.html?screen=savings | EXISTING_URL | savings / normal | true |
| 46 | Save — Goal Detail | /figma-export/46-goal-detail | app.html?screen=savings-detail | EXISTING_URL | savings-detail / goal-detail | true |
| 47 | Contribution Settings | /figma-export/47-contribution-settings | app.html?screen=savings-detail | EXISTING_URL | savings-detail / contribution | true |
| 48 | Goal Activity | /figma-export/48-goal-activity | Interaction or missing | MISSING_SCREEN_OR_STATE | savings / goal-activity | true |
| 49 | Insights — Spending | /figma-export/49-insights-spending | Interaction or missing | MISSING_SCREEN_OR_STATE | activity / spending | true |
| 50 | Insights — Categories / Merchants | /figma-export/50-insights-categories | Interaction or missing | MISSING_SCREEN_OR_STATE | activity / categories | true |
| 51 | Insights — Month Comparison | /figma-export/51-insights-comparison | Interaction or missing | MISSING_SCREEN_OR_STATE | activity / comparison | true |
| 52 | Profile — Personal Details | /figma-export/52-personal-details | Interaction or missing | MISSING_SCREEN_OR_STATE | settings / personal | true |
| 53 | Security Center | /figma-export/53-security-center | app.html?screen=security | EXISTING_URL | security / normal | true |
| 54 | Security — Biometrics / Passcode | /figma-export/54-security-credentials | Interaction or missing | MISSING_SCREEN_OR_STATE | security / credentials | true |
| 55 | Security — Devices / Sessions | /figma-export/55-security-devices | Interaction or missing | MISSING_SCREEN_OR_STATE | security / devices | true |
| 56 | Notification Privacy | /figma-export/56-notification-privacy | Interaction or missing | MISSING_SCREEN_OR_STATE | security / notification-privacy | true |
| 57 | Secure Account / Emergency Actions | /figma-export/57-secure-account | Interaction or missing | MISSING_SCREEN_OR_STATE | security / emergency | true |
| 58 | Help / Support | /figma-export/58-help-support | Interaction or missing | MISSING_SCREEN_OR_STATE | security / support | true |
| 59 | KYC — Welcome | /figma-export/59-kyc-welcome | app.html?screen=onboarding | EXISTING_URL | onboarding / normal | true |
| 60 | KYC — What you'll need / why | /figma-export/60-kyc-requirements | app.html?screen=kyc&state=intro | EXISTING_URL | kyc / intro | true |
| 61 | KYC — Phone / Email Verification | /figma-export/61-kyc-verification | Interaction or missing | MISSING_SCREEN_OR_STATE | kyc / verification | true |
| 62 | KYC — Personal / Legal Details | /figma-export/62-kyc-personal-details | Interaction or missing | MISSING_SCREEN_OR_STATE | kyc / personal | true |
| 63 | KYC — Choose ID Type | /figma-export/63-kyc-id-type | Interaction or missing | MISSING_SCREEN_OR_STATE | kyc / id-type | true |
| 64 | KYC — ID Capture Guidance | /figma-export/64-kyc-id-capture | app.html?screen=kyc&state=capture | EXISTING_URL | kyc / capture | true |
| 65 | KYC — Selfie / Liveness Guidance | /figma-export/65-kyc-selfie | Interaction or missing | MISSING_SCREEN_OR_STATE | kyc / selfie | true |
| 66 | KYC — Review Submitted Data | /figma-export/66-kyc-review | Interaction or missing | MISSING_SCREEN_OR_STATE | kyc / submitted | true |
| 67 | KYC — Approved | /figma-export/67-kyc-approved | Interaction or missing | MISSING_SCREEN_OR_STATE | kyc / approved | true |
| 68 | KYC — Capture Quality Failed | /figma-export/68-kyc-capture-failed | app.html?screen=kyc&state=failed | EXISTING_URL | kyc / failed | true |
| 69 | KYC — More Information Required | /figma-export/69-kyc-more-information | Interaction or missing | MISSING_SCREEN_OR_STATE | kyc / more-information | true |
| 70 | KYC — Manual Review / Support Path | /figma-export/70-kyc-manual-review | app.html?screen=kyc&state=manual | EXISTING_URL | kyc / manual | true |
