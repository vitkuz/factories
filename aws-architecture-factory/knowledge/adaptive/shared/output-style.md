# Output Style

These rules apply to every file you write. Follow them exactly.

Later, a JSON Schema or Zod validator may check your files. So shapes must be stable. Do not improvise structure.

## Where to write

- Write to the exact absolute path you were given.
- Do not pick another folder or file name.
- Do not write extra files unless you were told to.
- Create missing parent folders only if the path requires it.

## JSON files

- The file must be valid JSON. `jq .` must parse it without errors.
- Encoding is UTF-8. Keep non-English letters as real characters, not escapes.
- No comments. No trailing commas.
- No prose before or after the JSON. No Markdown fences inside the file.
- One top-level value, usually an object.
- Pretty-print with 2 spaces.

## Keys

- Use camelCase for every key: `problemType`, `falsificationQuestion`, `researchQuestions`.
- Use the key names from your task instructions. Do not rename them.
- Do not add fields you were not asked for.
- Do not invent fields to hide missing data or to explain a gap.

## Required fields

- Every required field is always present.
- If you do not know a value, write `null`. Never drop the key.
- If a list has no items, write `[]`. Do not write `null` for a list.
- Do not use placeholder text like "N/A", "unknown" or "TBD" in place of `null`.
- Do not guess to fill a field. A true `null` is better than a made-up value.
- Numbers are JSON numbers, not strings. Booleans are `true` or `false`, not "yes" or "no".

## Enums

Spell enum values exactly. Same case. Same underscores. No synonyms.

Problem archetypes:

- DECIDE
- UNDERSTAND
- DISCOVER
- PREDICT
- OPTIMIZE
- INVENT

Hypothesis statuses:

- SUPPORTED
- PARTIALLY_SUPPORTED
- REJECTED
- INCONCLUSIVE

Confidence:

- HIGH
- MEDIUM
- LOW

If a field has a registered list (frameworks, methods, source types), pick only from that list. Never invent a new value.

## Stable ids

- Ids look like `H1`, `H2` for hypotheses, `RQ1`, `RQ2` for research questions, `E1`, `E2` for evidence.
- An id, once created, never changes. Not its text, not its number.
- When you refer to something from an earlier file, copy its id exactly.
- Use the id field that points back: `hypothesisId`, `issueId`, `researchQuestionId`.
- Do not renumber. Do not reuse an id for something else.
- If you add new items, continue the numbering. Do not fill gaps.

## Language and wording

- Keep the user's original question text verbatim. Do not fix, shorten, translate or reword it.
- Write all human-readable text in the language of the question. A Russian question gets Russian text.
- Enum values, keys and ids stay in English exactly as listed above.
- Be specific. Short sentences. No filler.

## Honesty

- Never present weak evidence as fact.
- Never hide a gap by inventing data, sources or numbers.
- If something is missing, use `null` or an empty list, and say so in an existing text field if one fits.

## Self-check

After writing, run the check on the file you just wrote:

```bash
jq . /absolute/path/to/file.json
```

- If it prints an error, fix the file and run it again.
- Check that every required key is there and every enum is spelled right.
- Check that every id you reference exists in an earlier file.
- Only report success after `jq .` passes.

## The one Markdown deliverable

If you are asked for a Markdown file, it is for a human reader.

- Plain language. Short sentences.
- Answer first. Put the recommendation in the opening lines.
- Then the reasons, then the risks, then what is still unknown.
- No chronological story of how the research went.
- No jargon unless the reader used it first.
- Same language as the user's question.
- Do not paste raw JSON into it.
