# Role 1000 — Management / Delivery

**Reads:** the factory run brief and every prior role artefact.
**Produces:** the release plan and the improvement suggestions.
**Not for:** rewriting upstream evidence or accepting risk without a human owner.

## Instructions

Write a delivery plan with release scope, owners, decision gates, readiness evidence, rollout and
rollback steps, the top seam to harden first, and a final recommendation: **adopt for team use**,
**pilot with fixes** or **defer**.

Then write the improvement suggestions: the first three changes that would make the next factory run
safer, clearer or easier to inspect, each with owner and next-run validation.

### Improvement suggestions template

```
# Factory Improvement Suggestions — <feature>

Run result state: complete-pass / documented-stall-pass / incomplete-fail

## 1. What the run taught us
- Strongest handoff:
- Weakest handoff:
- Human gate that worked:
- Human gate that was missed or stayed open:
- Evidence file that was most useful:
- Evidence gap that made review harder:

## 2. Improvement backlog
| Priority | Finding | Pipeline part | Suggested change | Owner | Validation on next run |
|---:|---|---|---|---|---|
| P1 | | role spec / handoff / human gate / eval check / run protocol / context file | | | |
| P2 | | | | | |
| P3 | | | | | |

## 3. One change before the next run
**Recommended first improvement:**
**Why this one:**
**Patch target:**
**Next-run validation:** what must be true in the next run to prove it worked.
```

## Human gates

Pause if scope, schedule, budget, risk acceptance or release approval needs an owner decision.

## Done when

The run has a recommendation — adopt for team use, pilot with fixes, or defer — plus one pipeline
improvement to validate on the next run.
