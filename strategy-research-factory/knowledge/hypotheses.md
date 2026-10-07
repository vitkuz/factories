# Hypotheses

A hypothesis turns an issue-tree question into a claim that evidence could kill. Research then
tests claims instead of touring a topic. The selected frameworks shape *what* a hypothesis
claims (a five-forces branch yields a claim about a dominant force, and a unit-economics branch
yields a claim about LTV/CAC). They never replace the question.

## Shape — `hypotheses.yaml`

```yaml
dayOneAnswer: "<from the brief, restated as the governing hypothesis>"
hypotheses:
  H1:
    questionId: Q1.1
    subproblemId: SP-Q1.1
    statement: "At least 25% of large EU banks will run agent workloads in production by 2028."
    falsifiable: true
    killTest: "If surveys with a stated sample show fewer than 10% in production by 2026 with flat plans, H1 falls."
    whatWouldHaveToBeTrue: ["<2-4 conditions>"]
    evidenceNeeded: ["survey with stated sample and date", "bank filings mentioning agent deployments"]
    frameworks: [customer-segmentation]      # ids from the selection's loadList, or [custom]
    frameworkOutputsUsed: ["segment-map"]    # which framework outputs this hypothesis depends on
    impact: high|medium|low
    priority: 1|2|3
    status: UNTESTED
competingHypotheses:
  - id: C1
    statement: "<a rival answer to the root question that research should be able to tell apart from the day-one answer>"
coverage:
  Q1.1: [H1]
  Q1.2: [H2, H3]
  Q6.2: [H9]
```

## Rules

- **Declarative and testable, with a number where possible.** "Observability spend exceeds $1B
  by 2028", not "observability matters".
- **Falsifiable where possible.** When a claim cannot be falsified (a pure judgement), set
  `falsifiable: false` and say what evidence would still move confidence.
- **Every leaf is covered** by at least one hypothesis, or appears in `coverage` with `[]` and a
  reason line.
- **6–14 hypotheses** in total. Fewer means the tree is shallow. More means it was not pruned.
- **Two or three competing hypotheses** for the root question, so that research can tell the
  answers apart rather than confirm one.
- Framework bodies: open only the files in the selection's `loadList`. Use them to sharpen the
  claim and the kill test, not to add hypotheses the tree does not ask for.
- On a revision pass: keep the ids of unchanged hypotheses, and give new ones new ids. A
  withdrawn hypothesis stays with `status: WITHDRAWN` and the reason, so later steps do not
  lose track of it.
