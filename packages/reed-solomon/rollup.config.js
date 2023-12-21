import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import pkg from './package.json';
// const pathResolve = (p) => path.resolve(__dirname, p);

function resolveExternal() {
  return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
}

export default async () => {
  return [
    // ESM
    {
      input: ['./src/index.js', './src/web.adapter.js'],
      output: {
        format: 'es',
        dir: 'dist',
        entryFileNames: '[name].esm.js',
        sourcemap: true,
      },
      external: resolveExternal(),
      context: 'window',
      treeshake: true,
      plugins: [
        commonjs(),
        resolve({
          browser: true,
          preferBuiltins: false,
        }),
        terser(),
      ],
    },

    // CJS
    {
      input: ['./src/index.js', './src/node.adapter.js', './src/utils.js'],
      output: {
        format: 'cjs',
        // file: 'dist/index.js',
        dir: 'dist',
        sourcemap: true,
      },
      external: resolveExternal(),
      plugins: [
        // commonjs(),
        // resolve({
        //   browser: true,
        //   preferBuiltins: false,
        // }),
      ],
    },

    // UMD
    {
      input: './src/index.js',
      output: {
        format: 'umd',
        file: 'dist/index.aio.js',
        name: 'RS',
        sourcemap: true,
      },
      plugins: [
        commonjs(),
        resolve({
          browser: true,
          preferBuiltins: false,
        }),
        terser(),
      ],
    },
    {
      input: './src/web.adapter.js',
      output: {
        format: 'umd',
        file: 'dist/web.adapter.aio.js',
        name: 'WebAdapter',
        sourcemap: true,
      },
      plugins: [
        commonjs(),
        resolve({
          browser: true,
          preferBuiltins: false,
        }),
        terser(),
      ],
    },
    {
      input: './src/utils.js',
      output: {
        format: 'umd',
        file: 'dist/utils.aio.js',
        name: 'RSUtils',
        sourcemap: true,
      },
      plugins: [
        commonjs(),
        resolve({
          browser: true,
          preferBuiltins: false,
        }),
        terser(),
      ],
    },
  ];
};
