# Framework routing

The router decides, for every sub-problem, which frameworks (if any) will be used to answer it.
It works **only from the framework metadata index** in the run folder: purpose, problem types,
use-when, do-not-use-when, questions answered, required evidence, outputs, complexity and
overlaps. It never opens a framework body. That is what keeps routing cheap as the registry
grows. Zero frameworks is a valid, often correct, outcome.

## The algorithm, per sub-problem

1. **Retrieve.** Candidates are the frameworks listed under the sub-problem's problem types in
   the index's `problemTypes` map. This lookup is mechanical. You may add at most two
   **discretionary** candidates whose `purpose` clearly fits a need the lookup missed. Mark them
   `discretionary: true`. A `custom: true` type retrieves nothing.
2. **Exclude.** Reject any candidate whose `doNotUseWhen` matches the sub-problem, quoting the
   matching line. Excluded candidates are not scored.
3. **Score** each remaining candidate on six dimensions:

   | Dimension | Range | Question |
   |-----------|-------|----------|
   | problemFit | 0–5 | How well do its `problemTypes` and `useWhen` match this sub-problem? |
   | questionCoverage | 0–5 | What share of the sub-question do its `questionsAnswered` cover? |
   | decisionRelevance | 0–5 | Would its `outputs` move the decision, not just describe the context? |
   | evidenceAvailability | 0–5 | Is its `requiredEvidence` findable in public sources for this scope? (Use the sub-problem's `evidenceOutlook`.) |
   | frameworkOverlap | 0 to −5 | How much does it duplicate a framework already selected for this sub-problem, or one selected elsewhere that already answers this? `overlapsWith` is the first signal. |
   | unnecessaryComplexity | 0 to −5 | `−(complexity − 2)` when a simpler candidate or a custom analysis would answer as well, capped at −5. Otherwise 0. |

   `score = problemFit + questionCoverage + decisionRelevance + evidenceAvailability + frameworkOverlap + unnecessaryComplexity`,
   from −10 to 20.
4. **Select greedily, smallest useful set.** Sort by score. Take the top candidate if its score
   is **≥ 12** and it has **no dimension at 0 among the four positive ones**. Take a further
   candidate only if it scores ≥ 12 **after** its overlap penalty has been re-scored against what
   is already selected, and it covers a part of the question the selected set does not.
   - **At most 2 frameworks per sub-problem.** A third needs an explicit `exceptionReason`.
   - **At most 6 distinct frameworks per study.** Beyond that, drop the lowest-scoring selection
     that another selected framework can absorb, and record the drop.
5. **Fall back to custom analysis** when nothing qualifies, when the type is custom, or when the
   best framework covers less than half of the question. Write the custom decomposition: 2–5
   MECE analytical questions that answer the sub-problem. You may also combine one framework with
   a custom analysis that covers the rest.
6. **Record everything.** Record every selection with its reason. Record every candidate that
   was excluded or not selected, with its reason. A framework that was never retrieved is not
   listed.

Reuse across branches is encouraged: a framework selected for two sub-problems counts once
toward the study budget.

## Shape — `framework-selection.yaml`

```yaml
frameworkSelection:
  SP-Q1.1:
    question: "Is there sufficient customer demand?"
    problemTypes: [customer-demand, product-market-fit]
    candidates: [customer-segmentation, jobs-to-be-done]     # retrieved + discretionary
    selected:
      - framework: customer-segmentation
        score: { problemFit: 5, questionCoverage: 3, decisionRelevance: 4, evidenceAvailability: 3, frameworkOverlap: 0, unnecessaryComplexity: 0, total: 15 }
        reason: "Identify distinct buyer groups; demand differs by regulation intensity."
        appliesTo: "which segments show intent to buy in 2027-2030"
      - framework: jobs-to-be-done
        score: { ..., total: 13 }
        reason: "Explain why customers would adopt instead of building in-house."
        appliesTo: "switching forces vs in-house platforms"
    rejected:
      - framework: porter-five-forces
        discretionary: true
        excludedBy: "doNotUseWhen: understanding detailed customer needs or adoption behaviour"
        reason: "Does not directly answer customer adoption behaviour."
    customAnalysis: null           # or { reason:, questions: ["...", "..."] }
  SP-Q6.2:
    question: "Could hyperscalers bundle the capability for free?"
    problemTypes: [{ type: platform-bundling-risk, custom: true }]
    candidates: []
    selected: []
    rejected: []
    customAnalysis:
      reason: "No registry framework covers bundling risk; a custom split is sharper."
      questions: ["What do the top 3 clouds ship today?", "What have they announced?", "What did bundling do to comparable categories?"]
loadList: [customer-segmentation, jobs-to-be-done]   # distinct selected ids; the only framework files later steps may open
studyBudget: { distinctFrameworks: 2, limit: 6, drops: [] }
routingNotes: ["<cross-branch reuse, overlaps resolved, anything a reviewer should know>"]
treeFeedback: null            # or a list of { nodeId, problem, suggestedFix } when the tree itself must change
```

## Rules

- Never force a sub-problem into a framework. A low-scoring framework used anyway is framework
  misuse, and review will send it back.
- A framework is not a report structure. It answers part of one branch.
- `treeFeedback` is only for defects that make routing impossible: overlapping branches, a leaf
  that is not a question, or a branch the decision obviously needs that is missing. Poor
  wording is not a tree defect.
