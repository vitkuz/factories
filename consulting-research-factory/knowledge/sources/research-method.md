# The strategy-consulting research method (McKinsey style): operational notes for agents

Pipeline: frame → issue tree → hypotheses → research plan → evidence → synthesis → storyline → exhibits → report → partner review.

Each section gives the rule, a checklist or template, and sources. Items marked **[derived]** are my operational restatements of the sources, not direct quotes.

Running example used throughout: *"MidCo, a $40M ARR B2B SaaS firm, wants to know how to lift gross margin."*

Note on access: mckinsey.com pages blocked automated fetching (403 errors and timeouts). Claims attributed to McKinsey pages come from search-result extracts of those pages and from reposts/summaries, which are cited alongside.

---

## 0. The backbone: Conn & McLean's 7 steps (Bulletproof Problem Solving, 2018)

The 7 steps are **Define → Disaggregate → Prioritize → Workplan → Analyze → Synthesize → Communicate**. The authors say to treat the process "like an accordion": compress or expand steps as you learn, and loop back.

| BPS step | Pipeline stage |
|---|---|
| 1 Define | frame |
| 2 Disaggregate | issue tree |
| 3 Prioritize (prune) | hypotheses |
| 4 Workplan | research plan |
| 5 Analyze | evidence |
| 6 Synthesize | synthesis |
| 7 Communicate | storyline → exhibits → report |
| Team process (obligation to dissent, and similar) | partner review |

Sources:
- McKinsey podcast with Charles Conn and Hugo Sarrazin, "How to master the seven-step problem-solving process" (2019): https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/how-to-master-the-seven-step-problem-solving-process
- Summary with "accordion", step details and team behaviours: https://sellingsherpa.com/index.php/2020/08/30/bulletproof-problem-solving-book-summary/
- https://readingraphics.com/book-summary-bulletproof-problem-solving/
- https://ideasforleaders.com/book_reviews/bulletproof-problem-solving/
- Podcast recap, including "focus on parts that have the biggest impact … and ones that you can change": https://sgsubra.wordpress.com/2022/11/15/how-to-master-the-seven-step-problem-solving-process/

---

## 1. FRAME: the problem statement worksheet

**Good problem statements, per BPS**, are:
- outcome-focused ("expressed in outcomes, not activities")
- specific and measurable
- time-bound
- explicit about the decision-maker's values, boundaries, required accuracy and scale of aspiration
- scoped broadly enough for creativity and unexpected results
- solved at the highest organizational level possible

"A well-defined problem is a problem half-solved."
- https://sellingsherpa.com/index.php/2020/08/30/bulletproof-problem-solving-book-summary/
- https://readingraphics.com/book-summary-bulletproof-problem-solving/

**Worksheet fields**, as taught by Slideworks (ex-McKinsey/BCG):
1. **Main question**, which must be SMART (Specific, Measurable, Action-oriented, Relevant, Time-bound). Example: *"How can Airline Inc. reduce operating costs by $400 million through more efficient and effective operations before 2027?"*
2. **Context**: industry trends, competitive position, capability gaps, financial flexibility.
3. **Criteria for success**: how stakeholders define success *and failure*, including non-numeric criteria (timing, visibility, capability building, mindset shift).
4. **Scope and constraints**: what is in and out (e.g. "organic growth options only").
5. **Stakeholders and key sources**: the decision makers, and the internal and external expertise you need.

Source: https://slideworks.io/resources/mckinsey-problem-solving-process

**Frame template [derived]**

```
Decision maker:        <who decides; what they value>
Decision to be made:   <the choice this research informs>
SMART question:        How can <actor> <achieve measurable outcome> by <date>?
Context:               <3-5 facts: market, position, recent change>
Success criteria:      <quantitative target>; <qualitative criteria>; <what "failure" looks like>
In scope / Out of scope:
Constraints:           <budget, time, data access, non-negotiables>
Time frame & accuracy: <deadline; order-of-magnitude vs. ±10%>
Stakeholders/sources:  <who to interview; which data sets>
```

