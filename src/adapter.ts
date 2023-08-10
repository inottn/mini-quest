import buildFullPath from './buildFullPath';
import type { Config } from './types';

declare const my: any;

export default function adapter(config: Config) {
  const { method, baseURL, url } = config;
  config = { ...config, url: buildFullPath(baseURL, url!) };

  if (method === 'UPLOAD') {
    return my.uploadFile(config);
  }

  if (method === 'DOWNLOAD') {
    return my.downloadFile(config);
  }

  return my.request(config);
}
