import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import autoExternal from 'rollup-plugin-auto-external';
import pkg from './package.json';

function resolveExternal() {
  return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
}

export default async () => {
  return [
    {
      input: './index.ts',
      output: {
        dir: './dist',
        format: 'cjs',
        banner: '#!/usr/bin/env node',
      },
      external: resolveExternal(),
      plugins: [
        autoExternal(),
        nodePolyfills({
          include: 'node_modules/**',
        }),
        commonjs({
          ignoreDynamicRequires: true,
        }),
        typescript({
          tsconfig: './tsconfig.json',
        }),
      ],
    },
  ];
};
