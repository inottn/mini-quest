import { describe, expect, it } from 'vitest';
import mergeConfig from '../src/mergeConfig';

describe('mergeConfig', () => {
  it('merge headers', async () => {
    const config1 = {
      headers: {
        'Content-Type': 'application/json',
        'custom-field': 'test',
      },
    };

    const config2 = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Custom-Field-2': 'Test',
      },
    };

    expect(mergeConfig(config1, config2)).toEqual({
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'custom-field': 'test',
        'custom-field-2': 'Test',
      },
    });
  });
});
