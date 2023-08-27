import { isObject, isUndefined } from '@inottn/fp-utils';
import adapter from './adapter';
import type { InstanceConfig } from './types';

const defaultConfig: InstanceConfig = {
  adapter,
  headers: { 'content-type': 'application/json' },
  transformRequest: [
    function defaultTransformRequest(data) {
      if (isObject(data)) {
        for (const key of Object.keys(data)) {
          if (isUndefined(data[key])) {
            delete data[key];
          }
        }
      }

      return data;
    },
  ],
  validateStatus: (status: number) => {
    return status >= 200 && status < 300;
  },
};

export default defaultConfig;
