# The issue tree

The issue tree breaks the decision into questions that are mutually exclusive and collectively
exhaustive (MECE). The decision drives it. **No framework is named or used here.** Framework
selection comes later, one branch at a time. A tree that copies a framework's boxes (five forces,
the 3Cs, PESTEL letters) is wrong unless the decision's own logic happens to produce that split.

## Choose the tree type

- **Decision tree** for yes/no or which-option questions: the conditions that must all hold for
  "yes" (demand? attractive? can we win? can we make money? viable entry? what could kill it?).
- **Solution (how) tree** when the goal is fixed: the ways to reach it.
- **Diagnostic (why) tree** when a cause is unknown.
- Never mix why and how in one tree.

Construction techniques: conditional logic ("what would have to be true"), a math identity
(profit = price × volume − cost), or a split into things that behave differently.

## Shape — `issue-tree.yaml`

```yaml
rootQuestion: "<the problem statement from the brief>"
treeType: decision|solution|diagnostic
technique: "<one line: how the split was built>"
branches:
  - id: Q1
    question: "Is there sufficient customer demand in 2027-2030?"
    rationale: "<why this branch is needed for the decision>"
    impact: high|medium|low          # how much the decision changes if this answer flips
    children:
      - id: Q1.1
        question: "<a sub-question>"
        children: []                 # a leaf: answerable by analysis and evidence
pruned:
  - question: "<a branch considered and dropped>"
    reason: "<low impact / outside the decision maker's control / out of scope>"
meceCheck:
  me: "<pass, or what was fixed>"
  ce: "<pass, or what was fixed; name the 'other' bucket>"
  sameLogic: "<pass or fixed>"
  levels: "<pass or fixed>"
  soWhat: "<if every leaf were answered, would the decision be made? pass or fixed>"
```

## Rules

- 3–6 top-level branches, 2–4 children each, at most three levels. Leaves are questions that
  analysis and public evidence can answer.
- Include a branch for **what could invalidate the thesis** (risks, reasons it fails) whenever
  the decision is a go / no-go.
- Cover the **stakeholders** the decision touches (buyers, users, competitors, partners,
  regulators, the company itself). A missing stakeholder is the most common gap.
- Ids are stable. On a revision pass, keep the ids of unchanged nodes, and give new nodes new ids.
- Nothing here is an answer and nothing here is a hypothesis yet.

## Example (decision tree, top level)

```
Should we enter the market?
├── Q1 Is there customer demand?
├── Q2 Is the market attractive?
├── Q3 Can we compete?
├── Q4 Can we make money?
├── Q5 What entry strategy is viable?
└── Q6 What could invalidate the thesis?
```
