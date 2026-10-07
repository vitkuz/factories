# Framework routing

Choose the primary framework that structures the whole research problem. Add 0 to 3 supporting frameworks. Frameworks are tools. They shape the problem. They are not the report.

## Inputs

- The problem archetype: DECIDE, UNDERSTAND, DISCOVER, PREDICT, OPTIMIZE or INVENT.
- The framework index. It holds frontmatter only: `id`, `purpose`, `problemTypes`, `useWhen`, `doNotUseWhen`, `questionsAnswered`, `complexity`, `overlapsWith`, `pairsWellWith`.
- Never open a framework body. Route from the index alone.

## Default: archetype to primary framework

The spec uses enum names. The registry uses file-name ids. Always output the id.

| Archetype | Spec enum | Default primary id | Typical supporting ids |
|-----------|-----------|--------------------|------------------------|
| DECIDE | HYPOTHESIS_DRIVEN | `hypothesis-driven` | `mece`, `financial-modeling` |
| UNDERSTAND | ROOT_CAUSE | `root-cause-analysis` | `mece`, `hypothesis-driven` |
| DISCOVER | JTBD | `jobs-to-be-done` | `design-thinking`, `customer-segmentation` |
| PREDICT | SCENARIO_PLANNING | `scenario-planning` | `pestel` |
| OPTIMIZE | CONSTRAINT_ANALYSIS | `constraint-analysis` | `value-chain`, `root-cause-analysis` |
| INVENT | FIRST_PRINCIPLES | `first-principles` | `design-thinking` |

The remaining spec enums map the same way: MECE to `mece`, DESIGN_THINKING to `design-thinking`.

The supporting column is a starting list, not a quota. Use it only when the index confirms the id exists.

## When to deviate from the default

Start from the default. Read its frontmatter. Deviate only with a quotable reason.

1. **doNotUseWhen matches.** If any line describes this problem, reject the default. Quote the line in the rationale.
2. **useWhen fits another framework better.** Pick a candidate whose `useWhen` and `problemTypes` match the problem's domain and whose `doNotUseWhen` does not match.
3. **Domain framework beats generic.** A generic method (hypothesis-driven, mece) is a fallback for open questions. If the question is plainly about one domain structure, a domain framework can lead. Examples: market sizing, `tam-sam-som`. Industry rivalry, `porter-five-forces`. Margin structure, `profit-tree` or `unit-economics`.
4. **Complexity.** If two candidates fit equally, take the lower `complexity`. Do not take a heavy model when a light one answers the question.
5. **Evidence.** Prefer a framework whose evidence can be found in public sources for this scope.

Record the default, the choice, and the reason in the rationale. Lower the confidence when you deviate on judgement rather than on a quoted line.

## Picking supporting frameworks (0 to 3)

- Add one only if it covers a part of the question the primary leaves open.
- Prefer low `complexity`. Prefer ids in the primary's `pairsWellWith`.
- Never pair two ids where either lists the other in `overlapsWith`. Keep the stronger fit.
- Reject any candidate whose `doNotUseWhen` matches.
- Do not repeat the primary in the supporting list.
- Zero supporting frameworks is a valid answer. Simple problems need only a primary.
- Never exceed 3.

## Hard rule: the registry is the only source

Never name an id that has no file in the registry. Check every id against the index before output.

- Do not translate an enum into an id by guessing. If `design-thinking` is not in the index, it does not exist for this run.
- If the default primary is missing, choose the best indexed candidate and say so in the rationale. Lower the confidence.
- If no indexed framework fits, use the closest general one that does not match its `doNotUseWhen`. Do not invent one.
- Supporting ids that are missing are dropped. Do not substitute guesses.

## Output shape

Return JSON only.

```json
{
  "primaryFramework": "hypothesis-driven",
  "supportingFrameworks": ["mece", "financial-modeling"],
  "rationale": "Why the primary fits the archetype and problem. Why each supporting id adds coverage. Any default overridden, with the quoted doNotUseWhen line.",
  "confidence": 0.85
}
```

- `primaryFramework`: one id, as a string.
- `supportingFrameworks`: array of 0 to 3 ids. Empty array if none.
- `rationale`: 2 to 5 short sentences.
- `confidence`: number from 0 to 1. Use below 0.6 when a default was missing or overridden by judgement.

## Worked example

Question: "Should I buy a $55k studio in Didi Dighomi?" Archetype: DECIDE.

1. Default primary is `hypothesis-driven`. Its `useWhen` fits a yes/no decision under uncertainty. No `doNotUseWhen` line matches. Keep it.
2. The decision has separate parts: resale, price economics, livability, future development. `mece` splits them without overlap. It is low complexity. Add it.
3. The price and yield part needs numbers. `financial-modeling` answers it. Add it, if it is in the index.
4. Future development is uncertain over years. `scenario-planning` could fit. It is heavier, and the structure above already covers it with a hypothesis. Leave it out to stay small.
5. Check that none of the three lists the other in `overlapsWith`. Check that all three ids have files.

```json
{
  "primaryFramework": "hypothesis-driven",
  "supportingFrameworks": ["mece", "financial-modeling"],
  "rationale": "A buy-or-not decision is best structured as testable hypotheses. mece keeps the branches distinct. financial-modeling covers price and yield, which the primary does not. scenario-planning was skipped as too heavy for one branch.",
  "confidence": 0.88
}
```
