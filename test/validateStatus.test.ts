import { describe, expect, it } from 'vitest';
import { createMockAdapter } from './mock';
import { create } from '../src';

const statusList = [160, 200, 240, 280, 320, 360, 400, 440, 480, 520];

describe('validateStatus', () => {
  it('default validateStatus', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({
      adapter,
    });

    for (const status of statusList) {
      const response = {
        headers: {},
        status,
        data: 1,
      };
      setResponse(response);

      if (status >= 200 && status < 300) {
        await expect(miniquest.get('test')).resolves.toMatchObject(response);
      } else {
        await expect(miniquest.get('test')).rejects.toThrowError(
          'http status error',
        );
      }
    }
  });

  it('custom validateStatus', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const validateStatus = (status: number) => status >= 200 && status < 400;
    const miniquest = create({
      adapter,
      validateStatus,
    });

    for (const status of statusList) {
      const response = {
        headers: {},
        status,
        data: 1,
      };
      setResponse(response);

      if (validateStatus(status)) {
        await expect(miniquest.get('test')).resolves.toMatchObject(response);
      } else {
        await expect(miniquest.get('test')).rejects.rejects.toThrowError(
          'http status error',
        );
      }
    }
  });

  it('validateStatus is null', async () => {
    const { adapter, setResponse } = createMockAdapter();
    const miniquest = create({
      adapter,
      validateStatus: null,
    });

    for (const status of statusList) {
      const response = {
        headers: {},
        status,
        data: 1,
      };
      setResponse(response);

      await expect(miniquest.get('test')).resolves.toMatchObject(response);
    }
  });
});
