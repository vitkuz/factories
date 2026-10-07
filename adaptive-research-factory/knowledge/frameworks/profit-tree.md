---
id: profit-tree
name: Profit tree
purpose: Decompose profit into revenue and cost drivers to locate what moves (or would move) profitability.
problemTypes: [profitability-diagnosis, revenue-model, cost-structure]
useWhen:
  - diagnosing why profit is below expectations or peers
  - building the economics of a new business line from its drivers
doNotUseWhen:
  - the question is about customer needs, competition or organisation
  - per-customer economics are what matter (use unit-economics)
questionsAnswered:
  - Which revenue drivers (price, volume, mix) and cost drivers (fixed, variable) determine profit?
  - Which driver explains the gap or holds the most leverage?
requiredEvidence: [revenue-by-driver, pricing, volumes, cost-breakdown, peer-benchmarks]
outputs: [driver-tree, leverage-points]
complexity: 2
overlapsWith: [unit-economics]
pairsWellWith: [value-chain]
---

## How to apply

1. Write the identity: **profit = revenue − costs; revenue = price × volume (by segment);
   costs = fixed + variable × volume**.
2. Extend each branch one or two levels where evidence exists.
3. Fill each driver with values and sources; benchmark against peers where possible.
4. Run a **sensitivity**: which driver's ±10 percent changes profit most.

## Output shape

```yaml
tree:
  revenue: { price:, volume:, mix:, evidence: [] }
  costs:   { fixed:, variable:, evidence: [] }
benchmarks: []
sensitivity: [{ driver:, profitChangeFor10pct: }]
leveragePoints: []
```

## Pitfalls

- A tree with no numbers.
- Mixing periods or currencies across branches.

## Reading the result

The driver with the biggest sensitivity and the most management control is where the
recommendation should focus; a driver the company cannot influence is a risk, not a lever.
