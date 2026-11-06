# Filter and compress

Two jobs in one step. First keep only the questions the judges approved. Then give the long ones a short dialogue version. Cut words, never meaning; never cut the particle that makes a sentence a question; leave a short question alone.

## Filter
- Keep a question only if its `verdict` is `direct`. The score is carried along for the reader; it does not decide.
- Keep the three lists and their order; copy each kept object unchanged. A list may end up empty.
- Never add, reword or re-score a question.

## Compress
Long, windy or academic questions become the punchy lines people say in a real dialogue.
- Only kept questions. One short version per question, the best one.
- A question that is already short and alive, 3 to 9 words in plain speech, is skipped: nothing is added for it.
- Rules: 3 to 9 words; drop openers ("слушай", "вот смотри", "как ты думаешь"); drop extra context and double thoughts, keep one central thought; simple words, not bookish, not philosophical; add no new meaning, never move into another area; it must sound like an ordinary human phrase ("Почему реформы не работают?", "Может, проблема в обществе?"); keep the particles "ли", "разве", "неужели", never turn a question into a statement with "?", a source with "ли" keeps "ли".

## Output JSON
```json
{
  "obviousQuestions": [ { "question": "...", "verdict": "direct", "reason": "...", "score": 0.9 } ],
  "dialogQuestions": [],
  "historyQuestions": [ { "question": "...", "verdict": "direct", "reason": "...", "score": 0.8 } ],
  "compact": [
    { "original": "Можно ли в политике добиться всего, чего хочешь?", "short": "Можно ли в политике получить всё?" }
  ]
}
```
`compact` holds only the questions that needed shortening, in list order: obvious, then dialog, then history.
