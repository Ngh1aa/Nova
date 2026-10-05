# Nova pastel UX remediation

This is a component repair of the existing banking prototype, with an explicitly requested new logo. The product remains simulated. Main is not merged or promoted.

## Shared owners

- `assets/ledger.css`: constrain the predecessor universal square/zero-elevation reset and square SVG stroke rules to non-product documents. Current components regain their declared geometry without new per-control important overrides.
- `assets/legacy/p2-1a-canonical/nova-current.p2-1a.css`: canonical component geometry, switch hit areas/focus, readable muted text, Activity scale/filter layout and comfortable dashboard spacing.
- `assets/legacy/p2-1a-canonical/nova-current-renderer.p2-1a.js`: reuse the existing two-child setting-row for Notifications; label switches, persist demo choices, expose selected theme state and keep security copy consistent with demo preference changes.
- `assets/nova-ios26.css`: retain the month heading as visible Activity context.
- `assets/nova-ios26.css` and `nova-ios26-final.css`: pair light financial meta surfaces with dark text; keep inverse white text scoped to its old dark hero context. This repairs invisible target/remaining labels on Savings detail and export 47.
- `assets/state-lab-launcher.js`: reviewer tooling is opt-in through `app.html?screen=home&reviewer=1`; ordinary product pages are not obscured by the floating reviewer launcher. The State Lab remains directly accessible from the prototype index.
- `assets/nova-motion.css`: remove the redundant active-icon underline; reduced motion no longer forces intentionally transparent checkbox inputs to become visible.
- `assets/nova-mark.svg`, `nova-logo.svg`, `favicon.svg`: one rounded N identity using mint, lavender and sky against Nova's dark surface. All existing consumers reuse the same asset paths.

Regenerate with `node scripts/p2-1b-consolidate-runtime.mjs` and `node scripts/build-figma-export.mjs`. Do not edit generated bundles manually. The 70 exports inherit changes through their canonical renderer. Previously downloaded HTML/Figma frames are snapshots and require regeneration/reimport.

## Five scenario-based expert walkthroughs

These are simulated expert checks, not human research or measured product outcomes.

| Scenario | Inspected friction | Repair and re-test |
| --- | --- | --- |
| Review a merchant and investigate suspicious activity | Oversized month heading, doubled filter chrome, redundant underline crossing the active nav icon | Product heading scale, wrapping 44px filter chips, one selected indication; search/filter and native protection regression checks |
| Choose a saved recipient and complete a transfer | Pay CTA had square corners despite a declared pill treatment | Shared reset repair; CTA focuses the saved-recipient search; existing amount/review/authentication/recovery/receipt tests |
| Manage the debit card and payment permissions | Cards CTA, network mark, chip and badges inherited inconsistent square geometry | Restore existing component radii; native freeze/preference/limit regression tests |
| Change notification preferences and revisit Settings | Two-child rows inherited three-column layout; anonymous checkboxes, no retained demo state, reduced-motion native checkbox overlay | Existing setting-row reused; named 44px controls with visible keyboard focus; Space/persistence/alignment/contrast checks |
| Review account security preferences | Same control/contrast defects; unchanged positive protection copy after disabling a demo option | Shared switch contract and local demo preferences; enabled count and protection summary update, sensitive-action confirmation remains mandatory |

## Validation and boundaries

`qa/pastel-ux.spec.mjs` adds native desktop/mobile shared-owner smoke checks, Activity search/filter semantics, CTA hover/focus behavior, named switch keyboard/persistence checks, security consequence copy and Settings/Security axe coverage. Existing critical-flow and 70-export tests remain required. CI includes Settings, Security, card controls and onboarding in the rendered/accessibility route inventory.

Theme selection remains an explicitly announced preview. Notification/security preferences remain local demo preferences, with no notification service or bank-policy integration. Compact dashboard affects desktop density. The logo and layout changes do not provide evidence of native Figma components, variables or import fidelity.

## UIUX Factory experience

The existing manifest compiler and `existing-ui-improvement` flow support this shared-component repair. Declaring the component cluster as `FOCUSED` avoids the recruiter-portfolio flow selected by Nova's portfolio metadata under `PRODUCT`. This uses the existing explicit-override contract, not a second router. The HTML-to-Figma routing/skill gap found in the original export task is repaired independently in Factory PR #207, with its own regression tests and CI; it remains unmerged.

Nova's source owners require care: final component sources live under a historical archive name, and the canonical bundle includes 21 ordered stylesheets. Editing the generated bundle would be overwritten. The verified faults in this remediation are Nova CSS/markup owners, not Factory runtime faults. No additional Factory source changes are needed for this repair.
