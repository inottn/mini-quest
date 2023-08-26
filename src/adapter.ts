import { withResolvers } from '@inottn/fp-utils';
import settle from './settle';
import {
  transformConfig,
  transformResponse,
  sdkDownload,
  sdkRequest,
  sdkUpload,
} from './utils';
import type { MergedRequestConfig, Response } from './types';

export default function adapter(config: MergedRequestConfig) {
  const { method, complete } = config;
  const { promise, resolve, reject } = withResolvers<Response>();
  const transformedConfig = transformConfig(config);

  transformedConfig.complete = function (rawResponse) {
    const response = transformResponse(rawResponse, config);
    complete?.call(config, rawResponse);
    settle(resolve, reject, response);
  };

  if (method === 'DOWNLOAD') {
    sdkDownload(transformedConfig);
  } else if (method === 'UPLOAD') {
    sdkUpload(transformedConfig);
  } else {
    sdkRequest(transformedConfig);
  }

  return promise;
}
