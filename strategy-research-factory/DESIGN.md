# strategy-research-factory — design

A decision-first strategy consulting research pipeline. Frameworks are data, selected per
branch of the issue tree, loaded lazily. This file explains the design; `pipeline.json` is the
graph and wins wherever the two disagree.

## 1. Folder structure — the five concerns, separated

```
factories/                                    SHARED BY EVERY FACTORY
├── pipeline.schema.json     what pipeline.json is checked against
└── state.schema.json        what a run's state.json is checked against

factories/strategy-research-factory/          ORCHESTRATION + STATE/TRANSITIONS
├── pipeline.json            the graph: steps, inputs/outputs, events, edges, caps
└── DESIGN.md                this file

.claude/skills/any-factory/                   HOW ANY GRAPH IS RUN (shared by every factory)
└── runner.md                how any graph is walked; the gate is factories/bin/validate.mjs, the recorder factories/bin/state.mjs (sources in factories/tools/)

.claude/skills/strategy-research-factory/
└── SKILL.md                 thin wrapper: hands off to /any-factory strategy-research-factory

factories/strategy-research-factory/knowledge/                   METHODOLOGY + ARTIFACT SHAPES
├── methodology.md           the permanent method: every step reads it
├── brief.md                 → brief.yaml
├── issue-tree.md            → issue-tree.yaml
├── subproblems.md           → subproblems.yaml
├── framework-routing.md     → framework-selection.yaml  (the routing algorithm + scoring)
├── hypotheses.md            → hypotheses.yaml
├── research-plan.md         → research-plan.yaml
├── evidence-record.md       → <lens>/evidence.jsonl + notes.md
├── evidence-base.md         → evidence.jsonl + evidence-summary.md
├── hypothesis-testing.md    → hypothesis-results.yaml
├── synthesis.md             → synthesis.yaml
├── storyline.md             → storyline.md
├── storyline-review.md      → storyline-review.yaml
├── report.md                → report.md
├── review.md                → review.yaml + review-history.md  (adversarial checks + revision routing)
└── finalize.md              → the package README

factories/strategy-research-factory/knowledge/frameworks/   FRAMEWORKS (the registry)
├── _schema.json             framework metadata schema
├── README.md                how to add one
└── <id>.md × 13             frontmatter = metadata, body = how to apply

scripts/frameworks/build-index.py               deterministic: registry → index, run as a before-hook

run/strategy-research-factory/<slug>-<date>/    ARTIFACTS (one folder per run)
├── pipeline.json                snapshot of the graph as it ran
├── framework-index.yaml         metadata only, generated
├── framework-vocabulary.yaml    problem type → framework ids, generated
├── 1-frame-decision/brief.yaml
├── …
└── 20-finalize/{report.md, evidence.jsonl, README.md}
```

`state.json` is not written yet. Run `/create-any-factory-add-state-and-validation
strategy-research-factory` to add the recorder, which writes it after every transition. The
`tools/pipeline-runner` CLI writes it already.

## 2–3. Pipeline and its schema

The pipeline is `pipeline.json`, checked against `factories/pipeline.schema.json` (JSON Schema 2020-12).
Here is the same graph as condensed YAML, showing the transitions only:

