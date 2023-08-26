import { beforeEach, describe, expect, it } from 'vitest';
import { clearMock, mockRequest } from './mockAlipaySdk';
import defaultInstance, { create } from '../src';

describe('adapter', () => {
  beforeEach(() => {
    clearMock();
  });

  it('default instance', () => {
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    mockRequest(rawResponse);
    expect(defaultInstance.get('test')).resolves.toMatchObject(rawResponse);
  });

  it('create instance', () => {
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    const http = create({
      adapter: (config) => Promise.resolve({ ...rawResponse, config }),
    });
    expect(http.get('test')).resolves.toMatchObject(rawResponse);
  });
});
