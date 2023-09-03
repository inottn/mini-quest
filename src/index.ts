/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { isFunction, withResolvers } from '@inottn/fp-utils';
import { aliasMethods } from './constants';
import defaults from './defaults';
import dispatchRequest from './dispatchRequest';
import { createError } from './error';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';
import type {
  InstanceConfig,
  RequestConfigWithoutUrl,
  RequestConfig,
  Response,
  MergedRequestConfig,
  MergedRequestMethod,
  DownloadConfigWithoutUrl,
  UploadConfigWithoutUrl,
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
  [key in Exclude<AliasMethod, 'download' | 'upload'>]: <
    T,
    R = Response<T>,
    D = any,
  >(
    url: string,
    config?: RequestConfigWithoutUrl<D>,
  ) => Promise<R>;
} & {
  download: <T, R = Response<T>, D = any>(
    url: string,
    config?: DownloadConfigWithoutUrl<D>,
  ) => Promise<R>;
  upload: <T, R = Response<T>, D = any>(
    url: string,
    config?: UploadConfigWithoutUrl<D>,
  ) => Promise<R>;
};

type MiniQuestInstance = MiniQuest['request'] & MiniQuest;

interface MiniQuest extends AliasMethodMapped {}

class MiniQuest {
  private locked = false;

  private unlockResolves?: ReturnType<typeof withResolvers<void>>;

  defaults?: InstanceConfig;

  interceptors = {
    request: new InterceptorManager<MergedRequestConfig>(),
    response: new InterceptorManager<Response>(),
  };

  constructor(instanceConfig?: InstanceConfig) {
    this.defaults = mergeConfig(defaults, instanceConfig);
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

    const chain: any[] = [dispatchRequest, undefined];
    let promise = Promise.resolve(config);

    this.interceptors.request.forEach(
      function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      },
    );

    while (chain.length) {
      promise = promise.then(this.waitForUnlock(chain.shift()), chain.shift());
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
    if (!this.locked) {
      this.unlockResolves = withResolvers();
      this.locked = true;
    }
  }

  unlock() {
    this.locked = false;
    this.unlockResolves?.resolve();
  }

  interrupt() {
    this.locked = false;
    this.unlockResolves?.reject();
  }

  isLocked() {
    return this.locked;
  }

  private waitForUnlock(fn?: Function) {
    if (!isFunction(fn)) return fn;

    return (config: MergedRequestConfig) => {
      if (this.isLocked() && !config.skipLock) {
        return this.unlockResolves?.promise
          .then(() => fn(config))
          .catch(() => {
            throw createError('request interrupted', { config });
          });
      }

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

aliasMethods.forEach((method) => {
  MiniQuest.prototype[method] = function <T, R, D>(
    url: string,
    config: RequestConfigWithoutUrl = {},
  ) {
    config.method = method;
    return this.request<T, R, D>(url, config);
  };
});

export function create(instanceConfig?: InstanceConfig) {
  return MiniQuest.create(instanceConfig);
}

const miniquest = create();

export default miniquest;

export { poll, retry } from '@inottn/fp-utils';
