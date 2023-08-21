import { vi } from 'vitest';
import type { RawResponse, TransformedConfig } from 'src/types';

declare const my: any;

let stubResponse: RawResponse | null = null;

if (typeof my === 'undefined') {
  vi.stubGlobal('my', {
    request: (config: TransformedConfig) => {
      config.complete(stubResponse!);
    },
    uploadFile: vi.fn(),
    downloadFile: vi.fn(),
  });
}

const spy = vi.spyOn(my, 'request');

export function clearMock() {
  stubResponse = null;
}

export function mockRequest(response: RawResponse) {
  stubResponse = response;
  return spy;
}

export function createMockAdapter(response: RawResponse) {
  let mockResponse = response;

  return {
    changeMockResponse(response: RawResponse) {
      mockResponse = response;
    },
    mockAdapter() {
      return Promise.resolve(mockResponse);
    },
  };
}
