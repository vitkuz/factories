# sync-results-s3

Syncs the quote-to-question results folder (`RESULTS_DIR`, the local `repos/quotes-to-question`) to S3.
Uploads every file that is missing remotely or whose MD5 differs from the object's ETag (single-part PUTs, so ETag = MD5).
Never deletes remote objects. Skips `.git`, `.DS_Store` and `node_modules`.

## S3 key rule

`key = S3_PREFIX (+ "/" if non-empty and missing) + path relative to RESULTS_DIR` with `/` separators, e.g.
`c048f7cb-473c-50f0-94fe-d66a94d71fa5/claude/quote-to-question-v1-factory/001/1-extract-core/quote.json`.
A path outside `RESULTS_DIR` is an error.

## Env (`.env` in this package folder, see `.env.example`)

| Key | Meaning |
| --- | --- |
| `AWS_PROFILE` | AWS profile for credentials (`personal`) |
| `AWS_REGION` | `us-east-1` |
| `S3_BUCKET` | target bucket (`vitkuz-q-and-a-processing-dev`; created by the q-and-a global stack, not by this tool) |
| `S3_PREFIX` | optional key prefix, default empty |
| `RESULTS_DIR` | absolute path of the results folder |
| `LOG_LEVEL` | `error` / `warn` / `info` (default) / `debug` |

The `.env` is loaded from the package folder, not from the cwd.

## Usage

```sh
npm install && npm run build
node dist/index.js [--dir <path inside RESULTS_DIR>] [--dry-run]
```

- `--dir` (default `RESULTS_DIR`): a folder (or one file) inside `RESULTS_DIR`, resolved against the cwd.
- `--dry-run`: lists the remote objects but sends no PUT; changed files are reported as `would-upload`.

Content-Type: `.json` → `application/json; charset=utf-8`, `.md` → `text/markdown; charset=utf-8`, else `application/octet-stream`.

## Output

Logs: JSON lines on stderr. Result: JSON on stdout.

```json
{
  "bucket": "vitkuz-q-and-a-processing-dev",
  "prefix": "",
  "dir": "/abs/path",
  "dryRun": false,
  "uploaded": 1,
  "unchanged": 0,
  "files": [{ "path": "<relative to RESULTS_DIR>", "key": "<s3 key>", "status": "uploaded" }]
}
```

`status` is `uploaded`, `unchanged` or `would-upload`. On an error stdout gets `{ "error": { "code", "message" } }`.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | ok |
| 1 | any other error (bad `--dir`, credentials, access denied, network) |
| 2 | bucket missing: `bucket <name> does not exist; creating it is out of scope` |

## Scripts

`npm run build`, `npm run lint`, `npm test`, `npm run format`, `npm run typecheck`.
