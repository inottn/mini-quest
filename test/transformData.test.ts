import { describe, expect, it } from 'vitest';
import { createMockAdapter } from './mock';
import { create } from '../src';

describe('transformData', () => {
  it('default transformRequest', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const response = {
      headers: {
        'test-field': 'test-value',
      },
      status: 200,
      data: 1,
    };
    const miniquest = create({
      adapter,
    });

    setResponse(response);
    await miniquest.post('test', {
      data: {
        a: undefined,
        b: 1,
      },
    });
    expect(adapter.mock.lastCall?.[0].data).toEqual({ b: 1 });
  });

  it('transformResponse', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const response = {
      headers: {
        'test-field': 'test-value',
      },
      status: 200,
      data: 1,
    };
    const miniquest = create({
      adapter,
      transformResponse: function (data, headers, status) {
        expect(data).toBe(response.data);
        expect(headers).toBe(response.headers);
        expect(status).toBe(response.status);
      },
    });

    setResponse(response);
    await miniquest.get('test');
  });

  it('passed transformResponse is an array', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const response = {
      headers: {
        'test-field': 'test-value',
      },
      status: 200,
      data: 1,
    };
    const miniquest = create({
      adapter,
      transformResponse: [
        function (data, headers, status) {
          expect(data).toBe(response.data);
          expect(headers).toBe(response.headers);
          expect(status).toBe(response.status);
          data = 'test';

          return data;
        },
        function (data) {
          expect(data).toBe('test');
        },
      ],
    });

    setResponse(response);
    await miniquest.get('test');
  });
});
