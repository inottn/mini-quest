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

export type RequestHeaders = Record<string, string>;
export type ResponseHeaders = Record<string, string>;

export interface RawResponse<T = any> {
  data: T;
  statusCode?: number;
  header?: ResponseHeaders;
  /** 支付宝小程序 支持 */
  status?: number;
  /** 支付宝小程序 支持 */
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
  adapter?: (config: RequestConfig<D, T>) => Promise<Response>;
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
