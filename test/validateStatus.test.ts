import { describe, expect, it } from 'vitest';
import { mockRequest } from './mock';
import { create } from '../src';

describe('validateStatus', () => {
  it('default validateStatus', async () => {
    const http = create();
    const statusList = [200, 240, 280, 320, 360, 400, 410, 450, 500];

    for (const status of statusList) {
      mockRequest({
        headers: {},
        status,
        data: 1,
      });

      if (status >= 200 && status < 300) {
        await expect(http.get('test')).resolves.toMatchObject({
          status,
          data: 1,
        });
      } else {
        await expect(http.get('test')).rejects.toThrowError(
          'http status error',
        );
      }
    }
  });

  it('custom validateStatus', async () => {
    const http = create();
    const statusList = [200, 240, 280, 320, 360, 400, 410, 450, 500];
    const validateStatus = (status: number) => status >= 200 && status < 400;

    for (const status of statusList) {
      mockRequest({
        headers: {},
        status,
        data: 1,
      });

      if (validateStatus(status)) {
        await expect(
          http.get('test', {
            validateStatus,
          }),
        ).resolves.toMatchObject({
          status,
          data: 1,
        });
      } else {
        await expect(
          http.get('test', {
            validateStatus,
          }),
        ).rejects.rejects.toThrowError('http status error');
      }
    }
  });
});
