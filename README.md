# GreenField JS SDK
A Greenfield JS SDK is an easy-to-use tool designed to help developers build decentralized applications (DApps) on the Greenfield blockchain using JavaScript. It provides a simple and straightforward starting point for developers to create DApps with the latest technology and best practices, making Dapp development more efficient. This SDK includes features and tools to make interacting with the Greenfield blockchain easy, such as libraries for common functionality, testing tools, and documentation. With a Greenfield JS SDK, developers can create scalable, maintainable, and efficient DApps for a variety of use cases.

## Documentation

You can find some package documentation below:

| Package | Description |
| --- | --- |
| [@bnb-chain/greenfield-chain-sdk](./packages/chain-sdk/README.md) | A client library for Greenfield Chain |
| [@bnb-chain/greenfiled-file-handle](./packages/file-handle/README.md) | WASM module that handle file, such as `checksums` |

## Document
[Document](./packages/chain-sdk/README.md)

## Examples

There are runnable examples included in the [examples](./examples/) folder

* [Next.js Example(TypeScript)](./examples/nextjs/README.md)
* [Nodejs](./examples/nodejs/README.md)

### Try in Stackblitz

You can try out some examples directly in your browser through Stackblitz:

* [Next.js Exmaple(Typescript)](https://stackblitz.com/edit/github-kikred?file=src%2Fpages%2Ftx.tsx)

### Running Examples Locally

Clone the project and install dependencies:
```bash
> git clone git@github.com:bnb-chain/greenfield-js-sdk.git
> cd greenfield-js-sdk
> pnpm install
```

and build package:
```bash
> pnpm run -r build
```

and then copy env template file:
```bash
> cp .env.simple .env
```

and then enter your own configuration. Take testnet, for example:
```bash
NEXT_PUBLIC_GRPC_URL=https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org
NEXT_PUBLIC_GREENFIELD_RPC_URL=https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org
NEXT_PUBLIC_GREEN_CHAIN_ID=5600
NEXT_PUBLIC_BSC_RPC_URL=https://gnfd-bsc-testnet-dataseed1.bnbchain.org
NEXT_PUBLIC_BSC_CHAIN_ID=97

# refer to https://docs.bnbchain.org/greenfield-docs/docs/guide/dapp/contract-list
NEXT_PUBLIC_TOKEN_HUB_CONTRACT_ADDRESS=
NEXT_PUBLIC_CROSS_CHAIN_CONTRACT_ADDRESS=
```

> The contract address may be outdated due to Greenfield reset, refer to https://docs.bnbchain.org/greenfield-docs/docs/guide/dapp/contract-list get the latest contract address.


abd then run example:
```bash
> npx next dev
```

## Supported JS environments

1. Modern browsers (Chromium, Firefox, Safari)
2. Browser extensions (Chromium, Firefox)
3. Nodejs

## Contribution

Look over [CONTRIBUTING](./CONTRIBUTING.md)


## Disclaimer

Look over [DISCLAIMER](./DISCLAIMER.md)

## License

The library is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html),
also included in our repository in the [LICENSE](./LICENSE) file.
