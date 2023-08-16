import { vi } from 'vitest';
import type { RawResponse, TransformedConfig } from 'src/types';

declare const my: any;

let stubResponse: RawResponse;

vi.stubGlobal('my', {
  request: (config: TransformedConfig) => {
    config.success(stubResponse);
  },
  uploadFile: vi.fn(),
  downloadFile: vi.fn(),
});

const spy = vi.spyOn(my, 'request');

export function mockRequest(response: RawResponse) {
  stubResponse = response;
  return spy;
}
