# Synthesis

Synthesis answers the decision from the tested hypotheses and the evidence base, and from
nothing else. A summary says what the sources say. A synthesis says what it means for the
decision. The test: "Give me the three insights from all this."

## The ladder

Every insight climbs five rungs. The most common failure is skipping a rung.

```
DATA → FINDING → INSIGHT → IMPLICATION → RECOMMENDATION
```

| Rung | What it is | Example |
|------|-----------|---------|
| data | sourced facts, with ids | 72% of enterprise agent deployments use fewer than 5 agents (EV-031) |
| finding | what the data says, one sentence | Enterprise deployments typically remain small. |
| insight (so what?) | why it matters: the pattern others miss | The market is moving from experimentation to early production. |
| implication | what it means for this decision maker | Reliability and observability may monetise earlier than large-scale agent coordination. |
| recommendation (now what?) | what to do, who, when | Prioritise governance and observability capabilities first; revisit orchestration in 2028. |

Ask "so what?" up to three times from the finding, until the answer is something the decision
maker would act on. A finding that never reaches an implication is cut, or moved to the appendix
list.

## Framework results

Where a framework was selected for a branch, apply it now to that branch's evidence and write its
output shape in compact form. Open only the files in the selection's `loadList`, and read their
"Reading the result" section. Then climb the ladder from the framework's output. The framework's
output is data for the ladder. It is not the conclusion. Branches with a custom analysis answer
their custom questions the same way.

## Shape — `synthesis.yaml`

```yaml
answer:
  question: "<problem statement>"
  governingThought: "<the answer in one sentence>"
  why: "<2-3 sentences>"
  dayOneAnswer: held|changed|reversed
  decidedBy: [EV-..., H...]
frameworkResults:
  - { subproblemId: SP-Q2.1, framework: porter-five-forces, result: { <compact output shape> }, evidence: [] }
  - { subproblemId: SP-Q6.2, framework: custom, result: { <answers to the custom questions> }, evidence: [] }
insights:
  - id: I1
    finding: { id: F1, text: "...", evidence: [EV-031, EV-044], label: FACT }
    insight: "..."                   # so what?
    implication: "..."
    recommendation: REC1             # now what? (id into recommendations), or null
    hypotheses: { H2: SUPPORTED, H5: PARTIALLY_SUPPORTED }
    confidence: 0.7
    label: INFERENCE
againstSuccessCriteria: [{ criterion: "...", met: yes|no|partly, reason: "..." }]
whatWouldHaveToBeTrue: [{ condition: "...", confidence: 0.6, evidence: [], weakest: false }]
strongestCounterArgument: { argument: "...", evidence: [], whyTheAnswerStands: "..." }
recommendations:
  - { id: REC1, action: "<imperative>", owner: "...", timing: now|12-months|later, impactRange: "...", firstStep: "...", fromInsights: [I1] }
risksAndIndicators: [{ risk: "...", indicator: "<observable early signal>", threshold: "..." }]
knownGaps: [{ gap: "...", touchesAnswer: true|false, howMuch: "..." }]
appendix: ["<findings that did not reach an implication>"]
```

## Rules

- **No new facts.** Every number comes from the number register and is cited by key or id.
- Label everything. FACT carries an id. INFERENCE says "we estimate" or "this suggests". Nothing
  untested appears as the answer.
- 3–5 insights. Prefer insights that rest on more than one lens.
- A rejected hypothesis is reported, along with what replaced it.
