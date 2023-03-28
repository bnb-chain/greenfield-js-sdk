import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import builtins from 'rollup-plugin-node-builtins';
import path from 'path';

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
  ];
};
