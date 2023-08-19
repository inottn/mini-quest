import { beforeEach, describe, expect, it } from 'vitest';
import { clearMock, mockRequest } from './mock';
import { Request } from '../src';

describe('adapter', () => {
  beforeEach(() => {
    clearMock();
  });

  it('default adapter', () => {
    const http = new Request();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    mockRequest(rawResponse);
    expect(http.get('test')).resolves.toMatchObject(rawResponse);
  });

  it('custom adapter', () => {
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    const http = new Request({
      adapter: (config) => Promise.resolve({ ...rawResponse, config }),
    });
    expect(http.get('test')).resolves.toMatchObject(rawResponse);
  });
});
