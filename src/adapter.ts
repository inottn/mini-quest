import { transformConfig, sdkDownload, sdkRequest, sdkUpload } from './utils';
import type { Config } from './types';

export default function adapter(config: Config) {
  const { method } = config;

  config = transformConfig(config);

  if (method === 'DOWNLOAD') {
    return sdkDownload(config);
  }

  if (method === 'UPLOAD') {
    return sdkUpload(config);
  }

  return sdkRequest(config);
}
