# Judge Lessons — Calibrated from Golden Dataset

These lessons supplement `judge-questions.md`. They do not replace its verdict definitions, intent rules, scoring system, or output schema.

The goal is to reduce false positives while preserving natural, witty, sarcastic, and conversational quote-as-answer matches.

## 1. Answer the exact question, not a neighboring question

Before assigning `direct`, identify the specific information the question requests.

Ask internally:

- What exactly would satisfy this question?
- What information does the quote actually provide?
- Does the quote supply the requested information, or merely something related to it?

Same domain is necessary but not sufficient.

**Example — Bismarck**

Quote: "Политика есть искусство возможного."

- `direct`: "Что такое политика?"
- `direct`: "Можно ли в политике добиться всего, чего хочешь?"
- `weak`: "Чего реально можно добиться в политике?"

The last question requests concrete achievable outcomes. The quote does not name any.

**Example — Wilde**

Quote: "Мода — настолько невыносимая разновидность уродства, что приходится менять её каждые полгода."

- `direct`: "Почему мода так часто меняется?"
- `weak`: "Почему мне так быстро надоедают модные вещи?"

The quote describes fashion changing, not the cause of an individual's boredom.

## 2. Do not silently add missing premises

A quote may imply an attitude without establishing a new factual claim.

Reject questions whose answers require an unsupported assumption about motives, consequences, causes, universal behavior, or exclusive alternatives.

**Example — Politics and friendship**

Quote: "В политике и в картах друзей не бывает."

- `direct`: "Есть ли в политике друзья?"
- `direct`: "Можно ли рассчитывать на дружбу в политике?"
- `weak`: "Кому в политике можно доверять?"

Friendship and trust are not equivalent. The absence of friendship does not establish that nobody is trustworthy.

- `weak`: "Что стоит за союзом политиков: дружба или расчёт?"

The quote rejects friendship but does not establish that calculation is the only remaining explanation.

**Example — Bismarck**

- `weak`: "Нужны ли в политике компромиссы?"
- `weak`: "Есть ли в политике место идеалам?"

The quote does not explicitly establish a requirement for compromise or exclude ideals.

## 3. A partial answer is not automatically a direct answer

Determine whether the question requests one example, one characteristic, a complete explanation, multiple criteria, or a practical method.

A single characteristic can answer:

- "Что характерно для X?"
- "Назови один признак X."
- "Как можно распознать X?" when the sign is reasonably informative.

It does not automatically answer:

- "Каковы все признаки X?"
- "Почему X существует?"
- "Как полностью проверить, что это X?"
- "Как устроен X?"

**Example — Orwell**

Quote: "Тоталитарное государство устанавливает не подлежащие изменению догмы и меняет их со дня на день."

- `direct`: "Что характерно для тоталитарного государства?"
- `direct`: "Как распознать тоталитарное государство?" — the quote supplies a relevant identifying sign, without claiming a definitive diagnosis.
- `weak`: "Почему тоталитарное государство меняет свои догмы?"
- `weak`: "Чем тоталитаризм отличается от обычной цензуры?"

The last question requires information about ordinary censorship that the quote does not supply.

Do not reject recognition questions merely because the quote gives only one sign. But do reject them if the question demands conclusive identification and the sign cannot reasonably support it.

## 4. Historical context is not part of the spoken answer

Historical context can help determine the intended meaning, subject, irony, and plausible question.

It must not supply missing information when judging whether the quote itself answers the question.

Use this test:

> If the listener hears only the question followed by the exact quote, does the response still work?

If the answer depends on explaining the author's essay, biography, surrounding paragraphs, or historical circumstances, use `weak`.

**Example — Orwell**

"Чем тоталитаризм отличается от обычной цензуры?" is `weak`, even if the historical essay discusses that comparison.

**Example — Wilde**

"Лучше ли одеваться удобно и красиво, чем по моде?" is `weak`: the quote criticizes fashion but says nothing about comfort, even if Wilde discussed rational dress elsewhere.

Historical evidence can clarify meaning. It cannot repair an incomplete answer.

## 5. Preserve conversational implication, but reject factual invention

A quote does not need to literally contain "да", "нет", or an imperative to function as a satisfying reply.

An indirect response can still be `direct` when its meaning is immediately understood in ordinary conversation.

Allow:

- Irony
- Sarcasm
- Rhetorical disagreement
- Natural warnings
- Clear conversational implications

