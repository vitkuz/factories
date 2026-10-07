# How exhibits are designed

An exhibit is a chart or table that proves exactly one claim: its title. The method is Gene
Zelazny's (*Say It With Charts*, McKinsey's long-time director of visual communications):
**message → comparison → chart form.** "The purpose of a chart is not to show data, it is to
convey a message."

## Step 1 — write the message

The action title: a full sentence, 15 words or fewer, with a number, stating the takeaway.

| Topic title (wrong) | Action title (right) |
|---------------------|----------------------|
| Market overview | The EU mid-market grew 9% a year in 2021–25, twice as fast as enterprise |
| Survey results | 62% of churned customers cite onboarding, not price, as the main reason |
| Cost breakdown | Three items make up 70% of the $4.2M cost gap; labor alone is $1.9M |

**Cover-the-chart test:** reading only the title, does the reader get the point? **The data must
prove the title:** if it does not, change the title, never the data.

## Step 2 — name the comparison, then choose the form

| Comparison | The message says | Trigger words | Form | Vega-Lite |
|------------|------------------|---------------|------|-----------|
| Component | parts of a whole | share, % of, accounted for | 100% stacked bar; pie only if ≤5 slices and one slice is the point | `bar` with `stack: "normalize"` |
| Item | how things rank | larger, ranks, leads, lags | horizontal bar, sorted | `bar`, `y` sorted `-x` |
| Time series | change over time | grow, rise, decline, since | column (≤7 periods) or line (more) | `bar` or `line`, time on `x` |
| Distribution | how many fall in each range | concentrated, most fall between | histogram | `bar` with `bin` |
| Correlation | two variables move together | related to, increases with | scatter (bubble only for a real third variable) | `point`, `size` for the third |

Consulting specials: **waterfall/bridge** (how you got from A to B — layered `bar` with `y`/`y2`),
**2×2 matrix** (scatter with rule lines at meaningful cut-offs, quadrants named as actions),
**range table** ("low–high (CAGR)" cells for scenarios), **Harvey-ball table** (qualitative scores
with a key defining each fill level — use ○ ◔ ◑ ◕ ●). Bar, column and line cover 80–90% of needs;
reaching for an exotic chart usually means the message is unclear. No 3D, no donuts, no rainbow.

## Step 3 — the exhibit block

Every exhibit is written in exactly this shape, so the report can copy it verbatim and the
renderer can draw it:

````markdown
### Exhibit 3
**Three cost items explain 70% of the $4.2M gap versus the peer median**
*Cost per site versus peer median, $ thousand, FY2025*

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container", "height": 220,
  "data": {"values": [
    {"item": "Labor", "gap": 1900, "key": true},
    {"item": "Rent", "gap": 600, "key": false}
  ]},
  "mark": {"type": "bar"},
  "encoding": {
    "y": {"field": "item", "type": "nominal", "sort": "-x", "title": null},
    "x": {"field": "gap", "type": "quantitative", "title": "$ thousand"},
    "color": {"condition": {"test": "datum.key", "value": "#0B3D91"}, "value": "#B8BEC6"}
  }
}
```

| Cost item | Us | Peer median | Gap | Share of gap |
|-----------|---:|------------:|----:|-------------:|
| **Labor** | 5,100 | 3,200 | 1,900 | **45%** |
| Rent | 2,300 | 1,700 | 600 | 14% |

Note: Peer set = 12 operators with more than 50 sites. Figures may not sum to 100%, because of rounding.
Source: Company filings FY2025 (EV-014, EV-019); analyst estimates (EV-022); team analysis
````

The parts, top to bottom:

1. `### Exhibit N` — numbered in reading order, 1…N. Exhibits in an executive summary may be
   E1, E2; appendix exhibits A1, A2.
2. **Action title** in bold.
3. *Subtitle* in italics — metric, unit, scope, period, and `n =` for surveys. Index base year
   if indexed ("2020 = 100").
4. A `vega-lite` code block — when the shape of the data is the message (trend, rank gap, share,
   bridge). Omit it for pure comparison tables and Harvey-ball tables.
5. **The data table** — always present, even under a chart. It is what a reviewer checks.
6. `Note:` — definitions, exclusions, scenario definitions, rounding.
7. `Source:` — third-party sources separated by semicolons with their evidence ids, and
   **"team analysis" last** whenever any figure was derived.

## Chart rules

- **Grey plus one accent.** Context in grey `#B8BEC6`, the data point the title is about in
  `#0B3D91`. A second accent `#E0712C` only for a contrast the title names. Same colour meaning
  in every exhibit.
- **Sort bars** by value unless categories have a natural order (time, age bands).
- **Bars start at zero.** Lines may be truncated only if the subtitle says so.
- **Label directly** (a `text` layer) rather than a legend when there are ≤4 series; set
  `"legend": null` then.
- **Round** to two or three significant figures. No decimals an executive does not need.
- **Ranges and scenarios** as range bars or paired bars labelled "low / high" or "early / late".
- Keep specs small: inline `data.values`, `"width": "container"`, no external data URLs, no
  interactivity.

## Rules

- **Every plotted number comes from the number register** (by key) or the evidence base (by id).
  An exhibit may do arithmetic on registered figures only when the source line ends with
  "team analysis" and the note gives the formula.
- One message per exhibit. If the title needs "and", consider two exhibits.
- Titles, read in order, match the storyline's exhibit list.
- Aim for one exhibit per key supporting point: typically 6–12 in a report.
