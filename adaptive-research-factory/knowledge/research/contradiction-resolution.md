# Contradiction Resolution

Sources will sometimes disagree. This file says what to do when they do.

The goal is an honest account of what is known. It is not a tidy answer.

## Core rules

- Check first whether the sources truly conflict. Many do not.
- Weigh the sources by quality, recency, directness and independence.
- Record both sides. Never average them away.
- If the conflict cannot be resolved, carry it as an explicit unknown.
- Never pick the convenient side. The side that fits the hypothesis or the expected answer gets no extra weight.
- Never silently drop the inconvenient evidence item.

## Step 1: Check whether the conflict is real

Two claims often differ because they measure different things. Compare them on each point below.

- Period: which month or year does each figure describe?
- Geography: the same district, city or country?
- Definition: does each source use the same meaning for the term?
- Unit: currency, area unit, per month or per year, gross or net?
- Price type: asking price or transaction price?
- Statistic: mean or median? Sample size and sample type?
- Scope: new build or resale, all stock or one segment?

If any point differs, the claims are not in conflict. Record both as separate facts with their scope. Add a note on why they differ. Stop here.

## Step 2: Weigh the sources

Only conflicts that survive Step 1 need weighing. Rate each side on four points.

- Source quality: official data and primary records beat press, press beats forums and marketing.
- Recency: newer data beats older data when the subject changes over time.
- Directness: a measured value beats an estimate, and an estimate beats a reported opinion.
- Independence: three pages that copy one origin count as one source.

State the weighing in words. Say which side is stronger and why.

A stronger side is not the only true side. Keep the weaker side on record.

## Step 3: Record both sides

Do not blend two figures into a midpoint. A midpoint matches no source.

Keep both evidence items with their ids. Give each its own date, source and limitations. Add one contradiction entry that links them.

## Step 4: Resolve or leave open

Mark the entry resolved only if one of these holds.

- Step 1 showed the claims measure different things.
- One side is clearly stronger on the Step 2 points, and you can say why.
- A newer primary source corrects an older one.

Otherwise mark it unresolved. Then write down:

- what evidence would settle it, such as a transaction registry extract or a dated official release;
- where that evidence might be found;
- how the result would change the status of the hypothesis.

Add the open item to the unknowns list. Do not hide it in a footnote.

## Step 5: Apply the effect to hypothesis and confidence

- A resolved conflict that was only a difference in scope has no effect on status.
- A real conflict that favors one side lets the hypothesis keep its status, with lower confidence.
- A real conflict on a key point usually gives PARTIALLY_SUPPORTED.
- A real conflict with no stronger side and no other support gives INCONCLUSIVE.
- Never give SUPPORTED or REJECTED when the decisive evidence is split and unresolved.
- Lower confidence one level for each unresolved conflict that touches the core claim.

## Contradiction entry format

```json
{
  "id": "C1",
  "hypothesisId": "H1",
  "evidenceIds": ["E3", "E5"],
  "explanation": "What differs between the two claims and why it matters.",
  "weighing": "Which side is stronger, on which of the four points.",
  "resolution": "resolved: ... | unresolved",
  "settlingEvidence": "What would settle it, or null if resolved.",
  "effectOnStatus": "None | lowers confidence | PARTIALLY_SUPPORTED | INCONCLUSIVE"
}
```

## Worked example

Hypothesis: Studios in Didi Dighomi can be resold without a major discount.

- E3: a listing portal shows a median of 1,900 USD per sqm for Didi Dighomi. Dated this month.
- E5: a registry-based market report shows a median of 1,650 USD per sqm. Dated last quarter.

Step 1. Both are medians, both are in USD per sqm, both cover the same district. Two points differ. E3 is asking prices and E5 is recorded transaction prices. The periods also differ by a few months.

Step 2. Asking prices run above final prices, so the gap is expected. The two figures describe different things. Not a true conflict.

Step 3. Keep both. Do not average them to 1,775.

Entry:

```json
{
  "id": "C1",
  "hypothesisId": "H1",
  "evidenceIds": ["E3", "E5"],
  "explanation": "E3 is asking prices, E5 is transaction prices. E3 is also newer.",
  "weighing": "For resale value, E5 is more direct. E3 shows seller expectations.",
  "resolution": "resolved: different price types, not a true conflict",
  "settlingEvidence": null,
  "effectOnStatus": "None"
}
```

The gap itself is useful. About 13 percent between asking and transaction prices suggests sellers may need to discount. Report it as a finding.

If E5 had also been asking prices, the gap would be real. Check the dates and sample sizes. If these do not decide it, mark the entry unresolved. Ask for a registry extract for the same quarter. Mark the hypothesis PARTIALLY_SUPPORTED or INCONCLUSIVE.
