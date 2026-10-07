# Problem Archetypes

Every question maps to exactly one primary archetype from a controlled set of six. Never invent a seventh. Never return two.

Classify only. Do not generate hypotheses. Do not research. Do not answer the question.

## The six at a glance

| Archetype  | The user must...            | Core question shape            | Typical primary approach                              | Closest confusable |
|------------|-----------------------------|--------------------------------|-------------------------------------------------------|--------------------|
| DECIDE     | choose between options      | Should I / which one / yes or no | Hypothesis-driven research, MECE, decision analysis | OPTIMIZE           |
| UNDERSTAND | explain something that is   | Why is this happening          | Root cause analysis, issue tree, hypothesis testing   | DISCOVER           |
| DISCOVER   | learn what people need      | What do they actually want     | Jobs To Be Done, user research, design thinking       | UNDERSTAND         |
| PREDICT    | prepare for what may happen | What will happen / how big     | Scenario planning, forecasting, PESTEL                | DECIDE             |
| OPTIMIZE   | improve an existing system  | How do we make X better/faster | Constraint, bottleneck and process analysis           | INVENT             |
| INVENT     | create something new        | How could we design X anew     | First principles, design thinking, experimentation    | OPTIMIZE           |

## DECIDE

Definition: a choice must be made between named options, or between doing and not doing something. The answer is an action.

Signals (EN): should I, should we, is it worth, buy or rent, which one, A or B, go or no-go, choose, pick, invest in, hire, switch to.
Signals (RU): стоит ли, надо ли, нужно ли, что лучше, выбрать, покупать или снимать, имеет ли смысл, брать или нет, переходить ли на.

Examples:
- Should I buy a $55k studio in Didi Dighomi? / Стоит ли покупать студию за $55 000 в Диди Гоми?
- Should we move our backend from Lambda to containers?
- Что лучше для стартапа: Postgres или DynamoDB?

Approach: hypothesis-driven research, MECE issue tree, decision analysis. Output is a recommendation, often conditional.

Confusable: OPTIMIZE. Tie-break: if the user is choosing whether to take an action or which option to take, it is DECIDE. If the action is already settled and the user wants to do it better, it is OPTIMIZE.

## UNDERSTAND

Definition: something already happened or exists, and the user wants the cause or mechanism. The answer is an explanation.

Signals (EN): why, what caused, what is behind, how come, what explains, what went wrong, reason for the drop or rise.
Signals (RU): почему, из-за чего, в чём причина, что стоит за, отчего, как так вышло, что пошло не так.

Examples:
- Why is customer churn increasing? / Почему растёт отток клиентов?
- Why did our Lambda costs double last month?
- Из-за чего падает конверсия на странице оплаты?

Approach: root cause analysis, issue tree, hypothesis testing.

Confusable: DISCOVER. Tie-break: UNDERSTAND explains a known, observable phenomenon, often with data. DISCOVER uncovers unknown needs, motives or opportunities. If the evidence lives in metrics and events, pick UNDERSTAND. If it lives in what people say they need, pick DISCOVER.

## DISCOVER

Definition: the user does not yet know what people need, want or struggle with. The answer is a set of validated needs or jobs.

Signals (EN): what do users actually need, what do customers want, what problems do they have, what are they trying to get done, unmet needs, pain points, what is missing.
Signals (RU): что на самом деле нужно, чего хотят пользователи, какие у них проблемы, какие задачи решают, неудовлетворённые потребности, чего не хватает, что болит.

Examples:
- What do developers actually need from an architecture review tool? / Что на самом деле нужно разработчикам от инструмента ревью архитектуры?
- What jobs do small hotels hire a booking tool for?
- Какие боли у фрилансеров при выставлении счетов?

Approach: Jobs To Be Done, user research, design thinking.

Confusable: UNDERSTAND. Tie-break: if the user asks about a need or motive of a group, DISCOVER. If the user asks why a specific measured change happened, UNDERSTAND.

## PREDICT

Definition: the user wants to know how the future may unfold. The answer is scenarios, ranges or probabilities, not an action.

Signals (EN): what will happen, what could happen, where is this heading, over the next N years, forecast, outlook, trend, will X grow, how big will it get, likelihood.
Signals (RU): что будет, что может произойти, куда движется, в ближайшие N лет, прогноз, перспективы, тренд, вырастет ли, каков будет, насколько вероятно.

Examples:
- What could happen to this market over the next five years? / Что может произойти с этим рынком в ближайшие пять лет?
- Will Tbilisi rental prices keep rising through 2028?
- Какой будет рынок AI-агентов через три года?

Approach: scenario planning, forecasting, PESTEL.

Confusable: DECIDE. Tie-break: a forecast with no choice attached is PREDICT. If the user will act on the forecast ("should I buy before prices rise?"), it is DECIDE, and the forecast becomes a hypothesis inside it.

