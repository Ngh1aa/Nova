# NOVA — Requirement Coverage Ledger

Status model: `DONE_VERIFIED | N/A_JUSTIFIED | PENDING_FUTURE_PHASE | BLOCKED`

| ID | Requirement | Owner phase | Status | Verification / evidence |
|---|---|---|---|---|
| R01 | Read UIUX Factory operating contract/source of truth | Phase 0/1 | DONE_VERIFIED | AGENTS/README/context/checklist/delivery/gating/QA docs inspected |
| R02 | Benchmark at least 5 real products | Phase 1 | DONE_VERIFIED | 6 products, primarily official sources |
| R03 | Competitor matrix + pattern inventory + opportunity | Phase 1 | DONE_VERIFIED | `Research-Synthesis.md` |
| R04 | Product thesis + users + JTBD + risks | Phase 1 | DONE_VERIFIED | `Design-Contract.md` |
| R05 | IA and five flow classes | Phase 1 | DONE_VERIFIED | `IA-and-Flows.md`; admin N/A, security permission flow substituted appropriately |
| R06 | 3 visual adjectives + visual signature | Phase 1 | DONE_VERIFIED | calm/clear/human + Money Horizon |
| R07 | Responsive strategy 1440/1024/768/390 | Phase 1 | DONE_VERIFIED | Design Contract + QA plan |
| R08 | Motion/accessibility contract | Phase 1 | DONE_VERIFIED | Design Contract |
| R09 | Realistic prototype data | Phase 1 | DONE_VERIFIED | `Content-Data-Model.md`; clearly prototype/simulated |
| R10 | Target repository + stack audit | Phase 0/2 | DONE_VERIFIED | `Ngh1aa/Nova`; greenfield repo with initial README/.gitattributes; static HTML/CSS/JS selected |
| R11 | Create `feat/nova-portfolio-grade` branch | Phase 2 | DONE_VERIFIED | Branch created from `main` |
| R12 | Implement required product screens | Phase 2 | DONE_VERIFIED | `app.html?screen=...` interactive state machine covers onboarding/KYC/home/activity/detail/cards/controls/transfer/savings/subscriptions/security/notifications/success/error |
| R13 | Implement design-system/component-states/sitemap/user-flows/prototype pages | Phase 2 | DONE_VERIFIED | All five required evidence pages exist and local-link integrity check passes |
| R14 | Cloud Playwright/axe/Lighthouse on target repo | Phase 3 | PENDING_FUTURE_PHASE | `QA-Plan.md` |
| R15 | Rendered screenshot inspection + visual critique | Phase 3 | PENDING_FUTURE_PHASE | Requires implementation evidence |
| R16 | Repair loop / re-QA | Phase 3 | PENDING_FUTURE_PHASE | Triggered by findings |
| R17 | PR | Phase 3/4 | PENDING_FUTURE_PHASE | Target repo + passing gates required |
| R18 | Merge/deploy | Phase 4 | PENDING_FUTURE_PHASE | Authorization + passing gates required |

## Current blockers

- **Phase 2 source/implementation blockers:** 0
- **Phase 2 unaccounted:** 0
- **Representative rendered inspection:** still due after cloud CI creates evidence.

Do not promote R14–R18 until their owner phase evidence exists.
