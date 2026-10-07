# Anatomy of public McKinsey / MGI reports (2023-2026)

Method note: mckinsey.com returns 403 (Akamai) to WebFetch, curl and headless browsers. Every source below was read from Wayback Machine snapshots of the original URL (HTML pages plus full PDFs, text pulled with pypdf). Quotes are verbatim. Some PDF ligatures ("fi", "ff") were broken by the extraction and have been fixed here.

## Sources opened

| # | Report | Type | Date | PDF pages | Short version? |
|---|---|---|---|---|---|
| A | The next big arenas of competition. Web https://www.mckinsey.com/mgi/our-research/the-next-big-arenas-of-competition. PDF `.../the-next-big-arenas-of-competition_final.pdf` | MGI full report | Oct 2024 | 213 | Yes: a separate 17-page "Executive summary" PDF (`...-executive-summary-final.pdf`), and the web page carries only At a glance + intro + PDF link |
| B | The economic potential of generative AI: The next productivity frontier. https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier | McKinsey Digital/MGI report | Jun 2023 | 68 | The web page is a long-form version of the report with "Key insights" |
| C | A new future of work: The race to deploy AI and raise skills in Europe and beyond. https://www.mckinsey.com/mgi/our-research/a-new-future-of-work-the-race-to-deploy-ai-and-raise-skills-in-europe-and-beyond | MGI report | May 2024 | (archived PDF corrupt, not counted) | The web page is an article-length condensation plus the PDF |
| D | Agents, robots, and us: Skill partnerships in the age of AI. PDF https://www.mckinsey.com/~/media/mckinsey/mckinsey%20global%20institute/our%20research/agents%20robots%20and%20us%20skill%20partnerships%20in%20the%20age%20of%20ai/agents-robots-and-us-skill-partnerships-in-the-age-of-ai.pdf | MGI report | Nov 2025 | 60 | none found |
| E | Geopolitics and the geometry of global trade: 2026 update. https://www.mckinsey.com/mgi/our-research/geopolitics-and-the-geometry-of-global-trade-2026-update (PDF at `.../geopolitics-and-the-geometry-of-global-trade-2026-update.pdf`) | MGI report (annual update) | Mar 2026 | 59 | none found |
| F | The state of AI in 2026: On the road to ROI. https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai | Survey article | 2026 | web only, about 2,950 words | n/a |
| G | Seizing the agentic AI advantage. https://www.mckinsey.com/capabilities/quantumblack/our-insights/seizing-the-agentic-ai-advantage | Long insight/report | 2025 | web, about 7,800 words | n/a |
| H | Superagency in the workplace. https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/superagency-in-the-workplace-empowering-people-to-unlock-ais-full-potential-at-work | Survey report | Jan 2025 | web | n/a |
| I | Unlocking the next frontier of personalized marketing (McKinsey Quarterly). https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/unlocking-the-next-frontier-of-personalized-marketing | Quarterly article | Jan 2025 | web, about 3,300 words | n/a |

## 1. Full MGI report: section structure (what the PDFs actually contain)

**Front matter, the same in every MGI PDF.** Cover (title + one-sentence dek) → copyright page → "McKinsey Global Institute" boilerplate ("Our mission is to provide a fact base to aid decision making...", five research themes, "None of our work is commissioned or funded by any business, government, or other institution", list of MGI directors and partners) → Contents.

**A: Arenas (2024), the classic long form:**
```
At a glance 4 | Introduction 6 | Executive summary 8
Chapter one. The arenas of today 17
Chapter two. The arena-creation potion 37
Chapter three. The arenas of tomorrow 55
Arenas of tomorrow compendium 83  (18 numbered mini-profiles, 4-8 pp each)
Acknowledgments 191 | Endnotes 192 | Technical appendix 200
```
The PDF runs 213 pages. It has a persistent side-nav on every page (chapter tabs), chapter openers ("CHAPTER THREE" plus a big pull-stat: "The revenue of arenas could represent a growing share of global GDP: from 4 percent in 2022 to 10 to 16 percent by 2040."), and named sidebars ("Industry dynamism measured by share shifts"; "How we defined the arenas of the future"). Exhibits are numbered E1... in the executive summary, 1...N in the chapters and A1... in the appendix.

