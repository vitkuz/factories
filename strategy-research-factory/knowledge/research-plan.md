# The research plan

The plan turns hypotheses into targeted research tasks. Every task traces **decision →
issue-tree question → hypothesis**. A task that cannot name that chain is broad research, and it
is cut. Kill tests come first.

## The five lenses

Five analysts run in parallel, and each runs only the tasks assigned to its lens. A task has
exactly one lens. A task that needs two lenses is two tasks.

| Lens | Owns |
|------|------|
| `market` | market size and growth, prices, costs, unit economics, financials, official statistics; market sizing top-down and bottom-up |
| `customer` | segments, needs, jobs, buying process, adoption and pilot-to-production rates, willingness to pay, surveys and reviews |
| `competition` | named players, products, pricing, strategy, funding and M&A, substitutes, barriers to entry, in-house alternatives |
| `environment` | technology shifts, regulation and policy, standards, macro forces |
| `counter-evidence` | kill tests for priority-1 and priority-2 hypotheses, bear cases, failed attempts, contrary data, rival explanations, evidence for the competing hypotheses |

A lens with no tasks is allowed. Its analyst records that and stops.

## Shape — `research-plan.yaml`

```yaml
decision: "<from the brief, one line>"
researchTasks:
  R1:
    hypothesis: H1
    questionId: Q1.1
    lens: customer
    killTest: true
    objective: "Establish the share of large EU banks with agents in production, 2025-2026."
    questions: ["What share of banks run agents in production?", "What share plan to by 2028?"]
    requiredData: ["production-adoption %, with sample size and date"]   # from the frameworks' requiredEvidence where one applies
    frameworkInputs: { framework: customer-segmentation, evidence: [needs-by-segment] }   # or null
    preferredSources: ["ECB / EBA reports", "bank annual reports", "surveys with stated samples"]
    searchQueries: ["<3-5 ready-to-paste queries: one plain, one with a year, one naming a source, one phrased as the opposite claim>"]
    doneWhen: "two independent sources, or a stated gap"
lensSummary:
  market: [R3, R4]
  customer: [R1, R2]
  competition: [R5, R6]
  environment: [R7]
  counter-evidence: [R8, R9, R10]
sizingApproach: null          # or { topDown: "<formula + inputs>", bottomUp: "<formula + inputs>" } when a market must be sized
stopRule: "every task has an answer or a stated gap; 8-20 records per active lens is normal"
risks: ["<data likely paywalled or missing, and the fallback>"]
```

## Rules

- Every priority-1 hypothesis has a kill-test task, normally in the counter-evidence lens.
- Required data comes from the selected frameworks' `requiredEvidence` in the metadata index,
  translated into concrete data points for this scope. Do not open framework files.
- Vary the queries, and use the language of the sources most likely to hold the answer.
- Tasks are ordered by priority, with kill tests first within each priority.
