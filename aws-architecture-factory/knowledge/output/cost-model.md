# Cost Model

The cost model explains the cost shape of the selected architecture and how it behaves under load. It is a reasoning tool, not a quote. Never present figures as a price quote or guaranteed bill.

## What to produce
1. A cost-shape table per service.
2. Cost scenarios: normal load, peak load, 10x growth. Use only when enough workload data exists; otherwise say what is missing.
3. Ranges for uncertain inputs, not single points.
4. Unbounded-cost risks and the control for each.
5. Sources and assumptions.

## Cost shape per service
State what the bill scales with.

| Service | Cost driver | Shape |
|---|---|---|
| Lambda | Requests, duration x memory | Proportional to use; zero at zero traffic |
| Fargate | vCPU and memory hours | Provisioned capacity; floor while tasks run |
| API Gateway | Requests (and data) | Proportional to requests |
| NAT Gateway | Hourly + data processed | Fixed floor plus per-GB processing |
| CloudFront | Requests + data transfer out | Proportional to traffic |
| DynamoDB | On-demand request units or provisioned capacity, storage | Request and storage dependent |
| S3 | Storage, requests, transfer | Grows with retained data |
| CloudWatch | Log ingestion, retention, metrics | Proportional to log volume |

Use this table as a starting pattern; add the actual services in the selected architecture.

## Scenarios
```json
{
  "scenario": "peak",
  "inputs": { "requestsPerMonth": { "low": 20000000, "high": 60000000 }, "avgPayloadKb": { "low": 50, "high": 200 } },
  "monthlyCostRangeUsd": { "low": 400, "high": 1500 },
  "dominantCostDrivers": ["Lambda duration", "CloudWatch logs"],
  "confidence": "LOW"
}
```
- Give normal, peak and 10x growth rows.
- Find the crossover point where a different design becomes cheaper (for example sustained utilization above which containers beat Lambda).
- Link ranges to the assumptions they depend on. Mark high-impact, low-confidence inputs.

## Pricing sources
- Cite the official pricing page for each service, with region and date checked (for example "AWS Lambda pricing, us-east-1, checked 2026-10-03").
- Prefer https://aws.amazon.com/pricing/ and service-specific pricing pages. Mention free tiers only when they matter.
- Prices vary by region and change; never use remembered numbers without a source.

## Unbounded-cost risks to check
| Risk | Typical control |
|---|---|
| NAT Gateway data processing | Gateway or interface VPC endpoints for AWS traffic |
| Logs at debug level, unlimited retention | Log levels, sampling, retention periods |
| Cross-AZ and cross-region data transfer | Co-locate chatty components; review replication |
| Unbounded retries | Max receive count, backoff, DLQ |
| Unauthenticated or unthrottled endpoints | Auth, WAF rate rules, usage plans |
| Storage that only grows | Lifecycle rules, TTLs |
| Autoscaling with no maximum | Max capacity, concurrency limits |
| Data egress to the internet | CDN, compression, caching |

Each unbounded scenario needs a cap, an alarm (budget or metric) or an owner-accepted rationale.

## Caveats section (always include)
- Not a quote or a forecast.
- Excludes taxes, support plans, enterprise discounts and engineering time unless stated.
- Lists every assumption and the pricing date.
