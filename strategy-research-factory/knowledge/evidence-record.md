# Gathering evidence

A research analyst runs the tasks of one lens and writes two files. The **evidence file**
(JSON Lines, one record per line) is the only place a fact enters the study. The **notes file**
is short. Analysts gather evidence. They do not conclude, and they never write the report.

## How to search

- Run every query the plan gives your tasks. Add your own when results are thin, and list them
  in the notes.
- **Open the source. Never trust the snippet.** The page carries the number, the date, the
  definition and the caveat.
- **Go to the primary.** When an article cites a report, find the report. When a report cites a
  survey, find its sample and date.
- **Look for the opposite on purpose.** For every hypothesis you touch, run at least one query
  phrased against it ("<claim> overestimated", "<claim> failed", "why <thing> did not work").
  Record the contradicting evidence with the same care.
- **Paywalls:** record what the public abstract or press release states, and set
  `"access": "abstract-only"`.
- Stop when every task has an answer or a stated gap.

## The record

```json
{"id":"CUS-004","claim":"31% of surveyed EU banks ran at least one AI agent in production in 2026.","evidence":"<at most 30 words, verbatim from the source>","value":31,"unit":"percent","year":2026,"source":"<publisher>, \"<title>\"","url":"https://...","published":"2026-05-14","accessed":"2026-09-22","sourceType":"survey","tier":"T2","geography":"EU","population":"banks with > EUR 30bn assets, n=112","methodology":"online survey of CIOs, May 2026","supports":["H1"],"contradicts":[],"label":"FACT","confidence":0.7,"limitations":["self-reported","vendor-sponsored survey"],"taskId":"R1","access":"full"}
```

| Field | Rule |
|-------|------|
| `id` | `<LENS>-<nnn>`: `MKT`, `CUS`, `CMP`, `ENV`, `CTR`. On a gap pass, continue the numbering |
| `claim` | one sentence stating exactly what the source says, with its number, unit, year and scope |
| `evidence` | the shortest verbatim passage that carries the claim, at most 30 words |
| `value`, `unit`, `year` | for quantitative claims; `null` otherwise. Quote numbers as given; any conversion is a separate INFERENCE record |
| `sourceType` | `official-statistic`, `filing`, `regulator`, `academic`, `industry-report`, `survey`, `press`, `company-statement`, `expert`, `vendor`, `aggregator` |
| `tier` | T1–T4, per the methodology |
| `geography`, `population`, `methodology` | what the figure covers and how it was produced; `null` only when truly unstated, and then list it in `limitations` |
| `supports`, `contradicts` | hypothesis ids. A context record has both empty. A record can support one hypothesis and contradict another |
| `label` | `FACT` for what a source states; `INFERENCE` for your derived figures, with `derivedFrom` (ids) and `formula` |
| `confidence` | 0–1 for this record, with the reason in `limitations` |
| `limitations` | sample, sponsor, age, definition quirks. Never empty for T3 and T4 |
| `taskId` | the research task it answers |

A fact you believe but cannot source is not a record. It goes in the notes under "believed but
unverified".

## The notes file

1. **Tasks run.** For each task: answered, partly answered, or gap.
2. **Per hypothesis.** Which way the evidence leans and the decisive record ids. No verdicts:
   testing happens later.
3. **Contradictions.** Records that disagree, with ids and what each says.
4. **Surprises.** Anything that suggests a hypothesis nobody wrote.
5. **Gaps.** What the tasks needed that no source gave.
6. **Queries run.** Every query, marked by whether it produced a record.

On a gap pass, start the notes with the gaps this pass addressed. Append to both files and never
rewrite earlier records.
