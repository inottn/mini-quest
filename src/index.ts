import { lock } from '@inottn/fp-utils';
import defaults from './defaults';
import dispatchRequest from './dispatchRequest';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';
import type { Config, Response } from './types';

export class Request {
  defaults?: Config;

  lockRequest = lock(dispatchRequest);

  interceptors = {
    request: new InterceptorManager<Config>(),
    response: new InterceptorManager<Response>(),
  };

  constructor(instanceConfig?: Config) {
    this.defaults = mergeConfig(defaults, instanceConfig);
  }

  request(configOrUrl: string, config: Config): Promise<any>;
  request(config: Config): Promise<any>;
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

  get(url: string, config: Config = {}) {
    config.method = 'get';
    return this.request(url, config);
  }

  post(url: string, config: Config = {}) {
    config.method = 'post';
    return this.request(url, config);
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