```yaml
START: [frame-decision]
steps:
  frame-decision:        { model: opus,   out: brief.yaml,              transitions: { DONE: [build-issue-tree] } }
  build-issue-tree:      { model: opus,   out: issue-tree.yaml,         transitions: { DONE: [identify-subproblems] } }
  identify-subproblems:  { model: opus,   out: subproblems.yaml,        transitions: { DONE: [route-frameworks] } }
  route-frameworks:      { model: opus,   out: framework-selection.yaml,
                           transitions: { DONE: [form-hypotheses], REVISE_TREE: { target: [build-issue-tree], max: 1, onMax: [form-hypotheses] } } }
  form-hypotheses:       { model: opus,   out: hypotheses.yaml,         transitions: { DONE: [plan-research] } }
  plan-research:         { model: opus,   out: research-plan.yaml,
                           transitions: { DONE: [research-market, research-customer, research-competition, research-environment, research-counterevidence] } }
  research-<lens> ×5:    { model: sonnet, out: evidence.jsonl + notes.md, transitions: { DONE: [build-evidence-base] } }   # fan-in
  build-evidence-base:   { model: sonnet, out: evidence.jsonl + evidence-summary.md, transitions: { DONE: [test-hypotheses] } }
  test-hypotheses:       { model: opus,   out: hypothesis-results.yaml,
                           transitions: { DONE: [synthesize-insights], RESEARCH_MORE: { target: [5 lenses], max: 1, onMax: [synthesize-insights] } } }
  synthesize-insights:   { model: opus,   out: synthesis.yaml,          transitions: { DONE: [build-storyline] } }
  build-storyline:       { model: opus,   out: storyline.md,            on: { DONE: [review-storyline] } }
  review-storyline:      { model: opus,   out: storyline-review.yaml,
                           on: { PASS: [write-report],
                                 REVISE: { target: [build-storyline], max: 2, onMax: [write-report] },
                                 REVISE_SYNTHESIS: { target: [synthesize-insights], max: 1, onMax: [write-report] } } }
  write-report:          { model: opus,   out: report.md,               on: { DONE: [review-report] } }
  review-report:         { model: opus,   out: review.yaml + review-history.md,
                           on: { PASS: [finalize], FAIL: [finalize], REVISE: { target: [route-revision], max: 3, onMax: [finalize] } } }
  route-revision:        { model: haiku,  out: route.yaml,
                           on: { TO_ISSUE_TREE: [build-issue-tree], TO_FRAMEWORKS: [route-frameworks], TO_HYPOTHESES: [form-hypotheses],
                                 TO_RESEARCH: [5 lenses], TO_SYNTHESIS: [synthesize-insights], TO_STORYLINE: [build-storyline],
                                 TO_REPORT: [write-report] } }      # each also max 3 → finalize, as a backstop
  finalize:              { model: haiku,  out: report.md + evidence.jsonl + README.md, on: { DONE: [END] } }
```

## 4–5. Framework metadata schema and the example frameworks

The schema is `factories/strategy-research-factory/knowledge/frameworks/_schema.json`. Its fields are id, name, purpose,
problemTypes, useWhen, doNotUseWhen, questionsAnswered, requiredEvidence, outputs, complexity
(1–5), overlapsWith and pairsWellWith. There are 13 frameworks: porter-five-forces, three-cs,
pestel, tam-sam-som, jobs-to-be-done, customer-segmentation, customer-journey, value-chain,
ansoff, mckinsey-7s, scenario-planning, profit-tree and unit-economics. Together they use 28
problem types.

## 6. Artifact schemas

Each artifact's shape is defined once, in the knowledge file that the step writing it reads (see
the tree above). The consuming steps read the same file names, so the shape is the contract.

| Artifact | Written by | Read by |
|----------|-----------|---------|
| brief.yaml | frame | every later step except route-revision |
| issue-tree.yaml | tree | subproblems, router, hypotheses, synthesis, review |
| subproblems.yaml | subproblems | router, review |
| framework-selection.yaml | router | hypotheses, plan, synthesis, report, review, finalize |
| hypotheses.yaml | hypotheses | plan, lenses, evidence base, tester, review |
| research-plan.yaml | plan | lenses, tester, review |
| evidence.jsonl (per lens) | lenses | evidence base |
| evidence.jsonl + evidence-summary.md | evidence base | tester, synthesis, storyline, report, review |
| hypothesis-results.yaml | tester | synthesis, storyline review, report, review, finalize |
| synthesis.yaml | synthesis | storyline, storyline review, report, review |
| storyline.md / storyline-review.yaml | storyline / its review | report, review |
| report.md | report | review, finalize |
| review.yaml / review-history.md | review | route-revision, the stage sent back to, finalize |

## 7. Transitions and the state machine

- **Events name outcomes**, never next steps. Each step returns exactly one event.
- **Caps are edge properties** (`max`). When a cap is spent, `onMax` gives the degraded but
  defensible path. It never ends in a dead stop.
- **Global review cap.** Every send-back from the final review passes through one `REVISE` edge
  with `max: 3`. `route-revision` is a haiku step that turns `reviseTo` into an event and decides
  nothing else. Without it, seven separate back-edges would each need a cap, and together they
  could loop about ten times.
