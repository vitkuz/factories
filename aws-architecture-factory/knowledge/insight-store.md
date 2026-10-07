# Insight Store (Architecture)

The insight store is the learning loop's memory for architecture work.
It holds reusable architecture insights from past runs, and later the real outcomes of the decisions they informed.
Stored insights are prior evidence, never unquestioned truth.

## Location and format

- Path: `factories-data/aws-architecture-factory/insight-store.jsonl`, relative to the project root (never inside the kit).
- Format: JSON Lines. One complete JSON object per line, no blank lines, no trailing commas, no wrapping array.
- The file may not exist before the first run. Readers treat a missing file as empty. Writers create it on first write.

## Record schema

| Field | Type | Meaning |
|---|---|---|
| `id` | string (uuid) | Unique id of the record. |
| `idea` | string | The user's original system idea or architecture problem. |
| `context` | object | `{ intent, domain, scale, region }`, all strings. Use `null` for an unknown value. |
| `insight` | string | The reusable finding, stated so it stands alone. |
| `architectureImplication` | string | What it changes in an architecture of this kind. |
| `hypothesisStatement` | string | The design hypothesis the insight came from. |
| `decision` | string | The run's architecture decision in one line. |
| `servicesInvolved` | string[] | AWS services the insight concerns. |
| `evidenceRefs` | string[] | Short list of sources (name, URL or citation). Keep it to a few items. |
| `confidence` | `HIGH` / `MEDIUM` / `LOW` | Confidence in the insight when it was written. |
| `outcome` | string or null | `null` until a person records what happened in production. |
| `outcomeRecordedAt` | string or null | ISO-8601 timestamp of the outcome. `null` while `outcome` is `null`. |
| `sourceRun` | string | Path of the run folder that produced it. |
| `createdAt` | string | ISO-8601 timestamp when the line was written. |

`context.intent` is the primary architecture intent (for example `NEW_SYSTEM`). `scale` is a short phrase such as "bursty, under 5k req/s".

### Example record

One line in the file. Shown on several lines for reading only.

```json
{
  "id": "7a1d4c52-3e90-4b8f-a6d1-9c0e2f5b8a13",
  "idea": "Image processing API on AWS",
  "context": {
    "intent": "NEW_SYSTEM",
    "domain": "media-processing",
    "scale": "bursty, below 5k requests per second",
    "region": "eu-west-1"
  },
  "insight": "SQS Standard queues deliver at least once, so a message can be processed more than once.",
  "architectureImplication": "Any queue worker with side effects must be idempotent, for example by keying writes on a job id.",
  "hypothesisStatement": "Lambda workers on SQS can process image jobs safely.",
  "decision": "Serverless pipeline with idempotent workers and a dead-letter queue.",
  "servicesInvolved": ["SQS", "Lambda", "DynamoDB"],
  "evidenceRefs": ["AWS SQS developer guide: standard queues", "AWS Lambda with SQS event source"],
  "confidence": "HIGH",
  "outcome": null,
  "outcomeRecordedAt": null,
  "sourceRun": "run/example-run-folder",
  "createdAt": "2026-10-03T09:30:00Z"
}
```

## Writing rules

1. Append only. Add new lines at the end of the file.
2. Write one object per line, as compact JSON.
3. Never rewrite, reorder, edit or delete existing lines.
4. Store only reusable insights. Skip trivia that matters to one run, such as a single price, quota value at one date, or one-off customer detail.
5. Write each insight so a stranger can use it without the run's files.
6. Before appending, read the existing lines and compare by meaning, not by wording.
7. Skip a near-duplicate with the same context. Add a related insight only for a new angle, different context or stronger confidence.
8. New records start with `outcome: null` and `outcomeRecordedAt: null`.
9. Generate `id` as a fresh uuid. Set `createdAt` to the current time in ISO-8601 UTC.
10. Do not copy secrets, account ids or personal data into any field.
11. AWS limits and prices change. Phrase service facts with their scope, and prefer lasting patterns over numbers.

## Reading rules

1. If the file is missing or empty, return an empty list. This is not an error.
2. Merge lines by id first (see "Recording an outcome"). Work on the merged records.
3. Match a new idea against `context.intent`, `context.domain`, `context.scale`, `context.region` and `servicesInvolved`.
4. Also match on keywords from the idea, `insight`, `architectureImplication` and `hypothesisStatement`.
5. A partial match is allowed; weigh closer context matches higher.
6. Return at most about 10 items, outcome-validated first, then newest `createdAt`.
7. If nothing matches, return an empty list. Never pad with weak matches.
8. Return each item as:

```json
{
  "insight": "...",
  "architectureImplication": "...",
  "originalContext": { "intent": "...", "domain": "...", "scale": "...", "region": "..." },
  "servicesInvolved": ["SQS"],
  "confidence": "HIGH",
  "outcomeValidated": false
}
```

- `outcomeValidated` is `true` only when a recorded outcome exists.
- Retrieved items are prior evidence, not truth. Use them to focus research and form hypotheses.
- Say plainly when an insight comes from a different scale, domain or region.
- If new AWS documentation contradicts a stored insight, trust the documentation and note the conflict.

## Recording an outcome

A person records what really happened later. Nobody edits the original line.

1. Append a line with `"updates": "<id of the original record>"`, plus `outcome` and `outcomeRecordedAt`.
2. Give it its own fresh `id` and `createdAt`. Other fields may be omitted.
3. Readers merge by id; latest value wins. A record with a merged `outcome` is outcome-validated.
4. An update line is not an insight: do not return it separately or count it in deduplication.

```json
{
  "id": "c4e8b1f0-2d5a-4a77-8f3c-1b9d0e6a7c25",
  "updates": "7a1d4c52-3e90-4b8f-a6d1-9c0e2f5b8a13",
  "outcome": "Duplicate deliveries occurred in production; idempotency keys prevented double processing.",
  "outcomeRecordedAt": "2027-03-01T10:00:00Z",
  "createdAt": "2027-03-01T10:00:00Z"
}
```

## Quality notes

- A stored insight is not proof. An outcome-validated one is stronger but still one case.
- A high-confidence insight with no outcome stays unvalidated.
- Keep it a flat file, not a knowledge graph.
