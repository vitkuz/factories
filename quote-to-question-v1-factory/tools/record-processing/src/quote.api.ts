import { AxiosInstance, AxiosResponse, isAxiosError } from 'axios';
import { createHttpAdapter } from './http.adapter';
import { apiErrorAnswerSchema, quoteAnswerSchema } from './record-processing.schema';
import { ApiFailure, Quote, QuoteApi, QuoteApiSettings, UpdateBody } from './record-processing.types';
import { redact, secretsOf } from './record-processing.utils';

export const GET_ONE_BY_UUID_PATH = '/v1/quote/getOneByUuid';
export const UPDATE_ONE_BY_PK_PATH = '/v1/quote/updateOneByPk';

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
  async (urlPath: string, body: unknown): Promise<Quote> => {
    try {
      const response: AxiosResponse<unknown> = await http.post(urlPath, body);
      return quoteAnswerSchema.parse(response.data) as Quote;
    } catch (error: unknown) {
      throw toApiFailure(secrets)(error);
    }
  };

export const createQuoteApi = (settings: QuoteApiSettings): QuoteApi => {
  const http: AxiosInstance = createHttpAdapter(settings);
  const post: (urlPath: string, body: unknown) => Promise<Quote> = postFactory(http)(secretsOf(settings.apiKey, settings.baseUrl));
  return {
    getOneByUuid: (uuid: string): Promise<Quote> => post(GET_ONE_BY_UUID_PATH, { uuid }),
    updateOneByPk: (body: UpdateBody): Promise<Quote> => post(UPDATE_ONE_BY_PK_PATH, body),
  };
};
