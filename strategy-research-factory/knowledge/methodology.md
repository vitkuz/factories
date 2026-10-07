# The permanent methodology

Every step of a strategy study reads this file. It is the method, and it does not change from
study to study. **Frameworks are not part of it.** They are optional tools, chosen per branch of
the issue tree, after the decision and the questions are known. What each step writes is
described in its own file beside this one.

## The order of thinking, never reversed

```
decision  →  questions  →  sub-problems  →  frameworks (0..n per branch)  →  hypotheses
          →  research tasks  →  evidence  →  tested hypotheses  →  synthesis  →  storyline  →  report
```

1. **Decision first.** Start from the choice someone has to make, never from a topic and never
   from a framework. "AI agents" is a topic. "Should a software services company build and
   commercialise an enterprise agent platform in 2027–2030?" is a decision.
2. **MECE decomposition.** Split every question into parts that do not overlap and that
   together cover the whole. Real trees are rarely perfectly MECE, but they must hold every
   issue that could change the decision.
3. **Issue tree before tools.** The tree is built from the decision's logic. A framework may
   later serve a branch. It never shapes the tree.
4. **Frameworks are optional.** Zero, one or several per branch. Prefer the smallest set that
   answers the question. When nothing fits, use a custom MECE analysis.
5. **Hypothesis-driven research.** Each research task tests a hypothesis, and each hypothesis
   answers an issue-tree question. Nothing is researched because it is interesting.
6. **Evidence-based reasoning.** Every important claim traces to an evidence record with a
   source, a URL and a date.
7. **Separate fact from inference.** Every statement carries one of the four labels below.
8. **Preserve contradiction.** Evidence against a hypothesis is recorded with the same care as
   evidence for it. Sources that disagree are shown as disagreeing, never averaged away.
9. **Synthesis, not summary.** Every finding climbs to *so what?* (why it matters to the
   decision) and, where strategic, *now what?* (what to do).
10. **Answer first (Pyramid Principle).** Give the governing thought first, then 3–5 supporting
    messages, then the evidence under each. Headings are full-sentence claims.
11. **Adversarial review.** A skeptical partner attacks the argument before any client sees it.
    Work that is sent back goes to the stage that caused the defect, not always to the writer.

## The four labels

| Label | Meaning | How it is written |
|-------|---------|-------------------|
| FACT | stated by a source, checkable | carries an evidence id: `(EV-012)` |
| INFERENCE | our reasoning from facts, including our own arithmetic | "This suggests…", "We estimate…", cites the facts it rests on |
| HYPOTHESIS | a claim not yet tested | "We expect…", marked untested; never presented as an answer |
| RECOMMENDATION | an action that follows from inferences | imperative, with owner and timing where known |

## Hypothesis statuses

`UNTESTED` (before research) and then exactly one of `SUPPORTED`, `PARTIALLY_SUPPORTED`,
`REJECTED` or `INSUFFICIENT_EVIDENCE`. A status always names the evidence ids that decide it.

## Source tiers

| Tier | What | Examples |
|------|------|----------|
| T1 | primary and official | statistics offices, regulators, filings, investor materials, statutes, peer-reviewed papers |
| T2 | reputable secondary with a stated method | research firms that publish methodology, multilateral institutions, quality press with named reporting |
| T3 | interested or thin | vendor white papers, press releases, trade blogs, conference talks |
| T4 | unsourced | aggregators, SEO pages, forums, AI summaries, market-report press releases with no method |

A key number needs one T1 source, or two independent T2 sources. Anything less is marked
single-source. Two pages quoting the same press release count as one source. A figure keeps the
year and the geography it refers to.

## Confidence and likelihood

- **Confidence** is a number from 0 to 1 attached to a record, a hypothesis result or an
  insight. As a guide: **0.8 or more** means several independent T1/T2 sources agree and few
  assumptions are needed. **0.5–0.8** means credible but not fully corroborated. **Below 0.5**
  means the evidence is fragmentary, single-source or interested. Give the reason in words next
  to the number.
- **Likelihood words** for forward-looking claims: almost no chance (1–5%), very unlikely
  (5–20%), unlikely (20–45%), roughly even (45–55%), likely (55–80%), very likely (80–95%),
  almost certain (95–99%).
- Forecasts are ranges or named scenarios, never single points. Potential is not a forecast.

## Ids used everywhere

| Id | Thing |
|----|-------|
| `Q1`, `Q1.2`, `Q1.2.1` | issue-tree nodes; the dotted path is the position in the tree |
| `SP-Q1.2` | the sub-problem for leaf `Q1.2` |
| `H1`, `H2`… | hypotheses |
| `R1`, `R2`… | research tasks |
| `MKT-001`, `CUS-001`, `CMP-001`, `ENV-001`, `CTR-001` | lens evidence records before merging |
| `EV-001`… | merged evidence records |
| `F1`, `I1`, `REC1` | findings, insights and recommendations in the synthesis |

An id never changes meaning within a run. On a revision pass, keep every id whose content did not
change, and give new content new ids.

## Artifacts, not transcripts

Steps communicate only through files. Read the files you are given and nothing else from the
run. Write exactly the files you are asked for. YAML artifacts must parse; keep strings on one
line, or use `|` blocks. JSON Lines files hold one JSON object per line and nothing else.

## What makes work amateur

Topic headlines ("Market overview"). The answer buried at the end. Framework spam: six boxes
filled for their own sake. Unsourced numbers. The same figure with two values. "Significant",
"could potentially", "various". False precision. Only one side of the argument. Inference written
as fact.
