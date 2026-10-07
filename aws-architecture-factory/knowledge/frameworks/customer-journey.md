---
id: customer-journey
name: Customer journey (buying and adoption journey)
purpose: Map the stages a buyer goes through, to find where adoption stalls and who decides.
problemTypes: [adoption-barriers, customer-needs, go-to-market]
useWhen:
  - adoption is slow or uncertain and the question is where and why
  - enterprise purchases involve several stakeholders and gates
doNotUseWhen:
  - the question is whether demand exists at all (use jobs-to-be-done first)
  - market size, profitability or industry structure questions
questionsAnswered:
  - What stages does a buyer go through from trigger to scaled use?
  - Who is involved and who can veto at each stage?
  - Where do deals or deployments stall, and why?
requiredEvidence: [buying-process-descriptions, stakeholder-roles, sales-cycle-length, pilot-to-production-rates, procurement-requirements]
outputs: [journey-map, stall-points, stakeholder-map]
complexity: 3
overlapsWith: [jobs-to-be-done]
pairsWellWith: [customer-segmentation]
---

## How to apply

1. Define the **stages** (e.g. trigger → evaluate → pilot → procure → deploy → expand).
2. For each stage: the **stakeholders**, their goal, the evidence of time spent and the **exit
   criterion**.
3. Mark **stall points** with evidence (conversion rates, cycle lengths, reported blockers).
4. Name the **veto holders** (security, legal, procurement) and what they require.

## Output shape

```yaml
stages:
  - { stage:, stakeholders: [], exitCriterion:, typicalDuration:, stallRisk:, evidence: [] }
stallPoints: []
vetoHolders: [{ role:, requirement:, evidence: [] }]
```

## Pitfalls

- Drawing the seller's funnel instead of the buyer's journey.
- Ignoring the gap between pilot and production.

## Reading the result

The stage with the biggest drop-off is where the product and the go-to-market must invest first;
a veto holder's requirement is often a feature, not a sales problem.
