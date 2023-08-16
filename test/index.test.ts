import { describe, expect, it } from 'vitest';
import { mockRequest } from './mock';
import { Request } from '../src';

describe('miniapp-request', () => {
  it('get', () => {
    const http = new Request();
    const response = {
      headers: {},
      status: 200,
      data: 'test',
    };
    mockRequest(response);
    expect(http.get('test')).resolves.toMatchObject(response);
  });

  it('request interceptor', async () => {
    const http = new Request();
    const response = {
      headers: {},
      status: 200,
      data: 1,
    };
    http.interceptors.request.use((config) => {
      config.headers.token = 'token';
      return config;
    });
    const spy = mockRequest(response);
    await http.get('test');
    const { lastCall } = spy.mock;
    expect(lastCall?.[0]).toMatchObject({ headers: { token: 'token' } });
  });
});
