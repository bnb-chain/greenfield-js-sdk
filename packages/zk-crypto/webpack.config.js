/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = [
  // Browser ESM
  {
    entry: './src/browser/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/browser/esm'),
      filename: 'index.js',
      library: {
        type: 'commonjs',
      },
      wasmLoading: 'fetch',
      enabledWasmLoadingTypes: ['fetch'],
    },
    target: 'web',
    experiments: {
      asyncWebAssembly: true,
    },
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
      ],
    },
    mode: 'development',
    resolve: {
      extensions: ['.js'],
      fallback: {
        // buffer: require.resolve("buffer"),
        // crypto: require.resolve('crypto-browserify'),
        // process: require.resolve('process/browser'),
        crypto: false,
        fs: false,
        util: false,
        // util: require.resolve('util/'),
        // stream: require.resolve('stream-browserify'),
        // path: require.resolve('path-browserify'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new CleanWebpackPlugin(),
    ],
  },

  // Browser UMD
  {
    entry: './src/browser/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/browser/umd'),
      filename: 'index.js',
      library: {
        name: 'ZkCrypto',
        type: 'umd',
      },
      wasmLoading: 'fetch',
      enabledWasmLoadingTypes: ['fetch'],
    },
    target: 'web',
    experiments: {
      asyncWebAssembly: true,
    },
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
      ],
    },
    mode: 'development',
    resolve: {
      extensions: ['.js'],
      fallback: {
        // buffer: require.resolve("buffer"),
        // crypto: require.resolve('crypto-browserify'),
        // process: require.resolve('process/browser'),
        crypto: false,
        fs: false,
        util: false,
        // util: require.resolve('util/'),
        // stream: require.resolve('stream-browserify'),
        // path: require.resolve('path-browserify'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new CleanWebpackPlugin(),
    ],
  },

  // Node.js
  {
    entry: './src/node/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/node'),
      filename: 'index.js',
      library: {
        type: 'commonjs',
      },
    },
    target: 'node',
    experiments: {
      asyncWebAssembly: true,
    },
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
      ],
    },
    mode: 'development',
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new CleanWebpackPlugin(),
    ],
  },
];
