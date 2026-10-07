---
id: scenario-planning
name: Scenario planning
purpose: Build a few plausible futures from the two most important uncertainties, and test the decision against each.
problemTypes: [uncertainty-and-risk, technology-change, strategic-options]
useWhen:
  - the decision depends on uncertainties that research cannot resolve today
  - the timeframe is long enough (typically 3+ years) for the environment to shift
doNotUseWhen:
  - the key uncertainties can be settled with available evidence
  - the timeframe is short and trends are stable
questionsAnswered:
  - What are the critical uncertainties and how could they resolve?
  - How does the decision perform in each plausible future?
  - Which early indicators tell which future is arriving?
requiredEvidence: [key-uncertainties, trend-data, expert-forecasts, historical-analogues]
outputs: [scenario-set, robustness-assessment, leading-indicators]
complexity: 4
overlapsWith: [pestel]
pairsWellWith: [pestel, ansoff]
---

## How to apply

1. List the **driving forces**; separate **trends** (near certain) from **uncertainties**.
2. Pick the **two uncertainties** with the highest effect on the decision and the highest
   uncertainty. They must be independent of each other.
3. Cross them into **four scenarios**; name each and describe it in three sentences, keeping
   trends constant across all four.
4. Test each **option** against each scenario (wins / survives / fails).
5. Name **leading indicators** for each scenario and the no-regret moves that win in most.

## Output shape

```yaml
trends: []
axes: [{ uncertainty:, poleA:, poleB:, evidence: [] }]
scenarios: [{ name:, narrative:, signals: [] }]
optionRobustness: { <option>: { <scenario>: wins|survives|fails } }
noRegretMoves: []
```

## Pitfalls

- A "base / best / worst" set, which is a forecast range, not scenarios.
- Correlated axes that produce two impossible scenarios.
- Assigning probabilities without evidence.

## Reading the result

An option that wins in one scenario and fails in three is a bet; say so, and recommend the
indicator to watch before committing.
