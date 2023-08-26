import { transformResponse } from '../src/utils';
import type { MergedRequestConfig, RawResponse } from '../src/types';

export function createMockAdapter(response?: RawResponse) {
  let mockResponse = response;

  const mockAdapter = (config: MergedRequestConfig) => {
    const response = transformResponse(mockResponse!, config);
    return Promise.resolve(response);
  };

  mockAdapter.setResponse = (response: RawResponse) => {
    mockResponse = response;
  };

  return mockAdapter;
}
