# The decision brief

The brief is the contract for the whole study, and every later step reads it. It is written
before any research. It turns a request, often a vague topic, into a decision and the questions
that must be answered to make it.

## Shape — `brief.yaml`

```yaml
request: "<the request exactly as given>"
inferred: [decision, audience]        # fields you inferred rather than read; [] if none
inferenceNote: "<why you inferred them; null if nothing was inferred>"
decision:
  statement: "Whether <actor> should <option A> or <option B / not> by <date>"
  decisionMaker: "<role, organisation type>"
  options: ["build and commercialise", "partner", "do not enter"]
problemStatement: "<one SMART question: Should/How can <actor> <measurable outcome> by <date>?>"
situation: ["<3-5 things the reader already agrees with>"]
complication: "<what changed and why it forces the decision now>"
audience: "<who reads the report and what they value>"
scope:
  inScope: []
  outOfScope: ["<what a reader might expect but will not get>"]
geography: "<as given, or narrowed and why>"
timeframe: "<as given, e.g. 2027-2030>"
constraints: ["public sources only", "<accuracy needed: order of magnitude / +-20%>", "<what must not be assumed>"]
successCriteria:
  quantitative: ["<e.g. >= $20M ARR within 3 years of launch>"]
  qualitative: ["<timing, risk appetite, capability fit>"]
  failureLooksLike: "<one line>"
keyQuestions: ["<5-8 questions the decision maker would ask in the first meeting; not yet MECE>"]
dayOneAnswer:
  statement: "<the answer you would bet on today; a hypothesis, labelled as one>"
  mostLikelyToOverturnIt: "<one line>"
```

## Rules

- **A question, not a topic.** If the request names no decision, pick the most plausible one,
  list `decision` in `inferred`, and say why in `inferenceNote`.
- **SMART:** specific, measurable, action-oriented, relevant, time-bound. A reader at the end
  must be able to say yes, no, or give a number.
- **Options are real alternatives**, including "do nothing" when it is one.
- **Scope is neither too narrow** (it presumes the answer) **nor too broad** (it boils the ocean).
- **No research and no frameworks here.** The situation holds background you believe to be true.
  It has no URLs yet.

## Example

Bad: "Research AI agents."
Good: "Should a 2,000-person software services company build and commercialise an enterprise AI
agent platform during 2027–2030, and can it reach $30M ARR by 2030?"
