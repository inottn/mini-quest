import { beforeEach, describe, expect, it } from 'vitest';
import { clearMock, mockRequest } from './mock';
import { create } from '../src';

describe('methods', () => {
  beforeEach(() => {
    clearMock();
  });

  it('get', () => {
    const http = create();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    mockRequest(rawResponse);
    expect(http.get('test')).resolves.toMatchObject(rawResponse);
  });

  it('post', () => {
    const http = create();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    mockRequest(rawResponse);
    expect(http.post('test')).resolves.toMatchObject(rawResponse);
  });
});
