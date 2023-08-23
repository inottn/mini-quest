/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { lock } from '@inottn/fp-utils';
import defaults from './defaults';
import dispatchRequest from './dispatchRequest';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';
import type { Config, Response } from './types';

type AliasMethod =
  | 'delete'
  | 'download'
  | 'get'
  | 'head'
  | 'options'
  | 'post'
  | 'put'
  | 'upload';

type AliasMethodMapped = {
  [key in AliasMethod]: <T, R = Response<T>, D = any>(
    url: string,
    config?: Config<D>,
  ) => Promise<R>;
};

type RequestInstance = Request['request'] & Request;

interface Request extends AliasMethodMapped {}

class Request {
  defaults?: Config;

  lockRequest = lock(dispatchRequest);

  interceptors = {
    request: new InterceptorManager<Config>(),
    response: new InterceptorManager<Response>(),
  };

  constructor(instanceConfig?: Config) {
    this.defaults = mergeConfig(defaults, instanceConfig);
    this.bindAliasMethods();
  }

  request<T = any, R = Response<T>, D = any>(
    configOrUrl: string,
    config?: Config<D>,
  ): Promise<R>;
  request<T = any, R = Response<T>, D = any>(config?: Config<D>): Promise<R>;
  request(configOrUrl?: string | Config, config?: Config) {
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

  private bindAliasMethods() {
    const methods: AliasMethod[] = [
      'delete',
      'download',
      'get',
      'head',
      'options',
      'post',
      'put',
      'upload',
    ];
    methods.forEach((method) => {
      this[method] = <T, R, D>(url: string, config: Config = {}) => {
        config.method = method;
        return this.request<T, R, D>(url, config);
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
      if (this.lockRequest.isLocked() && !config.skipLock) {
        return this.lockRequest.waitForUnlock().then(() => fn(config));
      }

      if (fn === this.lockRequest) return dispatchRequest(config);

      return fn(config);
    };
  }

  static create(instanceConfig?: Config) {
    const instance = new this(instanceConfig);
    const request = instance.request.bind(instance);
    Reflect.setPrototypeOf(request, instance);
    return request as RequestInstance;
  }
}

export function create(instanceConfig?: Config) {
  return Request.create(instanceConfig);
}

export default create();
