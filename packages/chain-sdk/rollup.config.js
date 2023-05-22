import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import builtins from 'rollup-plugin-node-builtins';

import autoExternal from 'rollup-plugin-auto-external';
import pkg from './package.json';
const pathResolve = (p) => path.resolve(__dirname, p);

function resolveExternal() {
  return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
}

export default async () => {
  return [
    {
      input: './src/index.ts',
      output: {
        dir: './dist/esm',
        format: 'esm',
      },
      external: resolveExternal(),
      context: 'window',
      treeshake: true,
      plugins: [
        json({
          include: ['src/**'],
        }),
        builtins(),
        resolve({
          exportConditions: ['default', 'module', 'import'],
          mainFields: ['module', 'main'],
          modulesOnly: true,
          preferBuiltins: false,
        }),
        commonjs({
          defaultIsModuleExports: false,
        }),
        typescript({
          tsconfig: './config/tsconfig-esm.json',
          declarationDir: './dist/esm',
        }),
        alias({
          entries: {
            '@': pathResolve('src'),
          },
        }),
      ],
    },
    {
      input: './src/index.ts',
      output: {
        dir: './dist/cjs',
        format: 'cjs',
      },
      external: resolveExternal(),
      plugins: [
        json({
          include: ['src/**'],
        }),
        autoExternal(),
        nodePolyfills({
          include: 'node_modules/**',
        }),
        commonjs({
          ignoreDynamicRequires: true,
        }),
        typescript({
          tsconfig: './config/tsconfig-cjs.json',
          declarationDir: './dist/cjs/types',
        }),
        alias({
          entries: {
            '@': pathResolve('src'),
          },
        }),
      ],
    },
  ];
};
