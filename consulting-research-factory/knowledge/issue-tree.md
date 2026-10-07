# How the issue tree and hypotheses are shaped

The issue tree breaks the governing question into sub-questions; the hypotheses turn each branch
into a claim that evidence can kill. It is written for the planner who will assign analyses and
for the reviewer who will check coverage.

## Choose the tree type first

- **Diagnostic (why) tree** when the cause is unknown: "Why is margin 7 points below peers?"
- **Solution (how) tree** when the goal is known: "How could we reach $20M ARR?"
- **Decision tree** for yes/no or which-option questions: "Should we enter?" splits into the
  conditions that must all hold (market attractive? can we win? can we afford it?).
- Never mix why and how in one tree. Know the why before the how.

Construction techniques: a math identity (profit = price × volume − cost; market = users ×
adoption × spend), a proven framework laid out MECE (market / competition / capabilities /
economics), or conditional logic (what would have to be true for the answer to be yes).
Prefer splits that separate things that behave differently; an alphabetical split is not
insight.

## Sections, in this order

1. **Governing question** — copied from the problem statement.
2. **Tree type** — diagnostic, solution or decision, and the construction technique, one line.
3. **The tree** — drawn as an indented text tree, three levels at most: the governing question,
   three to five branches, two to four sub-branches each.
4. **Hypotheses** — one per branch (and per sub-branch that matters), numbered `H1`, `H2`…
   For each:
   - **Statement** — declarative, testable, with a number where possible. "Agent observability
     spend will exceed $1B globally by 2028", not "observability matters".
   - **Branch** — which branch it answers.
   - **What would have to be true** — two to four conditions that must hold for it to stand.
   - **Kill test** — the single analysis or fact that would reject it, and the threshold ("if
     fewer than 20% of enterprises run agents in production, H2 falls").
   - **Evidence needed** — the kind of source that holds it (filing, official statistic,
     survey with a stated sample, pricing page, funding data).
   - **Impact** — high / medium / low: how much the answer changes if it is wrong.
   - **Priority** — 1, 2 or 3, from impact and how cheaply it can be tested.
5. **Competing hypotheses** — for the governing question, two or three rival answers, each one
   sentence, so research can discriminate between them rather than confirm one.
6. **Pruned** — branches dropped as low-impact or out of the decision maker's control, one line
   each with the reason. Dropping is a decision and is recorded.
7. **MECE check** — the tests below, one line each, passed or fixed.

## The tree tests

- **ME test:** could one fact or dollar sit in two branches? Redefine the branches.
- **CE test:** do the children add up to the parent? Name the "other" bucket; if it is large,
  the split is wrong.
- **Same-logic test:** read each level aloud as "X because A, B, C" or "X by doing A, B, C".
- **Level test:** siblings sit at the same level of abstraction.
- **Testability test:** every leaf names the analysis and data that would settle it.
- **So-what test:** "If I knew all the answers, would I know the answer to the governing
  question?" If not, a branch is missing.

## Rules

- Nothing here is an answer. Hypotheses are bets, labelled as such.
- Every hypothesis is answerable from public sources. "What does the CEO privately think" is not.
- Between six and twelve hypotheses in total. Fewer means the tree is shallow; more means it
  was not pruned.
