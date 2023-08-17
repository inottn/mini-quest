import { isFunction } from '@inottn/fp-utils';
import type { Response } from './types';

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
export default function settle<T extends Response>(
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void,
  response: T,
) {
  const { validateStatus } = response.config;
  if (
    response.status &&
    (!isFunction(validateStatus) || validateStatus(response.status))
  ) {
    resolve(response);
  } else {
    reject(response);
  }
}