## OPTIMIZE

Definition: a working system, process or product exists, and the user wants it faster, cheaper, better or more reliable. The answer is a ranked set of improvements.

Signals (EN): how can we reduce, how to speed up, improve, increase, cut cost, bottleneck, throughput, lead time, efficiency, make it more reliable.
Signals (RU): как сократить, как ускорить, как улучшить, как увеличить, снизить затраты, узкое место, пропускная способность, эффективность, как повысить.

Examples:
- How can we reduce deployment lead time? / Как сократить время доставки изменений в прод?
- How do we lower our monthly AWS bill without hurting latency?
- Как повысить конверсию из триала в оплату?

Approach: constraint analysis, bottleneck analysis, process analysis.

Confusable: INVENT. Tie-break: if the existing structure is kept and tuned, OPTIMIZE. If the user questions the structure itself or says "from scratch", "redesign", "rethink", INVENT.

## INVENT

Definition: the user wants to create or radically redesign something. The answer is a new design or concept, plus experiments to test it.

Signals (EN): how could we redesign, from first principles, rethink, reimagine, create a new, what if we built, design a new way, invent, from scratch.
Signals (RU): как можно переосмыслить, с нуля, с первых принципов, спроектировать заново, придумать новый, а что если построить, новый подход.

Examples:
- How could we redesign architecture reviews from first principles? / Как переосмыслить ревью архитектуры с первых принципов?
- What would a pricing model look like if we started from scratch?
- Придумай новый формат онбординга для B2B-продукта.

Approach: first principles, design thinking, experimentation.

Confusable: OPTIMIZE. Tie-break: same rule as above. Incremental gains on the current design is OPTIMIZE. A new design that replaces it is INVENT.

## Picking one archetype for a mixed question

Many questions mix archetypes. Pick the one the user must act on.

1. Find the final action or deliverable the user needs. Ask: after the answer, what will the user do or hold in hand?
2. Choose a choice or go/no-go: DECIDE. An explanation: UNDERSTAND. A set of needs: DISCOVER. A future view: PREDICT. A list of improvements: OPTIMIZE. A new design: INVENT.
3. The other archetypes become supporting inputs. They are not the primary type. The classifier does not plan them.
4. If two still fit equally, pick the one named by the last, most concrete verb in the question. Lower confidence to the 0.5-0.7 band and state the runner-up in the rationale.

Worked cases:
- "Why is churn rising and what should we do?" The user must act: pick OPTIMIZE if the goal is to reduce churn in the existing product, DECIDE if the user names options to choose from. Cause finding is supporting.
- "Will prices rise, and should I buy now?" DECIDE. The forecast is supporting.
- "What do users need, and how should we redesign onboarding?" INVENT if a redesign is the deliverable, otherwise DISCOVER.

## Domain and decisionObject

domain: a short lowercase kebab-case label for the subject area, such as real-estate, saas-growth, devops, healthcare-ops, personal-finance. Use one domain. Reuse the common label if one fits. Use English even when the question is in Russian.

decisionObject: the specific thing the question is about, as a short noun phrase: "studio apartment", "customer churn", "architecture review tool", "deployment lead time". It is the thing being chosen, explained, studied, forecast, improved or designed. Keep it concrete. Do not copy the whole question. Do not use a verb phrase. Use English.

## Confidence scale

A number from 0 to 1. It states how sure the classifier is about problemType only.

| Range     | Meaning                                                                 |
|-----------|-------------------------------------------------------------------------|
| 0.90-1.00 | Explicit signal words, one clear action or deliverable, no rival fits.  |
| 0.75-0.89 | Clear primary type. A secondary type is present but plainly supporting. |
| 0.50-0.74 | Two archetypes fit. The tie-break chose one. Name the runner-up.        |
| 0.30-0.49 | Vague or underspecified question. Best guess only.                      |
| below 0.30| Do not use. Re-read the question and choose the best fit above 0.30.    |

Do not output 1.0. Do not inflate confidence to look decisive.

## Output shape

Return one JSON object. No extra keys.

```json
{
  "problemType": "DECIDE",
  "domain": "real-estate",
  "decisionObject": "studio apartment",
  "rationale": "The user must choose whether to buy. Signal: 'Стоит ли покупать'. Resale and price questions are supporting.",
  "confidence": 0.96
}
```

Rules:
- problemType is exactly one of DECIDE, UNDERSTAND, DISCOVER, PREDICT, OPTIMIZE, INVENT, in uppercase.
- rationale is one to three sentences. Name the signal, the action the user must take, and the runner-up if confidence is below 0.75.
- confidence is a number between 0 and 1.
- Write rationale in English unless told otherwise.
