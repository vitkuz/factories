# Historical context research: fields and stop rules

Establish where the quote came from, what its author was discussing, and which question the author was trying to answer. Verify the attribution instead of assuming it. This step does not generate user questions, classify domains or rank anything; later steps do that and use this file as evidence only.

## Procedure

| Phase | Action | Result |
|---|---|---|
| 0. Language | Decide the author's language and the search plan (below) before the first query. | `authorLanguage`, primary and secondary search language |
| 1. Locate | Search in the primary language first: the exact wording when the quote is in that language, else the reconstructed original wording, plus the attributed works. Switch to the secondary language when the primary goes unproductive. | Candidate sources |
| 2. Verify | Open the candidates; check the original wording, the work, the author and the edition. | Attribution status |
| 3. Context | Read what comes right before and after the quote, and enough of the surrounding argument to understand it. | Documented context |
| 4. Intent | Record the issue the author was addressing. Take an explicit question verbatim when the source has one; otherwise reconstruct one from evidence and mark it inferred. | `authorUnderlyingQuestion` |
| 5. Return | Write the JSON with evidence, uncertainty and the research metrics. | The artifact |

## Search language strategy

The quote reaches this step in the chain's language, usually Russian, but its source lives in the author's language. A Russian search for a translated line finds quote collections, not the source; a search in the author's language finds the work. Decide the plan from the author before the first query.

### Step 0: decide the languages

