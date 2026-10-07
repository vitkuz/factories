# Architecture Intents

An intent says what kind of architecture work the request is. It steers which concerns matter and which research methods fit.
A request has one primary intent and zero or more secondary intents.

## Registered intents

Use only these twelve. Never invent an intent, rename one, or combine two into a new label.

| Intent | Definition | Typical signals |
|---|---|---|
| NEW_SYSTEM | Design a system that does not exist yet. | "build", "from scratch", "greenfield", "we want to launch". |
| MIGRATION | Move an existing workload to AWS or between AWS setups with the same behavior. | "move", "lift and shift", "migrate from on-prem / other cloud". |
| MODERNIZATION | Change an existing system's architecture style to a more modern one. | "break up the monolith", "go serverless", "replace legacy", "refactor to containers". |
| SCALE | Make an existing or planned system handle much higher load or size. | "10x traffic", "hitting limits", "growth", "millions of users". |
| COST_OPTIMIZATION | Reduce the cost of a running or planned design. | "too expensive", "bill", "reduce spend", "budget cap". |
| RELIABILITY | Raise availability or fault tolerance. | "outages", "SLA 99.99", "single point of failure", "resilient". |
| SECURITY | Strengthen security posture or meet security requirements. | "harden", "least privilege", "PII", "zero trust", "audit finding". |
| DATA_PLATFORM | Design ingestion, storage, processing or analytics of data at platform level. | "data lake", "ETL", "analytics", "warehouse", "streaming pipeline". |
| INTEGRATION | Connect systems, partners or events. | "integrate with", "webhooks", "event bus", "third-party API", "B2B". |
| DISASTER_RECOVERY | Define recovery from region or site loss. | "RTO", "RPO", "backup", "failover", "multi-region standby". |
| OBSERVABILITY | Make a system measurable and debuggable. | "monitoring", "tracing", "alerting", "we cannot see why it fails". |
| PERFORMANCE | Reduce latency or raise throughput. | "too slow", "p99", "latency budget", "throughput target". |

## How to choose

1. Read the original request and the drivers file.
2. The primary intent is the main reason the request exists. Pick the single best match.
3. Add secondary intents only when the request or a driver clearly asks for them (for example a stated SLA adds RELIABILITY; a stated budget cap adds COST_OPTIMIZATION).
4. Do not list more than about three secondary intents. A long list means the primary intent is unclear.
5. If two intents fit equally, choose the one that decides the architecture's shape, and put the other in secondary.
6. If nothing fits well, pick the nearest registered intent, lower the confidence, and explain in `reason`.

## Output shape

```json
{
  "primaryIntent": "NEW_SYSTEM",
  "secondaryIntents": ["RELIABILITY", "COST_OPTIMIZATION"],
  "confidence": 0.94,
  "reason": "The user wants to build an image processing API from scratch; the stated 99.9% SLA and small budget add reliability and cost concerns."
}
```

- `primaryIntent` and every entry of `secondaryIntents` must be from the registry, spelled exactly.
- `secondaryIntents` never contains the primary intent and has no duplicates.
- `confidence` is a number from 0 to 1. Below 0.6 means the request is ambiguous; say what is missing in `reason`.
- `reason` is one or two sentences citing the request or specific drivers.
