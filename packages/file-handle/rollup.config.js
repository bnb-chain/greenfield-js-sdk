import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import autoExternal from 'rollup-plugin-auto-external';
import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import wasm from '@rollup/plugin-wasm';
import copy from 'rollup-plugin-copy';

const buildConfig = ({
  input = './src/index.ts',
  es5,
  browser = true,
  minifiedVersion = true,
  ...config
}) => {
  const build = ({ minified }) => ({
    input,
    ...config,
    output: {
      ...config.output,
    },
    plugins: [
      json(),
      resolve({ browser }),
      commonjs(),
      minified && terser(),
      ...(es5
        ? [
            babel({
              // babelHelpers: 'bundled',
              // presets: ['@babel/preset-env'],
            }),
          ]
        : []),
      ...(config.plugins || []),
    ],
  });

  const configs = [build({ minified: false })];

  if (minifiedVersion) {
    build({ minified: true });
  }

  return configs;
};

export default async () => {
  return [
    ...buildConfig({
      input: './src/index.ts',
      es5: true,
      output: {
        dir: './dist/esm',
        format: 'esm',
      },
      plugins: [
        builtins(),
        nodePolyfills(),
        wasm({
          targetEnv: 'auto-inline',
        }),
        resolve({
          preferBuiltins: true,
          browser: true,
        }),
        typescript({
          tsconfig: './config/tsconfig-esm.json',
          declarationDir: './dist/esm',
        }),
      ],
    }),
    ...buildConfig({
      input: './src/index.ts',
      output: {
        dir: './dist/cjs',
        format: 'cjs',
      },
      plugins: [
        autoExternal(),
        resolve({
          preferBuiltins: false,
          browser: false,
        }),
        wasm({
          targetEnv: 'node',
        }),
        commonjs(),
        nodePolyfills(),
        typescript({
          tsconfig: './config/tsconfig-cjs.json',
          declarationDir: './dist/cjs',
        }),
      ],
    }),
    {
      input: ['./src/files-handle-wasm/node.js', './src/files-handle-wasm/web.js'],
      output: [
        { dir: './dist/files-handle-wasm/cjs', format: 'cjs', sourcemap: true },
        { dir: './dist/files-handle-wasm/esm', format: 'esm', sourcemap: true },
      ],
      plugins: [
        wasm({
          targetEnv: 'auto-inline',
        }),
        copy({
          targets: [
            { src: 'src/files-handle-wasm/main.wasm', dest: 'dist/files-handle-wasm/cjs' },
            { src: 'src/files-handle-wasm/wasm_exec_node.js', dest: 'dist/files-handle-wasm/cjs' },
            { src: 'src/files-handle-wasm/wasm_exec.js', dest: 'dist/files-handle-wasm/cjs' },
          ],
        }),
      ],
    },
  ];
};
