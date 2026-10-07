---
id: constraint-analysis
name: Constraint and bottleneck analysis
purpose: Find the single stage that limits the throughput, lead time or cost of a process, and decide how to relieve it and what becomes the limit next.
problemTypes: [process-optimization]
useWhen:
  - the question is how to reduce a lead time, cycle time, backlog or cost of a multi-stage process
  - effort is being spread across many improvements and the most valuable one is unclear
  - an earlier improvement did not change the end-to-end result
doNotUseWhen:
  - the process is a single step with no hand-offs or queues
  - the question is why a past outcome happened, not how to improve a flow (use root-cause-analysis)
  - no stage-level time, queue or utilisation data can be obtained or credibly estimated
  - the question is about market, customers or competitors rather than an internal process
questionsAnswered:
  - Where does time, work or cost accumulate across the process end to end?
  - Which single stage is the binding constraint, and what is the evidence?
  - How much would end-to-end performance improve if that stage were relieved?
  - Which stage becomes the constraint next?
requiredEvidence: [stage-durations, queue-and-wait-times, utilisation-or-capacity, rework-rates, process-volumes]
outputs: [process-map-with-metrics, binding-constraint, ranked-options, next-constraint]
complexity: 3
overlapsWith: [root-cause-analysis]
pairsWellWith: [profit-tree, hypothesis-driven]
---

## How to apply

Run the five focusing steps, in order, on one process at a time.

1. **Map the process end to end.** List stages from trigger to done. For each stage record
   touch (work) time, wait time before it, rework or failure rate, volume and capacity. Wait
   time between stages is usually the largest share, so do not map only the work.
2. **Identify the binding constraint from data**, not opinion: the stage with the longest
   queue, the highest utilisation (near 100%), the longest wait before it, and work piling up
   in front while stages after it are starved. A stage that is merely slow but has no queue
   is not the constraint.
3. **Exploit it.** Get the most from the constraint as it is: never let it idle, feed it only
   work that is ready, remove rework and low-value work from it.
4. **Subordinate everything else.** Pace upstream stages to the constraint; do not optimise
   non-bottlenecks, because their gains only grow the queue.
5. **Elevate it**: add capacity, automate, split, parallelise, change the design, but only
   after exploiting it. Estimate the end-to-end gain: relieving the constraint helps only up
   to the next-slowest stage, so name that stage and the gain ceiling.
6. **Repeat.** State where the constraint moves next, so the plan is not "fix X" but
   "fix X, then watch Y".

Rank the options by end-to-end gain over effort and cost. Label estimates as inference when
not measured.

## Output shape

```yaml
stages:
  - { stage:, touchTime:, waitTime:, reworkRate:, utilisation:, queue:, evidence: [] }
bindingConstraint: { stage:, why:, evidence: [] }
options:
  - { action:, step: exploit|subordinate|elevate, expectedGain:, effort:, rank: }
gainCeiling: { stage:, note: }        # the point where the next stage binds
nextConstraint: { stage:, why: }
```

## Pitfalls

- Optimising a non-bottleneck: a visible but local improvement that leaves end-to-end
  performance unchanged.
- Reading average times only; the constraint often shows in queue length and variance.
- Mapping touch time but ignoring wait and rework, which hides where time really goes.
- Elevating (spending money) before exploiting the constraint with what already exists.
- Promising the full gain: the benefit stops where the next constraint takes over.
- Treating the constraint as permanent; it moves after every successful fix.

## Reading the result

Put effort on the binding constraint and nowhere else until it moves. If no stage shows a
queue or saturation, the limit may be outside the process (demand, policy, external
dependency), so say so rather than naming a weak candidate. The expected end-to-end gain is
capped by the next constraint; report that cap together with the recommendation.
