import { InstanceConfig, Method } from './types';

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

  config.method = (config2.method || 'get').toUpperCase() as Method;
  config.headers = Object.assign({}, config1.headers, config2.headers);

  return config;
}
