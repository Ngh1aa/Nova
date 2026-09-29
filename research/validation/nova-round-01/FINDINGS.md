# Nova Round 01 — Findings

**Evidence state:** `PLANNED_VALIDATION`  
**Verified sessions:** `0`  
**Promotion rule:** No finding may be promoted from this file unless it references one or more real session IDs in `evidence-ledger.jsonl` and the corresponding anonymized session record exists.

## Current status

No direct-user findings exist yet.

The current product thesis remains a hypothesis: people may interpret **Money Horizon** as a safer decision surface for near-term spending when upcoming commitments and a protected buffer are visible together.

## Finding format

When real sessions exist, add findings using this structure:

### F-XX — [finding title]

- **State:** `OBSERVED` / `PATTERN` / `VERIFIED_FOR_ROUND` / `RETEST_REQUIRED`
- **Decision affected:** `D-01` / `D-02` / `D-03` / `D-04`
- **Supporting evidence IDs:** `E-...`
- **Contradicting evidence IDs:** `E-...` or `none observed`
- **Observation:** what participants actually did or said.
- **Interpretation:** what the observation may mean; keep this separate from behavior.
- **Design implication:** change / keep / defer / investigate.
- **Limitation:** population, prototype fidelity, moderator effect, sample size, or other constraint.

## Decision map

- `D-01` — Whether Money Horizon communicates safe-to-spend context without implying certainty.
- `D-02` — Whether suspicious-transaction protection and freeze recovery are discoverable and understandable.
- `D-03` — Whether transfer review communicates financial impact before confirmation.
- `D-04` — Whether failure recovery supports diagnosis and retry without moderator explanation.

## Synthesis rules

1. Preserve contradictory observations.
2. Do not convert preference into task success.
3. Do not calculate percentages without showing numerator and denominator.
4. Do not claim improvement until an iteration is retested with the same task definition.
5. AI may help cluster anonymized notes, but every material claim must trace back to real evidence IDs.
