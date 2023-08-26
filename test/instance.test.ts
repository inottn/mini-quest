import { describe, expect, it } from 'vitest';
import { createMockAdapter } from './mock';
import miniquest, { create } from '../src';

describe('instance', () => {
  it('default instance', () => {
    const { adapter, setResponse } = createMockAdapter();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    setResponse(rawResponse);
    expect(miniquest.get('test', { adapter })).resolves.toMatchObject(
      rawResponse,
    );
  });

  it('create instance', () => {
    const { adapter, setResponse } = createMockAdapter();
    const rawResponse = {
      headers: {},
      status: 200,
      data: 'test',
    };
    setResponse(rawResponse);
    const miniquest = create({
      adapter,
    });
    expect(miniquest.get('test')).resolves.toMatchObject(rawResponse);
  });
});
