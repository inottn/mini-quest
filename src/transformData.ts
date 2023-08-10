import { toArray } from '@inottn/fp-utils';
import type { MaybeArray } from '@inottn/fp-utils';
import type {
  Config,
  RequestTransformer,
  ResponseTransformer,
  Response,
} from './types';

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(this: Config, fns: MaybeArray<RequestTransformer>): any;
function transformData(
  this: Config,
  fns: MaybeArray<ResponseTransformer>,
  response: Response,
): any;
function transformData(
  this: Config,
  fns: MaybeArray<RequestTransformer | ResponseTransformer>,
  response?: Response,
) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const config = this;
  const context = response || config;
  const { headers } = context;
  let { data } = context;
  fns = toArray(fns);

  fns.forEach(function transform(fn) {
    data = fn.call(
      config,
      data,
      headers,
      response ? response.status : undefined,
    );
  });

  return data;
}

export default transformData;
