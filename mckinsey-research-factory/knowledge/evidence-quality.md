# Evidence Quality

Every claim in a dossier must say what kind of claim it is, where it came from, how much to trust it, and which hypothesis it bears on.
Keep what is known separate from what is assumed or judged (ICD 203, standard 3).

## 1. Classify every claim

| Type | Meaning | Example |
|------|---------|---------|
| FACT | Verifiable from a named source; observed or reported data | "Company X reported EUR 41.2M revenue in FY2025 (annual report)." |
| ESTIMATE | A number derived by a stated method or calculation | "Segment TAM ≈ EUR 300–450M (bottom-up: 12k firms x EUR 25–38k)." |
| ASSUMPTION | A supposition you accept in order to proceed; not verified | "Assume churn equals the peer median of 2%/month." |
| OPINION | A judgment by a person or organization | "Analyst Y expects consolidation within 3 years." |

Rules:
- Show the calculation for every ESTIMATE, with its inputs and their grades.
- Flag an ASSUMPTION as a *linchpin* when the conclusion depends on it. Say what happens if it is wrong, and what indicator would show it is wrong.
- Attribute every OPINION to its author. Never promote an opinion to a fact because it was repeated.

## 2. Grade sources

Use two axes, following the Admiralty / NATO code: **source reliability** (A–F) and **information credibility** (1–6).

Source reliability (the letter labels are the Admiralty code; the example source types are our adaptation for business research):
- **A** Completely reliable: official statistics, audited filings, primary legal text, peer-reviewed data.
- **B** Usually reliable: established research firms that state their method, major business press, regulator reports.
- **C** Fairly reliable: trade press, company marketing with checkable figures, reputable blogs by named experts.
- **D** Not usually reliable: unsourced articles, vendor-sponsored "studies" without method, content farms.
- **E** Unreliable: known errors, anonymous forums, obvious propaganda.
- **F** Cannot be judged: no basis to assess.

Information credibility:
1 confirmed by independent sources · 2 probably true · 3 possibly true · 4 doubtful · 5 improbable · 6 cannot be judged.

Record a combined grade (e.g. **B2**) plus the **date** of the data, not just the date it was published.

Recency:
- Market sizes, prices and competitor facts older than about 24 months are stale. Mark them `STALE` unless the topic changes slowly.
- Legal and regulatory text must be the current version.

Quick CRAAP screen before you grade (Meriam Library): **Currency** (when, updated?), **Relevance** (does it answer our question, and at the right level?), **Authority** (who, and what credentials?), **Accuracy** (evidence cited, reviewed, verifiable elsewhere?), **Purpose** (inform, sell or persuade, and are there biases?).

Also downgrade a body of evidence, GRADE-style, for:
- risk of bias
- inconsistency between sources
- indirectness (a different population, region or product)
- imprecision (wide ranges)
- selective publication

## 3. Primary vs secondary
- **Primary:** original data. Filings, statistics tables, legal texts, pricing pages, surveys, interviews, product docs.
- **Secondary:** someone else's summary of primary data.
- Trace each important secondary figure back to its primary source. If you can't, grade it no better than C3 and say so.
- Several articles citing the same report are **one** source, not several.

## 4. Triangulate
- An **important number** is any number that feeds a hypothesis verdict, a sizing, or the recommendation. It needs **≥2 independent sources**, or one source plus an independent method (e.g. top-down vs bottom-up).
- If they agree within a reasonable band, report the range and grade the credibility 1–2.
- If they disagree, record both. Explain the gap (definition, year, scope, method) and choose a working value with a reason. Never average silently.
- Having many sources is not a substitute for having good ones (CIA Tradecraft Primer, Quality of Information Check).

## 5. Record contradictory evidence
- Keep a **Contradictions** section in every dossier. List the evidence that conflicts with a hypothesis or with other evidence, and never drop it.
- Use the Analysis of Competing Hypotheses (ACH) habit:
  - Rate each item as consistent, inconsistent or not applicable against *each* hypothesis, not just your favourite.
  - Evidence that fits every hypothesis is not diagnostic.
  - Ask what evidence you would expect to see if the hypothesis were true but haven't found.

## 6. Tag evidence against hypotheses
Each evidence line carries one tag per relevant hypothesis:
- `supports H#`
- `refutes H#`
- `neutral H#` (relevant but not diagnostic)

## 7. Citation format
One line per claim:
```
[TYPE] Claim · Source title <URL> · data date YYYY-MM · grade B2 · tag: supports H1
```
- Use the exact URL of the page that contains the claim, not a home page.
- Paraphrase. Quote only short exact phrases, and only when the wording matters.
- Never invent a URL, figure, quote or date. If you can't find it, record it as a gap.

## 8. Record gaps
A gap is a question the plan needed answered that the research couldn't answer to at least C3. For each gap, write:
- what is missing
- why (not public, paywalled, conflicting)
- the proxy used, if any
- how much it matters to the decision (H/M/L)
- how it could be closed (e.g. customer interviews, a paid dataset)

## Template: dossier

```
# Dossier: <lens> — <topic>
Scope: branches <ids> · Hypotheses: H1, H3
Summary (3–5 bullets, each tagged to a hypothesis and grade)

## Evidence
| # | Type | Claim | Source (URL) | Data date | Grade | Hypothesis tag |
|---|------|-------|--------------|-----------|-------|----------------|
| E1 | FACT | ... | ... | 2026-03 | A1 | supports H1 |

## Estimates (method shown)
E7 = inputs (E1, E3) x formula → range; key sensitivities

## Assumptions
A1 <assumption> · linchpin? Y/N · if wrong: ... · indicator: ...

## Contradictions
E4 vs E9: <what differs> · likely reason · working value chosen and why

## Hypothesis status (provisional)
H1: leaning supported / leaning refuted / unclear — based on E1, E4

## Gaps
G1 <missing> · why · proxy · importance H/M/L · how to close

## Source list
<numbered URLs with grades>
```

## Sources
- https://en.wikipedia.org/wiki/Admiralty_code
- https://www.sans.org/blog/enhance-your-cyber-threat-intelligence-with-the-admiralty-system
- https://library.csuchico.edu/sites/default/files/craap-test.pdf
- https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-14
- https://www.stat.berkeley.edu/~aldous/157/Papers/Tradecraft%20Primer-apr09.pdf (CIA, A Tradecraft Primer, 2009)
- https://www.bmbs.org/salamanca/readings/ODNI_ICDs_203-206-208.pdf (ODNI ICD 203, Analytic Standards)
- https://www.scribbr.com/methodology/triangulation/
