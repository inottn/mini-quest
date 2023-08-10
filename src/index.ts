import { lock } from '@inottn/fp-utils';
import dispatchRequest from './dispatchRequest';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';
import type { Config, Response } from './types';

export class Request {
  defaults: Config;

  dispatchRequest = lock(dispatchRequest);

  interceptors = {
    request: new InterceptorManager<Config>(),
    response: new InterceptorManager<Response>(),
  };

  constructor(instanceConfig: Config) {
    this.defaults = instanceConfig;
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

    const chain: any[] = [this.dispatchRequest, undefined];
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

  lock() {
    this.dispatchRequest.lock();
  }

  unlock() {
    this.dispatchRequest.unlock();
  }

  waitForUnlock(fn: Function) {
    return (config: Config) => {
      if (this.dispatchRequest.isLocked() && !config.flush) {
        return this.dispatchRequest.waitForUnlock().then(() => fn(config));
      }

      return fn(config);
    };
  }
}
