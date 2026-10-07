# Testing hypotheses

Judge every hypothesis against the evidence base. Look for the evidence that would reject a
hypothesis **before** you count the evidence for it. A hypothesis is supported only when it
survived its kill test, or when no credible contradicting evidence exists after a real search.

## Procedure, per hypothesis

1. Find every record that lists it in `supports` or `contradicts`. Also scan the records that
   do not list it but bear on it (analysts miss links). Add those as `linkedByTester`.
2. Read the **kill test** result first. Did the counter-evidence lens run it? What did it find?
3. Weigh both sides by tier, independence, recency and fit of scope (geography, population,
   year). Five T3 records from one vendor are one weak voice.
4. Assign exactly one status:
   - `SUPPORTED`: the kill test failed to kill it, and at least two independent T1/T2 records
     support it.
   - `PARTIALLY_SUPPORTED`: it holds for part of the scope (some segments, some years), or with
     a smaller effect than claimed. Say which part.
   - `REJECTED`: the kill test succeeded, or strong contradicting evidence outweighs the support.
   - `INSUFFICIENT_EVIDENCE`: neither side has enough. Say what is missing.
5. Give **confidence** (0–1) and the reasoning in two to four sentences. Separate the facts
   (with ids) from your inference.
6. Record the **limitations** (scope mismatch, stale data, single-source numbers).

Then judge the **competing hypotheses**: which one the evidence favours, and why.

## Shape — `hypothesis-results.yaml`

```yaml
hypothesisResults:
  H1:
    statement: "<copied>"
    status: SUPPORTED
    supportingEvidence: [EV-001, EV-008]
    contradictoryEvidence: [EV-014]
    linkedByTester: []
    killTest: { ran: true, result: "<what it found>", evidence: [EV-021] }
    confidence: 0.81
    reasoning: "<2-4 sentences; FACT with ids, then INFERENCE>"
    limitations: ["<...>"]
competingHypotheses:
  favoured: C1|dayOne
  reasoning: "<...>"
dayOneAnswer: held|changed|reversed
surprises: ["<patterns no hypothesis covers>"]
researchGaps:            # only when more research is requested; else []
  - hypothesis: H4
    missingFact: "<exactly what fact is needed>"
    lens: market|customer|competition|environment|counter-evidence
    suggestedQueries: ["<...>"]
```

## Rules

- A rejected hypothesis is a result, not a failure. Keep it.
- Never upgrade a status because the story needs it.
- Ask for more research only for a **priority-1** hypothesis that is insufficient, and only when
  the missing fact is plausibly public. Otherwise record the gap and move on.
