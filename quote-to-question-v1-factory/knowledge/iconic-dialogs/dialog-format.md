# Формат диалога (JSON)

Результат по одной цитате — **один JSON-файл** с напряжением цитаты и массивом диалогов (обычно 3).

Имя файла: `iconic-dialogs.draft.json` — черновик сценариста; `iconic-dialogs.final.json` — итог после ревью (см. `how-to-merge-dialogs.md`).

---

## Структура

```json
{
  "quote": {
    "uuid": "string",
    "text": "string",
    "author": "string"
  },
  "tension": {
    "myth": "string",
    "answer": "string",
    "painPoint": "string"
  },
  "dialogs": [
    {
      "id": "string",
      "title": "string",
      "tone": "drama | irony | hard-truth | other",
      "context": {
        "setting": "string",
        "situation": "string"
      },
      "hiddenQuestions": ["string"],
      "realQuestions": ["string"],
      "characters": [
        {
          "id": "string",
          "name": "string",
          "role": "myth | truth",
          "description": "string"
        }
      ],
      "lines": [
        {
          "speaker": "string",
          "text": "string",
          "type": "line | pause | quote | reveal | punchline",
          "direction": "string"
        }
      ],
      "whyResonates": "string"
    }
  ]
}
```

---

## Описание полей

### `quote` — исходная цитата
| Поле | Тип | Описание |
|---|---|---|
| `uuid` | string | `quoteId` из `quote.json`. |
| `text` | string | `quote` из `quote.json`, дословно. |
| `author` | string | `author` из `quote.json`. |

### `tension` — напряжение цитаты (одно на все диалоги)
| Поле | Тип | Описание |
|---|---|---|
| `myth` | string | Общепринятое убеждение, которое опровергает цитата. |
| `answer` | string | Как цитата переворачивает это убеждение. |
| `painPoint` | string | Где зритель узнаёт себя. |

### `dialogs[]` — диалог
| Поле | Тип | Описание |
|---|---|---|
| `id` | string | Порядковый номер: `"1"`, `"2"`, `"3"`. |
| `title` | string | Название сцены, 1–3 слова («Чайник»). |
| `tone` | enum | `drama`, `irony`, `hard-truth` или `other`. |
| `context.setting` | string | Место и время («Кухня, три часа ночи»). |
| `context.situation` | string | Что случилось, 1–2 предложения. |
| `hiddenQuestions` | string[] | От 1 до 4 скрытых вопросов, которые подсознательно мучают главного героя, но которые он не задаёт открыто («Почему она выбрала не меня?»). Сценарист угадывает, каким вопросом мучается герой. Каждый — короткая фраза от первого лица, в форме вопроса. Вслух в `lines` не звучат, их выдают подтекст и реплика `reveal`. |
| `realQuestions` | string[] | От 1 до 4 настоящих вопросов за скрытыми. Встань в роль психотерапевта: скрытый вопрос живёт только в сцене («Почему она выбрала не меня?», «Может, я ещё её добьюсь?»), а за ним стоит общий вопрос, ответ на который — цитата-откровение («Можно ли добиться любви?», «Можно ли заслужить любовь?»). Переформулируй каждый скрытый вопрос в такой настоящий. Правила: вопрос о центральной теме цитаты, а не о личной обиде героя; понятен без сцены — без имён, «он/она», деталей и обстоятельств сцены; короткий, живой, в форме вопроса (с «ли» или вопросительным словом); цитата отвечает на него прямо, одной фразой своими словами; не повторяет скрытый вопрос дословно. Вслух в `lines` не звучит. |
| `characters` | array | Ровно 2 персонажа. |
| `lines` | array | От 4 до 10 реплик, по порядку. |
| `whyResonates` | string | Почему цепляет: какое напряжение раскрыто, где выдающая деталь, чем запоминается финал. |

### `characters[]` — персонаж
| Поле | Тип | Описание |
|---|---|---|
| `id` | string | Короткий ключ, на него ссылается `lines[].speaker` (`"younger"`, `"coach"`). |
| `name` | string | Как назвать в субтитрах («Младший брат», «Тренер»). |
| `role` | enum | `myth` — верит в общепринятое; `truth` — говорит цитату. |
| `description` | string | Кто он, 1 строка. |

### `lines[]` — реплика
| Поле | Тип | Описание |
|---|---|---|
| `speaker` | string | `id` персонажа. |
| `text` | string | Текст реплики. Для паузы `"…"`. |
| `type` | enum | Роль реплики в схеме (см. ниже). |
| `direction` | string? | Необязательная ремарка: интонация, жест, пауза («тихо», «не оборачиваясь»). |

#### Типы реплик (`type`)
| Значение | Смысл | Сколько |
|---|---|---|
| `line` | Обычная реплика: завязка, позиция героя. | любое |
| `reveal` | Выдающая деталь: герой сам себя разоблачает. | ≥ 1, до `quote` |
| `pause` | Молчание (`text: "…"`). | любое |
| `quote` | Реплика с цитатой. | ровно 1 |
| `punchline` | Короткая финальная реплика после цитаты. | 0–1, после `quote` |

---

## Правила валидации

