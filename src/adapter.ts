import { withResolvers } from '@inottn/fp-utils';
import settle from './settle';
import {
  transformConfig,
  transformResponse,
  sdkDownload,
  sdkRequest,
  sdkUpload,
} from './utils';
import type { Config, Response } from './types';

export default function adapter(config: Config) {
  const { method, complete } = config;
  const { promise, resolve, reject } = withResolvers<Response>();

  config = transformConfig(config);
  config.complete = function (rawResponse) {
    const response = transformResponse(rawResponse, config);
    complete?.call(config, rawResponse);
    settle(resolve, reject, response);
  };

  if (method === 'DOWNLOAD') {
    sdkDownload(config);
  } else if (method === 'UPLOAD') {
    sdkUpload(config);
  } else {
    sdkRequest(config);
  }

  return promise;
}
