# Candidate Architectures

Do not anchor on the first plausible design. Generate competing candidates, compare them, then select.

## How many and how different

- Produce 2 to 3 candidates. One is allowed only when a hard driver leaves a single viable design; say so explicitly.
- Candidates must differ materially in operating model, scaling model, cost structure, failure modes or complexity. Swapping one service for a near-equivalent is not a new candidate.
- Typical axes: serverless, container-based, hybrid.
- Candidates must use the researched evidence and the implications derived from it. Do not use limits or prices from memory.

Example set:

```text
A. API Gateway + Lambda + SQS + Lambda + S3 + DynamoDB
B. ALB + ECS Fargate + SQS + ECS workers + S3 + DynamoDB
C. API Gateway + Lambda ingestion + ECS workers
```

## Required fields per candidate

```json
{
  "id": "ARCH-A",
  "name": "Serverless",
  "components": [
    { "service": "Amazon SQS", "role": "Buffers upload jobs between ingestion and workers", "drivers": ["traffic.peak"] }
  ],
  "dataFlow": [],
  "strengths": [],
  "weaknesses": [],
  "assumptions": [],
  "risks": [],
  "estimatedOperationalComplexity": "",
  "estimatedCostShape": "",
  "bestFitConditions": [],
  "failureConditions": []
}
```

| Field | Rule |
|---|---|
| `components` | Each entry has `service`, `role` and `drivers`. No service without a role. |
| `dataFlow` | Ordered steps from entry to persistence, including the async and failure path. |
| `strengths`, `weaknesses` | Tied to drivers, not generic praise. |
| `assumptions` | Reference assumption text from the drivers file, plus any new one. |
| `risks` | Concrete, with the trigger. |
| `estimatedOperationalComplexity` | LOW / MEDIUM / HIGH with one phrase on why. |
| `estimatedCostShape` | What the cost scales with (requests, running capacity, data transfer), not a price. |
| `bestFitConditions` | When this candidate wins. |
| `failureConditions` | When this candidate becomes the wrong choice. |

## Traceability rules

1. Every AWS service in a candidate has an explicit role in `components`.
2. Every significant decision maps to at least one driver (by driver key) or one researched implication.
3. Every researched hypothesis is either reflected in at least one candidate or noted as not applicable.
4. Each candidate states state ownership: where persistent state lives and which component owns it.
5. Each async path states retry, duplicate handling and the dead-letter or quarantine path.
6. Do not hide a weakness. A candidate with no weaknesses is incomplete.

## Selection record

After comparison, record the choice:

```json
{
  "selectedArchitecture": "ARCH-C",
  "decision": "One sentence naming what is chosen and why.",
  "decisionDrivers": ["traffic.peak", "team.skills", "budget"],
  "rejectedAlternatives": [
    { "architecture": "ARCH-A", "reason": "Jobs may exceed practical execution limits." }
  ],
  "criticalAssumptions": ["Peak traffic is below 5k requests/second"],
  "confidence": "MEDIUM"
}
```

- `rejectedAlternatives` covers every candidate not selected, each with a driver-based reason.
- `criticalAssumptions` lists assumptions that, if false, would change the choice.
- `confidence` is HIGH, MEDIUM or LOW and reflects unresolved uncertainty: open HIGH-impact assumptions, unresearched hypotheses, thin evidence. It is not the model's self-assessment. If any HIGH-impact, LOW-confidence assumption is still open, confidence is not HIGH.
