---
id: hypothesis-driven
name: Hypothesis-driven research
purpose: Start from a provisional answer, turn it into falsifiable hypotheses tied to issue-tree branches, and spend research on the ones that could most change the decision.
problemTypes: [go-no-go-decision, uncertainty-and-risk]
useWhen:
  - a decision or recommendation is needed and research time is limited, so effort must go where it changes the answer
  - the question has been broken into branches and each branch needs a testable claim rather than open-ended exploration
doNotUseWhen:
  - the task is purely descriptive (map a market, list options) with no decision or claim to test
  - nothing is known well enough to form even a provisional answer (explore first, then hypothesise)
  - the uncertainty is about the future and cannot be settled by evidence available today (use scenarios instead)
questionsAnswered:
  - What is the provisional answer, and what must be true for it to hold?
  - Which claims are most worth testing first, given their impact and uncertainty?
  - Which hypotheses does the evidence support, and which does it reject?
  - Has the answer changed after testing, and what should be tested next?
requiredEvidence: [issue-tree-branches, evidence-for-and-against-each-claim, comparable-cases, base-rates]
outputs: [hypothesis-list, priority-ranking, accept-reject-verdicts, revised-answer]
complexity: 2
overlapsWith: []
pairsWellWith: [scenario-planning, pestel, unit-economics]
---

## How to apply

1. **State the provisional answer.** One sentence, as if you had to decide today. It is a
   claim to test, not a conclusion.
2. **Tie hypotheses to the issue tree.** For each important branch, ask what must be true on that
   branch for the provisional answer to hold. Each such condition becomes one or more hypotheses,
   and carries the id of its branch (`issueId`).
3. **Write each hypothesis as a specific, falsifiable statement.** It names a subject, a
   measurable condition, and a threshold or timeframe, and it would change the decision if
   false. Do not collect evidence at this stage.
4. **Write a falsification question for each.** "What evidence would show this is wrong?" It
   names the observation that would reject the claim, so research looks for disconfirming
   evidence, not only support.
5. **Score impact and uncertainty, each 0 to 1.** Impact: how much the decision changes if the
   hypothesis is false. Uncertainty: how unsure we are today. Use 0.1 steps; two decimals add
   false precision.
6. **Prioritise by impact x uncertainty.** Research the highest product first. A near-certain
   claim (low uncertainty) or one that cannot move the decision (low impact) waits or is dropped.
   Compute the product in code, not by judgement.
7. **Test, then accept or reject on evidence.** Search first for the evidence named by the
   falsification question. Mark each hypothesis accepted, rejected, or unresolved (and say what
   evidence is missing).
8. **Iterate.** Revise the provisional answer, re-score what is left, and add new hypotheses
   that the findings expose. Stop when no remaining hypothesis could change the decision.

## Output shape

```json
{
  "id": "H1",
  "issueId": "resale",
  "statement": "A studio in Didi Dighomi can be resold within 6 months at no more than a 10% discount to the purchase price.",
  "falsificationQuestion": "What evidence would show that comparable Didi Dighomi studios take longer than 6 months to sell or sell at a larger discount?",
  "impact": 1,
  "uncertainty": 0.8
}
```

After testing, a verdict is recorded against the hypothesis id:

```json
{ "hypothesisId": "H1", "priority": 0.8, "verdict": "accepted|rejected|unresolved", "evidenceIds": [], "note": "" }
```

`priority = impact x uncertainty`. The sorted list is the research order.

Good vs bad (resale liquidity of a Didi Dighomi studio):

| Bad | Why | Good |
|---|---|---|
| "The studio will be easy to resell." | Vague; no threshold, no timeframe; cannot be proven wrong | "A studio in Didi Dighomi can be resold within 6 months at no more than a 10% discount to the purchase price." |
| "The Tbilisi property market is good." | Not tied to the branch or the decision | "Comparable studios (25-40 m2) in Didi Dighomi had at least N sales in the last 12 months." |
| "Studios are always liquid." | Unfalsifiable absolute; untestable with available data | "Median days on market for Didi Dighomi studios is under 90 days." |

## Pitfalls

- Hypotheses that restate the branch name ("resale liquidity matters") instead of making a claim.
- Statements with no threshold or timeframe, which nothing can contradict.
- A falsification question that asks for support ("what shows this is true?") instead of
  disconfirmation.
- Scoring everything high impact and high uncertainty, so the ranking says nothing.
- Confirmation bias: stopping at the first supporting source and never searching for the
  disconfirming evidence.
- Treating "no evidence found" as acceptance; it is unresolved.
- Hypotheses that do not affect the decision, which spend research for no change in the answer.

## Reading the result

The product is a ranked list and a verdict per hypothesis, not a report. If the top-ranked
hypotheses are accepted, the provisional answer stands, and say how confident and why. If any
high-impact hypothesis is rejected, the answer changes or is withdrawn; state the new answer.
Unresolved high-priority hypotheses are the main residual risk: name them with the evidence that
would settle them.
