# Stop Conditions for Hypothesis Research

Research reduces uncertainty. It is not a report. For every hypothesis, ask one question: what evidence would materially change the decision? Stop when the answer is "none that is realistic to find".

Research must not run indefinitely. Every hypothesis gets stop conditions written before the first search, and the collector stops as soon as one fires.

## The five conditions

| # | Condition | How to check it |
|---|-----------|-----------------|
| 1 | Evidence is sufficient to classify the hypothesis | The plan's sufficiency threshold is met (counts, source diversity, dates). The evidence supports a status: supported, partially supported, rejected, or inconclusive with a stated reason. |
| 2 | New sources mostly repeat known information | The last 3 sources opened added 0 new claims, or at least 2 of the last 3 only restated claims already recorded. |
| 3 | More evidence is unlikely to change the decision | Write one sentence: "Even if the remaining unknown went to its worst or best case, the decision stays the same because ...". If you cannot write it, do not stop on this condition. |
| 4 | Research budget reached | Any budget cap in the table below is hit (searches, pages opened, or evidence items). Check the counters, do not estimate. |
| 5 | A critical blocker makes deeper research unnecessary | A named blocker exists: a disconfirming fact that already decides the hypothesis, a required source that is paywalled or does not exist, or data that cannot be obtained at all. State the blocker and why it ends the work. |

Conditions 1 to 3 are the good outcomes. Condition 4 means the hypothesis may be weakly supported, so say so. Condition 5 is an honest finding, not a failure.

## Writing concrete stop conditions in a plan

A stop condition must be checkable by counting. Someone who was not in the room must be able to say yes or no.

Rules:

- Use numbers: how many items, from how many independent sources, within what date window.
- Name the evidence type: listings, transactions, official statistics, filings, reviews.
- Require independence: two pages that copy one source count as one source.
- Include one disconfirming clause: "at least one search aimed at contradicting evidence has been run".
- Give a sufficiency threshold (stop, classify) and a budget cap (stop, report limits). Both are needed.

Weak: "enough comparable examples exist".
Strong: "at least 5 comparable listings with price and listing date, from at least 2 independent sources, published in the last 12 months".

Weak: "additional research is unlikely to change the conclusion".
Strong: "the last 3 sources added no new claim, and the 5 recorded items agree within 15 percent".

## Default per-hypothesis budget

Use these numbers unless the plan states a reason to change them. Higher-priority hypotheses may get up to 1.5 times the cap. Low-priority ones may get half.

| Counter | Default cap | Typical need |
|---------|-------------|--------------|
| Searches run | 10 | 5 to 8 |
| Pages opened and read | 15 | 8 to 12 |
| Evidence items recorded | 12 | 5 to 8 |

Reserve at least 2 searches for disconfirming evidence. Do not spend the whole budget on confirmation.

## Recording which condition fired

When research stops, write a stop record next to the evidence. Keep it short and factual.

```json
{
  "hypothesisId": "H1",
  "firedCondition": 1,
  "conditionName": "evidence sufficient to classify",
  "why": "6 comparable listings with price and date from 3 independent sources; 1 contradicting item found",
  "counters": { "searches": 7, "pagesOpened": 11, "evidenceItems": 8 },
  "openGaps": ["no closed-transaction prices found"]
}
```

Rules:

- `firedCondition` is a number from 1 to 5. If several fired, record the lowest number and list the others in `why`.
- `why` cites concrete numbers or the named blocker, never "enough research done".
- `openGaps` lists what is still unknown. Use an empty list only if none remain.
- Never record condition 1 when a threshold in the plan was not met. Use 4 or 5 and say what is missing.

## One gap round at most

After a hypothesis is assessed, the pipeline allows at most one extra gap-filling round for it. There is no second extra round.

Consequences:

- The first round must aim to be sufficient. Plan for the threshold, not for a first look.
- Spend the first-round budget on the evidence that decides the status, not on background.
- If a gap round is likely, record the specific gap in `openGaps` so the extra round is targeted.
- After the gap round, stop and report the status with its limits, even if it is inconclusive.

## Worked example

Hypothesis: a studio apartment in a given district can be resold within 6 months without a discount over 10 percent.

Plan stop conditions:

- Sufficient: at least 5 comparable listings with price and listing date, from at least 2 independent sources, published in the last 12 months, plus at least 1 item on time-to-sell or discounting.
- Redundancy: stop if the last 3 sources add no new claim.
- Budget: 10 searches, 15 pages, 12 evidence items.
- Blocker: no listing data for the district at all.

What happened: after 7 searches and 11 pages the collector holds 6 listings from 2 marketplaces, 1 broker report on time-to-sell, and 1 listing showing a 14 percent price cut. The sufficiency threshold is met. Stop record: condition 1, with the contradicting item noted and `openGaps` listing "no closed-transaction prices". Budget was not reached, so no extra search was spent.
