import { describe, expect, it } from 'vitest';
import { createMockAdapter } from './mock';
import { create } from '../src';

const rawResponse = {
  headers: {},
  status: 200,
  data: 1,
};

describe('request lock', () => {
  it('lock and unlock', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({ adapter });
    const requestCnts = 3;

    setResponse(rawResponse);
    miniquest.lock();
    Array.from({ length: requestCnts })
      .fill(0)
      .forEach(() => {
        miniquest.get('test');
      });
    await Promise.resolve();
    expect(miniquest.isLocked()).toBe(true);
    // 当请求锁定时，不会触发请求适配器
    expect(adapter).not.toBeCalled();

    miniquest.unlock();
    expect(miniquest.isLocked()).toBe(false);
    await Promise.resolve();
    // 当请求解锁时，再触发请求适配器
    expect(adapter).toBeCalledTimes(requestCnts);
  });

  it('interrupt', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({ adapter });
    setResponse(rawResponse);

    miniquest.lock();
    const promise = miniquest.get('test').catch((error) => {
      // 当请求中断后，会抛出异常
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('request interrupted');
    });
    await Promise.resolve();
    miniquest.interrupt();
    await promise;

    // 当请求中断后，不会触发请求适配器
    expect(adapter).not.toBeCalled();
  });

  it('skipLock', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({ adapter });
    setResponse(rawResponse);

    miniquest.lock();
    miniquest.get('test', { skipLock: true });
    await Promise.resolve();

    // skipLock 为 true 时会跳过请求锁
    expect(adapter).toBeCalled();
  });
});
