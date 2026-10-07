---
id: porter-five-forces
name: Porter's Five Forces
purpose: Assess structural industry attractiveness and the competitive pressure on profits.
problemTypes: [market-attractiveness, industry-structure, competitive-pressure]
useWhen:
  - evaluating whether an industry can sustain attractive profits
  - understanding the structural forces a new entrant would face
  - comparing the attractiveness of two or more industries or segments
doNotUseWhen:
  - estimating market size or growth
  - understanding detailed customer needs or adoption behaviour
  - diagnosing internal organisational problems
  - the "industry" is not yet defined (a nascent category with no stable players)
questionsAnswered:
  - How intense is rivalry among existing competitors?
  - How strong is buyer power?
  - How strong is supplier power?
  - How high are barriers to entry?
  - How significant is the threat of substitutes?
requiredEvidence: [competitors, market-concentration, customers, suppliers, substitutes, barriers-to-entry, industry-margins]
outputs: [competitive-pressure-analysis, structural-risks, strategic-implications]
complexity: 3
overlapsWith: [three-cs]
pairsWellWith: [tam-sam-som, value-chain]
---

## How to apply

1. **Define the industry** precisely: product scope and geography. A wrong boundary makes every
   force wrong. State it in one sentence.
2. For each of the five forces, list the **drivers** (e.g. rivalry: number and size of players,
   growth rate, fixed costs, switching costs, differentiation).
3. Rate each force **low / medium / high** from evidence, citing evidence ids per driver.
4. Name the **one or two forces that dominate** profitability; most industries are shaped by one.
5. Note **trends**: which force is getting stronger or weaker over the timeframe, and why.
6. Check the result against **observed margins**: if forces are "low" but margins are thin, the
   rating is wrong or a force is missing (e.g. a complementor or regulator).

## Output shape

```yaml
industryDefinition:
forces:
  rivalry:          { rating: low|medium|high, drivers: [], evidence: [EV-...], trend: }
  buyerPower:       { ... }
  supplierPower:    { ... }
  threatOfEntry:    { ... }
  threatOfSubstitutes: { ... }
dominantForces: []
observedMargins: { value:, evidence: [] }
soWhat:
```

## Pitfalls

- Treating it as a checklist instead of finding the forces that matter.
- Rating forces with adjectives and no evidence.
- Using it for a category that does not yet exist as an industry.
- Confusing a competitor's strength (company-level) with industry structure.

## Reading the result

High forces mean the average player earns thin returns: entry is attractive only with a
position that neutralises the dominant force (switching costs, a scarce input, a distinct
segment). Low forces with rising entry signal a window that is closing.
