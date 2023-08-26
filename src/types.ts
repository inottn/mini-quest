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

export type MergedRequestMethod = Uppercase<Method>;

export type RequestHeaders = Record<string, string>;
export type ResponseHeaders = Record<string, string>;

export interface RawResponse<T = any> {
  data: T;
  statusCode?: number;
  header?: ResponseHeaders;
  status?: number;
  headers?: ResponseHeaders;
}

export interface Response<T = any> extends RawResponse<T> {
  headers: ResponseHeaders;
  status: number;
  config: RequestConfig;
}

export interface RequestTransformer<D = any> {
  (this: RequestConfig, data: D, headers: RequestHeaders): any;
}

export interface ResponseTransformer<T = any> {
  (
    this: RequestConfig,
    data: T,
    headers: ResponseHeaders,
    status?: number,
  ): any;
}

export interface InstanceConfig<D = any, T = any> {
  baseURL?: string;
  headers?: RequestHeaders;
  skipLock?: boolean;
  transformRequest?: MaybeArray<RequestTransformer<D>>;
  transformResponse?: MaybeArray<ResponseTransformer<T>>;
  adapter?: (config: MergedRequestConfig<D, T>) => Promise<Response>;
  validateStatus?: (status: number) => boolean;
  success?: (response: RawResponse<T>) => void;
  fail?: (error: any) => void;
  complete?: (response: RawResponse<T>) => void;
  [key: string]: any;
}

export interface RequestConfigWithoutUrl<D = any, T = any>
  extends InstanceConfig<D, T> {
  method?: Method;
  data?: D;
}

export interface RequestConfig<D = any, T = any>
  extends RequestConfigWithoutUrl<D, T> {
  url: string;
}

export interface MergedRequestConfig<D = any, T = any>
  extends RequestConfig<D, T> {
  method: MergedRequestMethod;
  headers: RequestHeaders;
}

export interface TransformedRequestConfig<D = any, T = any>
  extends RequestConfig<D, T> {
  method: MergedRequestMethod;
  header?: RequestHeaders;
  headers?: RequestHeaders;
}