**Mini example.** "How can MidCo raise gross margin from 68% to 75% within 18 months, without raising logo churn above 8%, organically?"
- Decision maker: CEO and CFO.
- Out of scope: M&A, headcount cuts in R&D.

**Frame checklist**
- Is it a question, not a topic?
- Can someone tell, at the end, whether it was answered?
- Is there a named decision?
- Is the scope too narrow (it presumes the solution) or too broad (boiling the ocean)?

---

## 2. ISSUE TREE: disaggregate

**Tree types in BPS:**
- factor trees
- deductive logic trees
- inductive logic trees
- hypothesis trees
- decision trees

Early in a problem, when you know little, use component or factor trees. Once you know more, move to hypothesis trees.
- https://readingraphics.com/book-summary-bulletproof-problem-solving/
- https://sellingsherpa.com/index.php/2020/08/30/bulletproof-problem-solving-book-summary/

**Issue tree vs. hypothesis tree**
- An issue tree is built from **questions**. Open questions that begin with what, how or why "produce deeper insights than closed ones."
- A hypothesis tree is built from **declarative, testable statements**. Example: "Alpha can add $125M revenues by expanding to new customers, adding $8M of EBITDA."
- Sources: https://umbrex.com/resources/mckinsey-problem-solving/ and https://www.myconsultingoffer.org/case-study-interview-prep/hypothesis-tree/

**Diagnostic (why) vs. solution (how)**
- A diagnostic tree asks WHY, to find root causes. A solution tree asks HOW, to generate options.
- "You want to know the WHY before you get to the HOW": if the root cause is unknown, build the diagnostic tree first.
- Never mix why and how in one tree.
- Sources: https://www.preplounge.com/consulting-forum/whay-are-the-differences-between-issue-trees-and-hypothesis-trees-4922 and https://www.craftingcases.com/issue-tree-guide/

**The rules of a good tree (Crafting Cases, PrepLounge):**
1. It answers one specific key question, which sits at the root.
2. It goes from the key question down to more specific issues.
3. Its branches are MECE.
4. It keeps one type of logic throughout (all why or all how).
5. It goes deep enough, stopping "when your buckets can reasonably explain the problem."
6. Its branches are falsifiable: each one can be tested with data.

Crafting Cases also advises building one part at a time. Three construction techniques:
- a math equation (e.g. profit = revenue − cost)
- layered MECE frameworks
- decision-tree conditional logic

Source: https://www.craftingcases.com/issue-tree-guide/

**MECE.** Mutually Exclusive (no overlaps) and Collectively Exhaustive (no gaps). StrategyU notes that real trees are rarely perfectly MECE and should at least contain every *relevant* issue.
- https://strategyu.co/issue-tree/
- https://www.mbacrystalball.com/blog/strategy/mece-framework/

**Tree test checklist [derived from the sources above]**
- **ME test:** could one fact or dollar sit in two branches? If so, redefine the branches.
- **CE test:** sum the children. Do they equal the parent (algebraic trees)? Name the "other" bucket. If it is large, the split is wrong.
- **Same-logic test:** read each level aloud as "X because A, B, C" or "X by doing A, B, C". Mixed verbs mean mixed logic.
- **Level test:** are siblings at the same level of abstraction?
- **Testability test:** for each leaf, name the analysis and the data that would settle it. If you can't, go deeper or rephrase.
- **Insightfulness test:** does the split separate things that behave differently? Prefer revenue = price × volume over an arbitrary alphabetical split.

**Mini example (diagnostic):** "Why is MidCo's gross margin 68% vs. a peer median of ~75%?"
- Hosting/infrastructure cost per $ ARR is high
  - over-provisioned compute
  - unfavorable cloud contract
- Customer support/success cost in COGS is high
  - ticket volume per account
  - cost per ticket
