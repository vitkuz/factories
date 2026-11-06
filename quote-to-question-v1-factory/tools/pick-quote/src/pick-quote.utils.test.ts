import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseArgs } from './args.utils';
import { ParsedSearchUrl, QuoteHit } from './pick-quote.types';
import { authorOf, pageLimit, parseSearchUrl, redact, secretsOf, toSearchParams, UNKNOWN_AUTHOR } from './pick-quote.utils';

const CONSOLE = 'https://d2m48kxqpanigi.cloudfront.net/search';
const ARISTOTLE_URL = `${CONSOLE}?q=%D0%90%D1%80%D0%B8%D1%81%D1%82%D0%BE%D1%82%D0%B5%D0%BB%D1%8C&scope=author&processed=false`;

describe('parseSearchUrl', () => {
  it('turns the console URL into the quote.search body (Cyrillic decoded, processed=false kept)', () => {
    const parsed: ParsedSearchUrl = parseSearchUrl(ARISTOTLE_URL);
    assert.deepEqual(parsed, {
      request: { route: 'search', body: { query: 'Аристотель', scope: 'author', processed: false } },
      ignored: [],
    });
  });

  it('accepts only the query string, with or without "?"', () => {
    assert.deepEqual(parseSearchUrl('?q=love&lang=en').request, { route: 'search', body: { query: 'love', lang: 'en' } });
    assert.deepEqual(parseSearchUrl('tag=Smoke').request, { route: 'search', body: { tag: 'smoke' } });
  });

  it('maps every console filter and sort', () => {
    const parsed: ParsedSearchUrl = parseSearchUrl(`${CONSOLE}?q=x&scope=text&sort=updated&lang=ru&author=A&category=c&tag=T`);
    assert.deepEqual(parsed.request, {
      route: 'search',
      body: { query: 'x', scope: 'text', sort: 'updated', lang: 'ru', author: 'A', category: 'c', tag: 't' },
    });
  });

  it('drops what the console drops and lists it in `ignored`', () => {
    const parsed: ParsedSearchUrl = parseSearchUrl(`${CONSOLE}?scope=bad&sort=x&lang=RUS1&processed=true&pk=quote%23abc&page=2&cursor=c1`);
    assert.deepEqual(parsed.request, { route: 'search', body: {} });
    assert.deepEqual(parsed.ignored, ['scope=bad', 'sort=x', 'lang=RUS1', 'processed=true', 'pk=quote#abc', 'page=2', 'cursor=c1']);
  });

  it('sends the sense scope to quote.searchBySense with query and lang only', () => {
    const parsed: ParsedSearchUrl = parseSearchUrl(`${CONSOLE}?q=страх&scope=sense&lang=ru&processed=false`);
    assert.deepEqual(parsed.request, { route: 'searchBySense', body: { query: 'страх', lang: 'ru' } });
    assert.deepEqual(parsed.ignored, ['processed=false (not used by sense)']);
  });

  it('refuses a sense URL without a query and a URL that is not /search', () => {
    assert.throws(() => parseSearchUrl(`${CONSOLE}?scope=sense`), /needs a query/);
    assert.throws(() => toSearchParams('https://d2m48kxqpanigi.cloudfront.net/dashboard'), /expected \/search/);
  });
});

describe('pageLimit', () => {
  it('caps by what is left and by the route maximum', () => {
    assert.equal(pageLimit('search', 0, 250), 100);
    assert.equal(pageLimit('search', 200, 250), 50);
    assert.equal(pageLimit('searchBySense', 0, 100), 50);
    assert.equal(pageLimit('search', 10, 10), 0);
  });
});

describe('authorOf', () => {
  const hit: QuoteHit = { pk: 'quote#a', uuid: 'a', origin: 'o', lang: 'ru' };
  it('joins the authors, or says unknown', () => {
    assert.equal(authorOf({ ...hit, author: ['Аристотель'] }), 'Аристотель');
    assert.equal(authorOf({ ...hit, author: ['A', 'B'] }), 'A, B');
    assert.equal(authorOf({ ...hit, author: [] }), UNKNOWN_AUTHOR);
    assert.equal(authorOf(hit), UNKNOWN_AUTHOR);
  });
});

describe('redact', () => {
  it('hides the key, the URL and its host', () => {
    const hide: (text: string) => string = redact(secretsOf('k-123', 'https://api.example.com/prod/'));
    assert.equal(hide('k-123 at https://api.example.com/prod on api.example.com'), '*** at *** on ***');
  });
});

describe('parseArgs', () => {
  it('reads --url (also with "=" inside the URL) and --max', () => {
    assert.deepEqual(parseArgs(['--url', ARISTOTLE_URL, '--max', '20']), { url: ARISTOTLE_URL, max: '20', help: false });
    assert.deepEqual(parseArgs([`--url=${ARISTOTLE_URL}`]), { url: ARISTOTLE_URL, help: false });
  });

  it('refuses an unknown flag and a missing value', () => {
    assert.throws(() => parseArgs(['--uuid', 'x']), /unknown argument/);
    assert.throws(() => parseArgs(['--url']), /needs a value/);
  });
});
