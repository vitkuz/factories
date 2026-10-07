---
id: value-chain
name: Value chain analysis
purpose: Break the business into activities to find where cost and differentiation are created, and which activities to own.
problemTypes: [cost-structure, capability-fit, differentiation, competitive-position]
useWhen:
  - deciding which activities to own, partner for or buy (build / buy / partner)
  - finding the source of a cost or differentiation advantage
doNotUseWhen:
  - estimating demand or market size
  - a quick positioning view is enough (use three-cs)
  - the business model does not exist yet and activities cannot be evidenced
questionsAnswered:
  - Which activities create the most value or cost?
  - Where is the company advantaged or disadvantaged versus competitors?
  - Which activities should be owned, partnered or outsourced?
requiredEvidence: [activity-costs, competitor-operating-models, capability-evidence, partner-landscape]
outputs: [activity-map, advantage-sources, make-buy-partner-view]
complexity: 4
overlapsWith: [three-cs, mckinsey-7s]
pairsWellWith: [porter-five-forces, unit-economics]
---

## How to apply

1. List the **primary activities** (e.g. build, sell, deliver, support) and **support
   activities** (platform, talent, partnerships) for this business.
2. For each: share of cost or effort (estimated, labelled as inference if derived), and whether
   it drives **differentiation** in the customer's eyes.
3. Compare with 2–3 competitors' operating models.
4. For each activity decide **own / partner / buy**, with the reason.

## Output shape

```yaml
activities:
  - { activity:, type: primary|support, costShare:, differentiator: true|false, companyVsCompetitors:, evidence: [] }
advantageSources: []
makeBuyPartner: [{ activity:, choice:, reason: }]
```

## Pitfalls

- Invented cost shares presented as facts.
- Listing activities without comparing to competitors.

## Reading the result

Own the activities that differentiate and where the company is advantaged; partner for the rest.
An advantage that sits in an activity customers do not value is not an advantage.
