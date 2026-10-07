---
id: ansoff
name: Ansoff matrix
purpose: Classify growth options by new vs existing products and markets, to make their risk explicit.
problemTypes: [growth-strategy, entry-strategy, strategic-options]
useWhen:
  - comparing growth options with different distance from the core business
  - the decision is which direction to grow, not whether a market is attractive
doNotUseWhen:
  - there is only one option on the table
  - the question needs market size, economics or customer insight (Ansoff classifies, it does not evaluate)
questionsAnswered:
  - Is this option market penetration, market development, product development or diversification?
  - How far is each option from the core, and what risk does that carry?
requiredEvidence: [current-products-and-markets, option-descriptions, adjacency-success-rates]
outputs: [option-classification, risk-profile]
complexity: 1
overlapsWith: []
pairsWellWith: [three-cs, scenario-planning]
---

## How to apply

1. List the **options** under consideration.
2. Place each in a quadrant: existing / new **product** × existing / new **market**.
3. For each, state what is **new** (capability, customer, channel) and the evidence on how often
   similar moves succeed.
4. Rank options by distance from the core and the capabilities they need.

## Output shape

```yaml
options:
  - { option:, quadrant: penetration|market-development|product-development|diversification, whatIsNew: [], evidence: [] }
ranking: []
```

## Pitfalls

- Using the quadrant as the answer; it only frames risk.
- Treating "new product for new customers" as a simple extension.

## Reading the result

Diversification moves need a reason the company is advantaged anyway; without one, the matrix
is saying "high risk" and the synthesis should say so plainly.
