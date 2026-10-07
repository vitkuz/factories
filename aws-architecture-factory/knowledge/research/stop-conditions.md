# Research Stop Conditions

Architecture research is not unlimited. Stop as soon as more work would not change the decision.

## Core principle

Every research action must answer one question:

> What unknown could materially change the architecture decision?

If the action does not reduce that uncertainty, stop. Collecting more facts is not progress.
Before each search or page read, name the unknown it targets. If you cannot, do not do it.

## The seven stop conditions

Research for a hypothesis ends when any one holds. Record which one applied.

| # | Condition | How to recognize it |
|---|---|---|
| 1 | The relevant service constraint is known. | The limit, behavior or price dimension named in the falsification question is found and sourced. |
| 2 | Evidence is sufficient to classify the hypothesis. | You can mark it supported, contradicted or inconclusive with stated confidence. |
| 3 | New sources repeat known information. | Two consecutive sources add no new claim. |
| 4 | Further evidence is unlikely to change the design. | The remaining unknown is small compared with the margin between the options. |
| 5 | The research budget is reached. | The source or search cap in the plan is used up. |
| 6 | A blocker invalidates the candidate. | A hard limit or missing feature rules the choice out. |
| 7 | An architecture driver already determines the decision. | A hard driver (mandated service, region, compliance) leaves no real choice. |

## Budget guidance

- Budget is set per hypothesis in the research plan, as a cap on sources and searches.
- Scale it with priority: a high-priority, one-way hypothesis can use more; a low-priority one gets a quick look.
- A typical hypothesis needs a handful of sources, mostly from tiers 1 to 5 of the source hierarchy.
- When a budget ends the research, mark the result as budget-limited and keep the remaining uncertainty visible. Do not present it as settled.
- Do not use a saved budget on an unrelated hypothesis; spend effort where priority is highest.

## What to record when stopping

```json
{
  "hypothesisId": "H-COMPUTE-01",
  "stoppedBecause": 1,
  "verdict": "SUPPORTED",
  "remainingUncertainty": "Sustained utilization above 60% was not modeled.",
  "confidence": "MEDIUM"
}
```

- `stoppedBecause` is the number from the table above.
- `verdict` is SUPPORTED, CONTRADICTED or INCONCLUSIVE.
- `remainingUncertainty` is mandatory. "None" is allowed only for conditions 1, 6 and 7 with HIGH confidence.

## Anti-patterns

- Searching for confirmation of a favored design and ignoring contradictions.
- Reading a fifth source that restates the first four.
- Researching a two-way decision (instance size, Lambda memory) as if it were irreversible.
- Researching without a falsification question.
- Treating a stopped search as a proven conclusion.
