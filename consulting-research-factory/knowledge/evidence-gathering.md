# How evidence is gathered and recorded

Each analyst works one lens of the research plan and writes two files: an **evidence file** in
JSON Lines (one record per line) and a short **notes file**. The evidence file is the only
place a fact enters the study; the report is later built from it, never from an analyst's memory.

## How to search

- Run every query the plan gives your rows. Add your own when results are thin, and list the
  added queries in the notes file.
- **Open the source; never trust the snippet.** The page carries the number, the date, the
  definition and the caveat.
- **Go to the primary.** When a news article cites a report, find the report. When a report
  cites a survey, find the survey's sample and date.
- **At least three independent sources per priority-1 hypothesis.** Two pages quoting one press
  release are one source.
- **Search for the opposite claim** on purpose: "<claim> criticism", "<claim> overestimated",
  "<claim> failed", "why <thing> did not work", or the equivalent in the source language.
- **Market sizing** (numbers lens): find the inputs for both routes in the plan, compute both,
  and record the result as an inference with the inputs' ids. If the routes differ by more than
  2x, say which you trust and why. Sanity-check every headline figure per unit (per customer,
  per employee, per capita, share of GDP or of a known total).
- **Paywalls:** record what the public abstract, press release or table of contents states, and
  mark the record `"access": "abstract-only"`.
- Stop at the 80 percent: when every row has an answer or a stated gap.

## The evidence record

One JSON object per line. Ids are `<LENS>-<nnn>`: `NUM-001`, `PLY-001`, `CTR-001`. They are
renumbered to `EV-nnn` when the evidence base is merged, and your id is kept as `origin_id`.

```json
{"id":"NUM-007","hypotheses":["H2"],"stance":"supports","claim":"Global spending on AI software reached $X billion in 2025.","value":123.4,"unit":"USD billion","year":2025,"geography":"global","population":"enterprise software spend","source_title":"...","publisher":"...","url":"https://...","published":"2026-03-12","accessed":"2026-09-21","source_type":"industry-report","tier":"T2","method":"vendor revenue survey, 400 vendors","access":"full","quote":"<at most 30 words, verbatim>","label":"FACT","confidence":"moderate","limitations":["vendor-reported revenue","definition includes AI features in suites"]}
```

| Field | Rule |
|-------|------|
| `hypotheses` | the ids it bears on; `[]` is allowed for context records |
| `stance` | `supports`, `contradicts`, `mixed` or `context`, relative to each listed hypothesis |
| `claim` | one sentence stating exactly what the source says, with the number, unit, year and scope |
| `value`, `unit`, `year` | for quantitative records; `null` for qualitative ones. Quote numbers as the source gives them; convert in a separate derived record, never silently |
| `source_type` | `official-statistic`, `filing`, `regulator`, `academic`, `industry-report`, `survey`, `press`, `company-statement`, `expert`, `vendor`, `aggregator` |
| `tier` | T1–T4 from the method file |
| `quote` | the shortest verbatim passage that carries the claim, at most 30 words |
| `label` | `FACT` for what the source states; `INFERENCE` for your derived figures, with `derived_from` listing the ids and `formula` the arithmetic |
| `confidence` | high / moderate / low, for this record, with the reason in `limitations` |
| `limitations` | sample, geography, who paid for it, age, definition quirks. Never empty for T3/T4 |

A fact you believe but cannot source is not a record. It goes in the notes file under
"believed but unverified".

## The notes file — sections

1. **Lens and rows covered** — which workplan rows you ran.
2. **What the evidence says, per hypothesis** — two or three lines each: which way it leans,
   the decisive record ids, and your provisional verdict (supported / partially supported /
   rejected / insufficient evidence).
3. **Disagreements** — where sources conflict: the ids, what each says, which you lean on and why.
4. **Surprises** — anything that suggests a hypothesis nobody wrote down.
5. **Gaps** — what the rows needed that no source gave, one line each.
6. **Queries run** — every query, marked whether it produced a record.

On a counter-evidence lens, section 2 says for each hypothesis whether it **survived the attack**
and how hard you tried.

## Rules

- No record without a URL and a date.
- One claim per record. A source with five useful numbers gives five records.
- Never paste long passages. Copyright and clarity both demand short quotes.
- On a gap-filling pass: append only; continue the numbering; add a line at the top of the notes
  file naming the gaps this pass filled.
