import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import autoExternal from 'rollup-plugin-auto-external';
import nodePolyfills from 'rollup-plugin-polyfill-node';

import pkg from './package.json';
// const pathResolve = (p) => path.resolve(__dirname, p);

function resolveExternal() {
  return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
}

export default async () => {
  return [
    // ESM
    {
      input: './src/index.ts',
      output: {
        dir: './dist/esm',
        format: 'esm',
        sourcemap: true,
        // entryFileNames: '[name].esm.js',
      },
      external: resolveExternal(),
      context: 'window',
      treeshake: true,
      plugins: [
        commonjs({
          defaultIsModuleExports: false,
        }),
        resolve({
          exportConditions: ['default', 'module', 'import'],
          mainFields: ['module', 'main'],
          modulesOnly: true,
          preferBuiltins: false,
        }),
        typescript({
          tsconfig: './config/tsconfig-esm.json',
          declarationDir: './dist/esm',
        }),
        // terser()
      ],
    },

    // CJS
    {
      input: './src/index.ts',
      output: {
        dir: './dist/cjs',
        format: 'cjs',
        sourcemap: true,
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
          tsconfig: './config/tsconfig-cjs.json',
          declarationDir: './dist/cjs/types',
        }),
        // terser()
      ],
    },
  ];
};
