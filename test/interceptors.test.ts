import { describe, expect, it } from 'vitest';
import { createMockAdapter } from './mock';
import { create } from '../src';

describe('interceptors', () => {
  it('request interceptors', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({ adapter });
    const rawResponse = {
      headers: {},
      status: 200,
      data: 1,
    };

    setResponse(rawResponse);
    miniquest.interceptors.request.use((config) => {
      config.headers.customField3 = 'third';
      return config;
    });
    const id = miniquest.interceptors.request.use((config) => {
      expect(config).toMatchObject({ headers: { customField1: 'first' } });
      config.headers.customField1 = 'second';
      config.headers.customField2 = 'second';
      return config;
    });
    miniquest.interceptors.request.use((config) => {
      config.headers.customField1 = 'first';
      return config;
    });

    // 测试拦截器是否逆序执行
    await miniquest.get('test');
    expect(adapter.mock.lastCall?.[0]).toMatchObject({
      headers: {
        customField1: 'second',
        customField2: 'second',
        customField3: 'third',
      },
    });

    // 测试删除一个拦截器是否符合预期
    miniquest.interceptors.request.eject(id);
    await miniquest.get('test');
    expect(adapter.mock.lastCall?.[0]).toMatchObject({
      headers: {
        customField1: 'first',
        customField3: 'third',
      },
    });
  });

  it('response interceptors', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({ adapter });
    const rawResponse = {
      headers: {},
      status: 200,
      data: 1,
    };

    setResponse(rawResponse);
    miniquest.interceptors.response.use((response) => {
      expect(response).toMatchObject(response);
      response.data = 'first';
      return response;
    });
    const id = miniquest.interceptors.response.use((response) => {
      expect(response).toMatchObject({ data: 'first' });
      response.data = 'second';
      return response;
    });

    // 测试拦截器是否顺序执行
    expect(await miniquest.get('test')).toMatchObject({ data: 'second' });

    // 测试删除一个拦截器是否符合预期
    miniquest.interceptors.response.eject(id);
    expect(await miniquest.get('test')).toMatchObject({ data: 'first' });
  });
});
