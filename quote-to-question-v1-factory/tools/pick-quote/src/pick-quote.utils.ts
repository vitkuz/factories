import { SEARCH_SCOPES, SEARCH_SORTS } from './pick-quote.schema';
import { ParsedSearchUrl, PickedQuote, QuoteHit, SearchBody, SearchRequest, SearchScope, SearchSort, SenseBody } from './pick-quote.types';

export const SEARCH_PAGE_MAX = 100;
export const SENSE_LIMIT_MAX = 50;
export const UNKNOWN_AUTHOR = 'unknown';

const LANG_PATTERN: RegExp = /^[a-z]{2,3}$/;
const TEXT_FILTER_MAX = 60;

// Every other key (the console's `pk`, `cursor`, `page`: selection and paging) is dropped and listed in `ignored`.
const USED_KEYS: string[] = ['q', 'scope', 'sort', 'lang', 'author', 'category', 'tag', 'processed'];

const isScope = (value: string): value is SearchScope => (SEARCH_SCOPES as readonly string[]).includes(value);
const isSort = (value: string): value is SearchSort => (SEARCH_SORTS as readonly string[]).includes(value);

// A full console URL (`https://…/search?q=…`) or only its query (`?q=…`, `q=…`). Throws on an unparsable URL or a
// path other than /search.
export const toSearchParams = (input: string): URLSearchParams => {
  const text: string = input.trim();
  if (/^https?:\/\//i.test(text)) {
    const url: URL = new URL(text);
    if (!/\/search\/?$/.test(url.pathname)) {
      throw new Error(`not a console search URL (path ${url.pathname}, expected /search)`);
    }
    return url.searchParams;
  }
  return new URLSearchParams(text.startsWith('?') ? text.slice(1) : text);
};

const textValue = (params: URLSearchParams, key: string): string | undefined => {
  const value: string = (params.get(key) ?? '').trim();
  return value.length > 0 && value.length <= TEXT_FILTER_MAX ? value : undefined;
};

// The value of a key the console would drop (bad scope, sort, lang, processed other than `false`), as `key=value`.
const invalid = (params: URLSearchParams, key: string, kept: unknown): string[] =>
  params.has(key) && kept === undefined && (params.get(key) ?? '') !== '' ? [`${key}=${params.get(key)}`] : [];

// Reads the URL the way the console does (repos/front search.schema.ts): `q`, `scope` (incl. `sense`), `sort`, `lang`,
// `author`, `category`, `tag` (lowercased), and `processed` only when it is `false`; a bad value is dropped, like the
// console's `.catch(undefined)`. The `sense` scope asks quote.searchBySense with `query` and `lang` only.
export const parseSearchUrl = (input: string): ParsedSearchUrl => {
  const params: URLSearchParams = toSearchParams(input);
  const rawScope: string = params.get('scope') ?? '';
  const scope: SearchScope | undefined = isScope(rawScope) ? rawScope : undefined;
  const rawSort: string = params.get('sort') ?? '';
  const sort: SearchSort | undefined = isSort(rawSort) ? rawSort : undefined;
  const rawLang: string = params.get('lang') ?? '';
  const lang: string | undefined = LANG_PATTERN.test(rawLang) ? rawLang : undefined;
  const processed: false | undefined = params.get('processed') === 'false' ? false : undefined;
  const query: string = (params.get('q') ?? '').trim();
  const tag: string | undefined = textValue(params, 'tag')?.toLowerCase();
  const ignored: string[] = [
    ...invalid(params, 'scope', scope),
    ...invalid(params, 'sort', sort),
    ...invalid(params, 'lang', lang),
    ...invalid(params, 'processed', processed),
    ...[...new Set(params.keys())]
      .filter((key: string): boolean => !USED_KEYS.includes(key))
      .map((key: string): string => `${key}=${params.get(key)}`),
  ];
  if (scope === 'sense') {
    if (query.length === 0) {
      throw new Error('the sense scope needs a query (q)');
    }
    const body: SenseBody = { query, ...(lang === undefined ? {} : { lang }) };
    const senseIgnored: string[] = ['sort', 'author', 'category', 'tag', 'processed']
      .filter((key: string): boolean => params.has(key))
      .map((key: string): string => `${key}=${params.get(key)} (not used by sense)`);
    return { request: { route: 'searchBySense', body }, ignored: [...ignored, ...senseIgnored] };
  }
  const author: string | undefined = textValue(params, 'author');
  const category: string | undefined = textValue(params, 'category');
  const body: SearchBody = {
    ...(query.length === 0 ? {} : { query }),
    ...(scope === undefined ? {} : { scope }),
    ...(sort === undefined ? {} : { sort }),
    ...(lang === undefined ? {} : { lang }),
    ...(author === undefined ? {} : { author }),
    ...(category === undefined ? {} : { category }),
    ...(tag === undefined ? {} : { tag }),
    ...(processed === undefined ? {} : { processed }),
  };
  return { request: { route: 'search', body }, ignored };
};

// The next page's limit: what is left to collect, capped by the route's maximum.
export const pageLimit = (route: SearchRequest['route'], collected: number, max: number): number =>
  Math.max(0, Math.min(max - collected, route === 'search' ? SEARCH_PAGE_MAX : SENSE_LIMIT_MAX));

export const authorOf = (hit: QuoteHit): string =>
  hit.author !== undefined && hit.author.length > 0 ? hit.author.join(', ') : UNKNOWN_AUTHOR;

export const toPicked =
  (source: string, request: SearchRequest, ignored: string[]) =>
  (total: number, pool: QuoteHit[], index: number): PickedQuote => {
    const hit: QuoteHit = pool[index];
    return {
      status: 'picked',
      quote: hit.origin,
      quoteId: hit.uuid,
      author: authorOf(hit),
      lang: hit.lang,
      pk: hit.pk,
      source,
      total,
      pool: pool.length,
      index,
      request,
      ignored,
    };
  };

export const secretsOf = (apiKey: string, apiUrl: string): string[] => {
  const host: string = ((): string => {
    try {
      return new URL(apiUrl).host;
    } catch {
      return '';
    }
  })();
  return [...new Set([apiKey, apiUrl, apiUrl.replace(/\/+$/, ''), host])].filter((secret: string): boolean => secret.length > 0);
};

// Replaces every secret (the key, the API URL and its host) with `***`.
export const redact =
  (secrets: string[]) =>
  (text: string): string =>
    secrets
      .filter((secret: string): boolean => secret.length > 0)
      .reduce((acc: string, secret: string): string => acc.split(secret).join('***'), text);