- Professional services are sold below cost
- Price realization is low
  - discounting
  - legacy plans

---

## 3. HYPOTHESES: prioritize and prune

**Prioritization rule (BPS).** "Prioritize problems where both potential scale of impact [and] your ability to influence are high." Cut branches that are minor or that you cannot change. Slideworks uses a 2×2 matrix of impact vs. ease: *Start here / Maybe / Don't do*.
- https://sellingsherpa.com/index.php/2020/08/30/bulletproof-problem-solving-book-summary/
- https://slideworks.io/resources/mckinsey-problem-solving-process

**80/20 and "don't boil the ocean"** (Rasiel, *The McKinsey Way*): 80% of an effect comes from 20% of causes. Don't analyse everything. Find the key drivers.
- https://www.goodreads.com/book/show/206260.The_McKinsey_Way
- https://meghasehgal.wordpress.com/2016/06/12/summary-the-mckinsey-way-by-ethan-m-rasiel/

**The day-one answer (initial hypothesis).** State the likely answer on day one, then try to prove or disprove it. Rasiel: either the hypothesis holds, or the fact-finding gives you enough information to reach the right answer. Don't let a strong hypothesis turn into mental inflexibility, and don't bend the facts to fit it.
- https://minh-le.medium.com/the-mckinsey-way-summary-cb2700707641
- https://www.casestar.io/definitions/hypothesis-driven

**What makes a good hypothesis** (Slideworks and Umbrex):
- testable with data
- open to debate (not a statement of fact)
- material: if it proved false, the solution would change
- action-oriented, pointing to a client action
- not obvious without analysis

Sources: https://slideworks.io/resources/mckinsey-problem-solving-process and https://umbrex.com/resources/mckinsey-problem-solving/

**The "what would have to be true" test** (Roger Martin; BPS uses it as "what you'd have to believe"). For each option, list the conditions that must hold, then find the ones you are least confident in. Those become your tests.
- https://rogermartin.medium.com/what-would-have-to-be-true-83dac5bd2189

**Handling competing hypotheses (Analyst Academy).**
- Keep 2–3 competing hypotheses, ordered by impact and plausibility.
- Break each one into sub-hypotheses.
- Design disconfirming tests.
- Record the ones you dropped.
- "It's a direction, not a chain."

Source: https://www.theanalystacademy.com/strategy-hypothesis-driven-approach/

**Hypothesis template [derived]**

```
H1: <declarative claim with a number>  e.g. "Cloud cost/ARR can fall from 14% to 9% via rightsizing and a committed-use contract (+5 pts GM)"
Must be true: (a) utilization < 40% on core clusters; (b) committed-use discounts of 25-35% are available; (c) no latency SLA breach
Kill criterion: if utilization > 65%, H1 drops to < 1 pt
Impact (pts GM): 5 | Influence: high | Priority: 1
```

---

## 4. RESEARCH PLAN: the workplan, ghost deck and killer analyses

**Workplan columns.** For each issue or hypothesis, record:
- the **analyses** needed
- the **end product** (what the chart or table will show)
- the **sources**
- the **timing and responsibility**

"Doing it well requires working through the definition of each element … in a rigorous and methodical fashion."
Source: https://umbrex.com/resources/mckinsey-problem-solving/ (also https://slideworks.io/resources/mckinsey-problem-solving-process)

**BPS workplan discipline:**
- "We don't do any analyses that aren't guided by very clear and testable hypotheses."
- **Dummy the chart:** sketch each output before doing the work, to confirm it matters.
- **Run knock-out analyses first**: the cheap tests that could kill a branch.
- Plan in detail for only 2–3 weeks ahead.

Source: https://sellingsherpa.com/index.php/2020/08/30/bulletproof-problem-solving-book-summary/

