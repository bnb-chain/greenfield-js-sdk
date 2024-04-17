# GreenField JS SDK Next.js

Use [React](https://react.dev/) and [Next.js](https://nextjs.org/)

## Prepare

### install and build

Install dependencies:

```bash
pnpm install
```

Build package:

```bash
pnpm -F "@bnb-chain/**" build
```


### Run the demo application

`cp .env.simple .env` and fill your own configuration:

```bash
NEXT_PUBLIC_GRPC_URL=https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org

NEXT_PUBLIC_GREENFIELD_RPC_URL=https://gnfd-testnet-ethapi-us.bnbchain.org
NEXT_PUBLIC_GREEN_CHAIN_ID=5600

# BSC End POINT
NEXT_PUBLIC_BSC_RPC_URL=https://gnfd-bsc-testnet-dataseed1.bnbchain.org
NEXT_PUBLIC_BSC_CHAIN_ID=5601
```

> this is TESTNET's configuration.


Run the demo application: `npm run dev`

## Usage case

* tx
  * [transfer](./src/components/transfer/index.tsx)
  * [withdraw](./src/components/withdraw/index.tsx)
  * [bucket](./src/components/bucket/index.tsx)
  * [object](./src/components/object/index.tsx)
* [query](./src/components/withdraw/query.tsx)
