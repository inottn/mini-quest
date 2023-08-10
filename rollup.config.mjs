import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import commonjs from '@rollup/plugin-commonjs';

const entries = ['./src/index.ts'];

const plugins = [
  commonjs(),
  esbuild({
    target: 'node14',
  }),
];

export default [
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace('src/', 'dist/').replace('.ts', '-esm.js'),
        format: 'esm',
      },
      {
        file: input.replace('src/', 'dist/').replace('.ts', '-cjs.js'),
        format: 'cjs',
      },
    ],
    plugins,
    external: ['@inottn/fp-utils'],
  })),
  ...entries.map((input) => ({
    input,
    output: {
      file: input.replace('src/', '').replace('.ts', '.d.ts'),
      format: 'esm',
    },
    plugins: [dts()],
  })),
];
