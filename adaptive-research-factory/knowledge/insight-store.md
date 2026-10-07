# Insight Store

The insight store is the learning loop's memory.
It holds reusable insights from past research, and later the real outcomes of the decisions they informed.
Stored insights are prior evidence, never unquestioned truth.

## Location and format

- Path: `factories-data/adaptive-research-factory/insight-store.jsonl`, relative to the project root (never inside the kit).
- Format: JSON Lines. One complete JSON object per line, no blank lines, no trailing commas, no wrapping array.
- The file may not exist before the first run. Readers treat a missing file as empty. Writers create it on first write.

## Record schema

| Field | Type | Meaning |
|---|---|---|
| `id` | string (uuid) | Unique id of the record. |
| `question` | string | The user's original question. |
| `context` | object | `{ domain, geography, problemType, decisionObject }`, all strings. Use `null` for an unknown value. |
| `insight` | string | The reusable finding, stated so it stands alone. |
| `implication` | string | Why it matters for a decision of this kind. |
| `hypothesisStatement` | string | The hypothesis the insight came from. |
| `evidenceRefs` | string[] | Short list of sources (name, URL or citation). Keep it to a few items. |
| `decision` | string | The run's recommendation in one line. |
| `outcome` | string or null | `null` until a person records what really happened. |
| `outcomeRecordedAt` | string or null | ISO-8601 timestamp of the outcome. `null` while `outcome` is `null`. |
| `confidence` | `HIGH` / `MEDIUM` / `LOW` | Confidence in the insight when it was written. |
| `sourceRun` | string | Path of the run folder that produced it. |
| `createdAt` | string | ISO-8601 timestamp when the line was written. |

### Example record

One line in the file. It is shown here on several lines for reading only.

```json
{
  "id": "3f8c2a64-9b1e-4d7a-8c55-2e0f6a1b7d90",
  "question": "Should I buy a studio apartment in a district with heavy new-build supply?",
  "context": {
    "domain": "real-estate",
    "geography": "Tbilisi, Georgia",
    "problemType": "DECIDE",
    "decisionObject": "studio apartment"
  },
  "insight": "Where many new buildings are planned, generic studios compete with a growing supply and may resell slowly.",
  "implication": "Check planned supply against demand before buying a generic unit, and prefer units with a differentiator.",
  "hypothesisStatement": "The apartment can be resold within a reasonable period without a major discount.",
  "evidenceRefs": ["municipal permit register", "listing portal snapshot", "national statistics office"],
  "decision": "Buy only if the price is below the stated threshold.",
  "outcome": null,
  "outcomeRecordedAt": null,
  "confidence": "MEDIUM",
  "sourceRun": "run/example-run-folder",
  "createdAt": "2026-10-03T09:30:00Z"
}
```

## Writing rules

1. Append only. Add new lines at the end of the file.
2. Write one object per line, as compact JSON.
3. Never rewrite, reorder, edit or delete existing lines.
4. Store only reusable insights. Skip trivia that matters only to one run, such as a single price, a single listing or a one-off date.
5. Write each insight so a stranger can use it without the run's files.
6. Before appending, read the existing lines and compare by meaning, not by wording.
7. Skip a near-duplicate. If the same insight exists with the same context, do not add it again.
8. Add a related insight only when it brings a new angle, a different context or a stronger confidence.
9. New records always start with `outcome: null` and `outcomeRecordedAt: null`.
10. Generate `id` as a fresh uuid. Set `createdAt` to the current time in ISO-8601 UTC.
11. Do not copy secrets or personal data into any field.

## Reading rules

1. If the file is missing or empty, return an empty list. This is not an error.
2. Merge lines by id first (see "Recording an outcome"). Work on the merged records.
3. Match a new question against `context.domain`, `context.geography`, `context.problemType` and `context.decisionObject`.
4. Also match on keywords from the question, `insight`, `implication` and `hypothesisStatement`.
5. A partial match is allowed, but weigh closer context matches higher.
6. Return at most about 10 items.
7. Order the results with outcome-validated items first, then by newest `createdAt`.
8. If nothing matches, return an empty list. Never pad the list with weak matches.
9. Return each item in this shape:

```json
{
  "insight": "...",
  "originalContext": { "domain": "...", "geography": "...", "problemType": "...", "decisionObject": "..." },
  "confidence": "HIGH",
  "outcomeValidated": true
}
```

- `originalContext` is the stored `context` object, unchanged.
- `outcomeValidated` is `true` only when a recorded outcome exists for the record.
- Retrieved items are prior evidence. Use them to focus the research and to form hypotheses. Do not treat them as established fact.
- Say plainly when a retrieved insight comes from a different geography or problem type than the new question.
- If new evidence contradicts a retrieved insight, trust the new evidence and note the conflict.

## Recording an outcome

A person records what really happened later. Nobody edits the original line.

1. Append a new line with `"updates": "<id of the original record>"`.
2. Include `outcome` (what really happened, in plain words) and `outcomeRecordedAt` (ISO-8601).
3. Give the update line its own fresh `id` and its own `createdAt`.
4. Other fields may be omitted. The update line may be short.
5. Readers merge by id. The original record is the base. Fields from its update lines are applied on top, oldest to newest, so the latest value wins.
6. A record with a merged `outcome` is outcome-validated.
7. An update line is not an insight. Do not return it as a separate item and do not count it in deduplication.

Example update line:

```json
{
  "id": "b2d9e0c1-47aa-4f1b-9a3e-6c8d5e1f2a34",
  "updates": "3f8c2a64-9b1e-4d7a-8c55-2e0f6a1b7d90",
  "outcome": "Two years later, comparable studios sold only after large discounts.",
  "outcomeRecordedAt": "2028-10-03T12:00:00Z",
  "createdAt": "2028-10-03T12:00:00Z"
}
```

## Quality notes

- Never treat a stored insight as proof. An outcome-validated one is stronger, but it is still one case.
- A high-confidence insight with no outcome stays unvalidated.
- Keep the store simple. It is a flat file, not a knowledge graph.
