import { describe, expect, it } from 'vitest';
import { createError } from '../src/error';

const config = { url: 'test' };

describe('error', () => {
  it('error message', () => {
    const error = createError('error', { config });
    expect(error.message).toBe('error');
  });

  it('stringify error', () => {
    const error1 = createError('error', { config });
    expect(JSON.parse(JSON.stringify(error1))).toMatchObject({
      message: 'error',
      config: {
        url: 'test',
      },
      status: null,
    });

    const error2 = createError('error', {
      config,
      response: { headers: {}, status: 200, config, data: 1 },
    });
    expect(JSON.parse(JSON.stringify(error2))).toMatchObject({
      message: 'error',
      config: {
        url: 'test',
      },
      status: 200,
    });
  });
});
