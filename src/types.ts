import type { MaybeArray } from '@inottn/fp-utils';

type MethodType<T extends string> = Lowercase<T> | Uppercase<T>;

export type Method =
  | MethodType<'delete'>
  | MethodType<'download'>
  | MethodType<'get'>
  | MethodType<'head'>
  | MethodType<'options'>
  | MethodType<'post'>
  | MethodType<'put'>
  | MethodType<'upload'>;

export type RequestHeaders = any;
export type ResponseHeaders = any;

export type RawResponse<T = any> = {
  data: T;
  statusCode?: number;
  header?: ResponseHeaders;
  /** 支付宝小程序 支持 */
  status?: number;
  /** 支付宝小程序 支持 */
  headers?: ResponseHeaders;
};
export type Response<T = any> = RawResponse<T> & {
  config: Config;
};

export interface RequestTransformer<D = any> {
  (this: Config, data: D, headers: RequestHeaders): any;
}

export interface ResponseTransformer<D = any> {
  (this: Config, data: D, headers: ResponseHeaders, status?: number): any;
}

export type Config<D = any> = {
  url?: string;
  method?: Method;
  baseURL?: string;
  transformRequest?: MaybeArray<RequestTransformer<D>>;
  transformResponse?: MaybeArray<ResponseTransformer<D>>;
  headers?: RequestHeaders;
  header?: RequestHeaders;
  data?: D;
  skipLock?: boolean;
  adapter?: (config: Config) => Promise<Response>;
  validateStatus?: (status: number) => boolean;
  success?: (response: RawResponse) => void;
  fail?: (error: any) => void;
  complete?: (response: RawResponse) => void;
};

export type TransformedConfig = {
  url: string;
  complete(response: RawResponse): void;
};
