# Consulting-grade exhibits and executive writing: rules for an AI research agent

Research notes, 2026-09-21. Every rule carries a source URL. Where a rule is common practitioner
convention that no primary source states outright, it is marked **[convention]**. Where it is my own
adaptation for an agent that writes Markdown tables and chart specs, it is marked **[adaptation]**.

Source quality note: Zelazny's book and ICD 203 were read as primary text (ICD 203 in full; Zelazny
through a chapter summary of the book). Most "McKinsey slide rules" on the web come from former-consultant
blogs and template vendors (Deckary, Umbrex, StrategyU). They agree with each other, but they are
secondary sources, not McKinsey's internal style guide, which is not public.

---

## 1. Gene Zelazny, *Say It With Charts*: the message picks the chart

Zelazny was McKinsey's director of visual communications. His method has three steps:
**data → message → comparison → chart form.**

- "The purpose of a chart is not to show data, it is to convey a message." Decide the message before
  you pick a chart type. (https://www.antoinebuteau.com/lessons-from-gene-zelazny/)
- Step 1: write the message. Step 2: the message implies one of five kinds of comparison. Step 3: that
  comparison points to a chart form. (https://cdn.bookey.app/files/pdf/book/en/say-it-with-charts.pdf,
  https://www.oreilly.com/library/view/say-it-with/9780071369978/)
- The title *is* the message: use a message title, not a topic title. "The choice of title should
  reflect your message rather than simply describe the chart's content."
  (https://cdn.bookey.app/files/pdf/book/en/say-it-with-charts.pdf)
- One chart, one job. "The more you can remove from a chart without losing its meaning, the better."
  The reader should get the point in about 15 seconds. (https://www.antoinebuteau.com/lessons-from-gene-zelazny/,
  https://umbrex.com/resources/the-busy-consultants-guide-to-quantitative-charts/design-principles-for-mckinsey-quantitative-charts/)

### Table 1. Message → comparison → chart (Zelazny, extended for agent output)

| Comparison | What the message says | Trigger words in the draft title | Zelazny's form | Agent spec [adaptation] |
|---|---|---|---|---|
| **Component** | Size of each part as a % of a total | share, percentage of, accounted for, X% of | Pie (≤6 slices); 100% bar if comparing wholes | Vega-Lite `bar` stacked with `stack: "normalize"`, or a sorted bar of shares. Mermaid `pie` only if ≤5 slices and one slice is the point |
| **Item** | How things rank | larger than, smaller than, ranks, leads, lags | Horizontal bar, sorted | Vega-Lite `bar` with `y` sorted `-x`; Markdown table sorted by the value |
| **Time series** | How something changes over time | change, grow, rise, decline, fluctuate, since 2020 | Column (fewer than ~8 periods) or line (many periods) | Vega-Lite `bar` (≤7 periods) or `line`; Mermaid `xychart-beta` |
| **Frequency distribution** | How many items fall in each range | distribution, concentrated, x to y range, most fall between | Histogram (columns) or line | Vega-Lite `bar` with `bin: true` |
| **Correlation** | Whether two variables move together | related to, varies with, increases with, despite | Dot (scatter) chart; paired bars | Vega-Lite `point`; add a size channel only for a true 3rd variable (bubble) |

Sources: https://cdn.bookey.app/files/pdf/book/en/say-it-with-charts.pdf,
https://www.cliffsnotes.com/study-notes/28110394, https://strategyu.co/think-before-you-chart/

### Zelazny's chart-specific rules

- **Pie:** at most 6 components; group the rest into "Other". Put the most important slice at 12
  o'clock. When comparing pies: at most two pies with three components each. Zelazny rated pies the
  least useful form (about 5% of charts). (https://cdn.bookey.app/files/pdf/book/en/say-it-with-charts.pdf,
  https://www.antoinebuteau.com/lessons-from-gene-zelazny/)
- **Pies at McKinsey in practice:** a former consultant reports pies are effectively banned, because
  "the human eye is bad at comparing areas and angles". They are defensible only when one part is more
  than 50% of the total. (https://strategyu.co/think-before-you-chart/) Treat this as a secondhand claim.
- **Bar:** the workhorse for item comparisons (about 25% of charts). Sort high to low to show rank.
  Gaps between bars should be narrower than the bars. Put values on or next to the bars.
  (https://cdn.bookey.app/files/pdf/book/en/say-it-with-charts.pdf, https://www.antoinebuteau.com/lessons-from-gene-zelazny/)
- **Variations:** *deviation bar* (bars left and right of a baseline, for good vs bad results such as
  profit/loss by division); *range bar* (high-low spread); *100% stacked* (at most about 5 segments);
  *paired bar* (rank on one variable, show the second next to it).
  (https://cdn.bookey.app/files/pdf/book/en/say-it-with-charts.pdf)
- **Line:** "a line implies connection", so don't join categories that are not a sequence.
  (https://www.antoinebuteau.com/lessons-from-gene-zelazny/)
- **No 3D.** It distorts values. (https://www.antoinebuteau.com/lessons-from-gene-zelazny/)
- Bar, column and line cover 80-90% of business needs. Needing an exotic chart usually means the
  message is unclear. (https://strategyu.co/think-before-you-chart/)

---

## 2. Action titles and exhibit anatomy

### Title rules

| Rule | Detail | Source |
|---|---|---|
| Full sentence that states the takeaway | "State a conclusion, not a process." Active voice. | https://deckary.com/blog/consulting-slide-standards |
| Length | At most 2 lines; about 15 words or fewer | https://deckary.com/blog/consulting-slide-standards, https://a1slides.com/mckinsey-presentation-framework/ |
| Quantified when possible | "Q3 revenue grew 14% driven by expansion in APAC markets" | https://piktochart.com/blog/mckinsey-style-presentation/ |
| Cover-the-chart test | "If you cover up the data and only read the title, do you still get the point?" The message must be explicit, not implied. | https://umbrex.com/resources/the-busy-consultants-guide-to-quantitative-charts/design-principles-for-mckinsey-quantitative-charts/ |
| The body proves the title | Title, then one piece of evidence, then a source line. If the data doesn't show what the title claims, change the title, not the data. | https://deckary.com/blog/pillar-consulting-presentations-guide, https://strategyu.co/think-before-you-chart/ |
| One message per exhibit | "Each slide should communicate exactly one insight." | https://deckary.com/blog/consulting-slide-standards |

**Good / bad titles**

| Bad (topic title) | Good (action title) |
|---|---|
| Market overview | The EU mid-market grew 9% a year from 2021 to 2025, twice as fast as enterprise |
| Customer survey results | 62% of churned customers cite onboarding, not price, as the main reason |
| Cost breakdown | Three items make up 70% of the $4.2M cost gap; labor alone is $1.9M |
| Competitor comparison | Only two of seven competitors offer self-serve pricing, and both are gaining share |

### Horizontal logic

Read only the titles, in order. They should tell the whole story: situation, problem, recommendation.
(https://piktochart.com/blog/mckinsey-style-presentation/, https://deckary.com/blog/consulting-slide-standards)
**Vertical logic:** everything on one page supports that page's title. For a report agent this means
**section headings and exhibit titles, extracted on their own, must read as an executive summary.**
[adaptation]

### Exhibit anatomy, top to bottom

McKinsey's published reports use this layout. Example from *State of Fashion 2022*: "Exhibit 1: Supply
chain pressures on input costs will push some fashion companies to increase retail prices next year",
subtitle "EXPECTED RETAIL PRICE CHANGE IN 2022, % OF RESPONDENTS", then "SOURCE: BOF-MCKINSEY STATE OF
FASHION 2022 SURVEY".
(https://www.mckinsey.com/~/media/mckinsey/industries/retail/our%20insights/state%20of%20fashion/2022/the-state-of-fashion-2022.pdf)

1. **Tracker / breadcrumb** (optional): the section name, so the reader knows where they are in the
   storyline. (https://piktochart.com/blog/mckinsey-style-presentation/) [convention]
2. **Exhibit number**: "Exhibit 3". Number exhibits in order and refer to them in the text ("see
   Exhibit 3"). [convention, seen in McKinsey reports above]
3. **Action title**: the message sentence.
4. **Subtitle / unit line**: the metric, the unit, the scope and the time frame, e.g. "Revenue by
   segment, $ billion, FY2021-25" or "% of respondents, n = 1,204, Q2 2026". Give the base year for any
   index ("Indexed to 100 in 2020"). Keep currency and scale (M/B) the same across the whole report.
   (https://umbrex.com/resources/the-busy-consultants-guide-to-quantitative-charts/design-principles-for-mckinsey-quantitative-charts/)
5. **Body**: the chart or table.
6. **Notes**: numbered footnotes for definitions, exclusions and why totals don't add to 100 because
   of rounding. [convention]
7. **Source line**: "Source: Company annual reports (2022-2024); McKinsey analysis". Every data point
   has a source. (https://deckary.com/blog/consulting-slide-standards)

**Markdown template for the agent [adaptation]:**

```markdown
**Exhibit 3. Three cost items explain 70% of the $4.2M gap versus the peer median**
*Cost per site versus peer median, $ thousand, FY2025*

| Cost item      | Us    | Peer median | Gap   | Share of gap |
|----------------|------:|------------:|------:|-------------:|
| **Labor**      | 5,100 | 3,200       | 1,900 | **45%**      |
| Rent           | 2,300 | 1,700       |   600 | 14%          |
| ...            |       |             |       |              |

Note: Peer set = 12 operators with more than 50 sites; figures rounded, so shares may not add to 100%.
Source: Company filings FY2025 [S3][S7]; analyst estimates [S9]; team analysis.
```

---

## 3. Chart conventions

| Convention | Rule | Source |
|---|---|---|
| **Waterfall (cascade/bridge)** | Use it to show how you got from A to B, e.g. last year's EBIT → drivers → this year's EBIT. Start and end bars sit on the axis; the drivers float. Increases and decreases get different colors. Order the drivers logically or by size. McKinsey popularized the form. | https://www.mekkographics.com/why-would-i-use-a-cascade-waterfall-chart/, https://deckary.com/blog/pillar-powerpoint-charts-guide, https://en.wikipedia.org/wiki/Waterfall_chart |
| **Marimekko (mekko)** | Column width = size of a segment (e.g. market size); stacked height = share inside it (e.g. competitor share). Each cell's area = absolute value. Use it for market maps and "share of share". | https://www.mekkographics.com/using-a-marimekko-chart-to-map-a-market/, https://www.visualizing.org/marimekko-chart |
| **Stacked bars** | At most about 5 segments. Only the bottom segment has a common baseline, so put the segment that matters at the bottom (or use 100% stacked). | https://cdn.bookey.app/files/pdf/book/en/say-it-with-charts.pdf |
| **Bubble** | x and y are two metrics; bubble **area** (not radius) is a third, "size of prize". At most 3-4 encoded variables. | https://umbrex.com/resources/the-busy-consultants-guide-to-quantitative-charts/scatter-bubble-and-dot-matrix-charts/ |
| **2x2 matrix** | Two axes that decide something, with reference lines at meaningful cut-offs (average, target). Name each quadrant with an action ("Invest", "Harvest"). Say where the cut-offs come from. | https://umbrex.com/resources/the-busy-consultants-guide-to-quantitative-charts/scatter-bubble-and-dot-matrix-charts/, https://thestrategicframe.saltfoundrystrategy.com/p/2x2-matrix |
| **Harvey balls** | For qualitative scores in an items × criteria table (vendors, capabilities). Not for exact numbers or trends. Always include a scoring key that defines each fill level, or scores drift between analysts. Invented by Harvey Poppel at Booz Allen; used by McKinsey. | https://en.wikipedia.org/wiki/Harvey_balls, https://deckary.com/blog/harvey-balls-powerpoint |
| **One highlight color, rest grey** | "Design in shades of grey, then pick a single bold color to draw attention." Blue is safe for colorblind readers and prints well. Avoid red vs green pairs. | https://www.smartcville.com/blog/2020/08/27/book-review-storytelling-with-data-by-cole-nussbaumer-knaflic/, https://sglmr.com/blog/storytelling-with-data-by-cole-nussbaumer-knaflic/ |
| Highlight = the number in the title | "The most important number should be the most visually prominent." | https://strategyu.co/think-before-you-chart/ |
| Palette | 3-4 colors at most; keep color meanings the same across the report | https://deckary.com/blog/consulting-slide-standards, https://umbrex.com/resources/the-busy-consultants-guide-to-quantitative-charts/design-principles-for-mckinsey-quantitative-charts/ |
| **Direct labels, not legends** | Put labels next to the data; label only what matters (start, key turning points, end) | https://umbrex.com/resources/the-busy-consultants-guide-to-quantitative-charts/design-principles-for-mckinsey-quantitative-charts/ |
| **Sorted bars** | Sort by value unless the categories have a natural order (time, age bands) | https://cdn.bookey.app/files/pdf/book/en/say-it-with-charts.pdf |
| **Zero baseline** | Bar and column axes start at zero. Line charts may be truncated, but say so, and don't squash the scale. | https://umbrex.com/resources/the-busy-consultants-guide-to-quantitative-charts/design-principles-for-mckinsey-quantitative-charts/ |
| Rounding | Executives rarely need decimals. Round to 2-3 significant figures. | same as above |
| Declutter | Remove gridlines, borders, 3D, gradients and decoration: "visual elements which take up space, but don't increase understanding" | https://www.smartcville.com/blog/2020/08/27/book-review-storytelling-with-data-by-cole-nussbaumer-knaflic/ |
| Annotation | One arrow or callout that answers "what should I notice?". If a chart needs many callouts, simplify the chart. | https://umbrex.com/resources/the-busy-consultants-guide-to-quantitative-charts/design-principles-for-mckinsey-quantitative-charts/ |

**Mapping to agent formats [adaptation]:** a Markdown table is the default exhibit (it is precise and
easy to check). Add a Vega-Lite spec when the shape of the data *is* the message (trend, rank gap,
distribution). Mermaid `xychart-beta` and `pie` are good enough for simple bar, line and pie charts, but
they can't do highlight colors per bar, waterfalls or mekkos. Use Vega-Lite (a stacked bar with
`y`/`y2` for a waterfall) or hand-written SVG for those. In Vega-Lite, highlight with a `condition`
on `color` (the key category in accent color, all others `#B0B0B0`), and replace the legend with a
`text` layer (`legend: null`).

---

## 4. Executive writing

| Rule | Detail | Source |
|---|---|---|
| **Answer first (Pyramid Principle)** | Start with the governing thought, then the supporting arguments, then the evidence. Don't build up to the answer. The introduction follows SCQ: Situation (context the reader agrees with) → Complication (what changed) → Question → Answer. | https://www.barbaraminto.com/, https://thinkinsights.net/strategy/scqa-logic, https://modelthinkers.com/mental-model/minto-pyramid-scqa |
| **BLUF** | The first sentence is the bottom line: the decision, conclusion or ask. Then 2-3 lines of why. | https://en.wikipedia.org/wiki/BLUF_(communication), https://thinkinsights.net/consulting/bottomline-upfront-bluf |
| Main message up front (intelligence standard) | "Products should present a clear main analytic message up front." With several judgments, the main message is drawn from all of them. | ICD 203 §D.6.e(6), https://www.dni.gov/files/documents/ICD/ICD-203.pdf |
| **Dot-dash structure** | Dots = the main statements of the storyline (each becomes a heading or exhibit title). Dashes = the supporting facts and data under each dot. Write the storyline as dot-dash first and test it before drafting. | http://workingwithmckinsey.blogspot.com/2013/07/McKinsey-storyline-dot-dash.html, https://www.distinctive.plus/p/storylining-for-first-year-consultants |
| Short sentences | Average 15-20 words; no sentence over 40. Active voice ("who does what"). | https://digital.gov/guides/plain-language/writing, https://www.opm.gov/information-management/plain-language/ |
| One idea per paragraph | "Each paragraph should contain only one topic." | https://digital.gov/guides/plain-language/writing |
| **Bold lead-ins** [convention] | Open each paragraph or bullet with a bolded claim (the dot), then the evidence. Reading only the bold text should give the argument, the same idea as horizontal logic. | pattern from the dot-dash method above |
| **Quantify** | Replace vague words with numbers and units: "large" → "12%"; "recently" → "since Q3 2025"; "many firms" → "7 of 10 firms surveyed". Express judgments "as clearly and precisely as possible", covering likelihood, timing and nature. | ICD 203 §D.6.e(8), https://www.dni.gov/files/documents/ICD/ICD-203.pdf; https://piktochart.com/blog/mckinsey-style-presentation/ |
| **So what** | Every paragraph and exhibit ends in an implication for the reader's decision. ICD 203 calls this "customer relevance and implications". | ICD 203 §D.6.e(5) |
| Avoid jargon | Plain words; define any acronym once | https://digital.gov/guides/plain-language/writing |
| **Calibrated hedging** | Hedge with defined terms and ranges, not vague words. Good: "likely (55-80%)", "as much as $40M", "$25-40M", "roughly even chance". Bad: "could possibly", "may potentially", "it is possible that" (almost anything is possible). | https://pangearesearch.substack.com/p/analytic-tradecraft-standard-2-uncertainty; ICD 203 table below |

**Before / after**

- Before: "The market is growing significantly and there could be various opportunities for players
  in this space going forward."
- After: "**The market will likely double by 2030.** It grew 14% a year in 2021-25 (Exhibit 2), and
  three of the four drivers are still accelerating. The opening is mid-market: it is 40% of growth
  and has no clear leader."

---

## 5. Sources, methodology, limitations and confidence

### 5a. ICD 203 (US Intelligence Community, 2015, amended 2022): nine tradecraft standards

From the directive text (https://www.dni.gov/files/documents/ICD/ICD-203.pdf; mirror
https://github.com/wesinator/ICD203-intel-analysis):

1. **Describe the quality and credibility of sources, data and methods**: accuracy, completeness, age
   and currency, possible bias, access and expertise. Include a **source summary statement** that says
   which sources matter most for the key judgments.
2. **Express and explain uncertainty**: give both *likelihood* and *confidence*. Say what causes the
   uncertainty (knowledge gaps, old data) and which **indicators** would change it.
3. **Separate information from assumptions and judgments.** State linchpin assumptions explicitly and
   say what changes if they are wrong.
4. **Analyze alternatives**: plausible competing hypotheses, and indicators for each.
5. **Customer relevance and implications** (the "so what").
6. **Clear, logical argument**: main message up front, internally consistent, acknowledges contrary
   information.
7. **Explain change**: say how a judgment is the same as, or different from, earlier analysis.
8. **Accurate judgments**: "should not avoid difficult judgments in order to minimize the risk of being
   wrong".
9. **Effective visuals** where they clarify the message.

### 5b. Likelihood vocabulary

**ICD 203 (required terms; don't mix rows):**

| almost no chance | very unlikely | unlikely | roughly even chance | likely | very likely | almost certain(ly) |
|---|---|---|---|---|---|---|
| 1-5% | 5-20% | 20-45% | 45-55% | 55-80% | 80-95% | 95-99% |

Alternates in the directive: remote / highly improbable / improbable / roughly even odds / probable /
highly probable / nearly certain. **Rule: never put a confidence level and a likelihood term in the same
sentence.** (https://www.dni.gov/files/documents/ICD/ICD-203.pdf)

**UK PHIA Probability Yardstick** (alternative): remote chance (≈0-5%), highly unlikely (10-20%), unlikely
(25-35%), realistic possibility (40-<50%), likely/probable (55-75%), highly likely (80-90%), almost
certain (95-<100%). The gaps between ranges are deliberate, to avoid false precision.
(https://www.gov.uk/government/publications/explaining-uncertainty-in-uk-intelligence-assessment/explaining-uncertainty-in-uk-intelligence-assessment)

Sherman Kent started this in 1964: "make clear to the reader what is certain knowledge and what is
reasoned judgment". (https://en.wikipedia.org/wiki/Words_of_estimative_probability) Research shows
readers interpret verbal terms very differently, so **put the numeric range next to the word** at least
once. (https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0213522)

### 5c. Confidence levels

- **High:** high-quality information from several independent sources that agree; few assumptions.
  High confidence still does not mean certain.
- **Moderate:** credible and plausible sources, but not enough quality or corroboration for high.
- **Low:** credibility is uncertain, information is fragmentary or poorly corroborated, or source
  reliability is questionable.

(https://en.wikipedia.org/wiki/Analytic_confidence, https://www.cisecurity.org/ms-isac/services/words-of-estimative-probability-analytic-confidences-and-structured-analytic-techniques)
The UK grades confidence on information base, analytical rigour, and complexity/volatility.
(https://www.gov.uk/government/publications/explaining-uncertainty-in-uk-intelligence-assessment/explaining-uncertainty-in-uk-intelligence-assessment)

**Agent pattern [adaptation]:** "SMB adoption will very likely (80-95%) exceed 30% by 2028. *Confidence:
moderate. Based on two independent surveys (n = 1,200 and n = 800) that agree; no vendor-neutral
usage data.*" Likelihood and confidence go in separate sentences, as ICD 203 requires.

### 5d. Grading sources

- **Admiralty / NATO 6×6 code:** source reliability A (completely reliable) to F (cannot be judged),
  times information credibility 1 (confirmed by other sources) to 6 (cannot be judged). Example: "B2" =
  a usually reliable source with probably true information. Grade the source and the claim separately.
  (https://en.wikipedia.org/wiki/Admiralty_code, https://www.sans.org/blog/enhance-your-cyber-threat-intelligence-with-the-admiralty-system)
- **Evidence hierarchy** (from evidence-based practice): systematic reviews and meta-analyses > primary
  studies (RCT > cohort > case series) > expert opinion. Different questions need different hierarchies.
  (https://canberra.libguides.com/c.php?g=599346&p=4149721)
- **Business-research tiers [adaptation, built on the above]:** T1 primary or official data (filings,
  statistics offices, regulators, peer-reviewed papers, the company's own disclosures) → T2 reputable
  secondary sources (major research firms and consultancies that publish their method, quality press) →
  T3 vendor or trade material, press releases, analyst blogs → T4 unsourced aggregators, SEO pages,
  forums. A key number needs one T1 source or two independent T2 sources. Record the date of every
  figure.

### 5e. Method and limitations section

Following ICD 203 standards 1-3, a short "Approach and limitations" section should state: the question
and scope; which sources were searched and when; how numbers were derived (e.g. "market size = units ×
average price; triangulated top-down vs bottom-up"); key assumptions and what happens if they're wrong;
known gaps; and the date the data is as of. (https://www.dni.gov/files/documents/ICD/ICD-203.pdf)
Consulting source lines add "team analysis" or "McKinsey analysis" to show where the team derived a
number rather than copying it. (https://deckary.com/blog/consulting-slide-standards)

---

## 6. What makes work look amateur, and the fix

| Amateur / typical AI output | Consulting-grade fix | Source |
|---|---|---|
| Topic headlines ("Market Overview") | Action titles that state the so-what, with numbers | https://deckary.com/blog/consulting-slide-standards |
| Answer buried at the end, chronological "what I did" story | Answer first (Pyramid/BLUF); method goes to an appendix | https://www.barbaraminto.com/, https://en.wikipedia.org/wiki/BLUF_(communication) |
| Data dump: 12-column tables, every number found | One message per exhibit; show only the columns that prove the title; rest to appendix | https://deckary.com/blog/consulting-slide-standards |
| No so-what: facts with no implication | End each section with the implication for the decision | ICD 203 §D.6.e(5) |
| Unsourced numbers | Every figure has a source and a date; derived figures say "team analysis" | https://deckary.com/blog/consulting-slide-standards |
| Inconsistent figures (market $40B in section 1, $45B in section 4; shares that add to 112%) | One number register; reconcile or explain the difference in a note; state rounding | ICD 203 §D.6.e(6) "internally consistent" |
| Vague hedging ("could potentially", "significant") | Calibrated terms plus ranges; quantify | ICD 203; https://pangearesearch.substack.com/p/analytic-tradecraft-standard-2-uncertainty |
| False precision ("$41.37B market") | Round to 2-3 significant figures; give a range for estimates | https://umbrex.com/resources/the-busy-consultants-guide-to-quantitative-charts/design-principles-for-mckinsey-quantitative-charts/ |
| Chart type picked for looks (pies, 3D, donuts, rainbow palettes) | Pick by comparison type (Table 1); grey plus one accent | https://www.antoinebuteau.com/lessons-from-gene-zelazny/ |
| Title claims something the chart doesn't show | Rewrite the title to match the evidence | https://strategyu.co/think-before-you-chart/ |
| Legend-hunting, unsorted bars, truncated bar axes | Direct labels, sorted bars, zero baseline | https://umbrex.com/resources/the-busy-consultants-guide-to-quantitative-charts/design-principles-for-mckinsey-quantitative-charts/ |
| Missing units or time frame | Subtitle with metric, unit, scope, period, n | McKinsey State of Fashion exhibit format (above) |
| Only one view presented | Name the main alternative hypothesis and what would confirm it | ICD 203 §D.6.e(4) |
| Facts and opinions mixed together | Mark the difference between "data shows" and "we judge"; state assumptions | ICD 203 §D.6.e(3) |
| Inconsistent formatting between exhibits | Same exhibit template, units and color meanings throughout | https://deckary.com/blog/consulting-slide-standards |

### Checklist for each exhibit [adaptation]

1. Can I say the message in one sentence? That sentence is the title, ≤15 words, with a number.
2. Which of the 5 comparisons is it? Did I use the matching form?
3. Subtitle: metric, unit, scope, period, n.
4. Sorted? Zero baseline? One accent color on the number in the title? Direct labels?
5. Notes (definitions, rounding) and a source line with dates and tier.
6. Do the numbers match every other place they appear in the report?
7. Does the text refer to it by number and say what it means for the reader?
