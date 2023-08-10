import { Config, Method } from './types';

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
  config1: Config = {},
  config2: Config = {},
) {
  const config: Config = { ...config1, ...config2 };

  config.method = (config2.method || 'get').toUpperCase() as Method;
  config.headers = { ...config1.headers, ...config2.headers };

  return config;
}
