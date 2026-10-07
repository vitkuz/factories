---
id: customer-segmentation
name: Customer segmentation
purpose: Split buyers into groups that behave differently, and pick the segment to serve first.
problemTypes: [buyer-segmentation, customer-demand, go-to-market]
useWhen:
  - demand differs a lot between buyer groups
  - choosing a beachhead segment for entry
doNotUseWhen:
  - there is effectively one buyer type
  - the question is industry profitability or internal organisation
questionsAnswered:
  - Which distinct buyer groups exist?
  - How large, reachable and willing to pay is each?
  - Which segment should be served first, and why?
requiredEvidence: [buyer-firmographics, segment-sizes, needs-by-segment, willingness-to-pay, channel-reach]
outputs: [segment-map, beachhead-choice]
complexity: 3
overlapsWith: []
pairsWellWith: [jobs-to-be-done, tam-sam-som]
---

## How to apply

1. Choose **segmentation variables that predict behaviour** (need, use case, size, regulation,
   maturity), not just demographics. Two variables are usually enough.
2. Define 3–6 **segments**, mutually exclusive, each with a name and a one-line profile.
3. Score each on **size, growth, need intensity, willingness to pay, reachability, competitive
   intensity** (1–5, with evidence ids).
4. Pick a **beachhead**: the segment with intense need, reachable buyers and a path to the next
   segment.

## Output shape

```yaml
variables: []
segments:
  - { name:, profile:, size:, growth:, needIntensity:, willingnessToPay:, reachability:, competition:, evidence: [] }
beachhead: { segment:, reason:, nextSegment: }
```

## Pitfalls

- Segments defined by the seller's org chart, not by buyer behaviour.
- Scoring without evidence.
- A beachhead chosen for size alone.

## Reading the result

The beachhead drives the whole go-to-market; if no segment scores high on both need and
reachability, demand is not yet concentrated enough to enter.
