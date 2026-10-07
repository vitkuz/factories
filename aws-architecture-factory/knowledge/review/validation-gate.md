# Validation Gate

The gate decides whether the architecture may be accepted. It reads all reviewer outputs (pillar reviews, domain-lens reviews, red-team findings), merges them into one risk register, and returns one verdict. Verdict names below are the shared vocabulary of the gate.

## Blocking conditions
The architecture cannot pass while any of these remain unresolved:

| # | Condition | Resolved when |
|---|---|---|
| 1 | Critical security risk | Mitigation is in the architecture (not an accepted risk by the finder) |
| 2 | Critical reliability gap | Mitigation in the architecture, or owner-accepted with a driver-based rationale |
| 3 | Unbounded data-loss scenario | Durability or replay mechanism exists |
| 4 | Unbounded cost scenario | A cap, throttle, budget alarm or bounded retry exists |
| 5 | Contradictory component contracts | Producers and consumers agree on payload, ordering, delivery semantics and error behavior |
| 6 | Missing authentication boundary | Every entry point has a defined authentication step |
| 7 | Undefined ownership of persistent state | Each store has one owning component |
| 8 | Undefined failure/retry behavior | Each asynchronous or remote call has retry, timeout and quarantine behavior |
| 9 | Architecture driver not addressed | Each driver maps to a decision or an explicit, owner-approved gap |

## Verdicts

| Verdict | Applies when |
|---|---|
| `PASS` | No blocking condition is open. No high risk remains unmitigated. Any remaining items are minor or improvements. |
| `PASS_WITH_ACCEPTED_RISKS` | No blocking condition is open, and at least one high risk is explicitly accepted with a named owner and rationale. Accepted risks are listed in the gate file. |
| `REVISE` | At least one blocking condition or high risk can be fixed by changing the architecture, and the drivers and assumptions still look sound. The gate lists the required changes. |
| `BLOCKED` | A core driver or assumption is wrong, missing or contradictory, or a decision needs a human (for example conflicting drivers, an unacceptable risk that only the business can accept). Changing components alone cannot fix it. |

Decision order: check for `BLOCKED` first, then `REVISE`, then `PASS_WITH_ACCEPTED_RISKS`, else `PASS`.

## Risk register shape
One merged entry per distinct risk.

```json
{
  "id": "R-001",
  "title": "No DLQ on the ingest queue",
  "sourceReviewers": ["RELIABILITY", "RED_TEAM"],
  "severity": "CRITICAL",
  "likelihood": "HIGH",
  "impact": "HIGH",
  "mitigation": "Add a DLQ with bounded receive count and a depth alarm.",
  "status": "open",
  "owner": "Platform team"
}
```

| Field | Values |
|---|---|
| `severity` | `CRITICAL`, `MAJOR`, `MINOR` (see `risk-severity.md`) |
| `likelihood`, `impact` | `LOW`, `MEDIUM`, `HIGH` |
| `status` | `open`, `mitigated`, `accepted` |
| `owner` | Role or person responsible for the mitigation or acceptance |

## Deduplicate across reviewers
1. Compare findings by meaning: same component plus same failure scenario is one risk, even with different wording or pillar.
2. Keep the highest severity among duplicates. List every reviewer in `sourceReviewers`.
3. Merge mitigations into one that satisfies all sources.
4. Do not drop a finding because another reviewer disagreed on severity. Record the disagreement in the title or mitigation text and keep the higher rating.

## Gate file shape

```json
{
  "verdict": "REVISE",
  "blockers": [
    { "condition": "Undefined failure/retry behavior", "riskIds": ["R-001"], "detail": "Ingest queue has no retry limit or quarantine." }
  ],
  "requiredChanges": [
    { "riskId": "R-001", "change": "Add DLQ with bounded retries and an alarm.", "component": "SQS ingest queue" }
  ],
  "acceptedRisks": [
    { "riskId": "R-004", "owner": "Product owner", "rationale": "24h RTO meets driver." }
  ]
}
```

- `blockers` is empty for `PASS` and `PASS_WITH_ACCEPTED_RISKS`.
- `requiredChanges` is non-empty for `REVISE`; for `BLOCKED` it states the human decision needed instead.
- `acceptedRisks` is non-empty only for `PASS_WITH_ACCEPTED_RISKS` (and may appear on others).
- Every high risk appears either in `requiredChanges` or in `acceptedRisks`.
