# Assembling the final consulting report package

The package is the report as the partner last saw it, a rendered HTML version, the evidence
register and one index. Nothing in the report is rewritten here.

## What to do

1. **Copy the report** into the package folder as `report.md` with a file command (`cp`), never by
   retyping. Then remove one thing only: a `## Review points addressed` section at the top, if
   present (from that heading to the next `#`/`##` heading). Everything else stays byte for byte.
2. **Render** the copied report to `report.html` with the command given in the task. It needs only
   Python 3; the page loads its Markdown and chart libraries from a CDN when opened. If the command
   fails, report the error in the index and carry on — the Markdown report is the deliverable.
3. **Copy the evidence register** as `evidence.jsonl`, with `cp`.
4. **Write `README.md`**, the index.

## The index

1. **Title** — the report's title and dek, quoted.
2. **Verdict** — the first line of the last partner review, quoted. If the report was finalized
   because a review loop reached its cap, say so in one sentence and list the findings left open.
3. **The answer** — the report's At a glance, quoted verbatim.
4. **Files** — `report.md` (the report), `report.html` (open in a browser; charts render there),
   `evidence.jsonl` (every sourced fact, one per line), one line each.
5. **Open points** — every CRITICAL or MAJOR review finding not addressed and every known gap the
   report lists, one line each. "None" is a valid entry.
6. **How this was made** — two or three sentences: number of hypotheses and how many were
   supported / rejected, number of evidence records and sources, number of exhibits, number of
   review passes. Count them from the files; do not estimate.

## Rules

- The clerk changes no wording, no number and no order inside the report.
- A missing report is a failed package, not a package with a note.
