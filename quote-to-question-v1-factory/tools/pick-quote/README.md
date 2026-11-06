# pick-quote

Picks the quote for a quote-to-question run when the user gave none. It takes the address of a quotes-admin search
page, sends the same search to the q-and-a API and picks one hit at random.

```
https://d2m48kxqpanigi.cloudfront.net/search?q=Аристотель&scope=author&processed=false
→ POST /v1/quote/search { "query": "Аристотель", "scope": "author", "processed": false, "limit": 100 }
→ one random hit → { "quote", "quoteId", "author", … }
```

## Usage

```bash
npm ci && npm run build
node dist/index.js [--url "<console search URL>"] [--max <n>]
```

- `--url`: a full `https://…/search?…` URL or only its query (`?q=…&scope=…`). Default: `DEFAULT_SEARCH_URL` from the env.
- `--max`: how many hits to collect before picking, 1..1000 (default 100). `quote.search` is paged by its cursor (100 per
  page); the `sense` scope answers one page of at most 50.

## How the URL is read (the same rules as the console)

| URL key | API body | Rule |
|---|---|---|
| `q` | `query` | trimmed; empty = no query |
| `scope` | `scope` | `all` \| `text` \| `author` \| `id`; `sense` calls `quote.searchBySense` with `query` and `lang` only (a query is required) |
| `sort` | `sort` | `relevance` \| `updated` |
| `lang` | `lang` | 2–3 lowercase letters |
| `author`, `category` | same | 1..60 chars |
| `tag` | `tag` | lowercased |
| `processed` | `processed: false` | only the value `false` (the console's `unprocessed` chip) |

A bad value is dropped, as the console does. `pk`, `cursor`, `page` and unknown keys are dropped too. Everything dropped
is listed in `ignored` and logged as a warning.

## API calls

- `POST {API_URL}/v1/quote/search` (header `x-api-key`), following `cursor` while hits are needed.
- `POST {API_URL}/v1/quote/searchBySense` for the `sense` scope.

## Env (`.env` in this package folder, see `.env.example`)

| Key | |
|---|---|
| `API_URL`, `API_KEY` | The q-and-a API and this tool's own API key (`npm run --silent api-key -- create pick-quote` in `repos/tools`; printed once). Never printed; redacted in logs. |
| `DEFAULT_SEARCH_URL` | The search URL used without `--url`. |
| `LOG_LEVEL` | `error` \| `warn` \| `info` \| `debug` (default `info`). |

## Output

STDOUT, one JSON object; logs are JSON lines on STDERR.

```json
{ "status": "picked", "quote", "quoteId", "author", "lang", "pk", "source", "total", "pool", "index", "request": { "route", "body" }, "ignored": [] }
```

`quote` is the quote's `origin` as stored; `author` is its authors joined with `, `, or `unknown`; `total` is the API's
total, `pool` the hits collected, `index` the picked one among them. No hits: `{ "status": "empty", "source", "total",
"request", "ignored" }`. On an error: `{ "error": { "code", "message", "status"? } }`.

## Exit codes

| Code | |
|---|---|
| 0 | picked |
| 1 | bad args, URL or env; API or network error |
| 2 | no hits |

## Scripts

`npm run build`, `npm run lint`, `npm test` (node --test via ts-node), `npm run format`.
