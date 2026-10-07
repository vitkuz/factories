---
id: root-cause-analysis
name: Root Cause Analysis
purpose: Explain why a metric or outcome moved by localising the change, testing candidate causes against data and separating root causes from contributing ones.
problemTypes: [root-cause-diagnosis]
useWhen:
  - the question is "why is X happening" and X is an observed change in a metric (churn rising, conversion falling, costs up)
  - several plausible explanations compete and data exists to tell them apart
  - an intervention is planned and must target the cause, not the symptom
doNotUseWhen:
  - the question is what to do or which option to choose, not why something happened
  - the symptom cannot be measured or has no baseline to compare against
  - the outcome is a forecast or has not happened yet
questionsAnswered:
  - What exactly changed, by how much and when?
  - Where (which segment, channel, region, cohort) is the change concentrated?
  - Which candidate causes are supported, refuted or untested by the evidence?
  - Which causes are root causes and which are only contributing?
  - How confident are we in the explanation?
requiredEvidence: [metric-time-series, segment-breakdowns, event-timeline, operational-data, customer-feedback]
outputs: [symptom-definition, segment-localisation, candidate-causes, root-causes, confidence]
complexity: 3
overlapsWith: [profit-tree]
pairsWellWith: [hypothesis-driven, mece]
---

## How to apply

1. **Define the symptom precisely.** Name the metric, its definition, the time window and the
   baseline ("monthly logo churn rose from 2.1% to 3.4% between March and June"). If the
   question is vague, fix the definition first; a moving definition is itself a candidate cause.
2. **Segment to localise.** Split the change by customer type, product, region, channel,
   cohort and tenure. Find where it is concentrated; a uniform change points to a global cause,
   a concentrated one to a local cause. Compare mix shift against within-segment change.
3. **List candidate causes as a cause tree** (or fishbone categories such as product, price,
   service, competition, market, measurement). Keep branches mutually exclusive and cover
   measurement artefacts and external events, not only internal ones.
4. **Run 5 Whys on each live branch.** Ask why until the answer is something you can act on,
   with evidence at every level. Stop when the next "why" has no evidence or leaves the
   organisation's control.
5. **Test each candidate against data.** Does timing match (cause precedes effect)? Does the
   effect appear in exactly the segments exposed to the cause and not in unexposed ones? Is the
   size enough to explain the movement? Mark each candidate supported, refuted or untested.
6. **Separate contributing from root causes** and correlation from causation. A root cause is
   one whose removal would have prevented the symptom; a contributing cause amplifies it.
   Prefer natural experiments, dose-response and before/after comparisons over co-movement.
7. **State confidence** and what evidence would change the conclusion.

## Output shape

```yaml
symptom: { metric:, definition:, window:, baseline:, current:, change: }
segments:
  - { dimension:, segment:, change:, shareOfTotalChange:, evidence: [] }
candidateCauses:
  - { cause:, branch:, mechanism:, evidence: [], status: supported|refuted|untested, role: root|contributing|unclear }
rootCauses: []
confidence: high|medium|low   # with what would change the conclusion
```

## Pitfalls

- Stopping at the first plausible cause (anchoring) instead of testing alternatives.
- Treating correlation or co-timing as causation; ignoring a third factor that drives both.
- Skipping segmentation, so a mix shift is mistaken for a real change in behaviour.
- 5 Whys chains built on opinion; each level needs its own evidence.
- Missing data or definition changes as the cause (instrumentation, tracking, reclassification).
- Naming a single root cause when several contribute; quantify each share where possible.

## Reading the result

Trust a root cause only when it is supported by timing, segment pattern and size together. Report
untested candidates openly, with the cheapest test that would resolve them, and lead with the
cause that explains the largest share of the change. Low confidence is a valid result; say so
rather than naming a cause the evidence does not carry.
