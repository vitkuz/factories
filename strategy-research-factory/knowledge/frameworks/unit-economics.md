---
id: unit-economics
name: Unit economics
purpose: Test whether one customer (or unit) is profitable over its life, and what price and costs make it so.
problemTypes: [unit-economics, pricing, revenue-model]
useWhen:
  - the question is "can we make money" per customer, deal or unit
  - comparing pricing or business models
doNotUseWhen:
  - there is no defined customer unit or price yet and no comparables exist
  - the question is about market structure or organisation
questionsAnswered:
  - What does it cost to acquire, serve and retain a customer?
  - What is the lifetime value, the payback period and the gross margin?
  - At what price and scale does the model work?
requiredEvidence: [comparable-pricing, customer-acquisition-cost-benchmarks, churn-or-retention-benchmarks, gross-margin-benchmarks, delivery-costs]
outputs: [unit-economics-model, pricing-range, break-even-conditions]
complexity: 3
overlapsWith: [profit-tree]
pairsWellWith: [tam-sam-som, customer-segmentation]
---

## How to apply

1. Define the **unit** (customer account, seat, deal, transaction).
2. Estimate **price / ARPA**, **gross margin**, **CAC**, **retention or churn**, from comparables
   with evidence ids; every derived value is INFERENCE with its formula.
3. Compute **LTV = ARPA × gross margin ÷ churn**, **LTV/CAC**, **CAC payback months**.
4. Run **low / base / high** cases and state the conditions under which LTV/CAC > 3 and payback
   < 18 months (or the relevant benchmark for the model).

## Output shape

```yaml
unit:
inputs: { arpa:, grossMargin:, cac:, churn:, evidence: [] }
results: { ltv:, ltvToCac:, paybackMonths:, formulae: [] }
cases: { low: {}, base: {}, high: {} }
breakEvenConditions: []
```

## Pitfalls

- Benchmarks from a different business model (self-serve SaaS numbers for enterprise services).
- A single-point answer with no cases.
- Forgetting delivery or services costs in gross margin.

## Reading the result

If the base case only works with best-in-class retention and CAC, the model is fragile; the
recommendation should name the one metric to prove in a pilot before scaling.
