# The evidence base

The evidence base merges the five lens files into the one store that every later step reads.
Nothing new is researched here. This step merges, deduplicates, grades and reconciles.

## The merged register — `evidence.jsonl`

Same record shape as the lens files, with these changes:

- **Renumber** every record `EV-001`, `EV-002`…, ordered by hypothesis and then by lens. Keep
  the lens id as `originId`.
- **Deduplicate.** Two records stating the same fact from the same underlying source become one:
  keep the higher-tier citation and list the other URL under `alsoReportedBy`. Two records
  stating the same fact from **independent** sources stay separate, because that is
  corroboration.
- **Re-grade.** Correct any `tier` that does not match its source type. A market-report press
  release with no method is T4, whatever the analyst said.
- **Flag.** Set `"stale": true` on a record older than the topic tolerates (normally 3 years for
  fast-moving technology markets, 5 otherwise). Set `"weak": true` on a record whose only
  support is T3 or T4.
- **Preserve contradiction.** Never drop a record because it disagrees with others.
- Drop nothing silently. Every dropped record goes in the summary with its reason.

## The summary — `evidence-summary.md`

1. **Number register.** Every figure later steps may use, as one table:

   | Key | Figure | Value | Unit | Year | Scope | Evidence ids | Tier | Status |
   |-----|--------|-------|------|------|-------|--------------|------|--------|

   `Key` is a short stable name (`sam-2028`). `Status` is `corroborated` (one T1, or two
   independent T2+), `single-source`, `conflicting` or `derived` (with the formula). When
   sources conflict, give one row per value, then say which value the study uses and why. Do not
   average unless the definitions match. **The report may cite no number that is missing from
   this register.**
2. **Consistency checks.** Shares add up, parts sum to totals, growth rates match their
   endpoints. List every mismatch.
3. **Coverage.** Records per lens and per hypothesis. Name any priority-1 hypothesis with fewer
   than three independent records.
4. **Contradictions.** Each disagreement, with ids, what each side says and why they might
   differ (definition, year, sample, sponsor).
5. **Gaps.** Every gap the analysts listed, deduplicated, with the hypothesis it touches and the
   lens that could fill it.
6. **Dropped records.** Id and reason.