**"Killer analysis" [derived].** This is not a formally defined term in the sources. In practice it is the BPS "knock-out analysis": the single analysis whose result would kill or confirm a hypothesis. Schedule it first.

**One-day answer (BPS).** A short interim answer you revise as you go, written in three parts:
1. the situation
2. the observations or complications
3. the current best resolution

Source: https://sellingsherpa.com/index.php/2020/08/30/bulletproof-problem-solving-book-summary/

**Ghost deck (also called ghost pack, shell or skeleton).** A deck that is "about 20% complete, with most of the work going into developing leads (titles) and headlines". It has rough sketches of the planned charts and notes on which data exists and which is missing. It answers four questions:
1. Does the storyline need to change?
2. What content supports the story?
3. What content already exists?
4. What is missing, and how will we get it?

"If a storyline has to be changed, it's much better to know sooner rather than later."
- http://workingwithmckinsey.blogspot.com/2013/07/McKinsey-presentations-ghost-decks.html
- https://strategyu.co/consulting-presentations/
- https://a1slides.com/ghost-deck-presentation-structure/

**Workplan row template [derived]**

| Hypothesis | Analysis | End product (dummy chart + expected title) | Source | Owner | Due | Kill? |
|---|---|---|---|---|---|---|
| H1 cloud cost | Utilization by cluster, last 90 days | Bar chart, utilization % by cluster. Title: "Core clusters run at <40%, so rightsizing is worth ~3 pts GM" | Billing export, APM | agent-analyst | D2 | Yes |
| H4 pricing | Discount waterfall by segment | Waterfall list → net price | CRM deals | agent-analyst | D3 | No |

---

## 5. EVIDENCE: fact base, triangulation, sizing and sanity checks

**Fact-based.**
- Rasiel: McKinsey's approach is "fact-based, structured, hypothesis-driven."
- Slideworks: "Any solution not backed by solid numbers carries a heavy burden of proof."
- Sources: https://slideworks.io/resources/mckinsey-problem-solving-process and https://www.goodreads.com/book/show/206260.The_McKinsey_Way

**Start simple (BPS).** "Smart analysis starts with heuristics and summary statistics to assess the magnitude and direction of the key problem levers." Only then use the big guns:
- regression
- Monte Carlo simulation
- Bayesian methods
- experiments
- machine learning
- game theory

Other BPS advice:
- Ask "why" five times to reach the root cause.
- Look for natural experiments: "see if the world has already run it."
- Avoid "data-fishing expeditions."

Source: https://sellingsherpa.com/index.php/2020/08/30/bulletproof-problem-solving-book-summary/

**Market sizing: top-down vs. bottom-up, then cross-check.**
- Top-down starts from a large total (e.g. population) and narrows it with filters.
- Bottom-up starts from a single unit (one customer or store) and multiplies up.
- In real engagements both are used to triangulate. If the two land close (e.g. 120k vs. 150k), you are in the right neighbourhood.
- Sanity-check two ways: **per person** and **against a benchmark**. Example: $2.7B ÷ 225M users ≈ $12/person/yr, or about 4 brushes at $3 each, which is plausible.
- The 5-step method: clarify → choose approach → segment → calculate → sanity-check and state the implication.

Sources:
- https://www.hackingthecaseinterview.com/pages/market-sizing
- https://managementconsulted.com/market-sizing/
- https://igotanoffer.com/blogs/mckinsey-case-interview-blog/market-sizing

**Triangulation** means confirming a finding with at least two independent kinds of evidence, for example:
- data from different times, places or people
- different methods (interviews vs. documents vs. quantitative data)
- different analysts

Sources: https://delvetool.com/blog/triangulation-qualitative-research and https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11334375/

**Evidence checklist [derived]**
- Every number in the fact base has: a source URL or doc, an as-of date, units, and a definition.
- Every key number has one independent cross-check (a second source, or top-down vs. bottom-up), or is marked "single-source".
- Run a back-of-envelope check on every headline number:
  - order of magnitude
  - per-unit sense (per customer, per employee, per $ revenue)
  - a comparison to a known benchmark
