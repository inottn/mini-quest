import { describe, expect, it } from 'vitest';
import { createMockAdapter } from './mock';
import { create } from '../src';

describe('methods', () => {
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
});
