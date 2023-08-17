import { describe, expect, it } from 'vitest';
import { mockRequest } from './mock';
import { Request } from '../src';

describe('miniapp-request', () => {
  it('get', () => {
    const http = new Request();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    mockRequest(rawResponse);
    expect(http.get('test')).resolves.toMatchObject(rawResponse);
  });

  it('request interceptor', async () => {
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

  it('response interceptor', async () => {
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

  it('default validateStatus', async () => {
    const http = new Request();
    const statusList = [200, 240, 280, 320, 360, 400, 410, 450, 500];

    for (const status of statusList) {
      mockRequest({
        headers: {},
        status,
        data: 1,
      });

      if (status >= 200 && status < 300) {
        await expect(http.get('test')).resolves.toMatchObject({
          status,
          data: 1,
        });
      } else {
        await expect(http.get('test')).rejects.toMatchObject({
          status,
          data: 1,
        });
      }
    }
  });

  it('custom validateStatus', async () => {
    const http = new Request();
    const statusList = [200, 240, 280, 320, 360, 400, 410, 450, 500];
    const validateStatus = (status: number) => status >= 200 && status < 400;

    for (const status of statusList) {
      mockRequest({
        headers: {},
        status,
        data: 1,
      });

      if (validateStatus(status)) {
        await expect(
          http.get('test', {
            validateStatus,
          }),
        ).resolves.toMatchObject({
          status,
          data: 1,
        });
      } else {
        await expect(
          http.get('test', {
            validateStatus,
          }),
        ).rejects.toMatchObject({
          status,
          data: 1,
        });
      }
    }
  });
});
