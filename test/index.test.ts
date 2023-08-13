import { describe, expect, it } from 'vitest';
import './mock';
import { Request } from '../src';

describe('miniapp-request', () => {
  it('get', () => {
    const http = new Request();
    expect(http.get('test')).resolves.toBe(1);
  });
});
