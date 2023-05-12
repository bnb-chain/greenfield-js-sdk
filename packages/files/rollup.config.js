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
      wasm({
        targetEnv: 'auto-inline',
      }),
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
          browser: false,
        }),
        commonjs(),
        typescript({
          tsconfig: './config/tsconfig-cjs.json',
          declarationDir: './dist/cjs',
        }),
      ],
    }),
  ];
};