**B: Gen AI (2023):**
```
Key insights 3 | Chapter 1: Generative AI as a technology catalyst 4 | Glossary 6
Chapter 2: Generative AI use cases across functions and industries 8
Spotlight: Retail and consumer packaged goods 27 | Spotlight: Banking 28 | Spotlight: Pharmaceuticals and medical products 30
Chapter 3: The generative AI future of work: Impacts on work activities, economic growth, and productivity 32
Chapter 4: Considerations for businesses and society 48 | Appendix 53
```
The PDF runs 68 pages with 19 exhibits and numbered boxes ("Box 5: Using generative AI responsibly"). "Key insights" replaces At a glance.

**D: Agents, robots, and us (2025), the newer lean form with no executive summary:**
```
At a glance 3 | Introduction 4
CHAPTER 1 The workforce of the future will be a partnership of people, agents, and robots 7
CHAPTER 2 Human skills will evolve, not disappear, as people work closely with AI 21
CHAPTER 3 Entire workflows can be reimagined around people, agents, and robots 35
CHAPTER 4 Leadership is crucial as agents and robots reshape work and the economy 52
Glossary of terms 55 | Acknowledgments 56 | Endnotes 57
```
It has 24 exhibits, several of them running over two pages as "Exhibit 3 (continued)".

**E: Trade 2026 update:** At a glance 3 → Introduction (on p.4, with no heading in the TOC) → CHAPTER 1 "The new world of global trade" → CH 2 "United States: AI and tariffs reshape trade" → CH 3 "China: Finding new export markets" → CH 4 "The EU: Searching for growth amid a US–China squeeze" → CH 5 "Emerging economies: Finding opportunity across the geopolitical spectrum" → Acknowledgments → Endnotes. It runs 59 pages with 29 exhibits.

**Patterns**
- Always present: At a glance (or Key insights), Introduction, 3-5 chapters, Acknowledgments, Endnotes.
- Only in long reports (about 100+ pages): an executive summary with its own E-numbered exhibits and a separate executive-summary PDF.
- Methodology appears as a "Technical appendix" or "Appendix" at the back, or as an "Our methodology" sidebar in shorter pieces (C web).
- Glossary: in B and D.
- The Acknowledgments always close with the independence statement: "As with all MGI research, this work is independent and has not been commissioned or sponsored in any way by any business, government, or other institution... Any errors are our own." (A)
- The introduction states the scope and gives a roadmap by chapter: "Chapter 1 identifies... In chapter 2, we examine... In chapter 3, we describe..." (A p.6). It also names the audience: "relevant for entrepreneurs and incumbent companies..., investors..., people seeking jobs..., and policy makers" (A).
- I did not see an "In brief" section in these 2023-26 reports. The equivalent is "At a glance" (MGI), "Key insights" (B) or "Key takeaways" (F).

## 2. "At a glance" conventions

- **Always 5 bullets** in A, C, D and E; B's "Key insights" has 7. They are set with em-dash markers (" — ") on one page.
- **Each bullet is 2-4 sentences (about 40-90 words).** The first sentence is the claim; the following sentences give the number and the mechanism or contrast.
- **Almost every bullet carries a number**, usually a range or a comparison. There is typically one "framing/definition" bullet with no number (A bullet 1).
- **In the web version the first sentence is bold** (C, F, B). The PDF shows it in bold as well.
- Verbatim examples:
  - A: "We have identified 18 potential arenas of the future that could reshape the global economy, generating $29 trillion to $48 trillion in revenues by 2040. ... Their collective share of global GDP could increase from 4 percent to 10 to 16 percent by 2040."
  - A: "Twelve arenas of today showed outsize growth and dynamism from 2005 to 2020. ... By contrast, non-arenas had only a 4 percent revenue CAGR and a 6 percent market cap CAGR over the same period."
  - D: "Work in the future will be a partnership between people, agents, and robots—all powered by AI. Today's technologies could theoretically automate more than half of current US work hours. This reflects how profoundly work may change, but it is not a forecast of job losses."
  - D: "Demand for AI fluency—the ability to use and manage AI tools—has grown sevenfold in two years, faster than for any other skill in US job postings."
  - D (last bullet, conditional value): "By 2030, about $2.9 trillion of economic value could be unlocked in the United States—if organizations prepare their people and redesign workflows..."
  - E: "AI-related trade emerged as the most substantial engine of growth. Exports of semiconductors and data center equipment accounted for one-third of global trade growth..."
  - C: "By 2030, Europe could require up to 12 million occupational transitions, double the prepandemic pace."
- **Arc of the bullets:** a definition or headline finding → quantified findings → mechanism → an implication or call to action as the last bullet (E: "Companies need long-term thinking coupled with agility."; C: "Choices made today could revive productivity growth...").

## 3. Executive summary conventions (A, the 17-page stand-alone)

