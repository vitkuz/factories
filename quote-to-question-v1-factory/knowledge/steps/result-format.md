# Where the results are saved

The results repository holds, per quote, a copy of every step's output file, unchanged. Nothing is assembled, renamed or summarised: the files are the result.

```
<resultsDir>/<quoteId>/<harness>/<pipeline.id>/NNN/
  1-extract-core/quote.json
  1-extract-core/semantic-core.json
  2-research-historical-context/history-context.json
  3-find-obvious-questions/obvious-questions.json
  4-iconic-dialogs/iconic-dialogs.draft.json
  4-iconic-dialogs/balabanov.review.md
  4-iconic-dialogs/mamet.review.md
  4-iconic-dialogs/wilder.review.md
  4-iconic-dialogs/tarantino.review.md
  4-iconic-dialogs/iconic-dialogs.final.json
  5-merge-questions/merged-questions.json
  6-judge-questions/judged-questions.json
  7-filter-and-compress/filtered-and-compacted.json
```

- `quoteId` is the quote's id, given with the run; never invent or hash one.
- `harness` is the harness that ran the pipeline, given with the run: `claude`, `codex`, `antigravity`, `deepseek`, `copilot`, `grok` or another. `pipeline.id` is the factory id.
- `NNN` is a three-digit run counter inside that folder: `001` for the first run, `002` for the next, and so on. An earlier run is never overwritten or edited; the highest number is the latest result.
- The run folder under `run/` stays as it is: the work happens there, the results repository gets the copies.
- The filtered file is the deliverable; the other files are its evidence.

## How to release the files

1. The work directory is `<resultsDir>/<quoteId>/<harness>/<pipeline.id>`; create it if it is missing.
2. Find the next free three-digit number there (`001` when it is empty) and create that folder. Never touch an earlier one.
3. Copy every input file into it, byte for byte, under its step folder name as listed above.
4. Write the map in the run folder: the destination folder, then one line per copied file with its destination path.
