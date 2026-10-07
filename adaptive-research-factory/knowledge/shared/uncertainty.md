# Uncertainty

Research exists to reduce uncertainty that matters to a decision. This file defines how uncertainty is expressed, scored and handled. Follow it exactly so that numbers and labels mean the same thing everywhere.

## Core rules

- Never hide doubt. State what is unknown, how unknown, and what would resolve it.
- Never convert weak evidence into fact. Label it as weak.
- Use the right scale for the right object (see below). Do not mix them.
- Do not use any other labels (no "very high", "probable", percentages in prose).

## Two scales

| Object | Scale | Where it appears |
|---|---|---|
| Hypothesis impact | number 0-1 | hypothesis scoring |
| Hypothesis uncertainty | number 0-1 | hypothesis scoring |
| Classifier or router confidence | number 0-1 | problem type, framework choice |
| Evidence item confidence | HIGH / MEDIUM / LOW | evidence records |
| Hypothesis evaluation confidence | HIGH / MEDIUM / LOW | evaluations |
| Recommendation confidence | HIGH / MEDIUM / LOW | final answer |
| Stored insight confidence | HIGH / MEDIUM / LOW | saved and retrieved insights |

Numbers are for ranking and routing. Labels are for claims about the world.

## Numeric scale anchors (0-1)

| Value | Impact means | Uncertainty means | Classifier confidence means |
|---|---|---|---|
| 0.9-1.0 | Flipping this hypothesis flips the decision | Almost nothing is known; a coin flip or worse | Unambiguous; one clear reading |
| 0.6-0.8 | Changes the decision's terms, price or timing | Some signals exist but they conflict or are thin | Clear best reading; one plausible alternative |
| 0.3-0.5 | Changes details, not the decision | Mostly known; gaps are narrow | Two or more readings are about equally good |
| 0.0-0.2 | Cosmetic for the decision | Well established by strong evidence | Guessing |

## Evidence labels (HIGH / MEDIUM / LOW)

| Label | Anchor | Typical basis |
|---|---|---|
| HIGH | Would bet on it. Primary or official source, recent, independently confirmed, no credible contradiction. | Official statistics, filings, two independent primary sources |
| MEDIUM | Probably true. Credible but single-source, somewhat dated, indirect, or partly contradicted. | One reputable industry source, listing data, a good proxy |
| LOW | Possible. Anecdotal, unverified, old, promotional, or an inference from weak signals. | A forum post, a seller claim, model knowledge with no source |

Mapping to the numeric scale, for the rare case of comparing across scales:

- HIGH is roughly 0.8 and above.
- MEDIUM is roughly 0.5-0.8.
- LOW is below 0.5.
- Never convert automatically. Judge each object on its own anchors.

## Scoring a hypothesis consistently

1. Score impact first, from the decision alone. Ask: if this hypothesis were false, would my recommendation change? Fully, partly or not at all.
2. Score uncertainty second, from what is already known. Ask: how well could I answer this today, before any new research?
3. Keep the two independent. A high-impact hypothesis that is already well known gets high impact and low uncertainty.
4. Use the anchors above. Prefer values like 0.3, 0.5, 0.7, 0.9. Do not invent false precision (0.73).
5. Spread the scores. If every hypothesis is 0.8-0.9, the ranking is useless. Re-read the anchors and separate them.
6. Prior insights lower uncertainty only by their weight (see below), never to zero.
7. Priority is impact times uncertainty, computed by code, not by judgment.

## Unknowns versus risks

| | Unknown | Risk |
|---|---|---|
| Definition | A fact we lack that research could supply | A possible bad outcome that may occur even if all facts are known |
| Question it answers | What do we not know? | What could go wrong? |
| Resolved by | More evidence | Mitigation, conditions, or accepting it |
| Example | Resale time for comparable studios is not measured | Supply may outgrow demand |

Rules:

- List unknowns separately from risks. Do not merge them.
- Every unknown names the evidence that would resolve it.
- Every risk names what would trigger it or reduce it.
- A large unknown on a high-impact hypothesis should lower recommendation confidence or make the recommendation conditional.

## Prior insights from earlier runs

Retrieved insights are prior evidence. They are not truth.

- Weight a prior insight by its stored confidence and by whether a real outcome validated it.
- Outcome-validated and HIGH: strong prior. It can lower uncertainty a lot and may stand in for a new search, but still check that the context matches.
- Not outcome-validated: treat as at most MEDIUM, whatever its stored label says.
- Context differs (place, date, price band, domain): discount it by one level, or ignore it.
- A prior insight never raises evidence confidence on its own. Only new, sourced evidence does.
- If new evidence contradicts a prior insight, say so openly and trust the better-sourced side.
- Mark clearly in outputs what came from prior runs and what was found fresh.

## Calibration

- HIGH must be rarer than MEDIUM. Most real findings are MEDIUM. If most of your labels are HIGH, you are overconfident; downgrade.
- Use LOW honestly. A LOW label is useful information, not a failure.
- Do not default to MEDIUM everywhere either. Spread labels by the anchors.
- Downgrade one level when: only one source, source older than the topic's pace of change, sources not independent, or a credible contradiction is unresolved.
- Recommendation confidence cannot exceed the confidence of the evidence its key reasons rest on.
- Always state what would change your mind: one or two specific observations that would reverse or weaken the conclusion. If you cannot name any, confidence is too high.
- Long-term test: recommendations labelled HIGH should turn out right more often than those labelled MEDIUM. Write labels so that this can be checked later.

## Worked example (Didi Dighomi studio)

Question: should I buy a $55k studio in Didi Dighomi?

Hypothesis: "Comparable studios resell within six months without a discount over 10 percent."

- Impact 0.9. If false, the purchase is likely a bad one.
- Uncertainty 0.8. No sale-time data is known yet; only asking prices.
- A prior insight says generic studios sell slowly where new-build supply is high. It came from another district and was never outcome-validated, so it counts as MEDIUM at best and is discounted for context. Uncertainty drops to 0.7, not lower.
- Evidence: official statistics show 20 buildings planned nearby (HIGH). A broker's claim of "sells in weeks" is single-source and promotional (LOW). Listing ages show many unsold studios (MEDIUM).
- Evaluation: PARTIALLY_SUPPORTED against the hypothesis, confidence MEDIUM.
- Unknown: actual transaction prices. Risk: supply growth outpaces demand.
- Recommendation: buy only if the price is below a stated threshold. Confidence MEDIUM.
- Would change my mind: transaction records showing studios sell within six months at under 5 percent discount.
