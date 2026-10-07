# Research Method Routing

Choose the minimum set of research methods needed to test one hypothesis. Routing is done per hypothesis, never per whole question: two hypotheses under the same question usually need different methods.

Choose only from the registry below. The registry is fixed at 13 ids. Never invent, rename, pluralize or abbreviate an id (write COMPETITIVE_BENCHMARK, not COMPETITIVE_BENCHMARKING).

## Method registry

Framework files live in `frameworks/`, next to this folder. Files marked (pending) are being added; if one is missing, route anyway and rely on the "answers" and "evidence" columns.

| Method id | Answers | Evidence it needs | Web-only? | Framework file |
|---|---|---|---|---|
| MARKET_ANALYSIS | How big, how fast-moving and how liquid is a market or segment? | Market size and growth figures, price and volume series, transaction or listing activity, official statistics | Yes | `tam-sam-som.md`, `porter-five-forces.md` |
| COMPARABLES | What do similar assets, companies or deals tell us about price, speed or outcome? | A set of 5+ truly similar cases with price, date, size and terms | Yes, if public listings or deal records exist | none (use `unit-economics.md` for normalizing) |
| SUPPLY_DEMAND | Is supply growing faster than demand, or the reverse? | Pipeline and inventory counts, vacancy or stock levels, demand indicators, absorption rates | Yes | `porter-five-forces.md` |
| FINANCIAL_MODEL | Do the numbers work (return, payback, margin, break-even)? | Price, cost, revenue or rent inputs, rates, fees, taxes, horizon | Mostly; inputs are web-sourced, the model is computed | `unit-economics.md`, `financial-modeling.md` (pending) |
| SCENARIO_ANALYSIS | What could happen over a long horizon, and how robust is the choice? | Key uncertainties, trend data, plans and announcements, historical analogues | Yes | `scenario-planning.md` |
| PESTEL | Which political, economic, social, technological, environmental or legal forces shape the outcome? | Policy documents, macro data, demographic and technology trends, regulation texts | Yes | `pestel.md` |
| JTBD | What job is the person hiring the product or option to do? | Reviews, forums, support threads, published interviews, switching stories | Partly; stated behavior only | `jobs-to-be-done.md` |
| USER_NEEDS | What do users need, value and complain about? | Reviews, surveys, community discussions, usage reports | Partly; no primary research | `jobs-to-be-done.md`, `customer-segmentation.md` |
| LEGAL_DUE_DILIGENCE | Are there legal, tax, ownership or regulatory obstacles? | Statutes, regulator pages, registry rules, official guidance, tax schedules | Yes for reading rules; no for advice | none |
| COMPETITIVE_BENCHMARK | How does the option compare with alternatives on named criteria? | Feature, price and performance data for 3+ alternatives on the same criteria | Yes | `competitive-benchmarking.md` (pending), `porter-five-forces.md` |
| ROOT_CAUSE_ANALYSIS | Why did a problem happen, and which cause is real? | Timeline of events, metrics before and after, candidate causes, post-mortems | Partly; depends on public data | `root-cause-analysis.md` (pending) |
| EXPERT_INTERVIEWS | What do practitioners know that is not published? | Direct answers from named experts | No, not automatable in v1 | none |
| DATA_ANALYSIS | What do the numbers say when computed or compared directly? | Downloadable datasets, tables, time series | Yes, if the data is public | `unit-economics.md` |

## EXPERT_INTERVIEWS in v1

Interviews cannot be run. If a hypothesis truly needs expert knowledge:

1. Do not select EXPERT_INTERVIEWS as primary. Select the closest web-reachable method as primary.
2. Name the substitute: published expert commentary (analyst reports, practitioner blogs, conference talks, regulator statements, quoted broker or specialist views).
3. Flag the gap in the rationale, for example "expert view unavailable; relying on published commentary, confidence capped at MEDIUM".
4. Only list EXPERT_INTERVIEWS in `supportingMethods` to record the unmet need, never as the sole route.

## Routing rules

1. One primary method per hypothesis: the one whose evidence most directly confirms or falsifies it.
2. Zero to three supporting methods. Add one only if it covers evidence the primary cannot, or cross-checks a weak primary. Zero is a valid and common answer.
3. Prefer methods whose evidence is reachable on the web. If two methods fit, pick the one with public data.
4. Match the method to the hypothesis shape:
   - market, price, liquidity, resale: MARKET_ANALYSIS, COMPARABLES, SUPPLY_DEMAND
   - returns, cost, payback: FINANCIAL_MODEL (primary), DATA_ANALYSIS for inputs
   - long-horizon change, uncertainty: SCENARIO_ANALYSIS, PESTEL
   - what users want or do: JTBD, USER_NEEDS
   - why something happened: ROOT_CAUSE_ANALYSIS, DATA_ANALYSIS
   - versus alternatives: COMPETITIVE_BENCHMARK
5. LEGAL_DUE_DILIGENCE covers any hypothesis about law, tax, licensing, ownership or regulation. For high-risk legal, tax, medical or regulatory questions, state in the rationale that qualified expert review is required before acting, and treat web findings as orientation only.
6. Do not stack methods for coverage. Every method listed must name the evidence it adds.
7. Do not collect evidence here. Routing only decides methods.

## Output shape

Return one JSON object per hypothesis:

```json
{
  "hypothesisId": "H1",
  "primaryMethod": "MARKET_ANALYSIS",
  "supportingMethods": ["COMPARABLES", "SUPPLY_DEMAND"],
  "rationale": "Why these methods, what evidence each adds, and any flagged gap."
}
```

- `hypothesisId` echoes the hypothesis id exactly.
- `primaryMethod` is one registry id.
- `supportingMethods` is an array of 0 to 3 registry ids, none equal to the primary, no duplicates.
- `rationale` is 1 to 3 sentences naming the evidence and any gap or expert-review flag.

## Worked example

Hypothesis H1: "The studio can be resold within a reasonable period without a major discount."

- Primary MARKET_ANALYSIS: resale speed is a market-liquidity question, answerable from listing activity and price trends in the district.
- Supporting COMPARABLES: asking-versus-sold prices of similar studios show the real discount.
- Supporting SUPPLY_DEMAND: planned new buildings versus buyer demand show whether competing supply will grow.
- Not chosen: FINANCIAL_MODEL (belongs to a separate economics hypothesis) and EXPERT_INTERVIEWS (not automatable; broker commentary found online covers it).

```json
{
  "hypothesisId": "H1",
  "primaryMethod": "MARKET_ANALYSIS",
  "supportingMethods": ["COMPARABLES", "SUPPLY_DEMAND"],
  "rationale": "Resale liquidity is a market question; listing and price data are public. COMPARABLES gives the real sale discount, SUPPLY_DEMAND tests whether new supply will crowd out resale. Broker views are taken from published commentary only."
}
```
