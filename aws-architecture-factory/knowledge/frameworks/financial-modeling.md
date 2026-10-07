---
id: financial-modeling
name: Financial modeling
purpose: Test whether a purchase, investment or project earns an acceptable return, using a transparent cash-flow model with cases and sensitivity.
problemTypes: [investment-return, go-no-go-decision, uncertainty-and-risk]
useWhen:
  - deciding whether to buy an asset, make an investment or fund a project (for example a property bought to rent out)
  - the answer depends on yield, payback, NPV or IRR against a hurdle rate
  - the reader must be able to check every number
doNotUseWhen:
  - the question is per-customer economics of an operating business (use unit-economics)
  - the question is why an existing business's profit is low (use profit-tree)
  - there is no price, cost or income evidence at all, even as a range
  - the decision turns on market structure, customers or organisation rather than money
questionsAnswered:
  - What is the all-in cost, and what do the asset or project earn each year after costs and taxes?
  - What are the gross and net yield, the payback, and the NPV and IRR at a stated discount rate?
  - What rent, price or income makes the decision break even?
  - Which two or three inputs drive the result, and does the decision survive the low case?
requiredEvidence: [purchase-price-comparables, rent-or-income-comparables, vacancy-or-utilisation-benchmarks, running-costs, taxes-and-fees, exit-value-or-price-trend, discount-rate-reference]
outputs: [financial-model, cash-flow-table, return-metrics, scenario-cases, sensitivity-table, break-even-points]
complexity: 3
overlapsWith: [unit-economics]
pairsWellWith: [scenario-planning, hypothesis-driven, tam-sam-som]
---

## How to apply

Unit economics asks whether one customer or unit pays back inside a business. This asks whether
one asset or project, with an upfront outlay and an exit, beats a stated alternative.

1. **State the decision, horizon and discount rate.** Name the alternative the money could earn
   (deposit, bond, other asset) and use it, or a stated hurdle above it, as the discount rate.
2. **List the inputs in a table**: value, unit, low / base / high range, and source. Every input
   carries an evidence id, or is labelled ASSUMPTION with the reason it was chosen. No unlabelled
   numbers.
3. **Build the cash flows**: upfront (price, purchase fees, repairs, furnishing), recurring income
   (net of vacancy), recurring costs (running costs, management, insurance), taxes and fees on
   income, and exit value (price at horizon less selling costs).
4. **Compute the metrics** and show the arithmetic line by line:
   - gross yield = annual rent / purchase price
   - net yield = (income − costs − taxes) / all-in cost
   - payback years = all-in cost / annual net cash flow (state that it ignores exit)
   - NPV = sum of cash flow_t / (1 + r)^t; IRR = the r at which NPV = 0
   - break-even rent and break-even price at which NPV = 0
5. **Run base / low / high cases** where each case moves inputs together in one direction, then a
   **one-at-a-time sensitivity** on the 2 or 3 drivers that matter (change one input across its
   range, hold the rest at base). Rank drivers by swing in NPV.
6. **Mark each result as INFERENCE** with its formula and the input ids it uses.

## Output shape

```yaml
decision: { horizonYears:, discountRate:, alternative: }
inputs:
  - { name:, base:, low:, high:, unit:, source: <evidence id> | ASSUMPTION }
cashFlows: { upfront: [], annualIncome: [], annualCosts: [], taxesAndFees: [], exit: }
metrics: { grossYield:, netYield:, paybackYears:, npv:, irr:, formulae: [] }
cases: { low: {}, base: {}, high: {} }
sensitivity: [{ driver:, lowNpv:, highNpv: }]
breakEven: { rent:, price: }
```

### Worked example (all numbers are ILLUSTRATIVE ASSUMPTIONS, not market data)

A $55,000 studio in Didi Dighomi, Tbilisi, bought to rent out. In a real run each line below
would carry an evidence id from listings, rental comparables and the tax authority.

