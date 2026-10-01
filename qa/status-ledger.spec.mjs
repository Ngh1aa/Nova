import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const targetRoot = process.env.QA_TARGET_DIR || process.cwd();
const read = (file) => fs.readFileSync(path.join(targetRoot, file), 'utf8');
const json = (file) => JSON.parse(read(file));

test('canonical current-status docs preserve P2.3 and promote lean P2.4 to done', async () => {
  const phase = read('docs/uiux/Phase-State.md');
  const readme = read('README.md');
  const coverage = read('docs/uiux/Requirement-Coverage-Ledger.md');
  const qa = read('docs/uiux/QA-Plan.md');
  const runtime = read('docs/uiux/RUNTIME-ARCHITECTURE-2026-09-30.md');
  const dogfood = read('docs/uiux/A13-NOVA-DOGFOOD.md');
  const clarity = read('docs/uiux/NOVA-PHASE3-CLARITY-ITERATION.md');
  const handoff = read('docs/FIGMA-HANDOFF-SPEC.md');
  const index = read('docs/uiux/STATUS-INDEX.md');
  const p23 = read('docs/uiux/PHASE-LEDGER-REFRESH-2026-10-01.md');
  const p24 = read('docs/uiux/DESIGN-DECISIONS-TRADEOFFS-2026-10-01.md');

  expect(phase).toContain('current_workstream: portfolio_handoff');
  expect(phase).toContain('result: DONE_VERIFIED');
  expect(phase).toContain('p2_1_runtime_consolidation: DONE_VERIFIED');
  expect(phase).toContain('p2_2_identity_source: DONE_VERIFIED');
  expect(phase).toContain('p2_3_phase_ledger_refresh: DONE_VERIFIED');
  expect(phase).toContain('p2_3_main_release_confirmation: DONE_VERIFIED');
  expect(phase).toContain('p2_4_decision_tradeoff_evidence: DONE_VERIFIED');
  expect(phase).toContain('next_workstream: observed_human_evidence_when_available');
  expect(phase).toContain('verified_direct_user_records_round_01: 5');
  expect(phase).toContain('verified_async_retest_records_round_02: 5');
  expect(phase).toContain('post_round_02_iteration_human_retested: false');
  expect(phase).not.toContain('p2_4_decision_tradeoff_evidence: NEXT_PLANNED');
  expect(phase).not.toContain('next_workstream: P2.4_decision_tradeoff_evidence');
  expect(phase).not.toContain('feature_branch: feat/nova-portfolio-grade');
  expect(phase).not.toMatch(/\nphase:\s*2\b/);

  expect(readme).toContain('10 verified direct-user/self-report records across two rounds');
  expect(readme).toContain('implemented but not human-retested');
  expect(readme).not.toContain('RECRUITING / PLANNED — 0 verified sessions');

  expect(coverage).not.toContain('PENDING_FUTURE_PHASE');
  expect(coverage).toContain('P2.3 | DONE_VERIFIED');
  expect(coverage).toContain('P2.4 | DONE_VERIFIED');
  expect(coverage).toContain('a fresh observed task-based session when a real participant is available');

  expect(qa).not.toContain('Cloud checks remain due');
  expect(qa).toContain('P2.4 lean recruiter surface and completed status remain regression-protected');
  expect(qa).toContain('QA/CI is **prototype / technical evidence**, not usability validation');

  expect(runtime).toContain('P2.2 — canonical Nova identity source: `DONE_VERIFIED`');
  expect(runtime).not.toContain('Round 01 remains:\n\n- `RECRUITING`');

  expect(dogfood).toContain('Status: `PASSED`');
  expect(dogfood).not.toContain('Status: `CANDIDATE_PASS`');

  expect(clarity).toContain('IMPLEMENTED / QA_VERIFIED / NOT HUMAN-RETESTED');
  expect(clarity).not.toContain('IMPLEMENTED / PENDING_RENDERED_QA');

  expect(handoff).toContain('ITERATION_02_IMPLEMENTED_NOT_RETESTED');
  expect(handoff).toContain('post-Round-02 D-01…D-04 iteration implemented / QA-verified / not human-retested');

  expect(index).toContain('Current recruiter / decision evidence');
  expect(index).toContain('design-decisions.html');
  expect(index).toContain('P2.4 state: `DONE_VERIFIED`');
  expect(index).toContain('PRODUCT-DESIGN-AUDIT-2026-09-29.md');

  expect(p23).toContain('P2.3 — DONE_VERIFIED');
  expect(p23).toContain('Actions run: `36826923527`');
  expect(p23).toContain('merge commit: `710e2cb6857f790de42f217021143a3e4a71ec34`');
  expect(p23).toContain('Nova Visual QA run: `#319` / Actions run `36827703104` — `SUCCESS`');
  expect(p23).toContain('P2.3 is therefore fully landed and release-confirmed on canonical `main`.');

  expect(p24).toContain('Status: `DONE_VERIFIED`');
  expect(p24).toContain('Public recruiter cut (`design-decisions.html`)');
  expect(p24).toContain('Seven decisions remain traceable here');
  expect(p24).toContain('Actions run `36840448193`');
  expect(p24).toContain('`SUCCESS`');
  expect(p24).toContain('New human observation remains a separate future evidence task');
});

test('machine-readable research rollups preserve method and latest iteration truth', async () => {
  const round01 = json('research/validation/nova-round-01/status.json');
  const round02 = json('research/validation/nova-round-02/status.json');
  const profile = json('.uiux-profile.json');

  expect(round01).toMatchObject({
    status: 'VERIFIED_DIRECT_USER_ROUND / SUPERSEDED_BY_ROUND_02',
    evidence_state: 'DIRECT_USER_SELF_REPORT / FOLLOW_UP_RETEST_COMPLETE',
    verified_direct_user_records: 5,
    verified_sessions: 0
  });
  expect(round01.follow_up_round).toBe('research/validation/nova-round-02/status.json');

  expect(round02).toMatchObject({
    status: 'VERIFIED_ASYNC_RETEST / ITERATION_IMPLEMENTED_NOT_RETESTED',
    evidence_state: 'DIRECT_USER_ASYNC_RETEST_SELF_REPORT / POST_ROUND02_ITERATION_OPEN',
    verified_records: 5,
    moderated_sessions: 0
  });
  for (const decision of ['D-01', 'D-02', 'D-03', 'D-04']) {
    expect(round02.post_round02_implementation_status[decision]).toBe('ITERATED / NOT HUMAN-RETESTED');
  }
  expect(round02.post_round02_implementation_status.moderated_round_03).toBe('SKIPPED / 0 SESSIONS');

  expect(profile.source_of_truth[0]).toBe('docs/uiux/Phase-State.md');
  expect(profile.implementation.canonical_branch).toBe('main');
  expect(profile.evidence_state).toMatchObject({
    round_01_verified_direct_user_self_report_records: 5,
    round_02_verified_async_retest_records: 5,
    moderated_sessions_total: 0,
    post_round_02_iteration: 'IMPLEMENTED_NOT_HUMAN_RETESTED',
    business_impact: 'NOT_MEASURED'
  });
});
