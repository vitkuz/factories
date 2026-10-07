# Reversible and Irreversible Decisions

Separate decisions you can undo cheaply from decisions you cannot.
Expensive irreversible choices deserve deeper research and stronger review. When uncertainty is high, prefer the reversible option.

## Two kinds of door

| Kind | Meaning | Treatment |
|---|---|---|
| One-way door | Reversing it needs a migration, downtime, data movement or a rewrite. | Research first. Demand evidence. Review hard. Record in an ADR. |
| Two-way door | Reversing it is a config change, a redeploy or a short task. | Decide fast on a sensible default. Revisit with real metrics. |

## Irreversibility score (0 to 1)

Score each decision or hypothesis. Use the highest band that applies.

| Score | Band | Typical cost of reversal |
|---|---|---|
| 0.0 - 0.2 | Trivial | Parameter or setting change, no data effect. |
| 0.2 - 0.4 | Cheap | Redeploy or small code change, no data migration. |
| 0.4 - 0.6 | Moderate | Code rewrite of one component, or a bounded data migration. |
| 0.6 - 0.8 | Expensive | Migration of live data, API contract change, many consumers affected. |
| 0.8 - 1.0 | Near-permanent | Cannot be changed without rebuilding the system or moving accounts or regions. |

Raise the score when: data must move, clients depend on the contract, other teams depend on it, compliance evidence is tied to it, or downtime is required.
Lower it when: a facade or abstraction already isolates it, or data volume is small.
State the reason in one phrase next to the score.

## AWS examples

| Decision | Door | Typical score | Why |
|---|---|---|---|
| Primary datastore family (DynamoDB vs relational vs object store) | One-way | 0.8 - 0.9 | Data model, access patterns and queries are built around it. |
| Account structure and landing zone | One-way | 0.8 - 0.9 | Moving resources across accounts is costly. |
| Region and multi-region topology | One-way | 0.8 - 0.9 | Data residency, latency and replication are tied to it. |
| Public API contract and identity provider | One-way | 0.7 - 0.8 | External clients and tokens depend on it. |
| Partition key or primary key design | One-way | 0.7 - 0.8 | Changing it means a table rebuild. |
| Compute model (Lambda vs containers) | Mixed | 0.4 - 0.6 | Depends on how much runtime-specific code exists. |
| Message broker choice (SQS vs SNS vs EventBridge vs Kafka) | Mixed | 0.5 - 0.7 | Producers and consumers must change. |
| Instance or task size | Two-way | 0.1 | Setting change. |
| Lambda memory and timeout | Two-way | 0.1 | Setting change, tune with metrics. |
| Autoscaling thresholds, reserved concurrency | Two-way | 0.1 | Setting change. |
| Log retention, alarm thresholds | Two-way | 0.1 | Setting change. |

These scores are starting points. Adjust to the actual workload and say why.

## How to use the score

- The score is one input to hypothesis priority (see the design hypotheses file). Higher irreversibility raises research priority.
- A one-way door resting on a low-confidence assumption needs clarification, evidence or a reversible fallback before it is chosen.
- Prefer designs that keep one-way doors few and late: isolate the datastore behind a service boundary, keep payload formats versioned, start with one region unless a driver requires more.
- Every one-way decision in the selected design gets its own decision record with a "revisit when" condition.
