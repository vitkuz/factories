# Merging the question lists

Three sources, three lists, nothing rewritten, plus the quote they belong to.

| List | Taken from | Rule |
|---|---|---|
| `obviousQuestions` | the obvious-questions file, `obviousQuestions` | copied in order |
| `dialogQuestions` | the iconic dialogs file, `dialogQuestions` | copied in order |
| `historyQuestions` | the obvious-questions file, `historyQuestions` | copied in order; empty when empty |

- `quote` is the iconic dialogs file's `quote` object (`uuid`, `text`, `author`), copied unchanged as the first key.
- Never reword, shorten, translate or add a question.
- Drop an exact duplicate inside one list; keep the first. Keep a question that appears in two lists in both.
- Empty source, empty list; never fail.

## Output JSON
```json
{
  "quote": { "uuid": "...", "text": "...", "author": "..." },
  "obviousQuestions": ["..."],
  "dialogQuestions": ["..."],
  "historyQuestions": ["..."]
}
```