| Input | Base | Low / High | Source |
|---|---|---|---|
| Purchase price | $55,000 | n/a | ASSUMPTION (listing price) |
| Purchase fees and legal | 2% = $1,100 | n/a | ASSUMPTION |
| Repairs and furnishing | $4,000 | n/a | ASSUMPTION |
| Monthly rent | $350 | $300 / $400 | ASSUMPTION |
| Vacancy | 8% | 15% / 5% | ASSUMPTION |
| HOA and maintenance | $300/yr | n/a | ASSUMPTION |
| Property tax and insurance | 0.2% of price = $110, plus $50 | n/a | ASSUMPTION |
| Tax on rental income | 5% of collected rent | n/a | ASSUMPTION (verify the regime) |
| Price growth per year | 3% | 0% / 6% | ASSUMPTION |
| Selling costs | 2% of exit price | n/a | ASSUMPTION |
| Horizon, discount rate | 10 years, 10% | 6% as a check | ASSUMPTION |

Arithmetic (base case):

- All-in cost = 55,000 + 1,100 + 4,000 = **$60,100**
- Gross rent = 350 × 12 = 4,200; gross yield = 4,200 / 55,000 = **7.6%**
- Collected rent = 4,200 × (1 − 0.08) = 3,864
- Costs = 300 + 110 + 50 = 460; tax = 0.05 × 3,864 = 193
- Net cash flow = 3,864 − 460 − 193 = **$3,211/yr**; net yield = 3,211 / 60,100 = **5.3%**
- Payback (rent only) = 60,100 / 3,211 = **18.7 years**
- Exit = 55,000 × 1.03^10 × (1 − 0.02) = 72,437
- PV of rent = 3,211 × 6.1446 = 19,729; PV of exit = 72,437 × 0.3855 = 27,927
- **NPV at 10% = −60,100 + 19,729 + 27,927 = −$12,443**; **IRR ≈ 6.8%**
- Break-even rent (NPV = 0 at 10%) ≈ **$543/month**; break-even price ≈ **$31,000**

Cases (rent, vacancy, growth moved together):

| Case | Rent / vacancy / growth | Net yield | NPV at 10% | IRR |
|---|---|---|---|---|
| Low | $300 / 15% / 0% | 4.1% | −$24,283 | 3.2% |
| Base | $350 / 8% / 3% | 5.3% | −$12,443 | 6.8% |
| High | $400 / 5% / 6% | 6.4% | +$907 | 10.2% |

One-at-a-time sensitivity on NPV at 10% (base −$12,443):

| Driver | Low value | High value |
|---|---|---|
| Monthly rent $300 / $400 | −$15,666 | −$9,221 |
| Price growth 0% / 6% | −$19,590 | −$3,156 |
| Vacancy 20% / 0% | −$15,385 | −$10,482 |

Price growth is the largest driver, then rent; vacancy matters least. At a 6% discount rate the
base NPV is +$3,980, so the verdict depends on which alternative the buyer compares against.

## Pitfalls

- Inputs with no source and no ASSUMPTION label, or a model whose arithmetic cannot be rechecked.
- Reporting gross yield alone; it ignores vacancy, costs, taxes and purchase fees.
- Treating payback as a return: it ignores the exit value and the time value of money.
- A single-point answer. Cases move inputs together and cannot show which driver matters; run the
  one-at-a-time sensitivity as well.
- Mixing currencies, nominal and real figures, or periods (monthly rent with annual costs).
- Choosing the discount rate after seeing the result, or not naming the alternative it stands for.
- Exit value that assumes growth with no evidence; it often supplies most of the return.
- Forgetting one-off costs (fees, repairs, furnishing) and taxes on income or on sale.

## Reading the result

Decide on the stated rate: NPV above zero (IRR above the hurdle) in the base case, and a low case
that is survivable rather than ruinous. If the case is positive only when one driver reaches its
high end, say so and name the evidence that would settle that driver. Report the break-even rent
and price next to the asking figures: they show how much margin the deal really has. A result
that flips sign between the plausible alternatives is a finding about the hurdle rate, not about
the asset.
