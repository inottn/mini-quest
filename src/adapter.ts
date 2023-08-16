import { withResolvers } from '@inottn/fp-utils';
import { transformConfig, sdkDownload, sdkRequest, sdkUpload } from './utils';
import type { Config, Response } from './types';

export default function adapter(config: Config) {
  const { method, success, fail } = config;
  const { promise, resolve, reject } = withResolvers<Response>();

  config = transformConfig(config);
  config.success = function (rawResponse) {
    const response = { ...rawResponse, config };
    success?.call(config, rawResponse);
    resolve(response);
  };
  config.fail = function (error) {
    fail?.call(config, error);
    reject(error);
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
