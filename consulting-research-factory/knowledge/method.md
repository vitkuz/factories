# The consulting research method (McKinsey style)

Every step of a consulting-style study reads this file. It says what all steps share: the
backbone, the principles, the labels and the words. The shape of each step's own output is in
its own file beside this one.

This is the method visible in public material — McKinsey Global Institute reports, Conn &
McLean's *Bulletproof Problem Solving*, Minto's *Pyramid Principle*, Rasiel's *The McKinsey Way*,
Zelazny's *Say It With Charts* — not any firm's confidential internal process.

## The backbone: seven steps, run like an accordion

Define → Disaggregate → Prioritize → Workplan → Analyze → Synthesize → Communicate.
(Conn & McLean, *Bulletproof Problem Solving*, 2018.)

| Step | What it produces |
|------|------------------|
| Define | the problem statement: decision, SMART question, criteria, scope, day-one answer |
| Disaggregate + Prioritize | the issue tree, hypotheses per branch, pruned by impact |
| Workplan | the research plan and the ghost deck (the report's titles before any data) |
| Analyze | evidence records, merged into one evidence base and one number register |
| Synthesize | data → finding → insight → implication → recommendation, and the answer |
| Communicate | storyline (pyramid), exhibits, report |
| Review | a skeptical partner tries to break the argument before the client does |

"Like an accordion" means a later step may send work back to an earlier one. A study that
never revises its first hypothesis was probably not tested hard enough.

## Ten principles

1. **Decision before topic.** Research starts from a decision someone must make, turned into
   one SMART governing question. "AI agents" is a topic; "Should a mid-size SaaS vendor build an
   agent-observability product for launch in 2027?" is a question.
2. **Answer first, then try to kill it.** Write the day-one answer before any search. Research
   is a test of that answer, not a tour of the topic. A hypothesis that dies is replaced, and the
   report says it died and why.
3. **MECE.** Split every question into parts that do not overlap and together cover the whole.
   Real trees are rarely perfectly MECE; they must at least hold every relevant issue.
4. **80/20 — don't boil the ocean.** Prioritize branches by size of impact and how much the
   decision maker can influence them. Run the cheap analyses that could kill a branch first.
5. **Evidence before conclusion.** Every important claim traces to an evidence record with a
   URL and a date. A claim without a source is a guess wearing a suit.
6. **Separate what you know from what you think.** Every statement is one of the four labels
   below, and an inference is never presented as a fact.
7. **Look for the opposite on purpose.** Disconfirming evidence is recorded with the same care
   as supporting evidence. Sources that disagree are shown as disagreement, never averaged.
8. **Synthesis, not summary.** A summary says what the sources say. A synthesis says what it
   means for the decision: every finding climbs to "so what?" and, where it matters, "now what?"
9. **Pyramid communication.** Governing thought first, three to five supporting messages, the
   evidence under each. Every heading and exhibit title is a full-sentence claim; reading only
   the titles tells the whole story.
10. **Obligation to dissent.** Anyone who sees the argument failing says so. The review step
    exists to attack the work, not to polish it.

## The four labels

| Label | Meaning | How it is written |
|-------|---------|-------------------|
| FACT | stated by a source, checkable | carries an evidence id: `(EV-012)` |
| INFERENCE | our reasoning from facts | "This suggests…", "We estimate…", cites the facts it rests on |
| HYPOTHESIS | a claim not yet tested | "We expect…", marked untested, never in the answer |
| RECOMMENDATION | an action that follows from inferences | imperative, with owner and timing where known |

Derived numbers (our own arithmetic on sourced figures) are INFERENCE and their source line
says "team analysis" after the underlying sources.

## Hypothesis verdicts

Every hypothesis ends in exactly one state: **supported**, **partially supported**,
**rejected** or **insufficient evidence**. The verdict names the evidence ids that decide it.

## Source tiers

| Tier | What | Examples |
|------|------|----------|
| T1 | primary and official | statistics offices, regulators, central banks, company filings and investor decks, statutes, peer-reviewed papers, the organisation's own disclosed data |
| T2 | reputable secondary with a stated method | major research firms and consultancies that publish their methodology, multilateral institutions, quality press with named reporting |
| T3 | interested or thin | vendor white papers, press releases, trade blogs, analyst commentary, conference talks |
| T4 | unsourced | aggregators, SEO pages, forums, AI-generated summaries, market-report press releases with no method |

**A key number needs one T1 source or two independent T2 sources.** Otherwise it is marked
single-source. Two pages quoting the same press release are one source. Every figure keeps the
date and geography it refers to: a 2021 US figure is a 2021 US figure.

## Likelihood and confidence

Borrowed from intelligence analysis (ICD 203) because it stops vague hedging.

| Term | Range |
|------|-------|
| almost no chance | 1–5% |
| very unlikely | 5–20% |
| unlikely | 20–45% |
| roughly even chance | 45–55% |
| likely | 55–80% |
| very likely | 80–95% |
| almost certain | 95–99% |

Confidence is separate from likelihood: **high** (several independent good sources agree, few
assumptions), **moderate** (credible but not corroborated enough for high), **low** (fragmentary,
poorly corroborated or questionable sources). Never put a likelihood term and a confidence level
in the same sentence. Forward-looking numbers are ranges or named scenarios, never single points,
and potential is not presented as a forecast.

## Words used the same way everywhere

| Word | Meaning |
|------|---------|
| decision maker | the person the study serves; what they value |
| governing question | the one SMART question the whole study answers |
| day-one answer | the answer we would bet on before any evidence |
| issue tree | the governing question split into MECE sub-questions |
| hypothesis | a testable, falsifiable claim for one branch, with an id `H1`, `H2`… |
| kill test | the analysis whose result would reject a hypothesis |
| evidence record | one sourced fact in the evidence register, with an id `EV-001`… |
| number register | the one list of every figure the report may use, with its value, unit, year, scope and evidence ids |
| insight | a finding plus why it matters for the decision |
| governing thought | the answer, in one sentence, at the top of the pyramid |
| action title | a full-sentence claim used as a heading or exhibit title |
| known gap | a fact the answer needed that the study could not verify |

## What makes work look amateur

Topic headlines ("Market overview"). The answer buried at the end. A data dump with no so what.
Unsourced numbers. The same figure with two values in two places. "Significant", "could
potentially", "various". False precision ($41.37B). Only one side of the argument. Facts and
opinions mixed. A chart whose title claims more than its data shows. Fix every one of these.
