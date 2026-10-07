# AWS Research Method Registry

Pick research methods only from this registry. Never invent a method name, abbreviate it, or change its spelling.
Choose the fewest methods that can settle the hypothesis. Usually one to three.

| Method | When to use | What it answers | Typical sources |
|---|---|---|---|
| AWS_SERVICE_CONSTRAINT_RESEARCH | A choice depends on what a service can or cannot do. | Features, limits, behaviors, delivery semantics. | Service developer guides, API references. |
| AWS_BEST_PRACTICE_RESEARCH | Need the recommended way to use a service or pattern. | Recommended configuration and anti-patterns. | Service docs, Architecture Center, Prescriptive Guidance. |
| AWS_WELL_ARCHITECTED_RESEARCH | Need guidance for a pillar-specific question. | What the framework says about a design choice. | Well-Architected Framework, pillar whitepapers, lenses. |
| AWS_PRICING_RESEARCH | Cost depends on a price dimension. | Which dimensions are billed and at what regional rate. | Service pricing pages, pricing API docs. |
| QUOTA_ANALYSIS | A design could hit a limit. | Default and adjustable quotas, hard limits. | Service Quotas docs, service quota pages. |
| LATENCY_ANALYSIS | A latency target may be at risk. | Typical latency, cold starts, added hops. | Service docs, official blogs, benchmarks. |
| SCALING_ANALYSIS | Load growth or bursts could break the design. | Scaling model, burst limits, scaling speed. | Service docs, scaling guides. |
| FAILURE_MODE_ANALYSIS | Need to know how a component fails and recovers. | Failure behavior, retries, durability, SLA. | Service docs, service SLAs, Well-Architected Reliability. |
| IAM_ANALYSIS | Permissions or cross-service access are in question. | Required actions, resource policies, boundaries. | IAM docs, service authorization references. |
| NETWORK_ANALYSIS | Connectivity, VPC or endpoint design matters. | Paths, endpoints, NAT and data transfer implications. | VPC docs, networking whitepapers. |
| DATA_MODEL_ANALYSIS | The data shape drives the datastore choice. | Fit of the model to a datastore, key design. | Database docs, data modeling guides. |
| STORAGE_ACCESS_PATTERN_ANALYSIS | Read/write patterns drive storage choice. | Which storage class or store fits the access pattern. | S3, EBS, EFS, database docs. |
| CONSISTENCY_ANALYSIS | Consistency or ordering guarantees matter. | Consistency model, ordering, idempotency needs. | Service docs on consistency and delivery. |
| DR_ANALYSIS | Recovery targets are set. | Feasible strategies for the RTO and RPO. | Disaster recovery whitepaper, service replication docs. |
| COST_MODELING | Need a cost shape or estimate across load levels. | Cost at normal, peak and 10x load, as ranges. | Pricing pages, usage assumptions from drivers. |
| SECURITY_THREAT_MODELING | Sensitive data or exposed entry points. | Threats, abuse paths, mitigations. | Security docs, threat modeling guidance. |
| COMPLIANCE_MAPPING | A compliance regime is a driver. | Which services and controls meet the requirement. | AWS compliance programs, services in scope pages. |
| REFERENCE_ARCHITECTURE_RESEARCH | A well-known pattern may already exist. | Proven designs for similar workloads. | Architecture Center, Prescriptive Guidance, solutions library. |
| BENCHMARK_RESEARCH | Performance claims need data. | Measured throughput or latency. | Official blogs, independent engineering benchmarks. |

## Selection rules

1. Select methods from the registry only. Spell them exactly.
2. Match the method to the unknown named in the hypothesis's falsification questions.
3. Do not select a method just to fill the plan. Each method must answer a falsification question.
4. Prefer documentation-based methods first. Use BENCHMARK_RESEARCH only when documentation cannot answer.
5. A pricing question needs AWS_PRICING_RESEARCH or COST_MODELING, never memory.

## Research plan file shape

One plan per researched hypothesis.

```json
{
  "hypothesisId": "H-COMPUTE-01",
  "unknown": "Can individual image jobs exceed Lambda execution limits?",
  "methods": ["AWS_SERVICE_CONSTRAINT_RESEARCH", "QUOTA_ANALYSIS"],
  "documentationTargets": ["Lambda developer guide: configuration and limits", "Service Quotas for Lambda"],
  "queries": ["AWS Lambda maximum execution timeout", "Lambda deployment package size limit container image"],
  "stopConditions": ["The relevant limit is known and compared against the driver value", "Sources repeat known information"],
  "budget": { "maxSources": 6, "maxSearches": 8 }
}
```

| Field | Rule |
|---|---|
| `hypothesisId` | An existing hypothesis id. |
| `unknown` | The one unknown that could change the decision. Not a topic. |
| `methods` | Registry names only. |
| `documentationTargets` | Specific AWS docs or pages to read first. |
| `queries` | Concrete search strings. |
| `stopConditions` | Chosen from the stop conditions file, adapted to this hypothesis. |
| `budget` | Numeric caps on sources and searches. |
