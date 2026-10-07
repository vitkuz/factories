# Well-Architected Review Output

Each pillar reviewer reviews the selected architecture for one pillar and returns one JSON object. Reviewers assess; they never redesign.

## Output shape

```json
{
  "pillar": "RELIABILITY",
  "findings": [
    {
      "id": "REL-01",
      "title": "Queue consumer has no dead-letter queue",
      "component": "SQS queue + Lambda worker",
      "driver": "Availability and no-data-loss requirement",
      "severity": "HIGH",
      "description": "A message that always fails is retried until it expires and is then dropped.",
      "evidenceRefs": ["https://docs.aws.amazon.com/..."],
      "suggestedMitigation": "Attach a DLQ with a redrive policy and alarm on its depth."
    }
  ],
  "highRisks": ["REL-01"],
  "mediumRisks": ["REL-03"],
  "improvements": ["REL-04"],
  "architectureChangesRequired": true
}
```

## Field rules
| Field | Rule |
|---|---|
| `pillar` | One of `OPERATIONAL_EXCELLENCE`, `SECURITY`, `RELIABILITY`, `PERFORMANCE_EFFICIENCY`, `COST_OPTIMIZATION`, `SUSTAINABILITY`. |
| `findings` | Every issue, as an object. Ids are unique and prefixed by pillar (`OPS`, `SEC`, `REL`, `PERF`, `COST`, `SUS`). |
| `highRisks`, `mediumRisks`, `improvements` | Lists of finding ids. A finding appears in exactly one list. |
| `architectureChangesRequired` | `true` if any high risk needs a change to components, data flow or contracts. `false` if fixes are configuration or documentation only. |

## Finding rules
1. Every finding names one affected component, exactly as it appears in the selected architecture.
2. Every finding names the architecture driver it threatens or fails to serve. No driver, no finding.
3. `severity` is `HIGH`, `MEDIUM` or `LOW`. Use `../review/risk-severity.md` definitions for the likelihood, impact and reversibility reasoning.
4. `suggestedMitigation` states what to add or change in one or two sentences. It names the control, not a full redesign.
5. Cite official AWS sources for service limits and behavior. Say when a claim rests on an assumption.
6. If the evidence is insufficient, say so in `description` and lower the severity rather than guessing.
7. Do not report the same issue under several pillars. Report it in the owning pillar and reference it elsewhere.
8. An empty `findings` list is valid when nothing material was found. Do not pad.

## Reviewers never redesign
- Do not propose a replacement architecture, new component diagram or alternative service set.
- Do not edit the selected architecture.
- If a finding implies a different architecture, set `architectureChangesRequired: true` and describe the defect and the needed control. The decision to change belongs to the architect.
- If a driver or assumption looks wrong, report it as a finding on that driver so a human can decide.
