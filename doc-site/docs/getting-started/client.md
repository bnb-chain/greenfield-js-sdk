---
id: create-client
sidebar_position: 2
---

# Create Greenfield Client

```js
import { Client } from '@bnb-chain/greenfield-js-sdk'

// Node.js
const client = Client.create(GRPC_URL, GREEN_CHAIN_ID);

// Browser
Client.create(GRPC_URL, String(GREEN_CHAIN_ID), {
  zkCryptoUrl:
    'https://unpkg.com/@bnb-chain/greenfield-zk-crypto@0.0.2-alpha.4/dist/node/zk-crypto.wasm',
});
```

> Browser need load wasm manually.

# Usage

The JS SDK consists of two parts:

* Chain: https://docs.bnbchain.org/greenfield-docs/docs/api/blockchain-rest
* Storage Provider: https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest
