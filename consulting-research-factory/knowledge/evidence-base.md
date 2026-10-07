# How the evidence base is built

The evidence base turns three analysts' files into the single fact base every later step uses.
Three files come out: the **evidence register**, the **number register** and the **hypothesis
scorecard**. Nothing new is researched here; this step merges, grades, reconciles and scores.

## The evidence register

JSON Lines, same record shape as the analysts' files, with these changes:

- **Renumber** every record `EV-001`, `EV-002`… in order of hypothesis, then lens. Keep the
  analyst's id as `origin_id`.
- **Deduplicate.** Two records stating the same fact from the same underlying source become one;
  keep the higher-tier citation and list the other URL under `also_reported_by`. Two records
  stating the same fact from *independent* sources stay separate — that is corroboration.
- **Check the grade.** Re-tier any record whose `tier` does not match its source by the method
  file's table. A "market report" press release with no method is T4, whatever the analyst said.
- **Flag** records older than five years for a fast-moving topic (`"stale": true`), and records
  whose only support is T3/T4 (`"weak": true`).
- Remove nothing silently. A record you drop goes in the scorecard's "dropped records" list with
  the reason.

## The number register

A markdown table of every figure the report may use. **The report may cite no number that is not
in this register.** One row per distinct figure:

| Key | Figure | Value | Unit | Year | Geography / scope | Evidence ids | Tier | Status |
|-----|--------|-------|------|------|-------------------|--------------|------|--------|

- **Key** — a short stable name (`market-2025`, `cagr-2025-30`), used by later steps.
- **Value** — as the best source states it; ranges as `low–high`. Round to two or three
  significant figures for use; keep the exact source value in the evidence record.
- **Status** — `corroborated` (one T1, or two independent T2+), `single-source`, `conflicting`,
  or `derived` (team analysis; list the formula).
- **Conflicts:** when sources disagree, one row per source value, then a line under the table:
  which value the study uses, why (definition, tier, recency, method) and the spread. Do not
  average unless the definitions are identical, and say so if you do.
- **Consistency:** check that shares add to about 100 percent, that parts add to totals, and that
  growth rates match start and end values. Record any mismatch.

## The hypothesis scorecard

For each hypothesis:

| Hypothesis | Verdict | Supporting ids | Contradicting ids | Strength of evidence | Kill test result | Confidence |
|------------|---------|----------------|-------------------|----------------------|------------------|------------|

- **Verdict** — exactly one of supported / partially supported / rejected / insufficient evidence.
- **Strength of evidence** — count and best tier on each side, e.g. "4 for (2×T1), 1 against (T3)".
- **Kill test result** — what the planned kill test found, or "not run — no data".

Then:

1. **Competing hypotheses** — which rival answer to the governing question the evidence favours.
2. **Surprises** — patterns across the analysts' notes that no hypothesis covers.
3. **Gaps** — every gap the analysts listed, deduplicated, with the hypothesis it touches and
   whether the answer depends on it.
4. **Dropped records** — id and reason.
5. **Coverage** — records per lens and per hypothesis; any priority-1 hypothesis with fewer than
   three independent records is named.
