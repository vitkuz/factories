# How the synthesis is shaped

"Clients pay to synthesize stuff into insight, not to read a summary." The synthesis answers the
governing question from the evidence base and nothing else. "Give me the three insights from all
this" is the test.

## The ladder

Every insight climbs five rungs. Skipping a rung is the most common failure.

| Rung | What it is | Example |
|------|-----------|---------|
| Data | sourced facts, with ids | 72% of enterprise agent deployments use fewer than 5 agents (EV-031); 61% cite debugging as the top blocker (EV-044) |
| Finding | what the data says, one sentence | Most enterprise deployments are small and stuck on operability |
| Insight | why it matters — the pattern others miss | The market is in an operability phase, not an autonomy phase: the constraint is control, not scale |
| Implication | what it means for the decision maker | Products built for thousands of autonomous agents solve a problem customers do not have yet |
| Recommendation | what to do, with owner and timing | Lead with observability and governance for small production teams; revisit orchestration at scale in 2028 |

Ask "so what?" up to three times from the finding until the answer is something the decision
maker would act on. A finding that never reaches an implication is cut or moved to an appendix.

## Sections, in this order

1. **The answer** — the governing question, then the answer in one sentence (the governing
   thought), then two or three sentences on why. Say what happened to the day-one answer:
   held, changed or reversed, and which evidence decided it. It must pass the **30-second test**:
   what would you say to the CEO in an elevator?
2. **Key insights** — three to five, each a full-sentence claim. For each: the ladder above,
   rung by rung, with evidence ids on the data and finding rungs, the hypotheses it rests on and
   their verdicts, and a confidence level.
3. **Against the success criteria** — each criterion from the problem statement, and whether the
   answer meets it.
4. **What would have to be true** — for the recommendation to work: the three to five conditions,
   and for each how confident we are and what evidence supports it. The weakest one is named.
5. **The strongest counter-argument** — the best case against the answer, argued in good faith
   from the contradicting evidence, and why the answer still stands (or where it does not).
6. **Recommendations** — three to six, imperative, each tracing to an insight: what, who,
   when, the expected impact as a range, and the first step.
7. **Risks and indicators** — what could make the answer wrong, and the observable signal that
   would tell the decision maker early ("if hyperscalers bundle tracing free by 2027, revisit").
8. **Known gaps** — from the scorecard, those that touch the answer, with how much they matter.

## Rules

- **No new facts.** Every number is in the number register, cited by key or evidence id.
- Label every statement per the method file: FACT carries an id; INFERENCE says "we estimate",
  "this suggests"; nothing untested appears as an answer.
- An inductive argument (several independent supports) beats a deductive chain (one broken link
  breaks everything). Prefer insights that stand on more than one lens.
- A rejected hypothesis is a result, not a failure. Say so and say what replaced it.
- Group recommendations by time horizon (now / next 12 months / later) when there are more than
  three.
