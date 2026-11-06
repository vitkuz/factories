# Judging questions: one subagent per question

You coordinate; you never judge a question yourself. Every candidate question in the three merged lists is judged on its own by a subagent that sees only the quote, the author, the semantic core, the historical context and that one question. Isolation keeps the verdicts independent: a weak question cannot hide behind a strong neighbour.

How to run it:
1. Read the quote file, the semantic core, the historical context and the merged lists.
2. Dedupe across the three lists before judging: two questions are the same when they match after trimming, lowercasing, collapsing whitespace and dropping the final punctuation. Keep one judging slot per unique question and remember every place it appeared.
3. For every unique question launch one subagent on the opus model with the test task below, pasting in this file from "The test task" to the end, the Reverse Q&A rules, the Russian interrogative rules, the flags knowledge, the judge lessons and the lessons, then the quote, the author, the full semantic core, the full historical context and the one question. Launch them in parallel batches of about ten.
4. Collect each subagent's object. If one returns nothing usable, launch it once more; if it fails again, write the object yourself with verdict `weak`, score 0.0 and the reason "судья не ответил".
5. Write the output in the merged file's shape, same three lists, same order, nothing dropped: a question that appeared in two lists gets the same object in both. This step judges only; filtering happens afterwards, from `verdict` and `score`.

## The test task, given to each subagent

> Quote: "<quote>" (<author>). Question: "<question>". Semantic core and historical context attached.
> Decide whether the quote is a direct, natural and sufficient answer to this question, as if someone asked it in everyday talk and got the quote as the reply. Judge by the rules below. Return one JSON object {question, verdict, reason, score} and nothing else.

## Verdict
| `verdict` | Meaning |
|---|---|
| `direct` | Same semantic area as the quote, the quote answers it with no explanation after it. |
| `metaphorical` | The quote fits only by carrying its meaning into another area. |
| `weak` | Too general, needs an explanation after the quote, bookish, academic, too long, tailored to the quote, or alive on its own while the quote is not really its answer. |

Be harsh: when in doubt, `weak`. The semantic core gives the fence (`primaryDomain`, `directQuestionDomains`, `forbiddenAnalogyDomains`) and the shape flags; a "Почему …" question is `direct` only if `quoteExplainsWhy` or `quoteIsReason` is true. A "Как …" question, and any question of the same kind opened differently ("По каким признакам …?", "Чем отличается …?"), is judged by its intent under the rules below, never by its first word alone. A history question is `direct` only if the quote answers it today without the history explained; the context says whether it matches what the author was answering. A question that is not in proper question form (a statement with "?") is `weak`.

## Question intent
First name what the question asks for, then check the flag that can supply it. A flag opens the door; the quote must still walk through it: it has to answer this question, without unsupported generalization, metaphorical transfer or an explanation added after it.

| Intent | The question asks for | Examples | `direct` only if |
|---|---|---|---|
| mechanism | how something works | "Как работает двигатель?", "Как работает тоталитарное государство?" | `quoteExplainsHow` is true and the quote gives that mechanism. A quote that only names what X does, or a sign of X, does not. |
| method | how to achieve or do something | "Как стать счастливым?", "Как добиться X?", "Как вести себя в политике?" | `quoteExplainsHow` or `quoteIsPrinciple` is true and the quote gives actionable guidance or a principle a person could apply. |
| recognition | how to identify or recognize something | "Как понять, что государство тоталитарное?", "Как распознать лицемера?", "По каким признакам понять, что человеку нельзя доверять?" | `quoteProvidesIndicators` is true, the question's X is `indicatorSubject` or a subject the quote plainly covers, and the sign in the quote is relevant evidence for recognizing X. |
| distinction | how to tell two things apart | "Как отличить друга от врага?", "Чем X отличается от Y?" | `quoteProvidesIndicators`, `quoteIsObservation` or `quoteHasComparison` is true and the quote names a characteristic that actually separates the two things the question names. |
| similarity | what two things have in common | "Что общего между любовью и ненавистью?" | the comparison rules below. |
| ranking | which of two things is better | "Что лучше: голодать или есть что попало?" | the comparison rules below. |
| description | what something is like, how it usually behaves | "Как выглядит настоящий лидер?", "Как обычно ведут себя X?" | the observational rules below. |

