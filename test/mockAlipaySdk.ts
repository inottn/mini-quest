import { vi } from 'vitest';
import type { RawResponse, RequestConfig } from '../src/types';

declare const my: any;

let stubResponse: RawResponse | null = null;

if (typeof my === 'undefined') {
  vi.stubGlobal('my', {
    request: (config: RequestConfig) => {
      config.complete!(stubResponse!);
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
