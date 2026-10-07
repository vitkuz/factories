# Domain Lenses

After the six-pillar review, decide whether specialized review knowledge applies. A lens adds domain-specific questions on top of the pillars. It never replaces them.

Reference: https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses.html

## Check availability, do not trust memory
The set of official AWS lenses changes over time. Before selecting any official lens:
1. Fetch https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses.html (and the lens catalog it links to).
2. Record the lens names found and the date checked.
3. Select only lenses present on the page. If a lens you expected is absent, say so and do not cite it.

## Candidate domains
Examples of what to look for. Confirm each exists on the current page.

| Domain | Select when the architecture or drivers show |
|---|---|
| Serverless | Lambda, API Gateway, Step Functions, EventBridge, SQS/SNS as the core |
| SaaS | Multi-tenant product, tenant isolation, per-tenant cost or onboarding |
| Containers | ECS or EKS as the core compute |
| Data Analytics | Ingestion, lake, warehouse, streaming analytics |
| Migration | Intent is migration or modernization of an existing system |
| Machine Learning | Training, inference or ML pipelines |
| Financial Services | Regulated financial workload, resilience and audit expectations |

## Selection rules
1. Base the choice on the primary and secondary intents, the drivers (compliance, domain) and the selected components.
2. Pick the few lenses that change the review. Zero is a valid outcome. Do not apply a lens just because its name matches one component.
3. For each lens chosen, state why, and which components and drivers it covers.
4. Review through the lens as questions on top of the pillars. Findings use the same shape as `review-output.md`, with `pillar` set to the nearest pillar and an added `lens` field.
5. Do not duplicate findings already raised by a pillar reviewer. Reference them.

## Internal custom lenses
Organizations may have their own standards. These are placeholders; use them only when the source material for them is provided.

| Custom lens | Typical content |
|---|---|
| Company Platform Standards | Approved services, landing zone, account structure |
| Internal Security Baseline | Mandatory controls, encryption, logging, identity rules |
| Serverless Standards | Runtime, packaging, concurrency, observability conventions |
| API Standards | Naming, versioning, auth, error format, rate limits |

If a custom lens is requested but its content is not available, report it as an open question. Never invent the organization's rules.

## Output
The domain review returns the same structure as `review-output.md` with one addition:

```json
{
  "lensesApplied": [
    {
      "name": "Serverless",
      "kind": "OFFICIAL",
      "source": "https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses.html",
      "checkedOn": "2026-10-03",
      "reason": "Core compute and integration are Lambda, SQS and EventBridge"
    }
  ],
  "findings": [],
  "highRisks": [],
  "mediumRisks": [],
  "improvements": [],
  "architectureChangesRequired": false
}
```

`kind` is `OFFICIAL` or `CUSTOM`. An empty `lensesApplied` list is valid when no lens adds value.