- Tag each finding against a hypothesis: **supports**, **refutes** or **inconclusive**. Record refuting evidence with the same care as supporting evidence.
- Log the hypotheses you dropped, and why.

---

## 6. SYNTHESIS: summary vs. synthesis, and "so what"

**Summary vs. synthesis.**
- A summary reports what exists. A synthesis derives new meaning.
- "Clients pay McKinsey to synthesize stuff into insight, knowledge, new perspectives, recommendations, and strategy."
- A partner's demand: "Give me the three insights from all this."
- Practice the **3-takeaways** habit after every analysis.
- Sources: https://www.stratechi.com/synthesizing/ and https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/synthesis-capabilities-and-overlooked-insights

**"So what" (Slideworks).** "Data without a so what is reporting, and consultants are not paid for reporting." The method:
1. Ask why until you reach an addressable cause.
2. Turn that cause into a specific, actionable recommendation.
3. Pressure-test it: Am I biased? Is there a better answer? Does it move the needle?

Worked chain: high delivery costs → fuel 20% above average → each driver negotiates alone → the root cause is no central procurement → "Centralize fuel procurement to capture $2M annual savings."
Source: https://slideworks.io/resources/getting-to-so-what-guide-to-creating-actionable-business-insights

**What → So what → Now what.**
- *What*: the facts, with no interpretation.
- *So what*: the implication, and why the client should care. Ask "so what?" up to three times to reach the business implication.
- *Now what*: the action.
- Source: https://thinkinsights.net/consulting/what-so-what-now-what

**Ladder template [derived]: data → finding → insight → implication → recommendation**

| Level | MidCo example |
|---|---|
| Data | 31% of COGS is support; 2.1 tickets per account per month; peers ~0.9 |
| Finding | Support cost per account is 2.3× peers |
| Insight | 60% of tickets come from 3 onboarding flows, so the cost is a product-design issue, not a staffing issue |
| Implication | Fixing onboarding could cut ~1.3 tickets per account, worth ~3 pts GM |
| Recommendation | Redesign the 3 onboarding flows and add in-app guides in Q1. Target 1.0 tickets per account by Q3 |

**Elevator test** (Rasiel): know your solution well enough to explain it "clearly and precisely … in 30 seconds." The governing thought must pass the question "if you had 30 seconds with the CEO, what would you say?"
- https://minh-le.medium.com/the-mckinsey-way-summary-cb2700707641
- https://deckary.com/blog/pyramid-principle-consulting

**Synthesis checklist**
- Is there one governing thought?
- Is it at most 3–5 supporting insights?
- Is each insight a full sentence claim, not a topic?
- Does each insight cite its evidence and its hypothesis status?
- Does it pass the 30-second test?
- Does the synthesis answer the SMART question from the frame, and does it check the result against the success criteria? BPS: "reference original problem definition and success criteria."

---

## 7. STORYLINE: the Pyramid Principle (Minto)

**Three rules:**
1. Every idea summarizes the ideas grouped below it.
2. Ideas in each group are the same kind of idea.
3. Ideas in each group are in a logical order.

**Three sub-structures:**
- vertical Q&A dialogue
- horizontal deductive or inductive argument
- a narrative introduction (SCQA)

Sources:
- https://strategyu.co/pyramid-principle-partone/
- https://productmindset.substack.com/p/mckinseys-pyramid-principle
- https://modelthinkers.com/mental-model/minto-pyramid-scqa
- Book: https://www.goodreads.com/book/show/33206.The_Minto_Pyramid_Principle

**SCQA.**
- *Situation*: something the reader already agrees with.
- *Complication*: the change that creates a need to act.
- *Question*: the question that complication raises.
- *Answer*: the top of the pyramid.

Variants:
- direct: A-S-C
- standard: S-C-A
- concerned: C-S-A
- aggressive: Q-S-C

