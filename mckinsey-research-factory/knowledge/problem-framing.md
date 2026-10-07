# Problem Framing

Turn a vague request ("should we look at X?") into a decision problem that research can answer.
Don't skip this. A problem nobody wrote down precisely usually gets answered wrongly (McKinsey staff paper, "Don't skip this step!").

## 1. Frame the problem

Do these in order, then go back over them. Pinning down success criteria often means rewriting the key question.

1. **Context as SCQ.** Situation: facts the decision-maker already agrees with. Complication: what changed or what is at stake. Question: the one question that follows from them. If you can't write a complication, there is no decision to make yet.
2. **Key question, SMART.** Specific, Measurable, Action-oriented, Relevant, Time-bound.
   - Bad: "What about the German market?"
   - Good: "Should we launch product P in Germany by Q3 next year, and can it reach EUR 2M ARR within 24 months at a CAC payback under 18 months?"
3. **Decision-maker.** Who decides, who can help, who can block. Say what decision they will actually take (go/no-go, choose among options, how much to invest).
4. **Success criteria.** The quantitative thresholds from the question, plus the qualitative ones: timing, risk appetite, strategic fit, reversibility.
5. **Scope and out of scope.** Scope usually means markets, segments, geographies, horizon. Write the out-of-scope list explicitly, because that is how you find hidden disagreements.
6. **Constraints.** Limits on acceptable solutions inside the scope, e.g. "organic only", "no new headcount", "must comply with X", budget cap.
7. **Definitions.** Define every term that could be read two ways: "market", "customer", "active user", "revenue" (gross or net), currency, year basis.
8. **Key sources of insight.** Where the knowledge probably is: data sets, experts, customers, filings.

Checklist:
- [ ] The key question ends in a question mark and implies a choice.
- [ ] A number and a date appear in the question or in the success criteria.
- [ ] The decision-maker and their decision are named.
- [ ] Out of scope has at least 2 items.
- [ ] No undefined jargon.

## 2. Build a MECE issue tree

MECE means Mutually Exclusive (no overlaps) and Collectively Exhaustive (no gaps).

- **Pick the tree type.** A *diagnostic* tree answers "why?" (causes). A *solution* tree answers "how?" (options). Never mix "why" and "how" in one tree (Chevallier). Usually you diagnose first and build the solution tree once the cause is confirmed.
- **Root = the key question.** Each level breaks down the node above it. Write nodes as full-sentence questions (issue tree) or as testable claims (hypothesis tree).
- **Use a real split.** Prefer splits that come from logic or math: revenue = volume x price; profit = revenue - cost; customers = new + retained; segment A / B / other. Avoid lists of topics you brainstormed.
- **Depth of 2 to 3 levels.** Stop when a leaf can be answered with one analysis or one source hunt. Finish each level before going deeper.
- **Test for MECE:**
  - ME: can one fact sit in two branches? If so, redraw the split.
  - CE: do the children add up to the parent? Add an explicit "other" branch if needed and say how large it is.
  - Same kind: siblings are the same type of thing (all segments, or all cost lines).
  - Answer test: if every child is answered, is the parent answered?

## 3. Write Day One hypotheses

State your best-guess answer before researching. That answer drives which research you do. It is a working hypothesis to test, not a conclusion.

A good hypothesis meets these criteria (staff paper tests):
- **Testable:** evidence can prove or disprove it.
- **Debatable:** it could be wrong. If it can't be wrong, it is only a fact.
- **Reversal matters:** if the opposite were true, your logic would change.
- **Not obvious or naive** to the decision-maker.
- **Actionable:** it points to something the decision-maker would do.

For each hypothesis, write down:
- **Confirms if:** the specific evidence or threshold that would support it.
- **Kills if:** the specific evidence that would refute it. Write this first. It protects against confirmation bias.
- **Lens:** market, competitors, economics or operations.

## 4. Prioritize branches

- Score each leaf on **impact on the decision** (H/M/L) x **ease of answering** (H/M/L). Research high impact first. Cut low-impact leaves and record that you cut them.
- Apply 80/20: find the roughly 20% of analyses that settle most of the answer. Rough, order-of-magnitude estimates are fine for pruning.
- Other criteria when relevant: urgency, fit with constraints, option value. Keep the scoring simple.
- Revisit the priorities when evidence moves a hypothesis.

## Template: problem frame

```
# Problem frame: <short title>
Situation: <agreed facts>
Complication: <what changed / what is at stake>
Key question (SMART): <question?>
Decision-maker & decision: <who> will decide <what> by <date>
Success criteria: <metric ≥ threshold by date>; <qualitative criteria>
In scope: ... | Out of scope: ...
Constraints: ...
Definitions: <term> = <meaning>
Issue tree (type: diagnostic|solution):
  1. <branch question>
     1.1 <sub-question>  [impact H/M/L · ease H/M/L]
     1.2 ...
  2. ...
Day One answer: <one sentence>
Hypotheses:
  H1 <claim> | confirms if: ... | kills if: ... | lens: ...
```

## Template: research plan

```
# Research plan: <title>
| Branch | Hypothesis | Lens (market/competitors/economics/operations) | Analysis to run | Evidence needed | Likely sources | Priority |
|--------|------------|------|-----------------|-----------------|----------------|----------|
| 1.1    | H1         | market | bottom-up size of segment S | # buyers, price | stats office, filings | P1 |
Lenses not material: <lens> — <one-line reason>
Cut branches: <branch> — <reason>
```

Rules for the plan:
- Map every high-priority leaf to exactly one lens, and give each leaf one end product.
- Every hypothesis must appear in at least one row.
- The "operations" lens covers technical, regulatory and execution feasibility.

## Sources
- https://www.homeworksmontana.com/wp-content/uploads/2022/08/20200406152146the_mckinsey_approach_to_problem_solving.pdf (McKinsey Staff Paper No. 66, "The McKinsey Approach to Problem Solving", 2007)
- https://bulletproofproblemsolving.com/
- https://readingraphics.com/book-summary-bulletproof-problem-solving/
- https://en.wikipedia.org/wiki/Issue_tree
- https://www.barbaraminto.com/
- https://www.casestar.io/definitions/hypothesis-driven
