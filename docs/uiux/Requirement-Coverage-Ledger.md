# NOVA — Requirement Coverage Ledger

Status model: `DONE_VERIFIED | N/A_JUSTIFIED | NEXT_PLANNED | BLOCKED`

> This is a **current coverage ledger**, not a historical phase snapshot. Dated evidence files may describe earlier states that were true when captured; `docs/uiux/Phase-State.md` is the canonical current-status source.

| ID | Requirement | Owner phase | Status | Verification / evidence |
|---|---|---|---|---|
| R01 | Read UIUX Factory operating contract/source of truth | Phase 0/1 | DONE_VERIFIED | `Ngh1aa/uiux-ai-workspace` AGENTS/Factory/skills contracts used throughout Nova work |
| R02 | Benchmark at least 5 real products | Phase 1 | DONE_VERIFIED | Research synthesis contains benchmark/reference evidence |
| R03 | Competitor matrix + pattern inventory + opportunity | Phase 1 | DONE_VERIFIED | `Research-Synthesis.md` |
| R04 | Product thesis + users + JTBD + risks | Phase 1 | DONE_VERIFIED | `Design-Contract.md`, `PROJECT-CONTEXT.md` |
| R05 | IA and five flow classes | Phase 1 | DONE_VERIFIED | `IA-and-Flows.md` |
| R06 | Visual adjectives + visual signature | Phase 1 | DONE_VERIFIED | active iOS26 contract + Money Horizon signature |
| R07 | Responsive strategy 1440/1024/768/390 | Phase 1 | DONE_VERIFIED | project context + rendered QA |
| R08 | Motion/accessibility contract | Phase 1 | DONE_VERIFIED | design contract + browser evidence |
| R09 | Realistic prototype data | Phase 1 | DONE_VERIFIED | simulated/prototype boundary retained |
| R10 | Target repository + stack audit | Phase 0/2 | DONE_VERIFIED | `Ngh1aa/Nova`; static HTML/CSS/JS |
| R11 | Implement product screens and critical flows | Phase 2 | DONE_VERIFIED | direct product routes + regression suite |
| R12 | Implement design-system/component-states/sitemap/user-flows/prototype evidence | Phase 2 | DONE_VERIFIED | all evidence pages exist and are exercised in QA |
| R13 | Native Empty / Loading / Error / Edge states | P1.1 | DONE_VERIFIED | `NATIVE-STATE-EVIDENCE-2026-09-30.md`, `qa/native-states.spec.mjs` |
| R14 | Cloud Playwright / Axe / rendered target QA | Phase 3 / continuous | DONE_VERIFIED | `Nova Visual QA`; current workflow remains a merge gate |
| R15 | Rendered screenshot inspection + visual critique | Phase 3 / continuous | DONE_VERIFIED | representative product/evidence routes captured and inspected after material UI changes |
| R16 | Repair loop / re-QA | Phase 3 / continuous | DONE_VERIFIED | multiple P0/P1 fixes were repaired at owning layer and rerun to green |
| R17 | PR workflow | Phase 3/4 | DONE_VERIFIED | feature-branch → QA → PR → merge is established operating path |
| R18 | Merge/deploy | Phase 4 / continuous | DONE_VERIFIED | `main` has verified GitHub Pages and Vercel deployment paths; deployment does not imply production banking |
| R19 | Direct-user evidence with explicit method boundaries | Research | DONE_VERIFIED | Round 01 = 5 verified unmoderated self-report records; Round 02 = 5 NEW verified async self-report retest records; both 0 moderated sessions |
| R20 | Evidence-informed Round 02 follow-up implementation | Research/Product | DONE_VERIFIED | D-01 through D-04 implementation complete; human retest remains open |
| R21 | Consolidate canonical runtime ownership | P2.1 | DONE_VERIFIED | `RUNTIME-ARCHITECTURE-2026-09-30.md` |
| R22 | Remove source-level Nova/Ledger identity drift | P2.2 | DONE_VERIFIED | `IDENTITY-SOURCE-2026-10-01.md`, identity regression gate |
| R23 | Refresh stale current-status/phase language | P2.3 | DONE_VERIFIED* | implementation complete on P2.3 branch; `*` promotion remains contingent on PR/main QA before merge |
| R24 | Explicit rejected alternatives / trade-off evidence for recruiter review | P2.4 | NEXT_PLANNED | preserve balance-vs-horizon, speed-vs-safety, protection-vs-recovery and confidence-vs-certainty decisions |

## Current open work

- **Release blockers:** 0 known for the existing prototype scope.
- **Human-validation closure:** open by choice; post-Round-02 D-01…D-04 changes are implemented but not human-retested.
- **Moderated usability evidence:** 0 sessions; do not infer observed task success/time-on-task.
- **Business/production impact:** not measured.
- **Next portfolio-clarity task:** P2.4 design decisions / rejected alternatives.

## Promotion rule

`DONE_VERIFIED` means the requirement has direct repository/runtime/evidence support appropriate to the claim. It does not upgrade self-report research into moderated observation, browser accessibility evidence into WCAG certification, or prototype deployment into production product evidence.