Sources: https://strategyu.co/pyramid-principle-partone/ and https://slideworks.io/resources/mckinsey-problem-solving-process (the SCR variant)

**Vertical logic.** Every statement raises a question in the reader's mind (why? how? what?), and the level below answers exactly that question.

**Horizontal logic** comes in two forms:
- **Deductive:** premise → premise → therefore. It is fragile: if one link fails, the chain fails.
- **Inductive:** parallel points → an inference. It is more robust: one challenged point leaves the others standing. Prefer inductive for the key line.

**Ordering within a group:** by time, by structure, or by degree of importance.

**Group size:** 3–5 ideas, never more than about 7. Three is the "magic number."
- https://strategyu.co/pyramid-principle-partone/
- https://thinkinsights.net/strategy/pyramid-principle

**Dot-dash storyline.** The whole storyline written as a text outline:
- **dots** are top-level insights (future slide titles or the executive summary)
- **dashes** are supporting data and exhibits

You review it before building any slides, "before you waste a lot of time and effort."
- http://workingwithmckinsey.blogspot.com/2013/07/McKinsey-storyline-dot-dash.html
- https://caseprep.wordpress.com/tag/dot-dash-storyline/

**Mini dot-dash (MidCo)**

```
• MidCo can reach 75% GM in 18 months through three product/ops moves, without price increases above inflation
  • Cloud rightsizing plus a committed-use contract cuts infra cost/ARR from 14% to 9% (+5 pts)
    – Core clusters average 37% utilization (APM, Q2)
    – Committed-use discount quoted at 28% (vendor)
  • Onboarding redesign halves support tickets (+3 pts)
    – 60% of tickets come from 3 flows; peers run 0.9 tickets per account
  • Repricing professional services to cost+20% removes a -1 pt drag
  • Risk: churn stays < 8% because no list-price change is required
```

**Storyline checklist**
- The answer comes first.
- Every level answers the question raised by the level above.
- Each group is MECE, same-kind and 3–5 items.
- Each group has a stated order.
- The introduction follows SCQA.
- The top line passes the elevator test.

---

## 8. EXHIBITS: action titles and the horizontal-flow test

**Action titles.**
- Each title is the "so what" of its slide: a full sentence with a subject and a verb.
- One or two lines, at most about 15 words.
- If the message does not fit, the slide carries two messages. Split it.
- Before/after examples:
  - "Supply chain processes can be optimized" → "Optimize supply chain processes to reduce costs by 20%"
  - "We interviewed experts…" → "8 potential high-impact cost reduction levers identified"
- Sources: https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey and https://slidescience.co/action-titles/

**The read-the-titles test (horizontal flow).**
1. Strip every chart and all body text.
2. Read only the titles, in order.
3. Check whether they form a complete, logical, persuasive argument that lands on the recommendation.

Sources:
- https://www.storytellingwithdata.com/blog/2013/12/horizontal-logic
- https://www.chatslide.ai/guides/mckinsey-consulting-style-slides
- https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey

**Exhibit checklist [derived]**
- One message per exhibit.
- The title states the conclusion. The chart proves exactly that conclusion and nothing else.
- Every number has a source footnote and an as-of date.
- Readable in 20 seconds.
- The titles, read in order, equal the dot-dash dots.
- Supporting detail goes in the appendix.

Source for the 20-second rule and "lead with the recommendation": https://www.autopresent.ing/blog/consulting-slide-deck/

**Report layout** (StrategyU):
1. title
2. executive summary (the dot-dash, answer first)
3. body sections, one per key-line point
4. appendix

"Lead with your main recommendation so that even a quick skim delivers the key message."
Source: https://strategyu.co/consulting-presentations/

---

## 9. PARTNER REVIEW: obligation to dissent, pressure tests and top-down review

