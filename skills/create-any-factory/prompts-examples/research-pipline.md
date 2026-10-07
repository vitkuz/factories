/create-any-factory research-factory

Build a research pipeline that researches a topic using search queries in
several languages.

PARAMS
- topic         what to research. No useful default — ask if missing.
- languages     comma-separated languages to search in, e.g. "English, Polish".
  Default: "English".
- max_findings  how many findings to collect. Default: 8.

CONSTANTS
- format        markdown

STEPS

1. plan-research  (general-purpose)
   Turn {{topic}} into a research plan: 4-6 sub-questions, and for each one a
   search query in every language listed in {{languages}}.
   output: 1-plan-research/plan.md
   DONE -> research

2. research  (general-purpose)
   Follow the plan. Run the queries in {{languages}} and record up to
   {{max_findings}} findings, one file per sub-question. Every claim carries a
   source URL, and each finding notes the language of its source.
   Write each file in {{format}}.
   input:  1-plan-research/plan.md
   output: 2-research/*.research.md
   DONE -> review

3. review  (general-purpose)
   Check the findings against the plan: every sub-question answered, every
   language in {{languages}} actually used, every claim sourced.
   input:  2-research/*.research.md
   output: 3-review/review.md
   APPROVE -> END
   REVISE  -> research, max 2, onMax END

ALSO
- Give each step a short system prompt (`system`): research lead / researcher who never
  guesses / strict reviewer who checks coverage, not style.
- Write knowledge stubs for all three steps.
- Validate until it reports zero errors.