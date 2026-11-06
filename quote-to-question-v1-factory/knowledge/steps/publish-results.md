# Publishing a run: S3 sync and the quote's processing record

The last two steps hand the run's results to the outside world with two compiled tools that live in this factory:

| Tool | Folder | What it does |
|---|---|---|
| `sync-results-s3` | `tools/sync-results-s3/` | Uploads new or changed files under a folder of the results repository to the S3 bucket, keys = path relative to the results repository (plus an optional prefix). Never deletes. |
| `record-processing` | `tools/record-processing/` | Reads the quote by uuid, sets `processing["<factory id>"]` = `{ "<step folder>": ["<s3 key>", ...] }` (other factories' entries are kept) and adds the run's semantic core to the quote's `category` (`primaryDomain`, unless `другое`) and `tags` (`themes`, lowercase), keeping the stored values first, within the API limits (5 categories, 10 tags); one `quote.updateOneByPk` write. |

Each tool is its own npm package; `bin` points at `dist/index.js`. The pipeline's before-hook builds a tool whose `dist/` is missing. Each reads its own `.env` next to its `package.json` (secrets live only there, gitignored); never print, copy or log its values.

## Rules for both steps

- Run the tool from the project root with `node <tool>/dist/index.js …`. Do not reimplement it, do not call the AWS CLI or the API yourself.
- STDOUT is one JSON object; logs go to STDERR. Save STDOUT unchanged in the step's output file, and add the exit code: `{ "exitCode": <n>, "result": <stdout JSON> }`.
- The run folder is the destination folder the pack step wrote in its `map.md` (`<resultsDir>/<quoteId>/<harness>/<factory id>/NNN`). If the map does not name it, take the highest `NNN` under the work directory.

## What the record step reports

Besides the exit code, name the quote's `category` and `tags` after the write (`result.meta`) in your reply. No `meta` in the result means the run had no semantic core (the tool warned on STDERR); that is not a failure.

## Exit codes

| Tool | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| `sync-results-s3` | synced | bad input, env or AWS error | the bucket does not exist (creating it is out of scope) | — |
| `record-processing` | quote updated | bad input, env or API error | quote not found | the API does not accept `processing` yet (pending API change; nothing was written) |

## Known state (2026-10-10)

- The bucket `vitkuz-q-and-a-processing-dev` exists (created by the q-and-a global stack on 2026-10-10, name in SSM `/vitkuz/q-and-a/dev/global/processing-bucket-name`). Objects are publicly readable at `https://vitkuz-q-and-a-processing-dev.s3.us-east-1.amazonaws.com/<key>`; there is no anonymous list or write.
- The quote API accepts `category` (≤ 5 items, kept as written) and `tags` (≤ 10 items, stored lowercase) in an update patch; arrays replace.
- The quote API accepts `processing` in an update patch and deep-merges it (objects merge, arrays replace, `null` deletes a key).