1. Длина `dialogs` — от 1 до 3, по умолчанию 3.
2. В `characters` ровно 2 персонажа: один с `role: "myth"`, другой с `role: "truth"`.
3. В `lines` от 4 до 10 элементов.
4. В диалоге ровно одна реплика с `type: "quote"`, её произносит персонаж с `role: "truth"`.
5. Реплика `quote` не стоит первой. Перед ней есть хотя бы одна реплика `reveal`.
6. Если есть `punchline`, она идёт после `quote` и последней (паузы `pause` между ними допустимы).
7. Каждый `lines[].speaker` совпадает с `id` одного из `characters`.
8. Значения `tone` у диалогов разные.
9. У каждого диалога в `hiddenQuestions` от 1 до 4 разных коротких вопросов, и ни один не звучит в `lines` дословно.
10. У каждого диалога в `realQuestions` от 1 до 4 разных вопросов: без контекста сцены, о центральной теме цитаты, цитата отвечает на каждый прямо; ни один не совпадает со скрытым вопросом и не звучит в `lines` дословно.

---

## Zod-схема

```ts
import { z } from 'zod';

export const lineSchema = z.object({
  speaker: z.string().min(1),
  text: z.string().min(1),
  type: z.enum(['line', 'reveal', 'pause', 'quote', 'punchline']),
  direction: z.string().optional(),
});

export const characterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.enum(['myth', 'truth']),
  description: z.string().min(1),
});

export const dialogSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    tone: z.enum(['drama', 'irony', 'hard-truth', 'other']),
    context: z.object({
      setting: z.string().min(1),
      situation: z.string().min(1),
    }),
    hiddenQuestions: z.array(z.string().min(1)).min(1).max(4),
    realQuestions: z.array(z.string().min(1)).min(1).max(4),
    characters: z.array(characterSchema).length(2),
    lines: z.array(lineSchema).min(4).max(10),
    whyResonates: z.string().min(1),
  })
  .refine((d) => d.lines.filter((l) => l.type === 'quote').length === 1, {
    message: 'Exactly one quote line required',
  })
  .refine((d) => {
    const quoteIndex: number = d.lines.findIndex((l) => l.type === 'quote');
    return d.lines.slice(0, quoteIndex).some((l) => l.type === 'reveal');
  }, { message: 'A reveal line must precede the quote' });

export const dialogsFileSchema = z.object({
  quote: z.object({
    uuid: z.string().uuid(),
    text: z.string().min(1),
    author: z.string().min(1),
  }),
  tension: z.object({
    myth: z.string().min(1),
    answer: z.string().min(1),
    painPoint: z.string().min(1),
  }),
  dialogs: z.array(dialogSchema).min(1).max(3),
});

export type Line = z.infer<typeof lineSchema>;
export type Character = z.infer<typeof characterSchema>;
export type Dialog = z.infer<typeof dialogSchema>;
export type DialogsFile = z.infer<typeof dialogsFileSchema>;
```

Схема покрывает правила 2 (частично: число персонажей), 3, 4 (частично: только число цитат) и 5 (частично: только `reveal`). Правила 1, 6, 7, 8, 9, 10 и роли персонажей можно добавить отдельными `refine` при необходимости.

---

## Пример (один диалог)

```json
{
  "quote": {
    "uuid": "bf777aa1-99e1-51ab-95d2-d43bbc473b34",
    "text": "Если за любовь приходится бороться, то это не любовь, а спортивная вольная борьба.",
    "author": "Н.Векшин"
  },
  "tension": {
    "myth": "За любовь надо бороться — это красиво и героично.",
    "answer": "Если приходится бороться, взаимности нет — это соревнование, а не любовь.",
    "painPoint": "Борюсь за того, кто меня не выбирает, и называю это любовью."
  },
  "dialogs": [
    {
      "id": "2",
      "title": "Ковёр",
      "tone": "irony",
      "context": {
        "setting": "Зал вольной борьбы, после спарринга",
        "situation": "Тимура положили за сорок секунд. Его девушка теперь встречается с этим соперником из того же зала."
      },
      "hiddenQuestions": ["Почему она выбрала не меня?", "Чем он лучше меня?"],
      "realQuestions": ["Нужно ли бороться за любовь?", "Можно ли отвоевать любовь у соперника?"],
      "characters": [
        { "id": "timur", "name": "Тимур", "role": "myth", "description": "Молодой борец, хочет доказать, что он лучше." },
        { "id": "coach", "name": "Тренер", "role": "truth", "description": "Тренер по вольной борьбе, тридцать лет в зале." }
      ],
      "lines": [
        { "speaker": "coach", "text": "Ты где был на ковре? Сёмин положил тебя за сорок секунд.", "type": "line" },
        { "speaker": "timur", "text": "Тренер, она теперь с ним. Я хотел ему доказать…", "type": "line" },
        { "speaker": "coach", "text": "Доказать что? И кому?", "type": "line" },
        { "speaker": "timur", "text": "Ей. Что я лучше.", "type": "reveal" },
        { "speaker": "coach", "text": "Сынок, я тридцать лет в этом зале. Запомни: если за любовь приходится бороться, то это не любовь, а спортивная вольная борьба.", "type": "quote" },
        { "speaker": "timur", "text": "…", "type": "pause" },
        { "speaker": "coach", "text": "А в вольной борьбе ты, как видишь, тоже не очень.", "type": "punchline", "direction": "уходя" }
      ],
      "whyResonates": "Цитата оживает буквально: тренер по вольной борьбе отличает любовь от спорта. «Что я лучше» выдаёт соревнование вместо любви, а смешной финал смягчает горькую правду."
    }
  ]
}
```
