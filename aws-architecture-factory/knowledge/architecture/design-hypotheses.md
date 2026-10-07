# Design Hypotheses

Each material concern in the issue tree produces one or more falsifiable design hypotheses.
A hypothesis is a testable claim about the best design choice, not a preference.

## Hypothesis shape

```json
{
  "id": "H-COMPUTE-01",
  "issue": "Processing Model",
  "statement": "Lambda is preferable to container workers for image processing.",
  "rationale": [
    "bursty traffic",
    "short-lived stateless processing",
    "low operations preference"
  ],
  "falsificationQuestions": [
    "Can individual jobs exceed Lambda execution limits?",
    "Does sustained utilization make ECS materially cheaper?",
    "Does the native dependency footprint make Lambda packaging impractical?"
  ],
  "impact": 0.9,
  "uncertainty": 0.7,
  "irreversibility": 0.4,
  "blastRadius": 0.6,
  "researchCost": 0.3
}
```

| Field | Rule |
|---|---|
| `id` | Unique, format `H-<AREA>-NN`. |
| `issue` | The issue tree concern it belongs to. |
| `statement` | One falsifiable sentence naming the choice and the alternative. |
| `rationale` | Reasons tied to drivers. At least one. |
| `falsificationQuestions` | At least two concrete questions whose answers could prove it wrong. Each should be answerable from AWS documentation, pricing or quotas. |
| `impact` | 0-1. How much the architecture changes if the hypothesis is wrong. |
| `uncertainty` | 0-1. How unsure we are that it is true. |
| `irreversibility` | 0-1. Cost of reversing the choice later (see the reversible decisions file). |
| `blastRadius` | 0-1. Share of the system affected if the choice fails. |
| `researchCost` | 0-1. Effort to settle it. Low means one documentation page. |

## Priority

Priority is computed by deterministic code, not by the model:

```text
priority = impact x uncertainty x irreversibility x blastRadius / max(researchCost, 0.1)
```

The floor of 0.1 stops very cheap checks from dominating.
Example: 0.9 x 0.7 x 0.4 x 0.6 / 0.3 = 0.504.

## Cut-off rule

- Rank hypotheses by priority, highest first.
- Research every hypothesis with priority of 0.15 or more.
- Always research at least 3 and at most 8. If fewer than 3 reach 0.15, take the top 3. If more than 8 do, take the top 8 and record the rest as unresearched with their scores.
- Record the unresearched ones as accepted uncertainty, not as silently dropped.

## Evidence over preference

"Lambda is best here" is invalid. A hypothesis must state why and what would break it:

```text
Hypothesis: Lambda is preferable to ECS Fargate for this workload.
Because: workload is bursty; jobs are short-lived; execution is stateless; operational overhead is a major constraint.
Falsifiers: execution duration exceeds practical limits; sustained utilization makes containers cheaper;
cold-start sensitivity violates latency targets; required runtime or networking constraints make Lambda unsuitable.
```

## Writing guidance

1. One to three hypotheses per concern. More than that means the concern is too broad.
2. Write hypotheses for the choice, not for facts. "SQS supports X" is a fact to look up, not a hypothesis.
3. Score honestly. Do not inflate uncertainty to get research; do not set it to 0 to avoid it.
4. When an assumption in the drivers file is HIGH impact and LOW confidence, at least one hypothesis must test it or its consequences.
5. A hypothesis already decided by a hard driver (for example a mandated region) still gets recorded, with low uncertainty.
