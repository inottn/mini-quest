import { beforeEach, describe, expect, it } from 'vitest';
import { clearMock, mockRequest } from './mock';
import { Request } from '../src';

describe('interceptors', () => {
  beforeEach(() => {
    clearMock();
  });

  it('request interceptors', async () => {
    const http = new Request();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 1,
    };
    const spy = mockRequest(rawResponse);

    http.interceptors.request.use((config) => {
      expect(config).toMatchObject({
        headers: { customField1: 'second', customField2: 'second' },
      });
      config.headers.customField3 = 'third';
      return config;
    });
    http.interceptors.request.use((config) => {
      expect(config).toMatchObject({ headers: { customField1: 'first' } });
      config.headers.customField1 = 'second';
      config.headers.customField2 = 'second';
      return config;
    });
    http.interceptors.request.use((config) => {
      config.headers.customField1 = 'first';
      return config;
    });
    await http.get('test');

    const { lastCall } = spy.mock;
    expect(lastCall?.[0]).toMatchObject({
      headers: {
        customField1: 'second',
        customField2: 'second',
        customField3: 'third',
      },
    });
  });

  it('response interceptors', async () => {
    const http = new Request();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 1,
    };

    mockRequest(rawResponse);
    http.interceptors.response.use((response) => {
      expect(response).toMatchObject(response);
      response.data = 'first';
      return response;
    });
    http.interceptors.response.use((response) => {
      expect(response).toMatchObject({ data: 'first' });
      response.data = 'second';
      return response;
    });

    const response = await http.get('test');
    expect(response).toMatchObject({ data: 'second' });
  });
});
