# GreenField JS SDK ![License](https://img.shields.io/npm/l/%40bnb-chain%2Fgreenfield-js-sdk) ![version](https://img.shields.io/npm/v/%40bnb-chain%2Fgreenfield-js-sdk?color=blue)

A Greenfield JS SDK is an easy-to-use tool designed to help developers build decentralized applications (DApps) on the Greenfield blockchain using JavaScript. It provides a simple and straightforward starting point for developers to create DApps with the latest technology and best practices, making Dapp development more efficient. This SDK includes features and tools to make interacting with the Greenfield blockchain easy, such as libraries for common functionality, testing tools, and documentation. With a Greenfield JS SDK, developers can create scalable, maintainable, and efficient DApps for a variety of use cases.

## Documentation

You can find some package documentation below:

| Package | Description | Version | 
| --- | --- | --- |
| [@bnb-chain/greenfield-js-sdk](./packages/js-sdk/README.md) | A client library for Greenfield Chain | [![npm](https://img.shields.io/npm/v/%40bnb-chain%2Fgreenfield-js-sdk?color=blue)](https://www.npmjs.com/package/@bnb-chain/greenfield-js-sdk) |
| [@bnb-chain/greenfiled-file-handle](./packages/file-handle/README.md) | WASM module that handle file, such as `checksums` | [![npm](https://img.shields.io/npm/v/%40bnb-chain%2Fgreenfiled-file-handle?color=blue)](https://www.npmjs.com/package/@bnb-chain/greenfiled-file-handle) |
| [@bnb-chain/greenfield-zk-crypto](./packages/zk-crypto/README.md) | WASM module about sign crypto | [![npm](https://img.shields.io/npm/v/%40bnb-chain%2Fgreenfield-zk-crypto?color=blue)](https://www.npmjs.com/package/@bnb-chain/greenfield-zk-crypto) |
| [@bnb-chain/create-gnfd-app](./packages/create-gnfd-app/README.md) | Create Greenfield App Quickly | [![npm](https://img.shields.io/npm/v/%40bnb-chain%2Fcreate-gnfd-app?color=blue)](https://www.npmjs.com/package/@bnb-chain/create-gnfd-app) |

## Online Examples

* [Nextjs](https://codesandbox.io/p/github/rrr523/greenfield-nextjs-template/main)
* [Create React App](https://codesandbox.io/p/github/rrr523/greenfield-cra-template/main)
* [Vite](https://codesandbox.io/p/github/rrr523/greenfield-vite-template/main)

## Quick Start

You can use [`create-gnfd-app`](./packages/create-gnfd-app/README.md) to create a app quickly.

```bash
> npx @bnb-chain/create-gnfd-app
```

![](./packages/create-gnfd-app/example.gif)

## Supported JS environments

1. Modern browsers (Chromium, Firefox, Safari)
2. Browser extensions (Chromium, Firefox)
3. Nodejs

## Contribution

1. install dependencies

```bash
> pnpm install
```

2. Build packages:
```bash
> pnpm -F "@bnb-chain/**" build
```

Look over [CONTRIBUTING](./CONTRIBUTING.md)

## Disclaimer

Look over [DISCLAIMER](./DISCLAIMER.md)

## License

The library is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html),
also included in our repository in the [LICENSE](./LICENSE) file.