- It opens with a restated definition and a reference to the first exhibit: "...as measured by the 'shuffle rate,' a metric of company market share movements (Exhibit E1)."
- **Thematic subheads that are topic labels** ("The arenas of today", "The origins of arenas"), each followed by a lead-in sentence and **bulleted lists whose items start with a bold full-sentence claim**, then 3-5 supporting sentences packed with numbers:
  - "Today's arenas stand out from other industries in six ways." followed by " — **Arenas captured an increasing share of economic profit.** In 2005, arenas generated $53 billion, or 9 percent of total global economic profit..." / " — **Arenas enabled new entrants to grow.**" / " — **Arenas spawned giants.**" / " — **Arenas were more global.**"
- **Pull-stat callouts** in the margin: "In 2005, arenas generated less than 10 percent of total global economic profit. By 2019, they accounted for half of the total."
- Exhibits in the executive summary are numbered E1, E2... and repeat the key chapter exhibits.
- The web versions of B and C follow the same idea: each Key insight paragraph opens with a **bold lead sentence**, for example B: "**Generative AI's impact on productivity could add trillions of dollars in value to the global economy.** Our latest research estimates that generative AI could add the equivalent of $2.6 trillion to $4.4 trillion annually across the 63 use cases we analyzed—by comparison, the United Kingdom's entire GDP in 2021 was $3.1 trillion."
- **The analogy/benchmark device:** a big number is set against something familiar (UK GDP, "tripled their global GDP share").

## 4. Exhibit conventions

**Layout (PDF, top to bottom):** `Exhibit N` → **headline = one full-sentence takeaway, often with a number** → subtitle = what is plotted + time + unit (", %", ", $ billion", ", 2024–25 (annualized), %") → chart (legend, direct labels) → footnotes (superscript ¹ ²) → `Note:` → `Source:` → the "McKinsey & Company" wordmark.

**Headline examples (verbatim):**
- "The 18 potential arenas of tomorrow could generate $29 trillion to $48 trillion in revenues and $2 trillion to $6 trillion in profits." (A Ex.14). Subtitle: "18 potential arenas of tomorrow, by 2040 revenue estimate, $ billion"
- "Arenas' share of economic profit grew from 9 percent in 2005 to 49 percent in 2019." (A). Subtitle: "Economic profit, $ billion"
- "Investments by big tech players escalated 20-fold from 2005 to 2020." (A). Subtitle: "Select companies' spending on capital and R&D, $ billion"
- "Most of arenas' total market cap is held by 'giant companies.'" (A)
- "The advent of generative AI has pulled forward the potential for technical automation." (B Ex.7). Subtitle: "Technical automation potentials by scenario, %"
- "The midpoint scenario at which automation adoption could reach 50 percent of time spent on current work activities has accelerated by a decade." (B Ex.8)
- "Generative AI could have the biggest impact on activities in high-wage jobs; previously, automation's impact was highest in lower-middle-income quintiles." (B Ex.13). Subtitle: "Automation adoption per wage quintile, % in 2030, midpoint scenario"
- "Two-thirds of US work hours require only nonphysical capabilities." (D). Subtitle: "Share of work hours, %"
- "Digital and information skills are expected to experience the most change by 2030, while assisting and caring skills see the least." (D)
- "Trade is growing but traveling shorter geopolitical distances." / "China's exports surged to power manufacturing globally." / "ASEAN trade connected the world and grew faster than EU trade." (E)
- Web articles use the same headline as the image alt text, for example F: "High performers are scaling a wider range of AI tools than others are."; H: "Employees are three times more likely to be using gen AI today than their leaders expect."

**Source lines (verbatim formats):** third-party sources are separated by semicolons and **"McKinsey Global Institute analysis" always comes last**:
- "Source: McKinsey Value Intelligence; McKinsey Global Institute analysis"
- "Source: Lightcast; US Bureau of Labor Statistics (2024); McKinsey Global Institute analysis"
- "Source: Conference Board Total Economy Database; Oxford Economics; McKinsey Global Institute analysis"
- "Source: Gartner (for full information, see endnote 17)"
- Non-MGI pieces end with "McKinsey analysis" instead ("Source: US Bureau of Labor Statistics O*NET; McKinsey analysis").
- Survey pieces use "Source: McKinsey Global Survey on the state of AI, [dates], n = ...".

