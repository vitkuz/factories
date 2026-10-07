# Executive Summary: Layout of the Final Report

The final report is a Markdown file for a human reader.
It has a JSON twin for machines.
Both say the same thing. The JSON is the short form.
This file defines the layout only. Logic and quality rules live elsewhere.

## Rules for the whole report

- Write in the language of the question.
- Use plain words and short sentences. Define each acronym once.
- Every number has a unit, a date and a source.
- Give a range when the evidence is uncertain.
- Put the conclusion first in every section.
- No research diary. Do not tell what was searched, in what order, or what failed.
- Cite hypotheses and evidence by id (for example H2, E7) so a reader can trace a claim.
- Facts, estimates and opinions must be told apart. Never present weak evidence as fact.

## The top must fit on one screen

The top is sections 1 to 3 below. Aim for about 25 lines or fewer.
A reader who stops after the top must be able to decide.
Everything after the top is for those who want to check the case.

## Skeleton of the Markdown report

Use these sections, in this order. Do not skip one. If a section is empty, write "None found" once.

```markdown
# <Title: the question restated as a short topic>

## 1. Answer
1 to 3 sentences. The recommendation, plainly stated.
If it is conditional, say so here and point to section 7.

## 2. Key reasons
3 to 5 reasons, strongest first. One reason per bullet:
- <Reason as a full sentence with its key number and date>
  Hypothesis: H2 (supported). Evidence: E4, E7.

## 3. Confidence
HIGH, MEDIUM or LOW, plus one line on why
(for example: "MEDIUM: official data is recent, but one key claim has a single source").

## 4. Supporting evidence
The 3 to 6 strongest items. Each one line:
claim with number and unit · source · date · evidence id.
Include the strongest contradicting item, not only the supporting ones.

## 5. Major risks
2 to 4 risks. Each: what could go wrong, how big (number or range), early warning sign.

## 6. Unresolved unknowns
Each unknown: what is missing, and what would resolve it
(a data source, a document, a measurement, an expert).

## 7. Conditions and thresholds
Only if the recommendation is conditional.
List each as "Do X only if <measurable condition>", with the threshold, unit and date basis.
If the recommendation is unconditional, omit the section content and write "None".

## 8. Not researched, and prior knowledge used
- Hypotheses cut by the budget: id, one-line statement, why it was cut, how much it could matter.
- Prior insights reused: the insight, where it came from, and that it was treated as prior evidence, not truth.

## 9. Sources
Numbered list: title or publisher · URL · publication date · retrieval date · source type.
```

The confidence line sits in section 3 so the top shows the answer, the reasons and the trust level together.

## Length targets

| Part | Target |
|------|--------|
| Answer | 1 to 3 sentences |
| Key reasons | 3 to 5 bullets, 1 to 2 lines each |
| Confidence | 1 line |
| Supporting evidence | 3 to 6 lines |
| Risks | 2 to 4 bullets |
| Unknowns | 2 to 5 bullets |
| Conditions | 1 to 5 bullets |
| Whole report | about 1 to 2 pages, excluding the sources list |

If the report grows past two pages, cut detail. Do not shrink the top.

## Writing the numbers

- Write "USD 55,000 (listing, March 2026)", not "about 55k".
- Write the comparison beside the number: against last year, a competitor, or the threshold.
- Keep likelihood (how probable an event is) apart from confidence (how solid the evidence is).
- Name the cause of any uncertainty: thin data, conflicting sources, old data.

## The JSON twin

The JSON carries the same answer in a fixed shape.

```json
{
  "recommendation": "string, same as section 1",
  "keyReasons": ["string, same as the section 2 bullets, with ids"],
  "risks": ["string"],
  "unknowns": ["string, each with what would resolve it"],
  "confidence": "HIGH | MEDIUM | LOW",
  "conditions": ["string, empty array if unconditional"]
}
```

Rules for the JSON:

- Exactly these six keys. No extra keys, no missing keys.
- `confidence` is one of the three uppercase words. Nothing else.
- Arrays are never null. Use an empty array when there is nothing to list.
- Text matches the Markdown report word for word where it overlaps.
- Same language as the question. Keys stay in English.
- The one-line reason for confidence stays in the Markdown report.

## Checks before finishing

- The answer is in the first sentence of the report.
- The top fits on one screen.
- Every key reason names a hypothesis id and at least one evidence id.
- Every number has a unit and a date.
- Risks, unknowns and confidence are all present.
- Cut hypotheses and reused prior insights are listed.
- Markdown and JSON agree.
- Nothing in the report describes the research process.
