# Semantic core: fields

The semantic core is the classification of the quote: a map for every later step: what it says, where it may be used as an answer, where it may not, and what shape it has. Extract structure, not an explanation. Decide above all: which area of life the quote speaks to directly, which questions it can close as a direct answer, and where it cannot be carried without losing precision.

Example quote used in the tables: "В политике и в картах друзей не бывает." (Финлей Данн).

## Meaning fields

| Field | Type | What it is | Example |
|---|---|---|---|
| `literalMeaning` | string | What the quote says on the surface, one plain sentence. Keeps every later step anchored to the text. | "В политике и в карточной игре дружбы не бывает." |
| `deepMeaning` | string | What the quote really claims about life. Later steps look for questions this meaning answers. | "Там, где люди борются за выигрыш, дружба уступает интересу." |
| `centralTension` | string | The conflict the quote exposes or resolves. The final question must express this tension, so this is the target of the whole chain. | "Верность против выигрыша." |
| `worldview` | string | The stance behind the quote: cynical, stoic, tender, ironic. Keeps the questions' tone honest. | "Трезвый цинизм: интерес сильнее привязанности." |
| `themes` | string[] | Short topic labels, for matching and search. | ["дружба", "политика", "интерес", "доверие"] |

## Domain fields, the guard rails

| Field | Type | What it is | Example |
|---|---|---|---|
| `primaryDomain` | string | The one area of life the quote speaks to directly, from the fixed list: общество / любовь / старость / смерть / работа / характер / власть / одиночество / другое. Every question must sit here. | "власть" |
| `directQuestionDomains` | string[] | Areas where the quote works as a direct answer: the primary one and its close neighbours. | ["политика", "карты и азартные игры", "соперничество"] |
| `forbiddenAnalogyDomains` | string[] | Areas where the quote fits only as a metaphor. Questions from here are rejected. This is the main defence against stretching a quote into something it never said. | ["любовь", "семья", "школьная дружба", "терапия"] |

## Function and audience fields

| Field | Type | What it is | Example |
|---|---|---|---|
| `answerType` | string | What the quote does when used as an answer: объясняет причину / ставит диагноз / отрезвляет / спорит / утешает / предупреждает. A question must call for that kind of answer: a warning does not answer a "why". Two readings go in one string, separated by "; ". | "отрезвляет; предупреждает" |
| `emotionalTone` | string[] | How it feels to say it. The scene writer and the ranker match the question's mood to it. | ["горький", "насмешливый", "спокойный"] |
| `impliedConflicts` | string[] | Situations that produce the quote. Seeds for realistic questions. | ["предательство союзника", "ставка на дружбу в сделке"] |
| `lifeSituationsWhereItResonates` | string[] | When a person would want to hear it. | ["друг идёт в политику", "партнёр обыграл за столом"] |
| `likelySpeakerArchetypes` | string[] | Who tends to say it. Used for the scenes. | ["старый политик", "дядя-циник", "картёжник"] |
| `likelyListenerStates` | string[] | What the person asking is feeling. Questions are written from this state. | ["разочарован", "наивен", "надеется на поддержку"] |
| `ageRelevance` | string[] | For whom it lands. Keeps the question in a believable voice. | ["молодой идеалист", "взрослый профессионал"] |
| `socialSettings` | string[] | Where it would be said. Feeds the scenes directly. | ["кухня", "бар", "коридор офиса"] |

## Structural flags, which drive hard rules later

These are the only fields later rules branch on. Each flag is a shape of the quote; the shapes, their tests and the questions they unlock are in the quote-shapes knowledge. Fill every flag; several may be true at once.

