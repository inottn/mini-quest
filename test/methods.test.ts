import { describe, expect, it } from 'vitest';
import { createMockAdapter } from './mock';
import { create } from '../src';

describe('methods', () => {
  it('request', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({
      adapter,
    });
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    setResponse(rawResponse);
    await miniquest.request('test', { method: 'POST' });
    expect(adapter.mock.lastCall?.[0]).toMatchObject({
      url: 'test',
      method: 'POST',
    });

    await miniquest.request({ url: 'test', method: 'POST' });
    expect(adapter.mock.lastCall?.[0]).toMatchObject({
      url: 'test',
      method: 'POST',
    });
  });

  it('get', () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({
      adapter,
    });
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    setResponse(rawResponse);
    expect(miniquest.get('test')).resolves.toMatchObject(rawResponse);
  });

  it('upload', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({
      adapter,
    });
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    setResponse(rawResponse);
    await miniquest.upload('test');

    // 上传会删除 content-type 字段
    expect(adapter.mock.lastCall?.[0].headers['content-type']).toEqual(
      undefined,
    );
  });
});
