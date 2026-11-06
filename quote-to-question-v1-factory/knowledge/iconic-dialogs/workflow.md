# Workflow шага «диалоги-иконы»

Ты — ведущий шага. Сам не пишешь, не ревьюишь и не сводишь: запускаешь субагентов по порядку, передаёшь им **абсолютные пути** (не текст файлов), ждёшь их файлы и проверяешь.

Пути:
- **Знания** — `<корень проекта>/factories/quote-to-question-v1-factory/knowledge/iconic-dialogs/<файл>`. Корень проекта — твоя рабочая папка (в ней лежит `.claude/`).
- **Inputs и Outputs** — абсолютные пути из твоей задачи (папка запуска).

Все субагенты — модель **opus**. Отвечают на языке задачи.

---

## Шаг 1 — Сценарист

- **Subagent:** `general-purpose`
- **Prompt:** «Ты сценарист коротких диалогов-икон. Прочитай файлы знаний и следуй им. Из входных файлов возьми цитату, смысловое ядро и исторический контекст. Напиши черновик диалогов строго по `dialog-format.md`.»
- **Knowledge:** `goal.md`, `how-to-create-iconic-dialogs.md`, `dialog-format.md`
- **Inputs:** `1-extract-core/quote.json`, `1-extract-core/semantic-core.json`, `2-research-historical-context/history-context.json`
- **Outputs:** `4-iconic-dialogs/iconic-dialogs.draft.json`

---

## Шаг 2 — Панель: Балабанов, Мамет, Уайлдер

Три субагента **параллельно, в одном сообщении**. Каждому — только его пути. Скажи, что метод сценариста намеренно скрыт; `how-to-create-iconic-dialogs.md` и `how-to-review-dialogs.md` им не давай.

### Шаг 2a — Балабанов
- **Subagent:** `balabanov-reviewer`
- **Prompt:** «Отревьюй диалоги против цели. Метод сценариста намеренно скрыт. Напиши ревью в файл результата.»
- **Knowledge:** `goal.md`
- **Inputs:** `4-iconic-dialogs/iconic-dialogs.draft.json`
- **Outputs:** `4-iconic-dialogs/balabanov.review.md`

### Шаг 2b — Мамет
- **Subagent:** `mamet-reviewer`
- **Prompt:** как у 2a
- **Knowledge:** `goal.md`
- **Inputs:** `4-iconic-dialogs/iconic-dialogs.draft.json`
- **Outputs:** `4-iconic-dialogs/mamet.review.md`

### Шаг 2c — Уайлдер
- **Subagent:** `wilder-reviewer`
- **Prompt:** как у 2a
- **Knowledge:** `goal.md`
- **Inputs:** `4-iconic-dialogs/iconic-dialogs.draft.json`
- **Outputs:** `4-iconic-dialogs/wilder.review.md`

**Перед шагом 3:** все три ревью есть.

---

## Шаг 3 — Председатель: Тарантино

- **Subagent:** `tarantino-reviewer`
- **Prompt:** «Сведи ревью панели: вердикт, сводные оценки, диалоги панели и свой диалог. Напиши свод в файл результата.»
- **Knowledge:** `goal.md`
- **Inputs:** `4-iconic-dialogs/iconic-dialogs.draft.json`, `4-iconic-dialogs/balabanov.review.md`, `4-iconic-dialogs/mamet.review.md`, `4-iconic-dialogs/wilder.review.md`
- **Outputs:** `4-iconic-dialogs/tarantino.review.md`

**Перед шагом 4:** четыре ревью соответствуют «Готово, когда» в `how-to-review-dialogs.md` (это ты читаешь сам). Не сходится → перезапусти этого ревьюера один раз.

---

## Шаг 4 — Сводчик

- **Subagent:** `general-purpose`
- **Prompt:** «Прочитай файлы знаний и следуй им. Сведи черновик сценариста с правками председателя и диалогами панели в один итоговый файл.»
- **Knowledge:** `how-to-merge-dialogs.md`, `dialog-format.md`
- **Inputs:** `4-iconic-dialogs/iconic-dialogs.draft.json`, `4-iconic-dialogs/tarantino.review.md`
- **Outputs:** `4-iconic-dialogs/iconic-dialogs.final.json`

---

## Если типа агента нет

Вместо `balabanov-reviewer`, `mamet-reviewer`, `wilder-reviewer` или `tarantino-reviewer` запусти `general-purpose` с промптом: «Прочитай `<корень проекта>/.claude/agents/<имя>.md`: всё ниже frontmatter — твоя роль и инструкции. Следуй им.» и теми же Knowledge, Inputs и Outputs.

## Готово, когда

- все шесть Outputs есть;
- `python3 -m json.tool` читает `iconic-dialogs.draft.json` и `iconic-dialogs.final.json`;
- в `iconic-dialogs.final.json` есть `dialogQuestions`.

Тогда верни `DONE`.
