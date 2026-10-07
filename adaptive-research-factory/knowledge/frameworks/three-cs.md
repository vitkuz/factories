---
id: three-cs
name: 3Cs (Customer, Competitor, Company)
purpose: Find where customer needs, competitor weaknesses and company strengths overlap into a winnable position.
problemTypes: [competitive-position, differentiation, capability-fit]
useWhen:
  - judging whether "we" can win in a market that is already shown to be attractive
  - locating a differentiated position between customer needs and competitor offers
doNotUseWhen:
  - the question is about market size or industry profitability
  - the company is not yet defined (an investor view with no "company" side)
  - a detailed internal capability audit is needed (use value-chain)
questionsAnswered:
  - Which customer needs are unmet or badly met?
  - Where are competitors weak or absent?
  - Which company strengths map to those needs?
  - Is the resulting position defensible?
requiredEvidence: [customer-needs, competitor-offers, competitor-pricing, company-capabilities]
outputs: [strategic-position, differentiation-hypothesis]
complexity: 2
overlapsWith: [porter-five-forces, value-chain]
pairsWellWith: [jobs-to-be-done, customer-segmentation]
---

## How to apply

1. **Customer:** the top needs of the target segment, ranked by importance, with evidence.
2. **Competitor:** for each of 3–6 relevant competitors, how well they meet each need.
3. **Company:** how well the company can meet each need, from its stated capabilities.
4. Build a **needs × players** grid (high / medium / low) and mark the cells where the company
   is strong and competitors are weak on an important need.
5. State the **position** in one sentence and test its defensibility: how fast could a
   competitor copy it?

## Output shape

```yaml
segment:
needs: [{ need:, importance:, evidence: [] }]
grid: { <need>: { company:, <competitor>: } }
whiteSpace: []
position:
defensibility: { rating:, reason:, evidence: [] }
```

## Pitfalls

- A company column filled with aspirations instead of evidenced capabilities.
- Choosing competitors that make the company look good.
- Ignoring non-obvious competitors (in-house builds, platforms bundling the feature).

## Reading the result

No white space means the company competes on price or execution alone. White space that a
larger competitor can close in a year is a timing bet, not a position.
