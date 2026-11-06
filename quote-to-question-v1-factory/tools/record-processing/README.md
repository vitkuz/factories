# record-processing

Records a quote-to-question run on the quote: it lists the run folder's files, turns each into its S3 key and writes
them to the quote's top-level `processing` field through the q-and-a API. In the same write it fills the quote's
`category` and `tags` from the run's semantic core (`1-extract-core/semantic-core.json`).

```json
{ "processing": { "quote-to-question-v1-factory": { "1-extract-core": ["<key>", "<key>"], "2-research-historical-context": ["<key>"] } } }
```

The API deep-merges `patch.processing` into the stored object (objects merge key by key, arrays replace, `null`
deletes a key). So the tool sends **only this skill's entry**, plus `null` for every step key stored before but absent
from this run: other skills' entries are never sent (a concurrent write by another factory is never undone), and a
rerun with fewer steps leaves no stale keys. The result: this skill's entry is replaced, other entries are kept.

## Category and tags

| Quote field | From the semantic core | Rule |
|---|---|---|
| `category` | `primaryDomain` (fixed list: общество / любовь / старость / смерть / работа / характер / власть / одиночество / другое) | added unless it is `другое`; at most 5 items |
| `tags` | `themes`, lowercased | added in order; at most 10 items |

- The stored values are **kept and come first**; the core's items are appended when not already there (case-insensitive),
  while there is room. Items are trimmed; an empty one or one over 60 characters is skipped. Nothing is ever removed.
- The API replaces arrays, so a changed field is sent as the whole merged list; an unchanged field is not sent.
- No `semantic-core.json` in the run folder: a warning on STDERR, only `processing` is written. A file that is not
  valid JSON (or has the wrong shape): exit 1 `BAD_INPUT`, nothing is read or written.
- `--skip-meta` writes `processing` only.

## Usage

```bash
npm install && npm run build
node dist/index.js --uuid <quoteUuid> --run-dir <RESULTS_DIR>/<uuid>/<harness>/<skill>/<NNN> [--skill <id>] [--skip-log] [--skip-meta] [--dry-run]
```

- `--uuid`: the quote's uuid (the quote's pk is `quote#<uuid>`).
- `--run-dir`: the run folder; must be inside `RESULTS_DIR/<uuid>/`.
- `--skill`: the key under `processing`; default `SKILL_ID` from the env, else `quote-to-question-v1-factory`.
- `--skip-log`: sends `skipLog: true` (no `log` item for the write).
- `--skip-meta`: leaves `category` and `tags` alone; writes `processing` only.
- `--dry-run`: reads the quote (if reachable) and prints the would-be patch; writes nothing.

## The S3 key rule (same as sync-results-s3)

key = `S3_PREFIX` (a trailing `/` is added when missing) + the file's path relative to `RESULTS_DIR`, `/` separators.
A path outside `RESULTS_DIR` is an error. Each step folder (a direct subfolder of the run folder) lists all its files,
recursively, sorted; files directly in the run folder go under `_run`. `.git`, `.DS_Store`, `node_modules` are skipped.

## API calls

- `POST {API_URL}/v1/quote/getOneByUuid { uuid }` (header `x-api-key`).
- `POST {API_URL}/v1/quote/updateOneByPk { pk, patch: { category?, tags?, processing: { "<skill>": { "<step>": ["<key>"], "<stale step>": null } } }, skipLog? }`.

The answer's `processing` may hold any JSON object under other factories' keys; only this skill's entry is checked as
a step map (else exit 1 `BAD_ANSWER`). An API that does not accept `processing` (an older deploy) answers
`400 patch: Unrecognized key: "processing"`, which this tool reports as `api-pending` (exit 3); nothing is written.

## Env (`.env` in this package folder, see `.env.example`)

| Key | |
|---|---|
| `API_URL`, `API_KEY` | The q-and-a API and an API key (copy from `repos/tools/.env`). Never printed; redacted in logs. |
| `RESULTS_DIR` | The local results repository. |
| `S3_PREFIX` | Optional key prefix, default empty. |
| `SKILL_ID` | Optional default for `--skill`. |
| `LOG_LEVEL` | `error` \| `warn` \| `info` (default) \| `debug`. |

## Output

STDOUT, one JSON object; logs are JSON lines on STDERR.

```json
{ "uuid", "pk", "skill", "dryRun", "status": "updated" | "dry-run" | "api-pending", "processing": {}, "meta"?: { "category", "tags" }, "updatedAt"?, "request": { "pk", "patch", "skipLog"? }, "message"?, "apiMessage"? }
```

`processing` is the quote's whole field after the write (the API's answer; on dry-run / api-pending, the expected
value). `meta` is the quote's `category` and `tags` after the write (absent with `--skip-meta` or without a semantic
core). `request` is the body sent (or that would be sent). On an error: `{ "error": { "code", "message", "status"? }, "request"? }`.

## Exit codes

| Code | |
|---|---|
| 0 | `updated` or `dry-run` |
| 1 | any other error (bad args or env, run folder, other 4xx/5xx, network, `BAD_ANSWER`) |
| 2 | quote not found (404) |
| 3 | `api-pending`: the API does not accept `processing` (an older deploy) |

## Scripts

`npm run build`, `npm run lint`, `npm test` (node --test via ts-node), `npm run format`.
