import { beforeEach, describe, expect, it } from 'vitest';
import { clearMock, mockRequest } from './mockAlipaySdk';
import { createMockAdapter } from './mock';
import { create } from '../src';

describe('adapter', () => {
  beforeEach(() => {
    clearMock();
  });

  it('default adapter', () => {
    const miniquest = create();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    mockRequest(rawResponse);
    expect(miniquest.get('test')).resolves.toMatchObject(rawResponse);
  });

  it('custom adapter', () => {
    const { adapter, setResponse } = createMockAdapter();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    const miniquest = create({
      adapter,
    });
    setResponse(rawResponse);
    expect(miniquest.get('test')).resolves.toMatchObject(rawResponse);
  });

  it('adapter is not a function', () => {
    const wrongAdapters: any[] = [null, undefined, 0, 1, '0', '', true, false];
    wrongAdapters.forEach((adapter) => {
      const miniquest = create({
        adapter,
      });
      expect(miniquest.get('test')).rejects.toThrowError(
        'adapter must be a function',
      );
    });
  });
});
