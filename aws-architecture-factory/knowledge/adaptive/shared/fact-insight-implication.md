# Fact, Insight, Implication

Raw evidence is not understanding. Convert it in three levels, per hypothesis.
Each level cites the level below it. Nothing floats free.

| Level | Question | Cites |
|-------|----------|-------|
| Fact | What do we know? | Evidence ids |
| Insight | What does the combination of facts mean? | Fact ids |
| Implication | Why does it matter for the user's decision, and what does it change? | Insight ids |

## Fact
A fact is one checkable statement taken from the evidence files.
- It cites at least one evidence id.
- It stays within what the source says. No stretching.
- It keeps the evidence's confidence. Weak evidence stays weak. Never promote it to fact silently.
- It includes the number, date or scope when the evidence has one.
- Contradicting evidence is also a fact. Record it.

Test: can a reader open the cited evidence and find this claim there? If not, it is not a fact.

## Insight
An insight says what two or more facts mean together.
- It cites two or more fact ids. One fact may carry an insight only if it is compared with a stated baseline.
- It adds meaning that no single fact contains: a trend, a gap, a cause, a tension, a threshold.
- It is a declarative sentence, not a topic.
- It states its own uncertainty when the facts leave room ("may", "likely", "only if").

Test: delete the facts. Does the insight still say something new? Delete the insight. Is the reader missing a conclusion? Both must be yes.

## Implication
An implication connects an insight to the user's decision.
- It cites one or more insight ids.
- It names the decision, option or risk it touches.
- It says what changes: the choice, the price, the condition, the risk level, the next check.
- It is specific to this user's question. It would be wrong or pointless in another run.

Test: would the user act, or decide, differently because of this sentence? If not, rewrite or drop it.

## Common failures
1. **Fact restated as insight.** "20 buildings are planned" is a fact. Rewording it as "Many buildings are coming" adds nothing. Combine it with another fact or drop it.
2. **Insight with no evidence.** A plausible claim with empty fact ids. Either find the facts or remove the insight.
3. **Insight from one weak fact.** Strong wording on a single low-confidence source. Lower the claim or mark it uncertain.
4. **Generic implication.** "Do more research", "consider the risks", "be careful". These fit any question. Name the decision and the change.
5. **Implication that repeats the insight.** It must add the consequence for the user, not rephrase the meaning.
6. **Unsupported leap.** An implication that needs a claim no insight makes. Add the missing insight, or cut the leap.
7. **Ignoring contradictions.** Insights built only from supporting facts. Include the facts that cut against the hypothesis.
8. **Level mixing.** One sentence carrying a fact, an inference and advice. Split it into three items.

## Output shape per hypothesis
One JSON object per hypothesis. Ids are unique inside the object.

```json
{
  "hypothesisId": "H1",
  "facts": [
    { "id": "F1", "statement": "...", "evidenceIds": ["E1", "E4"] }
  ],
  "insights": [
    {
      "id": "I1",
      "statement": "...",
      "factIds": ["F1", "F2"],
      "confidence": "MEDIUM",
      "reusable": true,
      "reusableContext": "Short context in which this insight holds."
    }
  ],
  "implications": [
    {
      "id": "M1",
      "statement": "...",
      "insightIds": ["I1"],
      "affects": "The decision, option or risk this changes."
    }
  ]
}
```

Rules for the shape:
- Every id cited must exist. Evidence ids must exist in the evidence files.
- Every fact is used by at least one insight, or it is dropped. Every insight is used by at least one implication, or it is dropped or marked not decision-relevant.
- Keep it small. Prefer 2–5 facts, 1–3 insights, 1–2 implications per hypothesis.
- `confidence` is HIGH, MEDIUM or LOW. It cannot exceed the weakest fact it rests on without a stated reason.
- Do not introduce a claim that no cited evidence supports.

## Reusable insights
Set `reusable: true` only when the insight would help a future run on a different question.
- It is a pattern, not a one-off number. "New-build supply growth weakens resale of generic units" is reusable. "Building X opens in May" is not.
- `reusableContext` is one or two short sentences: where, when and under what conditions it holds. Without it a future reader cannot judge fit.
- Reusable insights are prior evidence for later runs. They are not proven truth.
- Set `reusable: false` for run-specific facts, prices and dates.

## Worked example
Question: should I buy a studio apartment in a given district? Hypothesis H1: the studio can be resold within a reasonable time without a major discount.

Facts:
- F1: 20 new residential buildings are planned within 2 km (E2, E5).
- F2: Listings of comparable studios have grown over the past year (E3).
- F3: Population growth in the district is flat (E6).

Insights:
- I1: Housing supply may grow faster than demand. (F1, F2, F3) Confidence MEDIUM. Reusable: yes. Context: districts with heavy new-build pipelines and flat population.
- I2: Standard studios compete with new-build units that have better finishes at similar prices. (F1, F2) Confidence LOW. Reusable: no.

Implications:
- M1: A generic studio may face stronger resale competition, so the purchase price should include a resale discount, or the buy should wait until the supply pipeline is clearer. (I1) Affects: buy decision and price ceiling.
- M2: A unit with a clear difference from new-builds, such as location or layout, would weaken this risk. Check that before offering. (I2) Affects: which unit to pick.

Why it passes:
- Each fact points to evidence ids.
- I1 says something none of F1, F2 or F3 says alone.
- M1 names the decision and what changes. It could not be pasted into another question.

## Checklist before returning
- Every item cites ids that exist.
- No insight merely rewords a fact.
- No implication is generic advice.
- Contradicting facts are included.
- Reusable flags are set only for patterns, each with a short context.
