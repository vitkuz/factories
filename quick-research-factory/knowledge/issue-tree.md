# How the issue tree file is shaped

The issue tree is the plan the whole research run follows. It is written once, before any
search, and every later step reads it. It is written for the analyst who will search and
for the reviewer who will check coverage.

## Sections, in this order

1. **Topic** — the topic as the person gave it, one line, unchanged.
2. **Governing question** — one sentence a reader could answer yes, no, or with a number.
   Say who the answer is for and by when it matters, if that is known.
3. **Hypothesis** — the one-sentence answer you would bet on today, before any search.
4. **Issue tree** — the sub-questions, numbered `1`, `2`, `3`, … in the order a reader
   should meet them. For each one:
   - **Sub-question** — one sentence, phrased as a question.
   - **Slug** — a kebab-case name of two to four words, used in the file names later
     (`market-size`, `cost-per-km`). Every slug in the tree is different.
   - **Hypothesis** — the one-sentence answer you would bet on for this branch.
   - **Evidence needed** — what facts would prove or disprove that hypothesis. Name the
     kind of source that holds them (an official statistic, a filing, a study, a price list).
   - **Search queries** — three to five, each on its own line, ready to paste into a search
     engine. Vary them: one plain, one with a year, one with a likely source name, one with
     the opposite claim, so the search finds disagreement too.
5. **MECE check** — two sentences: why no two sub-questions overlap, and why answering
   them all answers the governing question.
6. **Out of scope** — what a reader might expect but this run will not cover, one line each.

## Rules

- Exactly the number of sub-questions asked for. Not one more because the topic is big,
  not one fewer because the topic is small.
- A sub-question is answerable from public web sources. "What does the CEO privately
  think" is not a sub-question.
- Queries are in the language of the sources most likely to hold the answer, which may
  differ from the language of the report. Say which language each query is in when it is
  not the report's.
- Nothing in this file is an answer. Hypotheses are guesses and are labelled as such.
