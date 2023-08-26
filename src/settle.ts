import { isFunction } from '@inottn/fp-utils';
import { createError } from './error';
import type { MergedRequestConfig, Response } from './types';

export default function createSettle(config: MergedRequestConfig) {
  return function settle<T extends Response>(response: T) {
    const { validateStatus } = config;

    if (
      response.status &&
      (!isFunction(validateStatus) || validateStatus(response.status))
    ) {
      return response;
    } else {
      const message = response.status ? 'http status error' : 'request failed';
      throw createError(message, { config, response });
    }
  };
}