| Field | Type | What it is | Example |
|---|---|---|---|
| `centralSubject` | string | The noun phrase the quote is about. Every literal question is built on it, so the mirror form becomes "Есть ли в политике друзья?". | "дружба в политике и картах" |
| `quoteExplainsWhy` | boolean | The quote justifies its own claim with a cause: a marker (потому что / так как / ибо / оттого что / поскольку / иначе) or an explicit mechanism ("настолько …, что приходится"). A bare statement of fact is false. | false |
| `quoteIsReason` | boolean | The quote's claim names the cause or source of something: "Причина X — Y", "X происходит от Y", "Все беды от Y". It answers "В чём причина X?" even with no marker inside. | false |
| `quoteExplainsHow` | boolean | The quote describes a process, mechanism or sequence. A result without a mechanism, or a rhythm like "каждые полгода", is false. | false |
| `quoteIsPrinciple` | boolean | The quote states a rule to live or act by: a secret, law or principle of life, success, marriage, relationships, business or politics. It answers "Как добиться X?", "В чём секрет X?", "Какое главное правило X?". | true |
| `principleDomain` | string or null | The area the principle governs ("успех", "брак", "бизнес", "политика", "жизнь"). Null when `quoteIsPrinciple` is false. | "политика" |
| `quoteIsDefinition` | boolean | The quote has the form "X — это …", "X есть …", "X is …", including a dash standing in for "это" ("Мода — разновидность уродства"). | false |
| `definedConcept` | string or null | The X being defined ("любовь", "мода", "политика"). Null when `quoteIsDefinition` is false. | null |
| `quoteIsRhetoricalQuestion` | boolean | The quote itself ends with "?" and works as an implicit statement whose answer is obvious: "Может ли мерить вещи тот, у кого нет мерки даже для себя?" (the implied answer is "нет"). | false |
| `quoteIsObservation` | boolean | The quote describes, generalizes or makes a recognizable observation about how people, groups, society, relationships, nature or the world typically behave, or what traits they exhibit. Serious, cynical, humorous, ironic, exaggerated or subjective all count: the flag names the quote's communicative function, not its truth. Not every assertion is an observation: the quote must actually generalize about a subject's behaviour, traits or recurring patterns. | true |
| `observationSubject` | string or null | The X the observation is about ("мужчины", "люди", "тоталитарное государство", "дружба в политике"). Null when `quoteIsObservation` is false. | "дружба в политике и картах" |
| `observationType` | string or null | `behavioral` (patterns of behaviour), `characteristic` (traits, properties, tendencies), `social` (patterns of social interaction or relationships), `general` (other observations). Null when `quoteIsObservation` is false. | "social" |
| `quoteProvidesIndicators` | boolean | The quote names a sign, symptom, criterion or characteristic by which a subject can be recognized, or told apart from something else: a reader could use it tomorrow to identify X. "Тоталитарное государство устанавливает не подлежащие изменению догмы и меняет их со дня на день" gives a sign of a totalitarian state, so true. A judgement, an evaluation or a joke about X ("все мужчины козлы") is not a usable sign, so false. This flag never replaces `quoteExplainsHow`; a sign is not a mechanism. | false |
| `indicatorSubject` | string or null | The X the sign identifies ("тоталитарное государство", "лицемер", "человек, которому нельзя доверять"). Null when `quoteProvidesIndicators` is false. | null |
| `quoteHasComparison` | boolean | The quote compares two subjects it names with each other: sets A against B explicitly or through "чем / как / так же, как / в отличие от / лучше … чем / не … а", and says how they differ, what they share or which one is better. "Ненависть так же слепа, как и любовь" (A = ненависть, B = любовь), "Дурак учится на своих ошибках, умный — на чужих", "Лучше голодать, чем что попало есть" are true. Two subjects that merely share one claim ("В политике и в картах друзей не бывает": the two nouns are the claim's scope, nobody sets them against each other), a single subject with an implied other ("Настоящий друг познаётся в беде"), a definition "X — это Y" and a correlation "чем больше …, тем …" are false. It answers "Что общего между A и B?", "Чем отличается A от B?", and with `ranking` "Что лучше: A или B?". | false |
| `comparisonSubjectA` | string or null | The first compared subject, as named in the quote ("ненависть", "дурак", "голодать"). Null when `quoteHasComparison` is false. | null |
| `comparisonSubjectB` | string or null | The second compared subject ("любовь", "умный", "есть что попало"). Null when `quoteHasComparison` is false. | null |
| `comparisonType` | string or null | `similarity` (what A and B share), `difference` (what separates them), `ranking` (one is better, worse, more or less than the other). Null when `quoteHasComparison` is false. | null |

Eight quotes, for calibration (the first row is the running example):

| Quote | why | reason | how | principle | definition | observation | indicators | comparison | Which questions can win |
|---|---|---|---|---|---|---|---|---|---|
| "В политике и в картах друзей не бывает." | false | false | false | true, "политика" | false | true, "дружба в политике и картах", social | false | false (scope, not comparison) | "Есть ли в политике друзья?", "Кому в политике можно доверять?", "Чего ожидать от друзей в политике?" |
| "Политика есть искусство возможного." | false | false | false | true, "политика" | true, "политика" | false | false | false | "Что такое политика?", "В чём секрет политики?", "Можно ли в политике добиться всего?" |
| "Мода — настолько невыносимая разновидность уродства, что приходится менять её каждые полгода." | true | false | false | false | true, "мода" | false | false | false | "Почему мода так быстро меняется?", "Что такое мода?" |
| "Тоталитарное государство устанавливает не подлежащие изменению догмы и меняет их со дня на день." | false | false | false | false | false | true, "тоталитарное государство", behavioral | true, "тоталитарное государство" | false | literal "ли" forms: "Можно ли верить догмам такого государства?"; "Как обычно ведёт себя тоталитарное государство?"; "Как понять, что государство тоталитарное?". Not "Как работает тоталитарное государство?": how is false. |
| "Причина всех войн — страх." | false | true | false | false | false | false | false | false | "Почему начинаются войны?", "В чём причина войн?" |
| "Все мужчины козлы, но некоторые козлее." | false | false | false | false | false | true, "мужчины", characteristic | false | false | "Какие бывают мужчины?", "Чего ожидать от мужчин?", "Что ты думаешь о мужчинах?" |
| "Ненависть так же слепа, как и любовь." | false | false | false | false | false | true, "ненависть", characteristic | false | true, "ненависть" / "любовь", similarity | "Что общего между любовью и ненавистью?", "Слепа ли ненависть?" |
| "Лучше голодать, чем что попало есть." | false | false | false | true, "жизнь" | false | false | false | true, "голодать" / "есть что попало", ranking | "Что лучше: голодать или есть что попало?", "Можно ли есть что попало, лишь бы не голодать?" |

## Output files

Two files. The first is the quote exactly as given, with its id and the output language:

```json
{ "quoteId": "the id given with the task", "quote": "the quote as given", "author": "the author as given", "language": "the output language" }
```

The second is the semantic core below.

## Semantic core JSON

```json
{
  "literalMeaning": "строка",
  "deepMeaning": "строка",
  "centralTension": "строка",
  "primaryDomain": "общество / любовь / старость / смерть / работа / характер / власть / одиночество / другое",
  "directQuestionDomains": ["сферы, где цитата может быть прямым ответом"],
  "forbiddenAnalogyDomains": ["сферы, куда нельзя переносить цитату без натяжки"],
  "answerType": "объясняет причину / ставит диагноз / отрезвляет / спорит / утешает / предупреждает",
  "emotionalTone": ["..."],
  "themes": ["..."],
  "worldview": "строка",
  "impliedConflicts": ["..."],
  "lifeSituationsWhereItResonates": ["..."],
  "likelySpeakerArchetypes": ["..."],
  "likelyListenerStates": ["..."],
  "ageRelevance": ["..."],
  "socialSettings": ["..."],
  "centralSubject": "строка",
  "quoteExplainsWhy": false,
  "quoteIsReason": false,
  "quoteExplainsHow": false,
  "quoteIsPrinciple": false,
  "principleDomain": null,
  "quoteIsDefinition": false,
  "definedConcept": null,
  "quoteIsRhetoricalQuestion": false,
  "quoteIsObservation": false,
  "observationSubject": null,
  "observationType": null,
  "quoteProvidesIndicators": false,
  "indicatorSubject": null,
  "quoteHasComparison": false,
  "comparisonSubjectA": null,
  "comparisonSubjectB": null,
  "comparisonType": null
}
```
