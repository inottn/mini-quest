import { InstanceConfig, RequestHeaders } from './types';

export function mergeHeaders(
  headers1: RequestHeaders = {},
  headers2: RequestHeaders = {},
) {
  const headers: RequestHeaders = {};

  for (const key of Object.keys(headers1)) {
    const lowerK = key.toLowerCase();
    headers[lowerK] = headers1[key];
  }

  for (const key of Object.keys(headers2)) {
    const lowerK = key.toLowerCase();
    headers[lowerK] = headers2[key];
  }

  return headers;
}

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
export default function mergeConfig(
  config1: InstanceConfig = {},
  config2: InstanceConfig = {},
) {
  const config: InstanceConfig = Object.assign({}, config1, config2);

  config.headers = mergeHeaders(config1.headers, config2.headers);

  return config;
}
