---
id: mckinsey-7s
name: McKinsey 7S
purpose: Check whether strategy, structure, systems, shared values, style, staff and skills are aligned to execute a change.
problemTypes: [organizational-alignment, execution-readiness, capability-fit]
useWhen:
  - the question is whether the organisation can execute a strategy, not whether the strategy is right
  - a change needs several internal elements to move together
doNotUseWhen:
  - the question is about markets, customers or competitors
  - only public information is available about the organisation (most elements need inside data)
questionsAnswered:
  - Which organisational elements support or block the strategy?
  - What must change, and in what order, for the strategy to be executed?
requiredEvidence: [org-structure, operating-processes, talent-and-skills, leadership-style, culture-signals]
outputs: [alignment-assessment, change-priorities]
complexity: 4
overlapsWith: [value-chain]
pairsWellWith: [ansoff]
---

## How to apply

1. State the **strategy** the organisation must execute.
2. For each of the seven S's, describe the current state with evidence and rate its **fit** with
   the strategy (supports / neutral / blocks).
3. Identify the **misalignments** that matter most; the hard S's (strategy, structure, systems)
   are faster to change than the soft ones.
4. Sequence the **changes**.

## Output shape

```yaml
strategy:
elements:
  - { s: strategy|structure|systems|sharedValues|style|staff|skills, current:, fit:, evidence: [] }
misalignments: []
changeSequence: []
```

## Pitfalls

- Filling soft S's with guesses when there is no inside evidence; mark them as gaps.
- Using it on a hypothetical company with no evidence at all.

## Reading the result

Blocking soft elements (skills, shared values) mean a long lead time; the recommendation should
include build-or-acquire choices for them, not only a strategy.
