# Picking the quote when the user gave none

The factory needs one quote: its text (`quote`), its uuid (`quoteId`) and its `author`. When the user names a quote,
those come from the user. When the user gives **no quote**, the quote is picked from the quotes admin with the
factory's own tool `pick-quote` (`tools/pick-quote/`), before the run opens.

## Why before the run, not inside a step

`quote` names the run folder (the slug), and `quoteId` is part of the results path and of the processing record. Both
are fixed when the run opens, so the pick happens first and its answer becomes the run's params.

## The tool

| | |
|---|---|
| Folder | `tools/pick-quote/` (own npm package, `bin` = `dist/index.js`, built by the pipeline's before-hook when `dist/` is missing) |
| Env | its own `.env` next to its `package.json`: `API_URL`, `API_KEY` (its own key, named `pick-quote`), `DEFAULT_SEARCH_URL`, `LOG_LEVEL`. Gitignored; never print, copy or log its values. |
| Input | `--url <console search URL>`: the address of a `/search` page of the quotes admin, e.g. `https://d2m48kxqpanigi.cloudfront.net/search?q=Аристотель&scope=author&processed=false`, or only its query (`?q=…`). Without `--url` it uses `DEFAULT_SEARCH_URL`. `--max <n>` (default 100): how many hits to collect before picking. |
| What it does | Reads the URL the way the console does (`q`, `scope`, `sort`, `lang`, `author`, `category`, `tag`, `processed=false`), sends the same request to the API (`quote.search`, following the cursor up to `--max` hits; the `sense` scope goes to `quote.searchBySense`, at most 50), and picks one hit at random. `pk`, `cursor`, `page` and bad values are dropped and listed in `ignored`. |
| STDOUT | `{ "status": "picked", "quote", "quoteId", "author", "lang", "pk", "source", "total", "pool", "index", "request", "ignored" }`; `author` is the quote's authors joined with `, `, or `unknown`. |
| Exit codes | `0` picked, `2` no hits (`{ "status": "empty", … }`), `1` bad input, env or API error. |

`processed=false` in the URL keeps only quotes no factory has processed yet (the console's `unprocessed` chip), so a
picked quote is normally new to this factory. Without it, a picked quote may already have a run; the factory then
writes the next run number, which is fine.

## The rule for the orchestrator

1. The user gave `quote=` → use it; `source` is `user`.
2. The user gave no `quote=` → from the project root run
   `node factories/quote-to-question-v1-factory/tools/pick-quote/dist/index.js [--url "<the user's search URL>"]`
   (build it first with `npm ci && npm run build` in its folder if `dist/` is missing).
   - Exit 0: run the factory with `quote=<quote> quoteId=<quoteId> author=<author> source=<source>`. Tell the user which
     quote was picked (text, author, id) and from how many hits.
   - Exit 2: no quote matches the URL; tell the user and ask for another URL or a quote. Do not run the factory.
   - Exit 1: report the error code and message (never the key or the API URL) and stop.
3. Never edit the picked text: `quote` is the quote's `origin` exactly as stored.

## Where `source` goes

`source` (`user`, or the search URL the quote was picked from) is kept only in the run's params (`state.json`). It is
not passed to any step and never written into `quote.json`.
