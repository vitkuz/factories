import { AxiosInstance, AxiosResponse, isAxiosError } from 'axios';
import { createHttpAdapter } from './http.adapter';
import { apiErrorAnswerSchema, searchAnswerSchema } from './pick-quote.schema';
import { ApiFailure, QuoteApi, QuoteApiSettings, SearchAnswer, SearchBody, SenseBody } from './pick-quote.types';
import { redact, secretsOf } from './pick-quote.utils';

export const SEARCH_PATH = '/v1/quote/search';
export const SEARCH_BY_SENSE_PATH = '/v1/quote/searchBySense';

// An axios failure -> ApiFailure: `{ status, code, message }` from the API's `{ error }` answer, or a network error.
// The request (it carries the key) is never kept; the message is redacted.
export const toApiFailure =
  (secrets: string[]) =>
  (error: unknown): ApiFailure | unknown => {
    if (!isAxiosError(error)) {
      return error;
    }
    const hide: (text: string) => string = redact(secrets);
    const status: number | undefined = error.response?.status;
    const parsed: ReturnType<typeof apiErrorAnswerSchema.safeParse> = apiErrorAnswerSchema.safeParse(error.response?.data);
    if (parsed.success) {
      return { kind: 'api-failure', status, code: parsed.data.error.code, message: hide(parsed.data.error.message) };
    }
    if (status !== undefined) {
      return { kind: 'api-failure', status, code: `HTTP_${status}`, message: `The API answered ${status}` };
    }
    return { kind: 'api-failure', code: error.code ?? 'NETWORK', message: `The API could not be reached: ${hide(error.message)}` };
  };

const postFactory =
  (http: AxiosInstance) =>
  (secrets: string[]) =>
  async (urlPath: string, body: unknown): Promise<SearchAnswer> => {
    try {
      const response: AxiosResponse<unknown> = await http.post(urlPath, body);
      return searchAnswerSchema.parse(response.data);
    } catch (error: unknown) {
      throw toApiFailure(secrets)(error);
    }
  };

export const createQuoteApi = (settings: QuoteApiSettings): QuoteApi => {
  const http: AxiosInstance = createHttpAdapter(settings);
  const post: (urlPath: string, body: unknown) => Promise<SearchAnswer> = postFactory(http)(secretsOf(settings.apiKey, settings.baseUrl));
  return {
    search: (body: SearchBody): Promise<SearchAnswer> => post(SEARCH_PATH, body),
    searchBySense: (body: SenseBody): Promise<SearchAnswer> => post(SEARCH_BY_SENSE_PATH, body),
  };
};
