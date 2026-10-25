# Report explainer

## Goal

Turn the final research report into an engaging, plain-language TL;DR that a busy reader can act on.
The reader is a software developer building AI-driven systems, and an IT outsourcing/services company.
Keep the report's actual conclusions and uncertainty. Make it easier to read, never more certain.
Save one Markdown file: `10-explain-report/tldr.md`.

## Source discipline (non-negotiable)

- `9-write-report/final-report.md` is the source of truth. Use `1-frame-problem/problem-frame.md` for context and scope.
- Preserve dates, denominators, caveats, and uncertainty. Never turn estimates, hypotheses, correlations, or scenarios into proven facts.
- Never fabricate citations, quotes, events, case studies, or numbers. If the report says evidence is weak, say so.
- Distinguish report-backed conclusions from your implications with phrases such as “The report finds…” versus “My interpretation…” or “For you, this could mean…”.
- Do not quietly correct or reconcile contradictions. Flag consequential contradictions or unresolved issues in the limitations section.
- Keep at most three memorable metrics, with what they actually measure and any material caveat.
- If the report does not support a claim, remove it or label it clearly as a hypothesis worth testing.

## Voice

- Write in the requested language. Use natural, vivid, direct prose, as if explaining something exciting to a knowledgeable friend.
- Prefer everyday vocabulary and short sentences. Introduce unavoidable technical concepts in one phrase.
- Sound intellectually curious, not promotional. No hype, exaggerated predictions, buzzword soup, or empty praise.
- Use concrete comparisons: “Before: buy an app per employee. After: buy completed tasks.”
- State the answer early. Every major section should answer “Why should I care?”
- No generic CEO jargon, gratuitous acronyms, academic framing, or long methodologies.

## Structure

Target 700–1,200 words for a long research report; shorter when the evidence is thin. Markdown headings and compact bullets are fine. One small comparison table is optional.

### 1. Title + one-sentence takeaway
A plain-language title, followed by **one bold sentence** capturing the most important change or tension.

### 2. Five to seven key discoveries
For each:
- **A memorable headline**, not a topic label.
- **What happened / what the report says** in 1–2 sentences.
- **Concrete example or analogy** clearly illustrative rather than evidence, when useful.
- **So what?** in 1 sentence.
Avoid describing each dossier. Reorder around importance to readers.

### 3. Winners, losers, and uncertain bets (only when relevant)
A short table with category, likely direction, and reason. Avoid categorical future claims: say “more exposed,” “more defensible,” “uncertain.”

### 4. What this means for a developer
Explain 3–4 practical implications for skills, product design, architecture, or career. Link each to a finding, not to general AI enthusiasm.

### 5. What this means for an outsourcing/services company
Explain the threat to the existing business model and 2–3 plausible new service opportunities. Clearly label these as extrapolations unless the report measured them.

### 6. Three numbers worth remembering
Choose at most three well-sourced, meaningful measures. Give the unit, the population or denominator, and the uncertainty when material. Skip numbers if the report has none worth repeating.

### 7. What the research does NOT prove
Name 2–4 critical gaps, fragile assumptions, or unresolved disagreements. Explain why each could change the conclusion.

### 8. What to do next
Give 2–4 concrete actions or experiments. Specify what to test and how success would be measured when source evidence allows.

### 9. Three sharper follow-up questions
Propose specific research questions that naturally deepen or challenge the original report. Favor falsifiable questions with economic or practical implications over generic “learn more” prompts.

### 10. Final one-sentence conclusion
Memorable but calibrated. Never stronger than the underlying evidence.

## Editing pass (perform silently)

1. **Truth check:** Can each factual statement be traced to the final report? Is uncertainty preserved?
2. **Reader check:** Does the opening give the gist immediately? Are implications addressed to the actual audience?
3. **Clarity check:** Can a developer with no background in strategy understand every paragraph without looking up terms?
4. **Energy check:** Replace sterile formulations with concrete consequences. Avoid theatrical claims.
5. **Brevity check:** Delete duplicative findings, long source catalogs, and low-value methodology.
6. **Distinction check:** Report conclusions, extrapolations, and hypothetical examples are not conflated.

## Example transformation

**Too dry:** “The per-seat monetization model faces structural compression as AI-enabled workflow substitution reduces the number of active end users.”

**Better:** “If an AI agent does the work of 20 employees, why would a company keep paying for 20 software seats? Vendors may have to charge for the work done, not just for the people logging in.”

**Necessary caveat:** “This is the economic pressure identified by the report—not proof that all per-seat pricing will disappear.”
