# Source types and how to rank them

One fixed list of source types. Use it when you plan which sources a search should reach for,
and again when you record where a piece of evidence came from. The same words in both places.

This file is the taxonomy and the ranking. Judging one specific page (is this author real, is
this number right) is a separate job and is not covered here.

## The list

The list is closed. Use exactly these values, spelled this way, and never invent a new one.
If a source fits two, pick the one that describes who produced the data, not who hosts it.
The order is the default rank, strongest first. Rank is a starting point, not a verdict.

| # | sourceType | What it is | Good for | Bad for |
|---|---|---|---|---|
| 1 | `official` | Government bodies, statistics offices, ministries, courts, legislation | Population, prices indices, laws, statutes, national totals | Fast-moving or local detail; often months behind |
| 2 | `primary-data` | Raw datasets, filings, registers, transaction records, the original study data | Exact figures you can recompute | Interpretation; raw data needs method notes |
| 3 | `regulator` | Central banks, financial, tax, competition and sector regulators | Rates, rules, licensing, market-wide supervision data | Opinion on what the numbers mean for one buyer |
| 4 | `academic` | Peer-reviewed papers, university and institute research | Causes, methods, long-run effects | Recent events; narrow local cases; paywalled or dated |
| 5 | `industry-report` | Trade bodies, research firms, large consultancies, named analysts | Market size, trends, benchmarks | Anything where the sponsor gains from the result |
| 6 | `marketplace` | Listing sites, booking and classifieds platforms, price boards | Asking prices, supply counts, what is on offer now | Real transaction prices; listings are asks, not sales |
| 7 | `news` | Named outlets with editors and bylines | Events, dates, quotes, context | Numbers repeated from a press release without checking |
| 8 | `company` | A firm's own site, reports, press releases, price lists | Facts about that firm only | Claims about its own quality or its market |
| 9 | `expert` | A named practitioner speaking in their own words (broker, lawyer, engineer, interview) | Practical detail, how things work on the ground | Representativeness; one view is one view |
| 10 | `forum` | Forums, reviews, social posts, comment threads | Lived experience, complaints, early signals | Any number; anonymous and unverifiable |
| 11 | `aggregator` | Sites that collect, rewrite or rank others' content | Finding the original | Being the original; never cite it as the end of the chain |

Notes on edge cases:

- A firm's filing or an annual report is `primary-data`; its marketing page is `company`.
- A broker quoting a deal she closed is `expert`. A broker's site ranking "best districts" is `company`.
- A news story that only relays a statistic from a statistics office is `news` for the story. Go
  and fetch the statistics office, and record that as `official`.
- `aggregator` means no original work. If the page has its own method and data, it is something else.

## Preference order

Take evidence in this order. Move down only when the level above has nothing.

1. Primary sources: the original record, filing, dataset or statement.
2. Official data: statistics offices, regulators, courts, registers.
3. Credible industry sources: named, dated, with a stated method.
4. Multiple independent confirmations: two or more sources that did not copy each other.

Rules:

- A claim backed by one source of rank 1 to 3 beats a claim backed by five sources of rank 7 to 11.
- Weak sources are allowed as leads. Use them to find the strong source, then cite the strong one.
- Two pages that quote the same origin are one source. Count origins, not pages.
- A weak source alone gives a weak claim. Say so. Never write it up as settled fact.
- When a lower-ranked source contradicts a higher one, keep both and record the conflict.
  Do not drop the lower one silently.

## Match the type to the question

- Hard numbers (totals, rates, dates): `official`, `primary-data`, `regulator`.
- What is for sale or offered right now: `marketplace`, then `expert` to check it.
- Why something happens: `academic`, then `industry-report`.
- What people living with it say: `forum` and `expert`, labelled as anecdote.
- Facts about one company: `company`, backed by `primary-data` such as filings.

When planning queries, name the type you want next to each query. Ask for at least one query
aimed at rank 1 to 3 and at least one aimed at a source likely to disagree.

## Red flags

Any one of these lowers trust by a level. Two or more: use as a lead only.

- No publication date, or a date that cannot be found.
- No method: figures with no sample, no definition, no unit, no period.
- Affiliate or referral links beside the claim. The author is paid when you act on it.
- Sponsored or "partner" content. The sponsor chose the conclusion.
- SEO farm pattern: a "best of" listicle, keyword-stuffed headings, many near-identical pages.
- Likely AI-generated page: generic prose, no named author, no sources, confident round numbers.
- Anonymous author with claims of expertise and nothing to check.
- Circular sourcing: the page cites a page that cites it.
- Old data presented as current. A 2019 figure is a 2019 figure.

## Local and international sources

- Use both. International sources give the frame. Local sources give the facts on the ground.
- For any local question, aim at least one query at the local official body and at least one at
  local-language sources. Local-language pages often hold data that English pages lack.
- International sources are weaker on small places. Be careful with a regional or global figure
  applied to one district.
- Local sources can be thin, late or promotional. Check them against an official or
  international series when one exists.
- Record the language of the source when it is not English.

## Worked example

Question under test: is a studio apartment in Didi Dighomi, Tbilisi, easy to resell?

| What is needed | Source | sourceType |
|---|---|---|
| Housing price index, sales counts | geostat.ge | `official` |
| Mortgage rates, lending rules, market stress | nbg.gov.ge | `regulator` |
| Current asking prices, how many comparable studios are listed | Local listing sites | `marketplace` |
| How long studios take to sell, real discounts | A named local broker | `expert` |
| Planned new building in the area | A named local news outlet, then the permit register | `news`, then `primary-data` |
| "Best districts to invest in" lists | Blogs with affiliate links | `aggregator` or `company`, red flag |

Reading the table: listings show asks, not sales, so the price evidence from `marketplace`
needs a second source. Start from `official` and `regulator` for the frame, use `marketplace`
for the live picture, and use `expert` to test both. The affiliate lists are leads at most.
