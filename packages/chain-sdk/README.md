# Greenfield Chain JS SDK

## Install

```bash
npm install @bnb-chain/greenfield-js-sdk
```

## Create Client
```js
import {Client} from '@bnb-chain/greenfield-js-sdk'

// Node.js
const client = Client.create(GRPC_URL, GREEN_CHAIN_ID);

// Browser
Client.create(GRPC_URL, String(GREEN_CHAIN_ID), {
  zkCryptoUrl:
    'https://unpkg.com/@bnb-chain/greenfield-zk-crypto@0.0.2-alpha.4/dist/node/zk-crypto.wasm',
});
```

> Browser need load wasm manually.

## Usage

The SDK consists of two parts:

* Chain: https://docs.bnbchain.org/greenfield-docs/docs/api/blockchain-rest
* Storage Provider: https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest

## Chain

### Tx

#### 1. Tx construction

`transfer` tx for example:

```js
const transferTx = await client.account.transfer({
  fromAddress: address,
  toAddress: transferInfo.to,
  amount: [
    {
      denom: 'BNB',
      amount: ethers.utils.parseEther(transferInfo.amount).toString(),
    },
  ],
});
```

#### 2. Simulate Tx

```js
// simulate tx
const simulateInfo = await transferTx.simulate({
  denom: 'BNB',
});
```

#### 3. Boradcast Tx

```js
// broadcast tx
const broadcastRes = await transferTx.broadcast({
  denom: 'BNB',
  gasLimit: Number(simulateInfo.gasLimit),
  gasPrice: simulateInfo.gasPrice,
  payer: address,
  granter: '',
});
```

#### NOTICE: Signature mode for `Broadcast`  

`broadcast` use `window.ethereum` as signature provider by default.

If you want to use others, you can set `signTypedDataCallback`:

```js
// trustwallet:
const broadcastRes = await transferTx.broadcast({
  // ...
  signTypedDataCallback: async (addr: string, message: string) => {
    return await window.trustwallet.request({
      method: 'eth_signTypedData_v4',
      params: [addr, message],
    });
  }
});
```

If you broadcast in Nodejs, you can broadcast a tx by `privateKey`:
```js
const broadcastRes = await transferTx.broadcast({
  // ...
  privateKey: '0x.......'
});
```

### Query

```js
// get account info
await client.account.getAccount(address);
```

Examples:
* [Next.js](../../examples/nextjs/README.md)
* [Node.js](../../examples/nodejs/README.md)

### Storage Provider Client

> https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest

SDK support two [authentication type](https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest#authentication-type):

* ECDSA: It is usually used on Node.js(Because it need to use a private key)
* EDDSA: It is usually used in a browser

`getBucketReadQuota` as example:

```js
// browser:

// generate seed:
const allSps = await getAllSps();
const offchainAuthRes = await client.offchainauth.genOffChainAuthKeyPairAndUpload(
  {
    sps: allSps,
    chainId: GREEN_CHAIN_ID,
    expirationMs: 5 * 24 * 60 * 60 * 1000,
    domain: window.location.origin,
    address: 'your address',
  },
  provider: 'wallet provider',
);

// request sp api
const bucketQuota = await client.bucket.getBucketReadQuota(
  {
    bucketName,
  },
  {
    type: 'EDDSA',
    seed: offchainAuthRes.seedString,
    domain: window.location.origin,
    address: 'your address',
  },
);
```

```js
// Node.js:
// request sp api
const bucketQuota = await client.bucket.getBucketReadQuota(
  {
    bucketName,
  },
  {
    type: 'ECDSA',
    privateKey: '0x....'
  },
);
```

#### Support Custom Http Request

It's actually an HTTP request, we use `fetch` by default, and if you want to use another http library like `axios`, we'll construct it for you as well.

```js
// custom upload object
const { PUT_OBJECT: getPutObjectMetaInfo } = client.spClient.getMetaInfo(endpoint, payload);
const {reqMeta, url} = await getPutObjectMetaInfo(endpoint, params);

axios.put(...)
```
