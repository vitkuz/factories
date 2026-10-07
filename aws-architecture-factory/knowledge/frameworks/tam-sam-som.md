---
id: tam-sam-som
name: TAM / SAM / SOM market sizing
purpose: Size the total, serviceable and obtainable market, top-down and bottom-up, to judge whether the prize is worth the effort.
problemTypes: [market-sizing, market-growth, market-attractiveness]
useWhen:
  - the decision depends on how big the opportunity is
  - an investment case needs a revenue ceiling
doNotUseWhen:
  - the question is about why customers buy or how to win
  - sizing is not decision-relevant (the market is obviously large enough or obviously too small)
questionsAnswered:
  - How big is the total market and how fast is it growing?
  - Which part can the company actually serve?
  - What share is realistically obtainable in the timeframe?
requiredEvidence: [market-size-estimates, growth-rates, customer-counts, spend-per-customer, adoption-rates, competitor-revenues]
outputs: [market-size-ranges, growth-scenarios, obtainable-revenue-range]
complexity: 3
overlapsWith: []
pairsWellWith: [customer-segmentation, unit-economics]
---

## How to apply

1. **Define the market** as spend on a job, product scope, geography and year.
2. **Top-down:** start from a published total, apply filters (segment, geography, use case),
   citing each filter.
3. **Bottom-up:** number of target customers × adoption rate × annual spend per customer.
4. **Reconcile:** if the two routes differ by more than 2x, find the assumption that drives the
   gap and say which route you trust.
5. **SAM:** the part the company can serve with its product, channels and geography.
6. **SOM:** a share of SAM justified by comparables (what share similar entrants reached in
   similar time), as a range.
7. **Growth:** a base / low / high range to the end of the timeframe; never a single point.

## Output shape

```yaml
definition:
tam:  { low:, high:, unit:, year:, route: top-down|bottom-up|reconciled, evidence: [] }
sam:  { low:, high:, filters: [], evidence: [] }
som:  { low:, high:, comparables: [], evidence: [] }
growth: { base:, low:, high:, toYear: }
reconciliation:
sanityChecks: []   # per customer, per employee, share of a known total
```

## Pitfalls

- Quoting one vendor's market-report press release as the TAM.
- Adding up overlapping segments.
- Presenting SOM as a forecast instead of a comparable-based range.
- False precision ($41.37B).

## Reading the result

What matters for the decision is usually SOM against the investment, not TAM. A large TAM with
a small, contested SAM is a red flag, not a green one.
