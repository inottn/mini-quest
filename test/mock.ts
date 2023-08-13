import { vi } from 'vitest';
import type { TransformedConfig } from 'src/types';

vi.stubGlobal('my', {
  request: (config: TransformedConfig) => {
    config.success(1);
  },
  uploadFile: vi.fn(),
  downloadFile: vi.fn(),
});
