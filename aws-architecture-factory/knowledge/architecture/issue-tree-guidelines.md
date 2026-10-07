# Architecture Issue Tree Guidelines

The issue tree breaks the architecture problem into the concerns that matter. It is architecture-specific, not a generic checklist.

## Candidate branches

Pick from these, or name a domain-specific concern when none fits (for example "Request and Upload Path").

```text
Compute          Data               Integration       Networking
Security         Identity           Reliability       Scalability
Performance      Observability      Deployment        Operations
Cost             Disaster Recovery  Compliance        Data Lifecycle
```

## Rules

1. Select 3 to 8 material concerns. Not sixteen. A small serverless API does not need every branch.
2. A concern is material when a wrong decision there would change the architecture, the cost shape or the risk level.
3. Branches are MECE: no two branches ask the same question, and together they cover the problem. If two branches overlap, merge them or move the shared question to one of them.
4. Name branches after the architectural question, not the service. "Processing Model" is good; "Lambda" is not.
5. Every branch cites the drivers that make it material, by driver key (for example `traffic.peak`, `data.retention`, `compliance`).
6. Every branch has a one-line "why material". If you cannot write it, drop the branch.
7. Merge concerns driven by the same drivers into one branch rather than splitting them.
8. Intent matters: a COST_OPTIMIZATION request makes Cost a primary branch; a DISASTER_RECOVERY request makes Disaster Recovery and Data a primary branch.
9. Do not add a branch only because a Well-Architected pillar exists. Pillars are checked later.
10. A branch built on an unknown driver should say so; the unknown becomes a candidate hypothesis or a clarification.

## Example tree

```text
Image Processing Platform
|
|-- Request and Upload Path     (traffic.peak, latency.target)
|-- Processing Model            (traffic.average, team.skills, operationalConstraints)
|-- Storage and Data Lifecycle  (data.volume, data.retention)
|-- Failure Handling            (availability.sla, resilience.rpo)
|-- Delivery and CDN            (users, regions, latency.target)
|-- Security                    (security.sensitivity, security.authentication)
`-- Cost and Scaling            (budget, traffic.growth)
```

## Output shape

Write a short markdown tree for people, and a JSON list for later use. Both must list the same branches.

```json
[
  {
    "id": "IT-01",
    "concern": "Processing Model",
    "drivers": ["traffic.average", "traffic.peak", "team.skills", "operationalConstraints"],
    "whyMaterial": "Bursty, short jobs make the compute model the largest lever on cost and operations."
  }
]
```

| Field | Rule |
|---|---|
| `id` | Unique, stable, format `IT-NN`. |
| `concern` | The architectural question, in a few words. |
| `drivers` | One or more driver keys from the drivers file. Never empty. |
| `whyMaterial` | One sentence on what would change if this is decided badly. |

Check before returning: 3 to 8 entries, no overlap, each driver key exists in the drivers file, no service names used as concern names.
