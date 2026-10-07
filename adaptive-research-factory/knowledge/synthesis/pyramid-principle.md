# Pyramid Principle: the logical structure of the final answer

Use this to turn many hypothesis evaluations into one answer.
The answer comes first. The reasons follow. The evidence sits under the reasons.
The reader should get the decision in 30 seconds and the case for it in 5 minutes.

## The pyramid

```text
Governing thought            one sentence, answers the user's question
  |
  +-- Key reason 1           full-sentence claim
  |     +-- hypotheses (ids, status) + evidence ids
  +-- Key reason 2
  |     +-- hypotheses (ids, status) + evidence ids
  +-- Key reason 3           3-5 reasons, never more than 5
        +-- hypotheses (ids, status) + evidence ids

Then, below the reasons:
  Supporting evidence   claim, source, date, grade, evidence id
  Risks                 what could make the answer wrong, with a trigger
  Unknowns              what we could not settle, and what would settle it
  Confidence            HIGH / MEDIUM / LOW, with the cause of any doubt
```

## Order of the answer

1. Governing thought. If the answer is conditional, state the conditions here.
2. Key reasons.
3. Supporting evidence.
4. Risks.
5. Unknowns.
6. Confidence.

## Optional SCQ opener

Open with SCQ only when the reader needs context to see why the question matters.
- Situation: what the reader already agrees with. One sentence.
- Complication: what changed or what is at stake. One sentence.
- Question: the question the answer resolves.

The governing thought is the answer to Q. SCQ never replaces it and never delays it past the opener.

## Vertical logic

Each level answers "why?" (or "how?") of the level above.
- The governing thought raises: why this answer?
- The key reasons answer exactly that, and nothing else.
- Each reason raises: what shows this?
- The hypotheses and evidence ids answer that.

Test downward: does each group fully answer the question its parent raises?
Test upward: do the reasons add up to the governing thought, no more and no less?

## Horizontal logic

Siblings are the same kind of idea. Three reasons, or four reasons. Not two reasons and a risk.
- MECE: no two reasons overlap, and together they cover what decides the answer.
- Prefer parallel (inductive) reasons. If one fails, the others still stand.
- Use a chain (this, so that, so the answer) only when the logic really is a chain.
- Order the reasons by importance to the decision, strongest or most decisive first.
- Group by the question's own structure, not by the order in which hypotheses were tested.
- Several hypotheses can sit under one reason. One hypothesis should not be split across reasons.

## How REJECTED and INCONCLUSIVE hypotheses still shape the answer

Every evaluated hypothesis is used. None is dropped because it failed.
- SUPPORTED: carries a reason.
- PARTIALLY_SUPPORTED: carries a reason with a stated limit. The limit may become a condition.
- REJECTED: a real finding. It can be a reason ("liquidity is weak"), a risk, or the trigger for a condition. A rejected hypothesis often flips or narrows the answer.
- INCONCLUSIVE: goes to Unknowns, and lowers confidence on the reason it sits under. Say what evidence would close it. If it is decisive, it can become a condition on the recommendation.

Never hide a REJECTED hypothesis to keep the story clean. Never present INCONCLUSIVE as support.

## Never a chronology

Do not write "first we looked at, then we found". The reader does not need the research diary.
- Do not organize by the order of work, sources searched or hypotheses tested.
- Do not list activity. State findings and what they mean for the decision.
- Every sentence must support the governing thought or qualify it.

## Rules for each reason

- A full sentence with a subject and a verb, with a number where the evidence has one.
- Backed by at least one evaluated hypothesis and its evidence ids. A reason with none is cut.
- Only facts and insights from the evaluations. The synthesis organizes; it does not discover.
- Keep fact, interpretation and uncertainty visibly separate.

## Worked example: studio in Didi Dighomi, conditional buy

Question: should I buy a USD 55,000 studio in Didi Dighomi?

Governing thought: Buy, but only if the price is at or below the threshold, resale liquidity holds, and no large new supply is confirmed nearby. (Medium confidence.)

Key reasons:
1. The price is fair for the area, so entry cost is not the main risk. Backed by H1 (SUPPORTED), E1, E2.
2. Rental yield covers holding costs with a thin margin, so the studio can be held through a slow sale. Backed by H2 (PARTIALLY_SUPPORTED, margin depends on occupancy), E3, E4.
3. Resale is slower than average for generic studios, so the exit is the weak point. Backed by H3 (REJECTED: "easy to resell"), E5, E6.
4. Planned new buildings may add competing supply, which could push resale prices down. Backed by H4 (INCONCLUSIVE), E7.

Conditions come from the weak reasons:
- Price at or below the threshold, set from reason 1.
- Hold horizon long enough to absorb a slow sale, from reason 3.
- Re-check supply before signing, from reason 4.

Risks: a slow sale forces a discount; occupancy falls below the yield assumption.
Unknowns: how many of the planned buildings will be built (H4); what discount a fast sale needs.
Confidence: MEDIUM. Evidence is strong on price, thin on supply.

Note how the REJECTED hypothesis became reason 3 and a condition, and the INCONCLUSIVE one became reason 4, an unknown and a condition. Neither was dropped.

## Final check

- [ ] The first sentence answers the question.
- [ ] 3-5 reasons, same kind, no overlap, ordered by importance.
- [ ] Every reason cites hypothesis ids and evidence ids.
- [ ] Every hypothesis status is accounted for.
- [ ] Risks, unknowns and confidence are present.
- [ ] Nothing reads as a chronological account of the work.