- **Errors.** The schema has no `onError`, by design: a step that crashes stops the run, and
  `resume` continues it (with the pipeline-runner, or once the recorder is added). Problems in
  the domain are events instead. REVISE_TREE, RESEARCH_MORE and FAIL route to a stage that can
  handle them.

| Loop | Edge | Cap | On cap |
|------|------|-----|--------|
| router → tree | REVISE_TREE | 1 | continue to hypotheses |
| tester → research | RESEARCH_MORE | 1 | synthesize with gaps |
| storyline review → storyline | REVISE | 2 | write report, open findings listed as limitations |
| storyline review → synthesis | REVISE_SYNTHESIS | 1 | write report |
| final review → any stage | REVISE | 3 | finalize with open findings |

## 8. The framework-routing algorithm

The full algorithm is in `factories/strategy-research-factory/knowledge/framework-routing.md`. In short:

```
for each sub-problem:
  candidates = index.problemTypes[type] for its types      # mechanical lookup
             + ≤ 2 discretionary (by purpose)
  drop candidates whose doNotUseWhen matches              → rejected (excludedBy)
  score = problemFit + questionCoverage + decisionRelevance + evidenceAvailability   (0..5 each)
        + frameworkOverlap + unnecessaryComplexity                                   (0..-5 each)
  select greedily: score ≥ 12, no zero positive dimension, re-score overlap after each pick,
                   ≤ 2 per sub-problem, ≤ 6 distinct per study
  none qualifies / custom type / coverage < 50% → custom MECE analysis (2–5 questions)
  record selected + rejected with reasons
loadList = distinct selected ids            → the only framework bodies any later step may open
```

**Lazy loading, end to end:** the classifier sees only the vocabulary (about 1 KB). The router
and the planner see only the metadata index (about 15 KB for 13 frameworks). Hypotheses and
synthesis open only the bodies of the frameworks in `loadList`. No other step opens a framework
file.

## 9. Agent prompts

Each step has three parts in `pipeline.json`. `systemPrompt` says who the agent is (two
sentences). `prompt` holds only what changes per run and the events it may return. `knowledge`
holds the standing instructions and artifact shapes. To change *how* a step works, edit its
knowledge file. To change *what* happens next, edit `pipeline.json`.

## 10. The review and revision loop

1. The storyline is reviewed before any prose is written (`review-storyline`). A broken pyramid
   goes back to the storyline, and a weak synthesis goes back to the synthesis.
2. The report and every artifact behind it are reviewed against 17 checks
   (`factories/strategy-research-factory/knowledge/review.md`). Each finding is CRITICAL, MAJOR or MINOR, and is
   tagged with the stage that caused it.
3. The verdict is pass, revise or fail. A revise verdict sets `reviseTo` to the **earliest**
   stage at fault: issue-tree, frameworks, hypotheses, research, synthesis, storyline or report.
   Everything downstream of that stage reruns with the review file as its brief.
4. After three send-backs, the report is finalized with every open finding listed in the
   package README.

## 11. Example run (illustrative, not researched)

`QUESTION="Should we build and commercialize an enterprise AI development factory?"`

The walkthrough below shows the *shape* of each artifact, not real findings. The numbers are
placeholders in brackets.

**brief.yaml**
```yaml
inferred: [decision, decisionMaker]
decision:
  statement: "Whether a software services company should build, productise and sell a multi-agent software-delivery platform ('AI development factory') to enterprises in 2027-2030, or keep it as an internal delivery tool"
  options: [build-and-sell, use-internally-only, partner-with-platform-vendor]
problemStatement: "Should the company launch a commercial AI development factory by Q2 2027 and reach [$X]M ARR by 2030?"
keyQuestions: ["Do enterprises buy this or build it?", "Who already sells it?", "Can a services firm run a product business?", "What happens when model vendors ship it?"]
dayOneAnswer: { statement: "Yes, but only as governance and delivery tooling for regulated enterprises", mostLikelyToOverturnIt: "model vendors bundling agent tooling free" }
```

**issue-tree.yaml (top level):** Q1 Is there enterprise demand for buying rather than building?
· Q2 Is the market large and attractive enough? · Q3 Can we win against platforms and startups?
· Q4 Can we make money? · Q5 Can the organisation build and sell a product? · Q6 What could
invalidate the thesis?