1. Read `author` from quote.json. From what you know of the author's origin, set `authorLanguage` as an ISO code: "Джордж Оруэлл" → `en`, "Отто фон Бисмарк" → `de`, "А. Б. Мариенгоф" → `ru`, "Во Нгуен Зяп" → `vi` (sources in `fr` and `en`). Unknown, disputed or proverb-like → the quote's language, and say so in `reason`.
2. Primary search language = `authorLanguage` (for `vi` and other languages with thin web coverage, the language of the author's best-known editions, usually `en` or `fr`). Secondary = `en` when the primary is not English, else `ru`.
3. Split the budget: up to five searches in the primary language, at least two kept for the secondary, eight in all.

### Step 1: build the queries

| Situation | Query 1 | Query 2 | Query 3 | Then |
|---|---|---|---|---|
| Quote language = primary language (a Russian author, a Russian quote) | the exact wording in quotes: `"Смерть – это факт"` | the wording plus the author's surname: `"Смерть – это факт" Мариенгоф` | the wording plus the attributed work or genre: `"Смерть – это факт" афоризмы Мариенгоф` | the author's collected aphorisms, letters, diaries in the primary language |
| Quote language ≠ primary language (a Western author, a Russian quote) | reconstruct the original: translate the two or three key nouns and the sentence shape, keep the author's known vocabulary (`"unquestionable dogmas" Orwell`) | a second reconstruction with synonyms (`"alters them from day to day" totalitarian Orwell`) | the key nouns without quotes plus the author and the likely genre: `Orwell totalitarian state dogma essay` | open the hits in the author's collected works, essays, speeches or letters and read for the line |
| Switching to the secondary language | the quote's given wording with the author (`"Смерть – это факт" Мариенгоф` in Russian for a Western author; `"Death is a fact" Mariengof` in English for a Russian author) | the line alone in quotes, no author (`"Death is a fact"`) | `who said` / `кто сказал` plus the line | — |

- Never run two queries that differ only by punctuation or word order; that is a duplicate.
- Prefer sources in this order: the work itself (archive.org, gutenberg.org, orwell.ru, lib.ru, az.lib.ru, the author's foundation), then scholarly or encyclopedic pages, then dictionaries of quotations, then quote collections. A quote collection confirms circulation, not provenance.
- In the Russian branch, check the collection the quote came from (`source` in the task, e.g. Душенко) when its text is online: it often names the work and the translator.

### Step 2: switch and stop

- Count unproductive searches per language. Three unproductive in the primary → switch to the secondary and reset the counter. Three unproductive in the secondary, or eight in all → stop.
- A productive search is one that brings a new candidate source, the original wording, surrounding context or an attribution conflict. A page that only repeats the quote is unproductive.
- Stop early once the work, the surrounding context and the author's question are all evidenced, whatever the language.

### Step 3: record what the other language showed

- A reconstructed wording is a hypothesis until a source confirms it. `originalQuote` holds only the verified wording; a hypothesis that stayed unconfirmed is named in `reason`.
- A line found in the other language that is not the source still matters: a song lyric, a film line, a proverb or another author's sentence with the same wording ("Death is a fact" for "Смерть – это факт") says the line may be a commonplace, a misattribution or a translated borrowing. Record it in `relatedFindings` with its url, language and one line on what it is. It never changes `status` to `found` by itself.
- Write every language you searched into `researchMetrics.languagesSearched`, in the order used.

## Budget and stop rules

| Rule | Value | Behaviour |
|---|---|---|
| maxSearchRequests | 8 | At most eight web searches in the whole step. A ceiling, not a target. |
| maxConsecutiveUnproductiveSearches | 3 | Stop after three searches in a row that bring no new useful evidence. |
| stopOnSufficientEvidence | true | Stop as soon as source, surrounding context and underlying question are evidenced. |
| noDuplicateQueries | true | Never repeat a search that is substantially the same. |

Count every search yourself and report the count. Never fabricate a source, a passage, an intention or a question.

## Status

| `status` | Meaning | `historicalContext` |
|---|---|---|
| `found` | The original source is verified. | Filled; any field without evidence stays `null`. |
| `notFound` | No original source verified within the budget. | `null`. Do not infer intent or the underlying question. |
| `disputed` | Conflicting evidence about attribution or provenance. | `null` unless an original source is independently verified; explain the conflict in `reason`. |

`notFound` does not mean the quote is fabricated. A source found without a recoverable author question stays `found` with `authorUnderlyingQuestion: null`. A question reconstructed from context is never presented as the author's words.

## Fields

| Field | Type | What it is |
|---|---|---|
| `status` | `found` / `notFound` / `disputed` | The verification outcome, not whether the step ran. |
| `historicalContext` | object or null | The verified source and its context. |
| `historicalContext.author` | string or null | The verified author. |
| `historicalContext.originalWork` | string or null | The work containing the quote. |
| `historicalContext.publicationDate` | string or null | The verified date, in its original precision ("1867", "March 1904"). |
| `historicalContext.originalLanguage` | string or null | The language of the verified source. |
| `historicalContext.originalQuote` | string or null | The original wording, if verified. |
| `historicalContext.contextBefore` | string or null | A concise paraphrase of the preceding passage, marked as paraphrase, not quotation. |
| `historicalContext.contextAfter` | string or null | A concise paraphrase of the following passage. |
| `historicalContext.historicalBackground` | string or null | The evidenced circumstances: the event, debate or situation the quote belongs to. |
| `historicalContext.authorIntent` | string or null | What the author was doing with the sentence, from evidence. |
| `historicalContext.authorUnderlyingQuestion` | object or null | The question the author was addressing in the original context. |
| `historicalContext.authorUnderlyingQuestion.question` | string | The explicit question, or a careful reconstruction. |
| `historicalContext.authorUnderlyingQuestion.type` | `explicit` / `inferred` | Whether the question stands in the source verbatim. |
| `historicalContext.authorUnderlyingQuestion.evidence` | string | A short excerpt or explanation supporting it. |
| `authorLanguage` | string | The author's language as decided in phase 0 (ISO code: `ru`, `en`, `de`, `fr`, …), whatever the quote's language. |
| `relatedFindings` | array | Parallels found that are not the verified source: a song, a film, a proverb, another author's identical line, or the same line attributed elsewhere. Each: `url`, `language`, `what` (one line). Empty when none. |
| `sources` | array | Each: `url`, `type` (`primary` / `secondary` / `tertiary`), `supports` (the field names it backs). |
| `reason` | string or null | Why verification failed or is disputed. |
| `researchMetrics` | object | `searchRequests`, `maxSearchRequests`, `languagesSearched` (ISO codes in the order used), `stopReason` (`sufficientEvidence` / `unproductiveSearches` / `budgetExhausted`). |

Prose fields are written in the chain's output language; `originalQuote` stays in its original language.

## Output JSON

```json
{
  "status": "found",
  "historicalContext": {
    "author": "string or null",
    "originalWork": "string or null",
    "publicationDate": "string or null",
    "originalLanguage": "string or null",
    "originalQuote": "string or null",
    "contextBefore": "string or null",
    "contextAfter": "string or null",
    "historicalBackground": "string or null",
    "authorIntent": "string or null",
    "authorUnderlyingQuestion": {
      "question": "string",
      "type": "explicit | inferred",
      "evidence": "string"
    }
  },
  "authorLanguage": "en",
  "relatedFindings": [],
  "sources": [
    { "url": "https://example.org/primary-source", "type": "primary", "supports": ["originalQuote", "contextBefore", "authorUnderlyingQuestion"] }
  ],
  "reason": null,
  "researchMetrics": { "searchRequests": 3, "maxSearchRequests": 8, "languagesSearched": ["en", "ru"], "stopReason": "sufficientEvidence" }
}
```

When nothing is verified:

```json
{
  "status": "notFound",
  "historicalContext": null,
  "authorLanguage": "ru",
  "relatedFindings": [
    { "url": "https://example.org/lyrics", "language": "en", "what": "Песня с той же строкой «Death is a fact»; к автору отношения не имеет." }
  ],
  "sources": [],
  "reason": "No verifiable original source identified within the research budget.",
  "researchMetrics": { "searchRequests": 8, "maxSearchRequests": 8, "languagesSearched": ["ru", "en"], "stopReason": "budgetExhausted" }
}
```

## How later steps use it

- `found`: the context is evidence. `authorUnderlyingQuestion` is a strong candidate for the question the quote answers, but the quote itself must still answer it directly; test it like any other candidate.
- `notFound` or `disputed`: continue from the quote alone. Never retry the research automatically.
- `relatedFindings` is background, never evidence: no history question is built on a parallel that is not the source.
