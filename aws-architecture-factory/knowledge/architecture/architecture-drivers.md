# Architecture Drivers

Architecture drivers are the properties the system must achieve. Service selection follows drivers, never the reverse.
Do not ask "which AWS services?" until the drivers are written down.

## Driver model

Normalize the request into this JSON. Use `null` for an unknown scalar and `[]` for an unknown list. Never delete a key.

```json
{
  "goal": "",
  "functionalRequirements": [],
  "users": [],
  "traffic": { "average": null, "peak": null, "growth": null },
  "latency": { "target": null, "hardLimit": null },
  "availability": { "sla": null },
  "resilience": { "rto": null, "rpo": null },
  "data": { "volume": null, "growth": null, "consistency": null, "retention": null },
  "security": { "sensitivity": null, "authentication": null, "authorization": null },
  "compliance": [],
  "regions": [],
  "dataResidency": [],
  "budget": null,
  "team": { "size": null, "skills": [] },
  "operationalConstraints": [],
  "existingSystems": [],
  "integrations": [],
  "deliveryConstraints": [],
  "assumptions": []
}
```

Rules for filling it:
- Copy a value only when the user stated it or a provided file contains it.
- Keep units and scope in the value ("5k req/s peak", "p95 300 ms").
- A user phrase such as "fast" or "cheap" is recorded as stated, not converted to a number. Convert only through a recorded assumption.
- Every driver left `null` that could change the design is a candidate material unknown.

## Assumption record

Every inferred value becomes one record in `assumptions`.

```json
{
  "assumption": "Peak traffic is below 5k requests/second",
  "reason": "No traffic forecast was provided",
  "confidence": "LOW",
  "decisionImpact": "HIGH"
}
```

| Field | Values | Meaning |
|---|---|---|
| `assumption` | string | The inferred value, stated so it can be checked. |
| `reason` | string | Why it was inferred, or why it could not be asked. |
| `confidence` | HIGH / MEDIUM / LOW | How likely the assumption is true. |
| `decisionImpact` | HIGH / MEDIUM / LOW | How much the architecture would change if it is false. |

## Rules

1. Never invent a requirement silently. If a value is not given, either leave it `null` or record an assumption.
2. List assumptions with HIGH impact and LOW confidence first. Then HIGH/MEDIUM, then the rest.
3. A HIGH-impact, LOW-confidence assumption must trigger at least one of:
   - a clarification question to the user;
   - a sensitivity analysis (does the choice survive if the value is 10x different?);
   - multiple architecture variants, one per plausible value.
4. Do not hide assumptions inside prose. They live in the `assumptions` list.
5. Later work cites assumptions by their text, so keep the wording stable once written.
6. Drivers are the single source for weights, hypotheses and decisions. A decision with no driver behind it is unsupported.
