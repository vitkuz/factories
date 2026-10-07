# Identifying sub-problems

Each leaf of the issue tree becomes one **sub-problem**: the question, plus the kind of analysis
it needs. Problem types are what the framework router uses to look up candidate frameworks, so a
leaf labelled wrongly gets the wrong tools. You label the problem. You do not pick frameworks,
and you do not open the framework library.

## The vocabulary

The run folder holds a problem-type vocabulary generated from the framework registry. It maps
each type to the framework ids that serve it. **Use its type names exactly as spelled.** When no
type fits a leaf, coin a precise kebab-case type and mark it `custom: true`. It will be analysed
with a custom MECE decomposition. Never stretch an existing type to cover a leaf it does not fit.
A wrong label is worse than a custom one.

## Shape — `subproblems.yaml`

```yaml
subproblems:
  - id: SP-Q1.1
    questionId: Q1.1
    question: "<the leaf question, copied>"
    branchPath: [Q1, Q1.1]
    analyticalNature: "<one line: what has to be established, e.g. 'estimate adoption rate among mid-size banks'>"
    problemTypes:
      - { type: customer-demand, custom: false }
      - { type: buyer-segmentation, custom: false }
    decisionLink: "<one line: how the answer moves the decision>"
    priority: 1|2|3       # 1 = the decision flips on it; 3 = context
    evidenceOutlook: good|thin|unlikely   # can public sources plausibly answer it?
uncoveredLeaves: []       # leaf ids you could not turn into an analysable sub-problem, with the reason
```

## Rules

- One sub-problem per leaf. Every leaf appears exactly once.
- 1–3 problem types per sub-problem. The first one is the primary type.
- `priority` comes from the leaf's impact on the decision, not from how easy it is.
- `evidenceOutlook: unlikely` is honest, and it is useful. It tells the router and the planner
  to expect a known gap, rather than to plan research that cannot succeed.