Reject:

- Invented causes
- Invented motives
- New factual assertions
- Unsupported universal claims
- Missing instructions or steps
- Forced metaphors or hidden explanations

**Example — Wilde**

Quote: "Мода — настолько невыносимая разновидность уродства, что приходится менять её каждые полгода."

- `direct`: "Разве красиво то, что сейчас в моде?"
- `direct`: "Стоит ли гнаться за модой?" when understood as a conversational request for an opinion, not a demand for a practical plan.
- `weak`: "Как перестать гнаться за модой?"

The first two can receive a witty, satisfying response. The last requests a method that the quote does not provide.

**Example — Politics and friendship**

- `direct`: "Стоит ли щадить друга за картами?" — a natural ironic warning.
- `weak`: "Как вести себя с союзниками в политике?" — too broad to be answered by a single observation about friendship.

The boundary is not literal versus figurative wording. The boundary is whether the listener receives a satisfying answer without having to invent essential information.

## 6. Match the scope and subject of the question

Pay attention to changes in subject, domain, quantifiers, and level of abstraction.

Common invalid expansions:

- Fashion changing → an individual's boredom
- No friendship → no trust
- Dogmas changing → no principles of any kind
- Political allies → all personal relationships
- One observed trait → a complete description of a group
- Fashion trends → all trends in every domain

Words such as "всегда", "все", "никогда", "никому", and "единственный" require special scrutiny when the quote does not support that scope.

**Example — Orwell**

"Есть ли у тоталитарной власти твёрдые принципы?" is questionable because the quote describes unstable official dogmas, not necessarily every possible principle of the regime.

Prefer `weak` when the broader claim is essential to answering the question.

## 7. Do not confuse naturalness with answer sufficiency

A question can sound extremely natural and still be a bad reverse-Q&A match.

**Example — Wilde**

"Почему на старых фото модные наряды выглядят смешно?"

This is a plausible everyday question, but the quote does not directly explain changes in perception over time. Prefer `weak`.

**Example — Politics and friendship**

"Чего ожидать от союзников в политике?"

This is natural, but it requests a broader prediction than the quote supplies. Prefer `weak`.

Judge semantic answer fit before rewarding naturalness, memorability, or conversational style.

## 8. The reason must agree with the verdict

Before returning the JSON object, inspect your own explanation.

If your `reason` says any of the following, reconsider a `direct` verdict:

- "the quote does not say..."
- "the listener must infer..."
- "the question asks X, but the quote only says Y..."
- "the missing comparison comes from historical context..."
- "the answer requires an additional explanation..."
- "the quote does not explain the cause..."
- "the quote describes only one part of the requested answer..."

These phrases are not automatic rejection triggers. A trivial, conventional conversational implication may still be acceptable.

However, if the missing inference is essential to satisfying the question, the verdict must be `weak`.

Never use a high score to compensate for an incomplete answer. Never assign `direct` merely because the quote is relevant, memorable, or witty.

## 9. Use a final counterfactual test

Immediately before assigning `direct`, perform this internal test:

1. Imagine a person asking the candidate question naturally.
2. Reply with the exact quote, unchanged.
3. Do not add a second sentence explaining the quote.
4. Ask whether the person has received the information they requested.

If they would naturally respond:

- "Но это не то, что я спросил."
- "А почему?"
- "А как именно?"
- "При чём тут это?"
- "Откуда следует такой вывод?"

then prefer `weak`.

Do not reject merely because the answer is provocative, subjective, exaggerated, or sarcastic. A sharp conversational reply may intentionally challenge the questioner's assumptions.

## 10. Keep verdict and score conceptually separate

`verdict` answers a binary eligibility question:

> Is this a direct, natural, sufficiently complete answer?

`score` ranks quality within the verdict category.

A question cannot become `direct` just because it scores well on naturalness, brevity, memorability, or contextual flexibility.

A low-quality but valid `direct` question can receive a modest direct score. A natural but semantically invalid question must receive `weak` with a score below 0.4, following the existing scoring contract.

## Final instruction

Be conservative about unsupported information, but generous about genuine conversational meaning.

Do not optimize for maximizing the number of `direct` verdicts.

Optimize for this outcome:

> A real person asks the question. Another person replies with the exact quote. The reply feels relevant, natural, and sufficiently complete without explanation.

Apply these lessons together with all existing rules in `judge-questions.md`. Return the existing JSON schema unchanged.
