/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { lock } from '@inottn/fp-utils';
import defaults from './defaults';
import dispatchRequest from './dispatchRequest';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';
import type {
  Method,
  InstanceConfig,
  RequestConfigWithoutUrl,
  RequestConfig,
  Response,
} from './types';

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
    config?: RequestConfigWithoutUrl<D>,
  ) => Promise<R>;
};

type MiniQuestInstance = MiniQuest['request'] & MiniQuest;

interface MiniQuest extends AliasMethodMapped {}

class MiniQuest {
  defaults?: InstanceConfig;

  lockRequest = lock(dispatchRequest);

  interceptors = {
    request: new InterceptorManager<RequestConfig>(),
    response: new InterceptorManager<Response>(),
  };

  constructor(instanceConfig?: InstanceConfig) {
    this.defaults = mergeConfig(defaults, instanceConfig);
    this.bindAliasMethods();
  }

  request<T = any, R = Response<T>, D = any>(
    config: RequestConfig<D, T>,
  ): Promise<R>;
  request<T = any, R = Response<T>, D = any>(
    configOrUrl: string,
    config?: RequestConfigWithoutUrl<D, T>,
  ): Promise<R>;
  request(
    configOrUrl?: string | RequestConfig,
    config?: RequestConfigWithoutUrl,
  ) {
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);
    config.method = (config.method || 'get').toUpperCase() as Method;

    if (config.method === 'DOWNLOAD' || config.method === 'UPLOAD') {
      delete config.headers!['content-type'];
    }

    const chain: any[] = [this.lockRequest, undefined];
    let promise = Promise.resolve(config as RequestConfig);

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
      this[method] = <T, R, D>(
        url: string,
        config: RequestConfigWithoutUrl = {},
      ) => {
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

  release() {
    this.lockRequest.release();
  }

  waitForUnlock(fn: Function) {
    return (config: RequestConfig) => {
      if (this.lockRequest.isLocked() && !config.skipLock) {
        return this.lockRequest.waitForUnlock().then(() => fn(config));
      }

      if (fn === this.lockRequest) return dispatchRequest(config);

      return fn(config);
    };
  }

  static create(instanceConfig?: InstanceConfig) {
    const instance = new this(instanceConfig);
    const request = instance.request.bind(instance);
    Reflect.setPrototypeOf(request, instance);
    return request as MiniQuestInstance;
  }
}

export function create(instanceConfig?: InstanceConfig) {
  return MiniQuest.create(instanceConfig);
}

const miniquest = create();

export default miniquest;

export { poll } from '@inottn/fp-utils';
