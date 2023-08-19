/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { lock } from '@inottn/fp-utils';
import defaults from './defaults';
import dispatchRequest from './dispatchRequest';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';
import type { Config, Response } from './types';

export interface Request {
  delete<R>(url: string, config?: Config): Promise<R>;
  download<R>(url: string, config?: Config): Promise<R>;
  get<R>(url: string, config?: Config): Promise<R>;
  head<R>(url: string, config?: Config): Promise<R>;
  options<R>(url: string, config?: Config): Promise<R>;
  post<R>(url: string, config?: Config): Promise<R>;
  put<R>(url: string, config?: Config): Promise<R>;
  upload<R>(url: string, config?: Config): Promise<R>;
}

export class Request {
  defaults?: Config;

  lockRequest = lock(dispatchRequest);

  interceptors = {
    request: new InterceptorManager<Config>(),
    response: new InterceptorManager<Response>(),
  };

  constructor(instanceConfig?: Config) {
    this.defaults = mergeConfig(defaults, instanceConfig);
    this.bindMethods();
  }

  request<R>(configOrUrl: string, config: Config): Promise<R>;
  request<R>(config: Config): Promise<R>;
  request(configOrUrl: string | Config, config?: Config) {
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const chain: any[] = [this.lockRequest, undefined];
    let promise = Promise.resolve(config);

    this.interceptors.request.forEach(
      function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      },
    );

    while (chain.length) {
      promise = promise.then(
        this.waitForUnlock(chain.shift()),
        this.waitForUnlock(chain.shift()),
      );
    }

    this.interceptors.response.forEach(
      function pushResponseInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      },
    );

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }

  bindMethods() {
    const methods = [
      'delete',
      'download',
      'get',
      'head',
      'options',
      'post',
      'put',
      'upload',
    ] as const;
    methods.forEach((method) => {
      this[method] = <R>(url: string, config: Config = {}) => {
        config.method = method;
        return this.request<R>(url, config);
      };
    });
  }

  lock() {
    this.lockRequest.lock();
  }

  unlock() {
    this.lockRequest.unlock();
  }

  isLocked() {
    return this.lockRequest.isLocked();
  }

  waitForUnlock(fn: Function) {
    return (config: Config) => {
      if (this.lockRequest.isLocked() && !config.flush) {
        return this.lockRequest.waitForUnlock().then(() => fn(config));
      }

      if (fn === this.lockRequest) return dispatchRequest(config);

      return fn(config);
    };
  }
}