**Note lines:**
- "Note: Figures may not sum to 100%, because of rounding." (A, five times)
- "Note: Figures may not sum, because of rounding." (B)
- Scope and definition notes: "Note: Projections show middle scenario." (A)
- "Note: Technical automation potential shown is in 2024, in the late scenario of expert estimates. The early scenario of technical automation potential in the US is 65% of current work hours." (D)
- Footnotes define scenarios: "¹Early scenario: aggressive scenario for all key model parameters (technical automation potential, integration timelines, economic feasibility, and technology diffusion rates). ²Late scenario: parameters are set for the later adoption potential." (B Ex.9)

**Chart types seen:**
- horizontal bar rankings
- stacked 100% bars (distribution of hours, skills, market cap by company size)
- bubble/scatter (A: "shuffle rate" against growth share, circle size = market cap)
- waterfall/decomposition (E: "US and China (mainland) trade change decomposition")
- range tables with "low–high (CAGR)" cells (A Ex.14)
- line charts of scenario paths (B Ex.8: "Updated early scenario / Updated late scenario / 2017 early scenario")
- heatmaps (B Ex.4: use cases × industries)
- illustrated process flows (D, G case studies)
- occupation-archetype matrices

Exhibits are dense: 19-48 per report, roughly one every 2-4 pages.

## 5. How uncertainty is expressed

- **Ranges, never point estimates**, for forward numbers: "$2.6 trillion to $4.4 trillion annually"; "$29 trillion to $48 trillion"; "0.1 to 0.6 percent annually through 2040"; "between 2030 and 2060, with a midpoint in 2045".
- **Named scenarios:** early / midpoint / late adoption (B, C, D); "lower range of scenarios" / "higher range of scenarios" (A); "slow adoption" vs "accelerated technology adoption with proactive worker redeployment" (C: "up to 3 percent" against "0.3 percent"). Definition from B's glossary: "Early and late scenarios are the extreme scenarios of our work-automation model... The reality is likely to fall somewhere between the two."
- **Modal verbs and hedges:** "could" (the dominant verb in At a glance), "up to", "as much as", "about", "nearly", "roughly", "in theory". Headline outputs are framed as potential, not forecast: "This estimate reflects the technical potential for change in what people do, not a forecast of job losses... adoption may take decades." (D)
- **Conditional value:** "if organizations prepare their people..." (D); "if labor hours can be redeployed effectively" (B Ex.15 headline); "depending on the rate of technology adoption and redeployment of worker time" (B).
- **Explicit humility and "what you need to believe":** "To be sure, looking into the future is always speculative, and we recognize the possibility—indeed, the likelihood—that we may be getting some things wrong. For that reason, we have made transparent our assumptions, or what you need to believe about each candidate arena to match our scenarios." (A intro). The compendium lists "swing factors that could alter the outcomes."
- **Time-stamped caveats:** "Developments remain in flux... in February 2026 the US Supreme Court struck down the legal basis for many of the tariffs..." (E intro).
- **Technical appendix style (A):** subheads such as "Data set" describe the population and filters as bullets ("Data quality...", "Parent companies only: No double counting of subsidiaries.", "Minimum market cap: $3.5 billion in 2005 or $5 billion in 2020."), give the final N ("The final count of data points was 3,135"), explain classification choices, give a **worked hypothetical** ("Theta Company has operations in both consumer electronics and cloud services..."), define formulas (the shuffle rate), and point to appendix exhibits A2/A3. B's appendix is set out as "I. Scope of the investment landscape / II. How we sized the use case value potential" with sections for "Overall objective" and "Summary of our approach", data sources (PitchBook, Stanford AI Index) and a definitions table.
- **Survey methods box (F):** "The online survey was in the field from May 4 to June 8, 2026, and garnered responses from 1,719 participants in 97 nations... the data are weighted by the contribution of each respondent's nation to global GDP."

## 6. Tone and language

- **Chapter titles:** older reports use topic labels (A: "The arenas of today"; B: "Considerations for businesses and society"). Newer ones (2024-26) use **full-sentence claims**: D "Human skills will evolve, not disappear, as people work closely with AI"; C web H2s "Up to 30 percent of hours worked could be automated by 2030, boosted by gen AI, leading to millions of required occupational transitions" and "Businesses will need a major skills upgrade"; F H2 "Previous expectations of AI-driven workforce reductions were overstated, but a larger share expects declines going forward". **Numbers in headings** are common in 2024-26.
- **Coined concepts and metrics** carry a report: "arena-creation potion", "shuffle rate", "Skill Change Index", "gen AI paradox", "agentic AI mesh", "factory to the factories". Each is defined at first use, set in quotes, and used as a through-line.
- **Plain, confident, third-person-plural voice** ("We find", "Our research suggests", "We estimate"). Opening hooks are vivid: "In 2005, there was no iPhone or App Store..." (A ch.1); "we need to take a time machine" (A ch.2).
- **Sidebars and case examples:**
  - "Spotlight" sections (B)
  - numbered "Box" sidebars (B)
  - "Case study 1: How a bank used hybrid 'digital factories' for legacy app modernization", with a bold lead "The agentic approach:" (G)
  - sidebar case "How one retailer unlocked growth by launching targeted offers" (I)
  - Results in the cases are quantified ("a boost of about 3 percent in annualized margins").
