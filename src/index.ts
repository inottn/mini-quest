/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { lock } from '@inottn/fp-utils';
import defaults from './defaults';
import dispatchRequest from './dispatchRequest';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';
import type {
  InstanceConfig,
  RequestConfigWithoutUrl,
  RequestConfig,
  Response,
  MergedRequestConfig,
  MergedRequestMethod,
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
    request: new InterceptorManager<MergedRequestConfig>(),
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
    _config?: RequestConfigWithoutUrl,
  ) {
    if (typeof configOrUrl === 'string') {
      _config = _config || {};
      _config.url = configOrUrl;
    } else {
      _config = configOrUrl || {};
    }

    const config = mergeConfig(this.defaults, _config) as MergedRequestConfig;

    config.method = (
      config.method || 'get'
    ).toUpperCase() as MergedRequestMethod;

    if (config.method === 'DOWNLOAD' || config.method === 'UPLOAD') {
      delete config.headers['content-type'];
    }

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

  private waitForUnlock(fn: Function) {
    return (config: MergedRequestConfig) => {
      if (this.lockRequest.isLocked() && !config.skipLock) {
        return this.lockRequest.waitForUnlock().then(() => fn(config));
      }

      if (fn === this.lockRequest) return dispatchRequest(config);

      return fn(config);
    };
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
