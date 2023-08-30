import { isFunction } from '@inottn/fp-utils';
import { createError } from './error';
import createSettle from './settle';
import transformData from './transformData';
import type { MiniQuestError } from './error';
import type { MergedRequestConfig, Response } from './types';

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
export default function dispatchRequest(config: MergedRequestConfig) {
  // Transform request data
  if (config.transformRequest) {
    // @ts-ignore
    // ref: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html#strictbindcallapply
    config.data = transformData.call(config, config.transformRequest);
  }

  if (!isFunction(config.adapter))
    throw createError('adapter must be a function', { config });

  return config
    .adapter(config)
    .then(createSettle(config))
    .then(
      function onAdapterResolution(response: Response) {
        // Transform response data
        if (config.transformResponse) {
          response.data = transformData.call(
            config,
            config.transformResponse,
            response,
          );
        }

        return response;
      },
      function onAdapterRejection(reason: MiniQuestError) {
        // Transform response data
        if (reason?.response && config.transformResponse) {
          const { response } = reason;
          response.data = transformData.call(
            config,
            config.transformResponse,
            response,
          );
        }

        return Promise.reject(reason);
      },
    );
}
