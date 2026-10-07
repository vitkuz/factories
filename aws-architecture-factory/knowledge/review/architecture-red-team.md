# Architecture Red Team

The red team tries to break the selected architecture. It produces findings, not rewrites. Rewriting belongs to the architect after the findings are judged.

## Rules
1. Attack the architecture as written. Do not invent components that are not in it.
2. Walk every angle below. If an angle does not apply, record it as not applicable with a reason. Silence is not allowed.
3. Each finding needs a concrete trigger scenario, not a generic worry.
4. Tie every finding to affected components and to the driver it threatens.
5. Do not propose a new design. State the required change as a control or property ("consumer must be idempotent"), not as a new diagram.

## Mandatory attack angles
| # | Angle | How to probe |
|---|---|---|
| 1 | Single points of failure | Remove each component or AZ in turn; does the critical path survive? |
| 2 | Retry storms | Make a dependency slow; do retries at several layers multiply load? |
| 3 | Duplicate processing | Deliver each message twice; is the side effect idempotent? |
| 4 | Poison messages | Send one message that always fails; where does it end up, and does it block others? |
| 5 | Queue backlog growth | Halve consumer throughput; how fast does backlog and message age grow, and what expires? |
| 6 | Throttling | Exceed a service quota or API limit; what do callers see and does work get lost? |
| 7 | Concurrency exhaustion | Spike traffic; does one function or pool starve others or a downstream database? |
| 8 | Hot partitions | Skew keys to one value; does one partition or shard throttle the system? |
| 9 | Data loss | Kill a component mid-write; which acknowledged data is not durable? |
| 10 | Partial failure | Let step 2 of 3 fail; is state consistent and recoverable? |
| 11 | Regional failure | Lose the region; what is lost, what is the RTO/RPO, who decides? |
| 12 | Dependency failure | Make a third-party or AWS dependency time out; timeouts, fallbacks, degradation? |
| 13 | IAM blast radius | Compromise one role; what can the attacker read, change or destroy? |
| 14 | Credential exposure | Search for where secrets live, travel or get logged; how is rotation done? |
| 15 | Public network exposure | List every public endpoint and bucket; is each intended and authenticated? |
| 16 | Unbounded cost | Send 100x traffic or a retry loop; what stops the bill from growing? |
| 17 | Logging gaps | Pick an incident; can logs reconstruct who did what and when? |
| 18 | Monitoring gaps | Break the main flow silently; which alarm fires, and in how long? |
| 19 | Deployment rollback failure | Ship a bad version; can it be reverted, including state and config? |
| 20 | Schema migration failure | Migrate halfway and stop; do old and new code both work? |
| 21 | Vendor/service lock-in | Ask what it takes to leave a key service; is lock-in a stated, accepted trade-off? |
| 22 | Operational overload | Imagine the team at its stated size on call; is the number of moving parts survivable? |

## Output shape

```json
{
  "criticalFindings": [
    {
      "id": "RT-01",
      "angle": "Poison messages",
      "title": "Failing message blocks the FIFO group",
      "triggerScenario": "A malformed upload event fails on every attempt.",
      "impact": "All later messages in that message group stall; users see jobs stuck.",
      "affectedComponents": ["SQS FIFO queue", "Lambda worker"],
      "driver": "No lost or stuck work",
      "requiredChange": "Bounded receive count with a DLQ and an alarm on DLQ depth."
    }
  ],
  "majorFindings": [],
  "minorFindings": [],
  "requiredChanges": ["RT-01"],
  "acceptedRisks": [
    {
      "findingId": "RT-09",
      "rationale": "Regional failure accepted; RTO of 24h meets the stated driver.",
      "owner": "Product owner"
    }
  ],
  "anglesNotApplicable": [
    { "angle": "Schema migration failure", "reason": "No relational schema; data is immutable objects." }
  ]
}
```

- Severity buckets follow `risk-severity.md`.
- `requiredChanges` lists finding ids that must be fixed before the architecture can be accepted.
- `acceptedRisks` only lists risks a named owner can accept; the red team proposes, the owner decides.
