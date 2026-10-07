# Well-Architected Pillar: Performance Efficiency

Official framework: https://docs.aws.amazon.com/wellarchitected/latest/framework/
Pillars overview: https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html

Decision-quality review: will the architecture meet its latency and throughput drivers using appropriate resource types, and can it keep doing so as demand changes? Tie findings to a component and a driver (latency target, hard limit, peak traffic, data volume).

## Design principles
- Democratize advanced technologies: consume managed services instead of building them.
- Go global in minutes where users are distributed.
- Use serverless architectures where they remove undifferentiated work.
- Experiment more often; measure rather than assume.
- Consider mechanical sympathy: match the service to the access pattern.

## Key review questions
| Area | Ask |
|---|---|
| Latency budget | What is the end-to-end budget, and how is it split across hops? Is the p99 path synchronous? |
| Compute fit | Do execution duration, memory, runtime and networking fit the chosen compute? Cold starts relevant? |
| Data access | Do the data store and keys match the read and write access patterns? Any scan or hot key? |
| Caching | Is there a cache where reads dominate (CloudFront, DAX, ElastiCache, API cache)? What is the invalidation story? |
| Throughput limits | Which service quotas, burst limits or concurrency limits bind at peak? |
| Geography | Do users or data residency drivers imply edge delivery or regional placement? |
| Payload | Are large payloads routed through S3 or streaming instead of through API or queue limits? |
| Measurement | Which metrics prove the latency target is met, and how would a regression be detected? |

## Common AWS anti-patterns
- Lambda behind a strict low-latency target with heavy runtime start and no provisioned concurrency or alternative.
- DynamoDB Scan in a request path; relational joins forced onto a key-value store.
- Synchronous fan-out through several services inside one API call.
- Payloads near API Gateway, SQS or Lambda size limits.
- Cross-region calls inside the hot path.
- Over-provisioned fixed capacity "just in case"; no autoscaling signal.
- No load test or capacity reasoning for the stated peak.

## What a high risk looks like
- Stated hard latency limit that the design cannot meet on its critical path.
- A quota or throttle that binds below the stated peak or 10x growth with no mitigation.
- Data model that cannot serve a required access pattern efficiently.
- Component whose limits (duration, memory, payload) the workload is known to exceed.

Medium: latency target met only on warm paths, untested peak, missing cache for read-heavy data.

## Reviewer reminders
- Cite quotas and limits from official documentation with the date checked; limits change.
- If traffic drivers are assumptions, say which finding depends on which assumption.
