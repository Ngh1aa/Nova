# Nova Home-derived design system

## Scope and source ownership
The approved Home language is retained: Inter, mint/pink/butter/lavender, white working surfaces, 24px corners, 72px white rail, dark primary action. This is a density/composition correction, not a new brand proposal.

Canonical owners: tokens.css (values), components.css (shared surfaces/rows/controls), screens.css (composition), nova-dashboard-v2.js (Home copy), nova.js (foundation and inbox), legacy/p2-1a-canonical/nova-current-renderer.p2-1a.js (rich native screens). Generated current CSS/renderer must be regenerated. Existing 24-route and 8-state coverage is retained. Before evidence: style-sync/after and inbox-fix.

## Visual plan
Banking workspace; decision object is the user's available money.
Inter: page 26–30/600, section17/600, body15/400, helper13/400, metric28–36/600; Home main balance32–48.
Canvas #f7f7f8; white detail/form surfaces; mint available funds/selection; pink forecast; butter savings; lavender card/account.
24px card,16px inner control; subtle hairline, no decorative shadows.
Dashboard: existing12-column compact composition. Workspaces: content-sized groups. Forms/detail: bounded readable width plus contextual column. Inbox:320px list + bounded detail; no viewport-height cards or flex:1 list tiles.
One focal money metric per screen. Three differences from generic starter: Home allocation bar, five-payment forecast/calendar, physical debit-card object.
Remove: viewport minimum heights on sparse content, auto bottom-pushed CTA, per-page oversized metrics and repeated explanatory Home sentences.

## Replacement map
- Shared surface padding20 -> card16/form20 semantic tokens; remove duplicate desktop padding rule.
- Unbounded sparse detail -> detail/form width tokens; retain full-viewport application shell.
- Inbox fill-height/equal tiles -> compact list rows and intrinsic detail.
- Route-specific grid gutters20 -> shared12/16 scale; remove arbitrary stretch on supporting cards.
- Historic design-system and component-state pages -> live canonical CSS specimens.
- Repeated Home forecast amount/protection note -> one metric + short caveat.

## Acceptance
Check all native routes and states at390/1440, pressure320 and short desktop560; retain money identities and demo safety boundaries. Check selected inbox detail and direct mobile navigation. No commit/push/deployment requested.
## Implemented rules

- Semantic component tokens now own card/form padding, layout gap, row/detail-row heights, control target, metric scale, physical-card maximum and task-specific maximum widths.
- Shared components consume Home's16px padding and56px list rows; details use48px. White lists/forms and pastel summary roles retain24px/16px radii.
- Cards now uses three intrinsic desktop columns (card/wallet, controls/limits, funds/recent payments), removing grid-row waiting space. Mobile preserves source/focus order.
- Settings profile is a compact inline identity toolbar rather than a full-width pink card. Settings and inbox bound reading width; desktop shell remains full viewport.
- Inbox is one grouped list, with an intrinsic preview and local action. Phone list entries open the corresponding native detail.
- Home removes repeated forecast/protection paragraphs, keeps the14-day rule and one concise explanation of exclusions. Mobile profile remains operable in the header.
- Design-system.html and component-states.html now load canonical CSS, replacing stale historic palette and dimensional claims.

## Test changes

- content-flow: desktop Notifications now previews the selected item before its explicit detail action; assert both preview and correct native identity.
- direct-user-round01: preserved exclusion meaning with shorter Home wording.
- accessibility-evidence: target the current named risk row rather than a historical missing aria-label; keyboard occlusion/focus checks retained.
- inbox-layout: upper bounds on row/detail size, correct desktop/mobile destination and no sidebar scroll at560/600/832/1080px. Added actual mobile profile click to catch header occlusion.

## Evidence limits

Screenshots and automated accessibility checks are technical evidence, not human usability validation. The broad historical92-test sweep was also attempted from the temporary harness and did not pass: it included export-gated Figma fixtures and repository-document tests resolving paths from the temporary working directory, plus issues corrected in this pass. We do not call the entire historical suite green. The separately selected native runtime regression suite passed70tests; final post-composition focused run is recorded in verification.json.

Checker:0errors,10reviewed warnings (requested pastel palette and short specification label wrapping). Four additional axe audits on live system-reference pages passed. Source syntax, git diff whitespace and generator reproducibility checked. Overlay checker0errors/two generated-file advisories, no new CSS overlay or !important. No commit, push or deployment.

Final post-composition checks:26passed, including all-route style/axe matrix. Independent revision review verified:4.0/5, zero hard failures. Minor Notifications desktop heading placement remains a polish observation.
