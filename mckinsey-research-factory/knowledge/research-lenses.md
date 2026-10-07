# Research Lenses

Research each branch of the issue tree through one of four lenses. A lens tells you which questions to ask, which frameworks to use, which sources to trust, and which traps to avoid.
Work only on the branches the research plan assigns to your lens, and tie every finding to a hypothesis.

## Before you start (every lens)
- Re-read the key question, the success criteria and your assigned hypotheses. Research that doesn't move the decision is noise.
- Answers come before analysis: find the simplest fact-based test that proves or disproves each hypothesis.
- Look first for the evidence that would *kill* the hypothesis.
- Use a rough estimate to decide whether a detailed one is worth doing.

## Lens: Market

**Answers:** How big is the market, how fast is it growing, and why? Who buys, which segments exist, and what share is realistically reachable?

**Frameworks:**
- **TAM / SAM / SOM.** TAM = total demand if you had 100% share. SAM = the part your product and go-to-market can serve. SOM = the share of SAM you can realistically win within the horizon, given competition and sales capacity.
- **Top-down:** start from an industry total and apply filters (geography, segment, price tier). It is fast but easy to inflate.
- **Bottom-up:** # target customers x adoption x price x frequency. It is defensible because it forces explicit assumptions about customers, pricing and go-to-market.
- Always do both. If the two results differ by more than about 2x, find out why before you use either.
- **Growth drivers:** break growth into volume, price and mix. Name the 2–3 drivers and check whether they are structural or cyclical.
- **Segmentation:** split by need, size, geography or channel. Size each segment and check its willingness to pay.

**Best sources:** national statistics offices, regulators, company filings (10-K, annual reports), industry associations, peer-reviewed or academic studies, a named analyst's report *with its method stated*, and primary data such as surveys, interviews or pricing pages.

**Traps:** a single-source headline TAM from a paid report whose method you can't see; mixing currencies or years; using CAGR on a base you haven't checked; confusing TAM with a revenue forecast; false precision (report ranges instead).

## Lens: Competitors

**Answers:** Who else serves this need, including substitutes? How attractive is the industry structurally? How will rivals react to our move? Where is there room to position?

**Frameworks:**
- **Porter's five forces:** rivalry, threat of entry, supplier power, buyer power, threat of substitutes. Define the industry (products, geography), segment the participants, assess what drives each force, find the forces that control profitability, and test that against actual long-run profitability.
  - Growth rate, technology, government and complements are *factors* that act through the five forces. They are not extra forces.
- **Competitor profile (Porter's four corners, Competitive Strategy 1980):** future goals, current strategy, assumptions, capabilities. Use them to predict each rival's likely offensive and defensive moves.
- **Positioning:** a 2-axis map (e.g. price vs breadth, or segment vs capability), a feature and pricing comparison, and each rival's moat (switching costs, scale, network effects, brand, regulation).

**Best sources:** competitor filings and investor decks, pricing and product pages (record the date you captured them), job postings (they show strategic bets), patents, customer reviews, trade press, funding databases, and interviews with customers or ex-employees.

**Traps (Porter's list):** defining the industry too broadly or too narrowly; making lists instead of analyzing; giving every force equal attention instead of digging into the important ones; confusing effect (price sensitivity) with cause (buyer economics); static analysis that ignores trends; treating cyclical change as structural; using the framework to declare an industry "attractive" instead of to guide choices. Also: ignoring substitutes and non-consumption, and profiling only the famous rivals.

## Lens: Economics

**Answers:** Does each unit make money? What does it cost to get there? Is the investment worth it, and how sensitive is the answer to the key assumptions?

**Frameworks:**
- **Unit economics:** define the unit (order, customer, seat).
  - Contribution margin = (price - variable cost) / price.
  - CAC = acquisition spend / new customers in the period.
  - LTV = margin-based value over the expected customer lifetime.
  - LTV:CAC and CAC payback in months.
- **Cost structure:** fixed vs variable, scale effects, and the breakeven volume.
- **Pricing:** value-based vs cost-plus vs competitive; willingness to pay; elasticity signals.
- **Investment case:** NPV (discounted cash flows minus the initial investment), payback period and IRR. State the discount rate and horizon.
- **Sensitivity:** flex the 3–5 biggest assumptions (e.g. ±20%, or low/base/high) and report which ones flip the decision. Do a breakeven check: "what would X have to be for NPV = 0?"

**Best sources:** internal financials if available, public comparables' filings, pricing pages, supplier quotes, and benchmark studies that state their sample. Treat published "healthy" ratios (e.g. LTV:CAC of 3:1) as context, not proof. They vary by model and segment.

**Traps:** blended averages that hide unprofitable segments; LTV from retention you assumed but never observed; leaving out fully loaded CAC; a base case that is really the best case; one-point estimates without ranges; mixing nominal and real values.

## Lens: Operations (technical, regulatory, execution)

**Answers:** Can we actually do this, legally and technically, with the capabilities, time and money we have? What could stop us?

**Frameworks:**
- **Capability gap:** required vs existing capabilities, then build, buy or partner.
- **Technical feasibility:** proven vs novel technology, dependencies, integration effort, scalability, and a reference implementation if one exists.
- **Regulatory scan:** the applicable laws and licenses per jurisdiction, data and privacy rules, sector regulators, time to comply, and pending changes.
- **Execution plan and risk register:** critical path, lead times, key-person and supplier dependencies. Rate each risk on likelihood x impact and give it a mitigation.

**Best sources:** primary legal texts and regulator guidance (not blog summaries), official technical documentation, standards bodies, case studies of comparable launches, vendor documentation, and expert interviews.

**Traps:** "technically possible" treated as "operationally ready"; summarizing law from secondary sources; ignoring lead times such as licensing or hiring; optimism about timelines (the planning fallacy).

## When a lens is not material
If the plan assigns no material branch to a lens, or your first checks show it can't change the decision, don't pad it out. Write a short note and stop:

```
Lens: <name> — not material.
Why: <1–3 sentences tied to the key question / success criteria>
What would make it material: <trigger, e.g. "if launch expands beyond EU">
```

## Sources
- https://www.homeworksmontana.com/wp-content/uploads/2022/08/20200406152146the_mckinsey_approach_to_problem_solving.pdf
- https://hbr.org/2008/01/the-five-competitive-forces-that-shape-strategy
- https://public.dhe.ibm.com/software/data/sw-library/cognos/pdfs/articles/art_the_five_competitive_forces_that_shape_strategy.pdf
- https://en.wikipedia.org/wiki/Porter%27s_four_corners_model
- https://www.alloypartners.com/articles/market-sizing
- https://www.salesforce.com/blog/small-business/tam-sam-som/
- https://mercury.com/blog/understanding-unit-economics
- https://hbr.org/2014/11/a-refresher-on-net-present-value
- https://hbr.org/2011/06/the-big-idea-before-you-make-that-big-decision
