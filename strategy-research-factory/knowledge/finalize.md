# Assembling the package

The package is the report as the reviewer last saw it, the evidence base, and one index. Nothing
in the report is rewritten.

## What to do

1. **Copy the report** with `cp` into the package folder as `report.md`. Then remove one thing
   only: a `## Review points addressed` section at the top, if present (from that heading to the
   next `#` or `##` heading). Everything else stays byte for byte.
2. **Copy the evidence base** with `cp` as `evidence.jsonl`.
3. **Write `README.md`**, the index.

## The index

1. **Title.** The report's title and dek, quoted.
2. **Verdict.** The last review's verdict and its one-line reason. If the review said fail, state
   plainly that the study did not reach a defensible answer, and quote what it said would be
   needed. If the loop reached its cap, say so.
3. **The decision.** The decision and the problem statement from the brief.
4. **The answer.** The report's At a glance, quoted verbatim.
5. **How the question was broken down.** The top-level issue-tree questions, and for each the
   frameworks used, or "custom analysis". Count the frameworks considered and rejected.
6. **Hypotheses.** A table of id, status and confidence, counted from the results file.
7. **Files.** `report.md`, `evidence.jsonl`, and the relative paths of the brief, the issue tree,
   the framework selection, the hypotheses, the research plan, the test results, the synthesis,
   the storyline and the review history, one line each.
8. **Open points.** Every CRITICAL or MAJOR finding left open, and every known gap the report
   lists. "None" is a valid entry.
9. **How this was made.** Two or three sentences with the number of hypotheses (supported,
   rejected and so on), evidence records, distinct sources and review passes. Count them from the
   files; do not estimate.

## Rules

- Change no wording, no number and no order inside the report.
- A missing report means a failed package, not a package with a note.
