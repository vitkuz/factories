---
id: pestel
name: PESTEL
purpose: Scan political, economic, social, technological, environmental and legal forces that shape a market from outside.
problemTypes: [macro-environment, regulatory-risk, technology-change]
useWhen:
  - external forces (regulation, technology, macro) could make or break the decision
  - entering a new geography with unfamiliar rules
doNotUseWhen:
  - the question is about competitors or customers directly
  - only one external force matters (analyse it directly, do not scan all six)
  - the result would be a generic list with no link to the decision
questionsAnswered:
  - Which external forces materially affect the decision in the timeframe?
  - Which are tailwinds and which headwinds?
  - Which are uncertain enough to need scenarios?
requiredEvidence: [regulation, policy, macro-indicators, technology-trends, social-trends]
outputs: [external-drivers, regulatory-risks, scenario-inputs]
complexity: 2
overlapsWith: [scenario-planning]
pairsWellWith: [scenario-planning]
---

## How to apply

1. For each of the six letters, list only forces with a **plausible material effect** on the
   decision in the timeframe. Leave a letter empty rather than padding it.
2. For each force: direction (tailwind / headwind), size of effect (high / medium / low),
   likelihood and timing, with evidence ids.
3. Rank forces by effect × likelihood; keep the top five.
4. Flag forces with **high effect and high uncertainty** as scenario drivers.

## Output shape

```yaml
forces:
  - { letter: P|E|S|T|E|L, force:, direction:, effect:, likelihood:, timing:, evidence: [] }
topForces: []
scenarioDrivers: []
```

## Pitfalls

- A six-box list of truisms with no link to the decision.
- Mixing trends (certain) with uncertainties (scenario material).
- Citing regulation that is proposed as if it were enacted.

## Reading the result

A single high-effect legal or technology force usually matters more than the rest combined;
say which one, and whether the decision should wait for it to resolve.
