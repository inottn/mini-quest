import type { MaybeArray } from '@inottn/fp-utils';

type MethodType<T extends string> = Lowercase<T> | Uppercase<T>;

export type Method =
  | MethodType<'get'>
  | MethodType<'delete'>
  | MethodType<'head'>
  | MethodType<'options'>
  | MethodType<'post'>
  | MethodType<'put'>
  | MethodType<'patch'>
  | MethodType<'upload'>
  | MethodType<'download'>;

export type RequestHeaders = any;
export type ResponseHeaders = any;

export type RawResponse<T = any> = {
  data: T;
  status: number;
  headers: ResponseHeaders;
};
export type Response<T = any, D = any> = RawResponse<T> & {
  config: Config<D>;
};

export interface RequestTransformer {
  (this: Config, data: any, headers: RequestHeaders): any;
}

export interface ResponseTransformer {
  (this: Config, data: any, headers: ResponseHeaders, status?: number): any;
}

export type Config<Data = any> = {
  url?: string;
  method?: Method;
  baseURL?: string;
  transformRequest?: MaybeArray<RequestTransformer>;
  transformResponse?: MaybeArray<ResponseTransformer>;
  headers?: RequestHeaders;
  header?: RequestHeaders;
  data?: Data;
  flush?: Boolean;
  success?(response: RawResponse): void;
  fail?(error: any): void;
  complete?(): void;
};

export type TransformedConfig = {
  url: string;
  success(response: any): void;
  fail(error: any): void;
};
