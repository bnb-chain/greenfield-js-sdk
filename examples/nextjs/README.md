# GreenField JS SDK Next.js

Use [React](https://react.dev/) and [Next.js](https://nextjs.org/)

## Usage case

* tx
  * [transfer](./examples/wallet/src/components/transfer/index.tsx)
  * [withdraw](./examples/wallet/src/components/withdraw/index.tsx)
  * [bucket](./examples/wallet/src/components/bucket/index.tsx)
  * [object](./examples/wallet/src/components/object/index.tsx)
* [query](./examples/wallet/src/components/withdraw/query.tsx)

## Getting Started

### copy env template file

```bash
# DEV ENV
> cp .env.simple .env.development.local

# QA ENV
> cp .env.simple .env.test.local
```

### Enter your own configuration

Take testnet, for example:

```
NEXT_PUBLIC_GRPC_URL=https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org
NEXT_PUBLIC_GREENFIELD_RPC_URL=https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org
NEXT_PUBLIC_GREEN_CHAIN_ID=5600
NEXT_PUBLIC_BSC_RPC_URL=https://gnfd-bsc-testnet-dataseed1.bnbchain.org
NEXT_PUBLIC_BSC_CHAIN_ID=97
NEXT_PUBLIC_TOKEN_HUB_CONTRACT_ADDRESS=0xf5192b167d11ed87C02123801c0305ef072df04F
NEXT_PUBLIC_CROSS_CHAIN_CONTRACT_ADDRESS=0x24e4b644DF338f9656843E2Ebf1b84715B8c58Ba
```

## Install and Build

First, build SDK srouce code:

```bash
# root dir
> pnpm run install
> pnpm run -r build 
```

## Start

```bash
# dev ENV
> npm run dev
```

```bash
# qa env
> npm run dev:qa
```
