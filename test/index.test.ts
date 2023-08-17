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
});