- **Implications sections:**
  - D ch.4 has "Key questions for business leaders", with 6 question-form H3s such as "Are you reimagining your business for future value?", "Are you equipping your managers to lead teams of people, agents, and robots?", and "Key questions for institutions" such as "How can education and training keep pace?"
  - B ch.4 lists critical questions grouped by stakeholder ("Companies and business leaders", then policy makers and society).
  - C web has "Four priorities for companies", each a bold imperative ("Understand the potential.", "Plan a strategic workforce shift.", "Prioritize people development.", "Pursue the executive-education journey on automation technologies.").
- **Closing call to action** is short and forward-looking: "Companies need long-term thinking coupled with agility." (E); "The outcomes for firms, workers, and communities will ultimately depend on how organizations and institutions work together..." (D).
- US spelling; "percent" spelled out in body text (the "%" sign appears only in exhibits); serial comma; em-dashes without spaces; en-dash ranges in charts ("2005–20").

## 7. Article-length (Quarterly/insights) vs full report

| | Full MGI report (A, B, D, E) | Web report page (B, C) | Insight/survey article (F, G, H) | Quarterly article (I) |
|---|---|---|---|---|
| Length | 59-213 pp PDF | 5-10k words | 3-8k words | about 3.3k words |
| Summary block | At a glance (5 bullets) / Key insights (7) | At a glance (5 bold-lead paragraphs) | "Key takeaways" (7 bullets, F), "At a glance" (G) | none; a bold standfirst paragraph |
| Headings | Chapters, 4-5 | Full-sentence H2s | Full-sentence H2s | Short topic H2s ("The promise of targeted promotions") |
| Exhibits | 19-48, "Exhibit N" + source + notes | Fewer (about 5-10) | 6-12 ("Exhibit 1..."), or a lone "exhibit" | 1-2 plus a "table" |
| Method | Technical appendix | "Our methodology" box | "About the research" / "About the survey" / "Methodology" | none |
| Cases | Spotlights, boxes | Boxes | Numbered case studies | 1-2 sidebars ("How a European telecom used gen AI...") |
| Close | Leader/institution questions, acknowledgments, endnotes | "Four priorities for companies" + a closing paragraph | High-performer lessons, "Previous research" links | a short concluding paragraph |
| Byline | Authors + editor + data-viz credit on the cover or exec summary | "About the authors" with titles and offices | Same | "This article is a collaborative effort by X and Y, with A, B, and C, representing views from McKinsey's [Practice]." |

Articles keep the numbered-exhibit habit, the takeaway headlines, the bold lead sentences, the "could"/range hedging and the endnote citations to earlier McKinsey work (for example, 1 "The state of AI: How organizations are rewiring to capture value," McKinsey, March 12, 2025).

## Checklist for an agent imitating the style

1. Title with a colon and a subtitle ("X: The next productivity frontier"), plus a one-sentence dek containing the headline number.
2. At a glance: 5 bullets of 2-4 sentences each. The bold first sentence is the claim. At least 4 of the bullets carry numbers or ranges, and the last one is an implication.
3. Introduction: context, scope and coverage ("covers more than 90 percent of global trade"), a chapter roadmap and the audience.
4. Executive summary (only for long reports): topic subheads and bold-lead bullets, with E-numbered exhibits.
5. 3-5 chapters with full-sentence claim titles. Open each with a hook and pull-stat, and use sidebars and case examples.
6. Exhibits: "Exhibit N", a takeaway headline, a subtitle with the unit, a Note (rounding/scenario), and "Source: ...; McKinsey Global Institute analysis".
7. Forward numbers are given as ranges or scenarios (early/midpoint/late) and framed as "potential, not a forecast". Conditionals come with "if".
8. A closing chapter with "Key questions for business leaders" and for institutions or policy makers, written as questions or imperatives.
9. Back matter: Glossary, Technical appendix (data set, filters, N, formulas, worked example), Acknowledgments with the independence statement, Endnotes.
