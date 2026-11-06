import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from './record-processing.types';
import { redact, secretsOf } from './record-processing.utils';

export interface HttpAdapterSettings {
  baseUrl: string;
  apiKey: string;
  timeoutMs: number;
  logger: Logger;
}

export const CORRELATION_HEADER = 'x-correlation-id';
export const API_KEY_HEADER = 'x-api-key';

const correlationOf = (config: InternalAxiosRequestConfig | undefined): string => String(config?.headers?.[CORRELATION_HEADER] ?? '');

const redactedHeaders = (config: InternalAxiosRequestConfig): Record<string, unknown> => {
  const headers: Record<string, unknown> = { ...config.headers.toJSON() };
  return API_KEY_HEADER in headers ? { ...headers, [API_KEY_HEADER]: '***' } : headers;
};

// The one axios instance: every request gets a uuid correlation id; the interceptors log the request config (path,
// method, headers with the key redacted, body) and the response (status, ms, body), correlated by that id. The base
// URL is never logged.
export const createHttpAdapter = (settings: HttpAdapterSettings): AxiosInstance => {
  const hide: (text: string) => string = redact(secretsOf(settings.apiKey, settings.baseUrl));
  const startedAt: Map<string, number> = new Map();
  const instance: AxiosInstance = axios.create({
    baseURL: settings.baseUrl.replace(/\/+$/, ''),
    timeout: settings.timeoutMs,
    headers: { 'Content-Type': 'application/json', [API_KEY_HEADER]: settings.apiKey },
  });

  const elapsed = (correlationId: string): number | undefined => {
    const start: number | undefined = startedAt.get(correlationId);
    startedAt.delete(correlationId);
    return start === undefined ? undefined : Date.now() - start;
  };

  instance.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const correlationId: string = uuidv4();
    config.headers.set(CORRELATION_HEADER, correlationId);
    startedAt.set(correlationId, Date.now());
    settings.logger.info('[http] request', {
      correlationId,
      method: config.method?.toUpperCase(),
      url: hide(String(config.url ?? '')),
      headers: redactedHeaders(config),
      data: config.data === undefined ? undefined : JSON.parse(hide(JSON.stringify(config.data))),
    });
    return config;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      const correlationId: string = correlationOf(response.config);
      settings.logger.info('[http] response', {
        correlationId,
        url: hide(String(response.config.url ?? '')),
        status: response.status,
        ms: elapsed(correlationId),
      });
      settings.logger.debug('[http] response body', { correlationId, data: response.data });
      return response;
    },
    (error: AxiosError): Promise<never> => {
      const correlationId: string = correlationOf(error.config);
      settings.logger.warn('[http] error', {
        correlationId,
        url: hide(String(error.config?.url ?? '')),
        status: error.response?.status,
        code: error.code,
        ms: elapsed(correlationId),
        data: error.response?.data,
      });
      return Promise.reject(error);
    },
  );

  return instance;
};
