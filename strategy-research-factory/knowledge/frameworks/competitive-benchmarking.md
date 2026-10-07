---
id: competitive-benchmarking
name: Competitive Benchmarking / Comparables
purpose: Place a subject (an asset, product or company) against a defined comparable set on a few decision-relevant dimensions and say what the gaps imply.
problemTypes: [competitive-position, pricing, differentiation]
useWhen:
  - judging whether a price, rent, cost or feature set is high, low or in line with comparable alternatives
  - valuing or sanity-checking an asset against similar listings or transactions in the same area and period
  - comparing a product or company with peers on measurable dimensions to find where it leads or lags
doNotUseWhen:
  - no comparable set can be defined with explicit inclusion criteria (the subject is genuinely unique or the category does not exist yet)
  - the question is about industry structure or profit pools rather than where one subject stands
  - the question is about customer needs or adoption behaviour, not measurable attributes
  - comparable data cannot be collected like-for-like with sources and dates
questionsAnswered:
  - Who and what is genuinely comparable to the subject?
  - Where does the subject sit on each key dimension (percentile, gap to median and to best)?
  - Which comparables are outliers, and does the picture change without them?
  - What do the gaps imply for the decision (price, buy, position, improve)?
requiredEvidence: [comparable-set-records, dimension-values, source-and-date-per-datapoint, normalisation-bases, subject-values]
outputs: [comparable-set, benchmark-matrix, subject-position, decision-implications]
complexity: 2
overlapsWith: [three-cs]
pairsWellWith: [porter-five-forces, unit-economics, three-cs]
---

## How to apply

1. **Define the decision first.** Name what the benchmark must help decide (accept a price, set a rent,
   prioritise a feature). Dimensions and the comparable set both follow from it.
2. **Choose the comparable set with explicit inclusion criteria**: same segment, similar size,
   same location or market, same period. Write the criteria down, list what was excluded and why,
   and aim for enough members (typically 6 or more) that a median means something.
3. **Pick 4 to 8 dimensions** that move the decision. Give each a definition, a unit and a direction
   (higher is better or worse). Drop dimensions that are not decision-relevant, however easy to collect.
4. **Collect like-for-like data.** One record per comparable per dimension, each with an evidence id,
   source and date. Mark missing values as missing; never fill them with guesses.
5. **Normalise** to a common base (per sqm, per user, per month, per seat) and to a common period or
   currency, so differences reflect the subject and not scale or timing.
6. **Show the subject's position** per dimension: percentile rank, gap to the median, gap to the best.
7. **Separate outliers.** Flag values far from the rest, state the reason if known, and show the
   position with and without them.
8. **Say what the gaps imply** for the decision, and what would change the conclusion.

Applies to market comparables (for example studio listings near a given landmark, compared on price
per sqm, floor, condition and distance) and to product or company benchmarks (price per user, feature
coverage, growth, margin, support response time).

## Output shape

```yaml
decision:
comparableSet:
  criteria: { segment:, size:, location:, period: }
  members: [ { id:, name:, evidence: [EV-...] } ]
  excluded: [ { name:, reason: } ]
dimensions:
  - { id:, definition:, unit:, direction: higher-better|lower-better, normalisation: }
matrix:
  - { member:, values: { <dimensionId>: { value:, evidence: [EV-...], date: } } }
subjectPosition:
  <dimensionId>: { value:, percentile:, gapToMedian:, gapToBest:, outlierSensitive: true|false }
outliers: [ { member:, dimension:, reason: } ]
implications:
  - { statement:, dimensions: [], confidence: low|medium|high }
soWhat:
```

## Pitfalls

- Comparing unlike things: different segment, size, location or period, so the gap is not the subject's.
- Cherry-picking comparables that make the subject look good or bad; criteria must be set before collecting.
- Skipping normalisation, so a bigger or older comparable looks cheaper or dearer for the wrong reason.
- Too many dimensions, which buries the decision; too few members, which makes percentiles meaningless.
- Mixing asking prices with transaction prices, or list prices with realised prices, without saying so.
- Treating a gap as a verdict: a premium may be justified by a dimension that was not measured.
- Stale or undated data presented as current.

## Reading the result

A subject near the median on most dimensions is priced and positioned like the market; a large gap
matters only on dimensions that drive the decision. A premium that no measured dimension explains is a
risk to price or resale; a discount with strong dimensions is an opportunity or a hidden flaw to check.
If the conclusion flips when outliers are removed or the set is narrowed, report it as fragile and say
which extra evidence would settle it.
