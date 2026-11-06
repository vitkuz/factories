# Obvious questions

The obvious questions are the ones an ordinary person would ask and get the quote as a straight reply. They come from the quote's shape, not from imagination. Write them as plain strings, 10 to 20 in `obviousQuestions`, in proper question form. Use `primaryDomain` and `directQuestionDomains`; never `forbiddenAnalogyDomains`.

## Always: literal questions on `centralSubject`
Every reasonable variant, not one:
- mirror form, the inverted statement: "В политике друзей не бывает" → "Есть ли в политике друзья?"
- domain pivot: "Где не бывает друзей?"
- speaker pivot: "Будут ли у меня друзья, если я политик?"
- object pivot: "Кому в политике можно доверять?"

## By shape flag, when the flag is true
The flag → question-family map is the shared `flags.md`: what each flag means, the English and Russian patterns of the family it unlocks, and which "Как" intent each flag serves. Generate every member of every true flag's family that the quote actually answers; a false flag closes its family. When observation and indicators are both true, generate both families in full (recognition, signs, what is characteristic, how X usually behaves).

Also add one "Почему …?" and one method "Как …?" even when their flags are false; the final step decides.

## Recognition questions, when `quoteProvidesIndicators` is true
- Generate them only when the quote actually supplies the sign: "Тоталитарное государство устанавливает не подлежащие изменению догмы и меняет их со дня на день" answers "Как понять, что государство тоталитарное?"; a quote that merely evaluates X answers no recognition question. Never force the family onto a quote.
- X is `indicatorSubject`, kept narrow. The question names the thing to recognize, not the sign: "Как распознать лицемера?", not "Как понять, что человек хвалит в лицо?".
- Everyday phrasing: "Как понять, что человеку нельзя доверять?", "Каковы признаки X?", "По каким признакам понять, что X?". Not "Каковы диагностические критерии …".

## Observational questions, when `quoteIsObservation` is true
- Generate only the members of the family that the quote actually answers. "Все мужчины козлы, но некоторые козлее" answers "Какие бывают мужчины?" and "Чего ожидать от мужчин?"; it does not answer "Как обычно ведут себя мужчины?" if the quote names a trait and no behaviour. Let `observationType` guide the pick: `behavioral` favours "Как обычно ведут себя X?", `characteristic` favours "Какие X бывают?" and "Что характерно для X?", `social` favours "Чего ожидать от X?" and "Что можно сказать о X?".
- Phrase them the way people talk: "Какие бывают мужчины?", "Чего ждать от людей?". Not "Каковы поведенческие характеристики …".
- "Как обычно ведут себя X?" is a description question, not a mechanism one: it asks what X are like, so it goes in regardless of `quoteExplainsHow`. It is separate from the mandatory "Как …?" above, which asks for a way or a method.
- Keep the subject narrow: X is `observationSubject`, not a wider class. Never "Расскажи всё о X"-style containers; the quote supplies one observation, not a portrait.

## Comparison questions, when `quoteHasComparison` is true
- A is `comparisonSubjectA`, B is `comparisonSubjectB`; the question names both. Let `comparisonType` pick the member: `similarity` → "Что общего между A и B?"; `difference` → "Чем отличается A от B?" (or "Чем A отличается от B?"); `ranking` → "Что лучше: A или B?", plus "Чем отличается A от B?" only when the quote says what separates them.
- "Ненависть так же слепа, как и любовь" answers "Что общего между любовью и ненавистью?"; "Дурак учится на своих ошибках, умный — на чужих" answers "Чем умный отличается от дурака?"; "Лучше голодать, чем что попало есть" answers "Что лучше: голодать или есть что попало?".
- Name A and B the way a person would, not in the quote's image: skip the family when B exists only as the quote's metaphor ("Жизнь как коробка конфет": nobody asks what life and a box of chocolates have in common).
- With the flag false, write none of them, even when the quote mentions two subjects.

## History questions, a separate list
When the historical context is `found`, the questions that follow from it are obvious too, but only to someone who knows the context, so they go in `historyQuestions`, not in `obviousQuestions`:
- the `authorUnderlyingQuestion` itself, verbatim when `type` is `explicit`;
- one to three everyday versions of it, and of the situation in `historicalBackground` and `authorIntent`, as a person today would ask them.
The quote must still answer each of them directly, without the history being explained. When the status is `notFound` or `disputed`, `historyQuestions` is an empty list.

## Style
- Write the way living people speak. 4 to 12 words. Simple words, no academic or bookish tone, no extra context.
- Do not tailor a question to the quote; do not make it clever.
- Before adding a question, four checks, any "no" drops it: the quote answers it with no further explanation; it is in the quote's topic; it sounds like an ordinary phrase; it needs no metaphorical transfer.

## Output JSON
```json
{
  "obviousQuestions": ["Есть ли в политике друзья?", "Кому в политике можно доверять?"],
  "historyQuestions": ["Можно ли в политике добиться всего, чего хочешь?"]
}
```
