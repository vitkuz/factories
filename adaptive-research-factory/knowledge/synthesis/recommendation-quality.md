# Recommendation Quality

A recommendation is the product. Research that does not end in a usable answer has failed.
Use this bar when you write the final recommendation.

## The bar

1. **It answers the user's actual question.**
   - Re-read the original question and constraints before you write.
   - Answer in the user's terms: their object, their money, their horizon, their language.
   - The first sentence is the answer. Not background, not method.
2. **It is actionable.**
   - The reader knows what to do next: buy, wait, negotiate, stop, test, ask an expert.
   - Name the action, the owner if known, and the timing.
3. **It is conditional when the evidence calls for it.**
   - If the answer depends on a variable, say so with concrete thresholds.
   - Form: "Do X only if A is below N, B stays above M, and no C is found."
   - Each threshold must come from the evidence, not from a guess.
   - If the evidence gives one clear answer, do not invent conditions.
4. **Every key reason traces back.**
   - Each reason cites the hypothesis it rests on (for example H2) and the evidence ids (for example E4, E7).
   - A reason with no hypothesis or evidence id is an opinion. Cut it or label it as one.
5. **Confidence is calibrated.**
   - HIGH only when the decisive hypotheses are SUPPORTED and backed by HIGH-grade evidence.
   - MEDIUM when decisive hypotheses are PARTIALLY_SUPPORTED, or evidence is good but thin.
   - LOW when any decisive hypothesis is INCONCLUSIVE or rests on weak sources.
   - One weak decisive link caps the whole recommendation.
6. **Risks and unknowns are specific.**
   - A risk names what could go wrong, how likely, and how bad.
   - An unknown names the missing fact and who or what could supply it.
7. **It says what would change the answer.**
   - List the facts or events that would flip or weaken the recommendation.
   - Tie each one to a threshold or a hypothesis.
8. **It does not overstate on high-risk topics.**
   - For legal, medical, tax, or regulatory questions, give the research view as input only.
   - State plainly that it is not professional advice.
   - Recommend a qualified expert and say what to ask them.

## Rejected and weak hypotheses

- A REJECTED hypothesis must shape the answer. Say what it ruled out.
- An INCONCLUSIVE hypothesis belongs in the unknowns, not in the reasons.
- Do not quietly drop evidence that cuts against your recommendation. Address it.

## Pre-flight checklist

Run this before writing the final file. Fix any "no" first.

- [ ] The first sentence answers the question as the user asked it.
- [ ] The answer uses the user's own terms and constraints.
- [ ] There is a clear next action.
- [ ] Any conditions have numeric or checkable thresholds.
- [ ] Every key reason lists a hypothesis id and evidence ids.
- [ ] Every id I cite exists and says what I claim it says.
- [ ] Confidence matches the weakest decisive hypothesis and its evidence grade.
- [ ] Rejected hypotheses are reflected in the answer.
- [ ] Inconclusive hypotheses appear as unknowns.
- [ ] Each risk is specific, with likelihood and impact.
- [ ] Each unknown says what would resolve it.
- [ ] There is a "what would change this answer" list.
- [ ] If the topic is legal, medical, tax, or regulatory, an expert is recommended and certainty is toned down.
- [ ] Nothing in the recommendation goes beyond the evidence.
- [ ] No process narrative: the text describes the answer, not the research activity.

## Good vs bad

Question: "Should I buy a $55,000 studio in District X?"

Bad:

> Real estate can be a good investment, but it depends on many factors. The market has risks and opportunities. Consider your goals and consult a professional. Confidence: HIGH.

Why it fails: no answer, generic, no ids, no thresholds, HIGH with no basis.

Good:

> **Buy only if the price is at or below $52,000 and the building is already completed.** At $55,000 the studio is about 6% above comparable resale prices (H1, E3, E5), and 20 new buildings are planned nearby (H4, E9), which raises resale risk for generic studios. Rental yield clears 7% only under the current rent level (H2, E6; PARTIALLY_SUPPORTED).
> **Risks:** a supply wave could force a 10-15% resale discount (E9, E11). **Unknowns:** actual transaction prices, since listings are asking prices only. **Would change the answer:** verified transactions above $54,000, or the supply plan being cancelled.
> **Confidence: MEDIUM.** The resale hypothesis is SUPPORTED, but the rent hypothesis is only partly supported and evidence is mostly listings.

## Common failures

- **Hedging everything.** Every sentence has "may" and "could". Commit where the evidence is strong; hedge only where it is weak.
- **Generic advice.** Text that fits any question. If you can paste it under another question, rewrite it.
- **Ignoring rejected hypotheses.** The answer reads as if they were never tested.
- **Recommending beyond the evidence.** A firm "buy" built on INCONCLUSIVE hypotheses.
- **Inflated confidence.** HIGH because the writing sounds sure.
- **Invented thresholds.** Numbers with no source.
- **Untraceable reasons.** Claims with no hypothesis or evidence id.
- **Answering a different question.** A market overview when the user asked for a decision.
- **Vague risks.** "Market volatility" instead of a named event with an impact.
- **False certainty on professional topics.** Telling the user a tax, legal, or medical outcome as fact.
