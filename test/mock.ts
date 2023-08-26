import { vi } from 'vitest';
import { transformResponse } from '../src/utils';
import type { MergedRequestConfig, RawResponse } from '../src/types';

export function createMockAdapter(response?: RawResponse) {
  let mockResponse = response;

  const adapter = vi.fn((config: MergedRequestConfig) => {
    const response = transformResponse(mockResponse!, config);
    return Promise.resolve(response);
  });

  const setResponse = (response: RawResponse) => {
    mockResponse = response;
  };

  return { adapter, setResponse };
}
