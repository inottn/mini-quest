import dispatchRequest from './dispatchRequest';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';
import type { Config, Response } from './types';

export class Request {
  defaults: Config;

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

    const chain: any[] = [dispatchRequest, undefined];
    let promise = Promise.resolve(config);

    this.interceptors.request.forEach(
      function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      },
    );

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
}
