import { describe, expect, it, vi } from 'vitest';
import { createMockAdapter } from './mock';
import { create } from '../src';

const { mockedRequest, mockedUpload, setResponse } = vi.hoisted(() => {
  let mockedResponse: any;
  return {
    setResponse: (response: any) => {
      mockedResponse = response;
    },
    mockedRequest: vi.fn((config) => {
      config.complete(mockedResponse);
    }),
    mockedUpload: vi.fn((config) => {
      config.complete(mockedResponse);
    }),
  };
});

vi.mock('../src/utils.ts', async () => {
  const actual = (await vi.importActual('../src/utils.ts')) as any;
  return {
    ...actual,
    sdkRequest: mockedRequest,
    sdkUpload: mockedUpload,
  };
});

describe('adapter', () => {
  it('default adapter', async () => {
    const miniquest = create();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    setResponse(rawResponse);
    expect(miniquest.get('test')).resolves.toMatchObject(rawResponse);

    // 上传
    const uploadData = {
      test: 'test',
    };
    await miniquest.upload('test', {
      filePath: 'xxx',
      name: 'xxx',
      data: uploadData,
    });
    // data 字段将传递给默认适配器的 formData 字段
    expect(mockedUpload.mock.lastCall?.[0]).toHaveProperty('formData');
    expect(mockedUpload.mock.lastCall?.[0].formData).toBe(uploadData);
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
