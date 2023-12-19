import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
// const pathResolve = (p) => path.resolve(__dirname, p);

function resolveExternal() {
  return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
}

export default async () => {
  return [
    {
      input: './src/index.js',
      output: {
        format: 'es',
        file: 'dist/index.esm.js',
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
      ],
    },
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
      ],
    },
  ];
};