**Obligation to dissent.**
- It is a McKinsey core value ("uphold the obligation to dissent"), first set out by Marvin Bower.
- Every member, however junior, is expected to speak up if they think the team is heading to the wrong answer. Silence counts as consent.
- Sources:
  - https://www.mckinsey.com/about-us/overview/our-purpose-mission-and-values
  - https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/into-all-problem-solving-a-little-dissent-must-fall
  - https://www.hackingthecaseinterview.com/pages/mckinsey-values
  - https://firmsconsulting.com/marvin-bower-mckinsey-management-consulting/

**BPS team behaviours against bias:**
- obligation to dissent
- role-playing stakeholders
- a dialectic standard: each thesis faces an antithesis
- perspective-taking: state the other view compellingly
- "What would you have to believe?" instead of arguing
- distributed voting, with the most senior person voting last
- pre-mortems

Source: https://sellingsherpa.com/index.php/2020/08/30/bulletproof-problem-solving-book-summary/ (see also McKinsey, "A case study in combating bias": https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/a-case-study-in-combating-bias)

**Red team.** Independent reviewers who did not write the draft ask "What would prove this wrong?" rather than relying on internal consensus.
- https://mikefisher.substack.com/p/red-teaming-your-strategy
- https://loopio.com/blog/red-team-review/

**How partners read a deck top-down.** Partners treat a deck as an argument. They read the titles first. The most common red-ink notes:
- topic labels instead of assertions (the most common)
- no storyline
- charts without a takeaway
- the recommendation buried late
- dense slides

Source: https://www.autopresent.ing/blog/consulting-slide-deck/

**Partner-review checklist [derived from all the above]**
1. **Question fit:** does the governing thought answer the SMART question and meet the success criteria and constraints?
2. **Elevator:** can the answer be said in 30 seconds?
3. **Titles only:** do the titles alone tell the full story? Is each one an assertion?
4. **Pyramid:** does each level answer the "why/how?" raised above it? Is each group MECE, same-kind and 3–5 items?
5. **Evidence:** is every claim traced to a source? Are key numbers triangulated or flagged single-source? Do the numbers pass back-of-envelope checks?
6. **Dissent:**
   - What is the strongest counter-hypothesis?
   - Was it tested?
   - What evidence would kill the recommendation?
   - What must be true for it to work, and which of those conditions is weakest?
7. **So what:** is every finding carried up to an implication and an action with an owner and timing?
8. **Pre-mortem:** "It is 18 months later and this failed. Why?" Are those risks addressed?

Verdicts:
- **ship**
- **revise**, with specific red-ink notes for each slide or section
- **re-frame**, which sends the work back to step 1 (the accordion loop)

---

## Quick source list
- Conn & McLean, *Bulletproof Problem Solving* (Wiley, 2018). McKinsey podcast: https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/how-to-master-the-seven-step-problem-solving-process
- Conn & McLean, "Six problem-solving mindsets for very uncertain times", McKinsey Quarterly 2020: https://mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/six-problem-solving-mindsets-for-very-uncertain-times
- Minto, *The Pyramid Principle*: https://www.goodreads.com/book/show/33206.The_Minto_Pyramid_Principle
- Rasiel, *The McKinsey Way*: https://www.goodreads.com/book/show/206260.The_McKinsey_Way
- Crafting Cases issue trees: https://www.craftingcases.com/issue-tree-guide/
- StrategyU: https://strategyu.co/issue-tree/ · https://strategyu.co/pyramid-principle-partone/
- Slideworks: https://slideworks.io/resources/mckinsey-problem-solving-process
- Analyst Academy: https://www.theanalystacademy.com/strategy-hypothesis-driven-approach/
- Management Consulted market sizing: https://managementconsulted.com/market-sizing/
- Working with McKinsey blog (ghost decks, dot-dash): http://workingwithmckinsey.blogspot.com/
- Umbrex: https://umbrex.com/resources/mckinsey-problem-solving/
