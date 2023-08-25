import { defineConfig } from 'vite';
import Unocss from 'unocss/vite';
import { presetAttributify, presetUno } from 'unocss';

export default defineConfig({
  optimizeDeps: {
    exclude: ['vitepress'],
  },

  plugins: [
    Unocss({
      presets: [
        presetUno({
          dark: 'media',
        }),
        presetAttributify(),
      ],
    }),
  ],
});
