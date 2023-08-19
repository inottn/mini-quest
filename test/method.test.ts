import { beforeEach, describe, expect, it } from 'vitest';
import { clearMock, mockRequest } from './mock';
import { Request } from '../src';

describe('miniapp-request', () => {
  beforeEach(() => {
    clearMock();
  });

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

  it('post', () => {
    const http = new Request();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    mockRequest(rawResponse);
    expect(http.post('test')).resolves.toMatchObject(rawResponse);
  });
});
