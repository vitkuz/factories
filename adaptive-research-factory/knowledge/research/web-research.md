# How web evidence is collected and recorded

You test one hypothesis. You collect web evidence for it and write it down as evidence items.
The writer who evaluates the hypothesis will not re-read the sources. Every item must stand
on its own. Your job is to collect and record. Do not decide whether the hypothesis holds.

## How to search

- Run every query in the query plan with the WebSearch tool. Do not skip the contradiction
  query or the local-source query.
- Open the page with WebFetch. Never trust a snippet. A snippet summarises. The page carries
  the number, the date and the caveat.
- Add your own queries when results are thin: fewer than three usable pages, only one source
  type, or only old pages. Record every added query and why you added it.
- Look for the opposite claim on purpose. Search "<claim> criticism", "<claim> wrong",
  "<claim> decline", or the equivalent in the source language. Record what you find, even when
  it hurts the hypothesis. If you find nothing, say so and list the searches you tried.
- For a local question, read local-language sources. Query in the local language and open
  local portals, registries, local press and marketplaces. Translate the claim yourself and
  say in `limitations` that it is your translation.
- Prefer sources in this order: primary data and official statistics, institutional or
  peer-reviewed work, named-outlet reporting, an expert's own words, secondary summaries.
- Two pages that quote the same press release or dataset are one source. Count them once.
- Note `publishedAt` and `retrievedAt` for every item. A 2019 figure stays a 2019 figure.
  If the page has no date, write `null` for `publishedAt` and say so in `limitations`.

## One claim per evidence item

- One item states one claim.
- Put the number, the unit and the date the number refers to in the claim.
- Quote numbers as the source gives them. If you convert a unit, do it in a second sentence.
- Add a verbatim quote of at most two lines where the page allows it. Mark it as a quote.
  Never paste long passages.
- A fact you remember but cannot source is not evidence. Put it in the gaps as "believed but
  unverified".
- Never silently turn weak evidence into fact. Write the weakness in `limitations`.

## Evidence item shape

```json
{
  "id": "E1",
  "hypothesisId": "H1",
  "claim": "Median asking price for studios in the district was 1,850 USD per sqm in March 2026.",
  "quote": "\"median asking price ... 1,850 USD/sqm\"",
  "source": "Example Real Estate Index, Q1 2026 market report",
  "url": "https://example.com/reports/q1-2026",
  "sourceType": "official",
  "publishedAt": "2026-04-02",
  "retrievedAt": "2026-10-03",
  "confidence": "MEDIUM",
  "supportsHypothesis": true,
  "limitations": "Asking prices, not closed deals. Covers listings on one portal only."
}
```

Field rules:

- `id`: `E1`, `E2`, ... in order, unique inside the evidence file.
- `hypothesisId`: the hypothesis you were given, for example `H1`.
- `sourceType`: one of the source types named in the research plan. Use the plan's words.
- `publishedAt`, `retrievedAt`: ISO dates. `retrievedAt` is the day you opened the page.
- `confidence`: `HIGH`, `MEDIUM` or `LOW`. HIGH is primary or official data that is recent
  and matches the question. LOW is a single weak, old or indirect source.
- `supportsHypothesis`: `true` if the claim supports it, `false` if it contradicts it,
  `null` if it is context only and points neither way.
- `limitations`: what limits trust. Sample size, who paid for it, age, proxy measure,
  translation. Never leave it empty. Write "none found" only after you looked.
- `quote`: optional. Omit the field if you have no verbatim text.

## When a site blocks fetching

- If WebFetch fails, try once more with the canonical URL, without tracking parameters.
- Try another copy of the same fact: the publisher's own site, an official mirror, a
  dataset page, or a cached or archived page.
- If you still cannot open the page, do not use the snippet as evidence. You may record the
  fact as an item with `confidence` `LOW` only if the snippet names the number, the unit and
  the date. Say in `limitations`: "page not opened, snippet only".
- Otherwise list the blocked URL under the gaps.
- Never invent text that a blocked page might contain.

## Budget per hypothesis

- Aim for roughly 6 to 15 evidence items per hypothesis.
- Fewer is fine when the sources are strong and the stop conditions are met.
- More than 15 means the hypothesis is too broad or you did not stop. Stop.
- Stop as soon as one of these is true:
  - the evidence is enough to classify the hypothesis;
  - new sources mostly repeat what you already have;
  - more evidence is unlikely to change the conclusion;
  - the budget is reached;
  - a blocker makes deeper research pointless.
- Use the stop conditions in the research plan when they are stricter.
- Write down which stop condition ended the work.

## What the evidence file contains

1. The evidence items, in id order.
2. The opposite-claim searches: queries run and what they returned, or "nothing found".
3. Gaps: what the research plan needed and no source gave, one line each. Empty is allowed.
   Missing is not.
4. Queries run: every query, one per line, marked as planned or added, and whether any page
   from it was used.
5. The stop condition that ended the work.

## Gap round

- The evaluation may send back a list of gaps. Research only those gaps.
- Do not redo searches that already worked. Do not rewrite or delete existing items.
- Append new items to the existing evidence file with the next free ids. If the file ends
  at `E11`, the first new item is `E12`.
- Add the new queries to the queries list, marked as gap round.
- Add one line at the top of the file saying which gaps the round filled and which are
  still open.
- The same budget and stop conditions apply. If a gap cannot be filled, say so and keep it
  in the gaps list.
