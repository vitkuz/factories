import { ApiFailure, Outcome, ParsedSearchUrl, PickInput, PickSettings, QuoteHit, SearchAnswer, SearchRequest } from './pick-quote.types';
import { pageLimit, parseSearchUrl, toPicked } from './pick-quote.utils';

interface Pool {
  hits: QuoteHit[];
  total: number;
}

const isApiFailure = (error: unknown): error is ApiFailure =>
  typeof error === 'object' && error !== null && (error as { kind?: unknown }).kind === 'api-failure';

// Collects up to `max` hits: quote.search follows the cursor page by page (a pk seen twice is kept once);
// quote.searchBySense answers one page.
const collect =
  (settings: PickSettings) =>
  async (request: SearchRequest, max: number, pool: Pool = { hits: [], total: 0 }, cursor?: string): Promise<Pool> => {
    const limit: number = pageLimit(request.route, pool.hits.length, max);
    const answer: SearchAnswer =
      request.route === 'search'
        ? await settings.api.search({ ...request.body, limit, ...(cursor === undefined ? {} : { cursor }) })
        : await settings.api.searchBySense({ ...request.body, limit });
    const seen: Set<string> = new Set(pool.hits.map((hit: QuoteHit): string => hit.pk));
    const hits: QuoteHit[] = [...pool.hits, ...answer.items.filter((hit: QuoteHit): boolean => !seen.has(hit.pk))].slice(0, max);
    const next: Pool = { hits, total: answer.total };
    settings.logger.info('page', { route: request.route, got: answer.items.length, collected: hits.length, total: answer.total });
    const more: boolean =
      request.route === 'search' &&
      answer.cursor !== undefined &&
      answer.items.length > 0 &&
      hits.length < max &&
      hits.length > pool.hits.length;
    return more ? collect(settings)(request, max, next, answer.cursor) : next;
  };

// The console URL -> the API request -> up to `max` hits -> one at random. Exit 0 picked, 2 no hits, 1 error.
export const pickQuote =
  (settings: PickSettings) =>
  async (input: PickInput): Promise<Outcome> => {
    const parsed: ParsedSearchUrl = parseSearchUrl(input.url);
    if (parsed.ignored.length > 0) {
      settings.logger.warn('url params not used', { ignored: parsed.ignored });
    }
    try {
      const pool: Pool = await collect(settings)(parsed.request, input.max);
      if (pool.hits.length === 0) {
        return {
          exitCode: 2,
          output: { status: 'empty', source: input.url, total: pool.total, request: parsed.request, ignored: parsed.ignored },
        };
      }
      const index: number = settings.random(pool.hits.length);
      return { exitCode: 0, output: toPicked(input.url, parsed.request, parsed.ignored)(pool.total, pool.hits, index) };
    } catch (error: unknown) {
      if (isApiFailure(error)) {
        return {
          exitCode: 1,
          output: { error: { code: error.code, message: error.message, ...(error.status === undefined ? {} : { status: error.status }) } },
        };
      }
      throw error;
    }
  };
