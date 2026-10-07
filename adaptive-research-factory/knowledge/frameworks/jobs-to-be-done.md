---
id: jobs-to-be-done
name: Jobs to Be Done
purpose: Explain why customers would adopt, by the progress they are trying to make and what they fire to make it.
problemTypes: [customer-needs, customer-demand, product-market-fit]
useWhen:
  - the question is whether and why customers would adopt a new offer
  - existing categories hide what customers are really buying
doNotUseWhen:
  - sizing the market or assessing industry profitability
  - customers are already well understood and the question is about competitors or economics
  - no customer evidence (interviews, reviews, surveys, usage data) can be found
questionsAnswered:
  - What job is the customer hiring a solution for?
  - What do they use today, and what frustrates them about it?
  - What would make them switch (push, pull, anxiety, habit)?
requiredEvidence: [customer-interviews-or-surveys, product-reviews, usage-data, switching-stories, current-alternatives]
outputs: [job-statements, switching-forces, unmet-outcomes]
complexity: 3
overlapsWith: [customer-journey]
pairsWellWith: [customer-segmentation, three-cs]
---

## How to apply

1. Write the **core job** as "When <situation>, I want to <motivation>, so I can <outcome>".
2. List the **current solutions** hired for the job, including workarounds and doing nothing.
3. Collect **outcome statements** (what "done well" means: faster, cheaper, less risk) and mark
   which are underserved, with evidence.
4. Map the **forces of progress**: push of the current situation, pull of the new solution,
   anxiety about the new one, habit of the present.
5. Conclude whether push + pull clearly exceed anxiety + habit for a named segment.

## Output shape

```yaml
coreJob:
currentSolutions: []
outcomes: [{ outcome:, underserved: true|false, evidence: [] }]
forces: { push: [], pull: [], anxiety: [], habit: [] }
switchingVerdict: { segment:, likely: true|false, reason:, evidence: [] }
```

## Pitfalls

- Writing a feature list as a job.
- Inventing jobs with no customer evidence (reviews, forums, surveys count; intuition does not).
- Ignoring "do nothing" as the main competitor.

## Reading the result

Strong push but high anxiety means the offer needs risk reversal (pilots, guarantees) before it
needs features. Weak push means demand is aspirational; expect slow adoption whatever the price.