**subproblems.yaml → framework-selection.yaml (excerpt):**

| Sub-problem | Problem types | Selected (score) | Rejected | Custom |
|-------------|---------------|------------------|----------|--------|
| SP-Q1.1 buy vs build intent | customer-demand, product-market-fit | jobs-to-be-done (15) | customer-journey: overlaps JTBD (−3) → 11 | — |
| SP-Q1.2 which buyers first | buyer-segmentation | customer-segmentation (16) | — | — |
| SP-Q2.1 market size to 2030 | market-sizing, market-growth | tam-sam-som (15) | porter-five-forces: doNotUseWhen "estimating market size" | — |
| SP-Q3.1 position vs incumbents | competitive-position, differentiation | three-cs (14) | value-chain: complexity 4, three-cs answers it (−2) → 10 | — |
| SP-Q4.1 per-customer economics | unit-economics, pricing | unit-economics (16) | profit-tree: overlaps (−3) → 9 | — |
| SP-Q5.1 services → product capability | organizational-alignment, execution-readiness | — | mckinsey-7s: evidenceAvailability 0 (no inside data) | yes: 3 questions on product-company transitions of services firms |
| SP-Q6.1 model vendors bundle it | platform-bundling-risk (custom) | — | — | yes |

`loadList: [jobs-to-be-done, customer-segmentation, tam-sam-som, three-cs, unit-economics]`,
five of the six allowed. PESTEL, Ansoff and scenario planning were never retrieved, so they are
never loaded.

**hypotheses.yaml (excerpt):** H1 (Q1.1) "At least [N]% of large enterprises piloting AI coding
agents prefer a governed platform to in-house assembly." Kill test: surveys show a build
preference above [M]%. H6 (Q6.1) "Model vendors will not ship end-to-end governed delivery
pipelines by 2028." Kill test: announced GA features covering review, audit and deployment.

**research-plan.yaml:** about 14 tasks. `counter-evidence` owns the kill tests of H1, H4 and H6.
`environment` owns the EU AI Act obligations for code-generating systems. `competition` owns the
named platform vendors and agentic-IDE startups.

**hypothesis-results.yaml → review:** suppose H6 comes back REJECTED, with two vendor launch
announcements as EV records. The storyline review passes. The final review finds that the
recommendation still assumes that H6 holds (check 16, overreach), sets `reviseTo: synthesis`,
and `route-revision` returns TO_SYNTHESIS. The synthesis, storyline, storyline review, report
and final review rerun. The second review passes, and the package README lists one MINOR
finding as open.

## 12. Keeping it extensible and token-efficient

- **Add a framework = add one file.** The index, the vocabulary and the retrieval all pick it up
  on the next run. A malformed file fails the before-hook with the file name, before any money is
  spent.
- **Keep the frontmatter lean.** Every line is paid for in the router's context on every run.
  Detail belongs in the body, which is loaded only when the framework is selected. At about
  1.2 KB of metadata per framework, 50 frameworks come to roughly 60 KB. Above that, split the
  index by problem-type family and let the router read only the families its sub-problems use.
- **Reuse problem types before coining new ones.** The vocabulary is the retrieval key, and
  synonyms fragment it. Review `framework-vocabulary.yaml` whenever you add frameworks.
- **The budget is a knob, not code.** The ≤ 2 per sub-problem and ≤ 6 per study limits, and the
  score threshold of 12, live in `framework-routing.md`.
- **New lenses are graph edits.** A sixth lens means one more step, one more entry in
  `plan-research`'s fan-out, one more `input` block on `build-evidence-base`, and the lens in
  `research-plan.md`. Frameworks never need graph edits.
- **Artifacts over transcripts.** Each step's `input` lists only what it needs. Research lenses
  never see the synthesis, and the writer never sees the raw lens files.
- **Deterministic where it helps.** Indexing, retrieval by problem type, loop caps and revision
  dispatch are mechanical. Judgement (scoring, research, synthesis) is left to the models.
- **Candidates for more determinism later:** merging and renumbering the lens JSONL files, and
  recomputing derived numbers in the number register. Both are scriptable, and the add-on's
  validator could gate the YAML artifacts against JSON Schemas generated from the knowledge
  files.
