import { describe, expect, it } from 'vitest';
import buildFullPath from '../src/buildFullPath';

describe('url', () => {
  it('is an absolute url', () => {
    const baseURL = 'https://test.com';
    const url = 'https://test.com/user?id=1';

    expect(buildFullPath(baseURL, url)).toBe(url);
    expect(buildFullPath(undefined, url)).toBe(url);
  });

  it('not an absolute url', () => {
    const baseURL = 'https://test.com';
    const url = '/user?id=1';
    const fullPath = buildFullPath(baseURL, url);
    expect(fullPath).not.toBe(url);
    expect(fullPath).toBe(baseURL + url);
    expect(buildFullPath(undefined, url)).toBe(url);
  });
});
