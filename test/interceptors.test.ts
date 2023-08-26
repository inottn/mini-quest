import { describe, expect, it } from 'vitest';
import { createMockAdapter } from './mock';
import { create } from '../src';

describe('interceptors', () => {
  it('request interceptors', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({ adapter });
    const rawResponse = {
      headers: {},
      status: 200,
      data: 1,
    };

    setResponse(rawResponse);
    miniquest.interceptors.request.use((config) => {
      expect(config).toMatchObject({
        headers: { customField1: 'second', customField2: 'second' },
      });
      config.headers.customField3 = 'third';
      return config;
    });
    miniquest.interceptors.request.use((config) => {
      expect(config).toMatchObject({ headers: { customField1: 'first' } });
      config.headers.customField1 = 'second';
      config.headers.customField2 = 'second';
      return config;
    });
    miniquest.interceptors.request.use((config) => {
      config.headers.customField1 = 'first';
      return config;
    });
    await miniquest.get('test');

    const { lastCall } = adapter.mock;
    expect(lastCall?.[0]).toMatchObject({
      headers: {
        customField1: 'second',
        customField2: 'second',
        customField3: 'third',
      },
    });
  });

  it('response interceptors', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({ adapter });
    const rawResponse = {
      headers: {},
      status: 200,
      data: 1,
    };

    setResponse(rawResponse);
    miniquest.interceptors.response.use((response) => {
      expect(response).toMatchObject(response);
      response.data = 'first';
      return response;
    });
    miniquest.interceptors.response.use((response) => {
      expect(response).toMatchObject({ data: 'first' });
      response.data = 'second';
      return response;
    });

    const response = await miniquest.get('test');
    expect(response).toMatchObject({ data: 'second' });
  });
});
