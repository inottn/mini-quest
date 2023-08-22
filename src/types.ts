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

export interface RequestTransformer {
  (this: Config, data: any, headers: RequestHeaders): any;
}

export interface ResponseTransformer {
  (this: Config, data: any, headers: ResponseHeaders, status?: number): any;
}

export type Config = {
  url?: string;
  method?: Method;
  baseURL?: string;
  transformRequest?: MaybeArray<RequestTransformer>;
  transformResponse?: MaybeArray<ResponseTransformer>;
  headers?: RequestHeaders;
  header?: RequestHeaders;
  data?: any;
  adapter?: (config: Config) => Promise<Response>;
  flush?: Boolean;
  validateStatus?: (status: number) => boolean;
  success?: (response: RawResponse) => void;
  fail?: (error: any) => void;
  complete?: (response: RawResponse) => void;
};

export type TransformedConfig = {
  url: string;
  complete(response: RawResponse): void;
};