An identifying characteristic is not a sufficient diagnostic criterion. A recognition question is `direct` when the quote's sign is what a person would reasonably reply with and no further test must be added; it is `weak` when recognizing X would need signs the quote does not give, or when the quote's sign fits X only by generalizing beyond it. `quoteExplainsHow` false never by itself rejects a recognition, distinction or description question; `quoteExplainsHow` true never by itself accepts one.

Calibration on "Тоталитарное государство устанавливает не подлежащие изменению догмы и меняет их со дня на день" (how false, principle false, indicators true, observation true):
- "Как понять, что государство тоталитарное?" may be `direct`: recognition, the quote names a usable sign.
- "Как работает тоталитарное государство?" is `weak`: mechanism, and the quote gives none.
- "Как стать счастливым?" for any quote without a method or principle stays `weak`.

## Observational questions
A question asks for an observation when it wants a characterization of a subject X: "Что можно сказать о X?", "Какие X бывают?", "Как обычно ведут себя X?", "Что характерно для X?", "Чего ожидать от X?", "Что ты думаешь о X?". Judge it independently of the mechanism and principle flags. It may be `direct` only when all five hold:
1. `quoteIsObservation` is true and the quote makes a relevant observation about the question's X, the same X as `observationSubject` or a subject the quote plainly covers.
2. The quote supplies the kind of characterization the question requests: a behaviour for a behaviour question, a trait for a trait question.
3. The reply sounds natural in conversation.
4. The question needs no broader explanation than the quote gives.
5. No unsupported interpretation or metaphorical transfer is needed.

A broad container ("Расскажи всё о мужчинах", "Что вообще можно сказать о людях?") is `weak` when the quote provides one narrow observation. A subjective or exaggerated generalization still counts as an observation; do not reject it for being untrue, and do not score it higher for sounding like a fact.

## Comparison questions
A question asks for a comparison when it names two subjects and wants their likeness, their difference or which one is better: "Что общего между A и B?", "Чем отличается A от B?", "Что лучше: A или B?". It may be `direct` only when all four hold:
1. `quoteHasComparison` is true.
2. The question names both subjects, and they are `comparisonSubjectA` and `comparisonSubjectB` (in either order, in plain words) or subjects the quote plainly covers. A question that names only one of them, or swaps one for a subject the quote never mentions, is `weak`.
3. The quote supplies what the question asks: a shared trait for "Что общего …", a separating trait for "Чем отличается …", a preference for "Что лучше …". A `ranking` quote does not answer "Что общего …"; a `similarity` quote does not answer "Чем отличается …".
4. The question is not tailored: a subject that exists only as the quote's image makes it `weak`.

With `quoteHasComparison` false, a "Что общего между A и B?" or "Что лучше: A или B?" question is `weak`, and a "Чем отличается A от B?" question is `direct` only through the distinction rule above.

## Score
One number from 0.0 to 1.0, bare, never a string. For a rejected question the score is below 0.4. For a `direct` question it is the judge's overall rating from these six, weighed equally: semantic precision, direct-answer fit, everyday naturalness, shortness potential, memorability, contextual flexibility. The reason names the one or two that decided it.

## Reason
One or two sentences, in the output language: why this verdict and this score, in words a person would use.

## Output JSON, written by the coordinator
The merged file's shape; each string is now an object. Lists stay in their original order.
```json
{
  "obviousQuestions": [
    { "question": "Есть ли в политике друзья?", "verdict": "direct", "reason": "Та же сфера, цитата отвечает без пояснений, звучит как живая реплика.", "score": 0.9 }
  ],
  "dialogQuestions": [
    { "question": "...", "verdict": "weak", "reason": "...", "score": 0.3 }
  ],
  "historyQuestions": [
    { "question": "...", "verdict": "direct", "reason": "...", "score": 0.8 }
  ]
}
```
