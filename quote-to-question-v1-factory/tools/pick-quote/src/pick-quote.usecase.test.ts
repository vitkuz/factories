import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Logger, Outcome, PickedQuote, QuoteApi, QuoteHit, SearchAnswer, SearchBody, SenseBody } from './pick-quote.types';
import { pickQuote } from './pick-quote.usecase';

const silent: Logger = {
  debug: (): void => undefined,
  info: (): void => undefined,
  warn: (): void => undefined,
  error: (): void => undefined,
};

const hitOf = (n: number): QuoteHit => ({ pk: `quote#${n}`, uuid: `uuid-${n}`, origin: `quote ${n}`, lang: 'ru', author: ['Аристотель'] });

const URL_ARISTOTLE = 'https://d2m48kxqpanigi.cloudfront.net/search?q=Аристотель&scope=author&processed=false';

// A fake quote.search over `count` hits, `pageSize` per page at most, paging by a numeric cursor.
const fakeApi = (count: number, calls: (SearchBody | SenseBody)[]): QuoteApi => ({
  search: async (body: SearchBody): Promise<SearchAnswer> => {
    calls.push(body);
    const start: number = body.cursor === undefined ? 0 : Number(body.cursor);
    const end: number = Math.min(count, start + (body.limit ?? 100));
    const items: QuoteHit[] = Array.from({ length: end - start }, (_: unknown, i: number): QuoteHit => hitOf(start + i));
    return { items, total: count, took: 1, ...(end < count ? { cursor: String(end) } : {}) };
  },
  searchBySense: async (body: SenseBody): Promise<SearchAnswer> => {
    calls.push(body);
    const items: QuoteHit[] = Array.from({ length: Math.min(count, body.limit ?? 20) }, (_: unknown, i: number): QuoteHit => hitOf(i));
    return { items, total: items.length, took: 1 };
  },
});

describe('pickQuote', () => {
  it('sends the console filters, collects one page and picks the hit at the random index', async () => {
    const calls: (SearchBody | SenseBody)[] = [];
    const outcome: Outcome = await pickQuote({ api: fakeApi(7, calls), logger: silent, random: (n: number): number => n - 1 })({
      url: URL_ARISTOTLE,
      max: 100,
    });
    assert.equal(outcome.exitCode, 0);
    assert.deepEqual(calls, [{ query: 'Аристотель', scope: 'author', processed: false, limit: 100 }]);
    const picked: PickedQuote = outcome.output as PickedQuote;
    assert.deepEqual(
      { quote: picked.quote, quoteId: picked.quoteId, author: picked.author, total: picked.total, pool: picked.pool, index: picked.index },
      { quote: 'quote 6', quoteId: 'uuid-6', author: 'Аристотель', total: 7, pool: 7, index: 6 },
    );
    assert.equal(picked.source, URL_ARISTOTLE);
  });

  it('follows the cursor until `max` hits are collected', async () => {
    const calls: (SearchBody | SenseBody)[] = [];
    const outcome: Outcome = await pickQuote({ api: fakeApi(500, calls), logger: silent, random: (): number => 0 })({
      url: URL_ARISTOTLE,
      max: 250,
    });
    assert.deepEqual(
      calls.map((body: SearchBody | SenseBody): unknown => [body.limit, (body as SearchBody).cursor]),
      [
        [100, undefined],
        [100, '100'],
        [50, '200'],
      ],
    );
    assert.equal((outcome.output as PickedQuote).pool, 250);
    assert.equal((outcome.output as PickedQuote).total, 500);
  });

  it('asks quote.searchBySense for the sense scope, at most 50', async () => {
    const calls: (SearchBody | SenseBody)[] = [];
    const outcome: Outcome = await pickQuote({ api: fakeApi(80, calls), logger: silent, random: (): number => 3 })({
      url: '?q=страх&scope=sense',
      max: 100,
    });
    assert.deepEqual(calls, [{ query: 'страх', limit: 50 }]);
    assert.equal((outcome.output as PickedQuote).quoteId, 'uuid-3');
  });

  it('answers exit 2 `empty` when nothing matches', async () => {
    const outcome: Outcome = await pickQuote({ api: fakeApi(0, []), logger: silent, random: (): number => 0 })({
      url: URL_ARISTOTLE,
      max: 100,
    });
    assert.equal(outcome.exitCode, 2);
    assert.deepEqual(outcome.output, {
      status: 'empty',
      source: URL_ARISTOTLE,
      total: 0,
      request: { route: 'search', body: { query: 'Аристотель', scope: 'author', processed: false } },
      ignored: [],
    });
  });

  it('answers exit 1 with the API error', async () => {
    const api: QuoteApi = {
      search: async (): Promise<SearchAnswer> =>
        Promise.reject({ kind: 'api-failure', status: 400, code: 'BAD_REQUEST', message: 'processed: bad' }),
      searchBySense: async (): Promise<SearchAnswer> => Promise.reject(new Error('unused')),
    };
    const outcome: Outcome = await pickQuote({ api, logger: silent, random: (): number => 0 })({ url: URL_ARISTOTLE, max: 100 });
    assert.deepEqual(outcome, { exitCode: 1, output: { error: { code: 'BAD_REQUEST', message: 'processed: bad', status: 400 } } });
  });
});
