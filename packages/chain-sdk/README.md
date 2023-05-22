# Greenfield Chain JS SDK

## Install

```bash
# QA
npm install @bnb-chain/greenfield-chain-sdk@alpha

# TESTNET
npm install @bnb-chain/greenfield-chain-sdk@beta
```

## Usage

### create client
```js
import {Client} from '@bnb-chain/greenfield-chain-sdk'
const client = Client.create(GRPC_URL, GREEN_CHAIN_ID);
```

Apis include transactions and queries.

### Tx

#### 1. Tx construction

take `transfer` for example:

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

`broadcast` use `window.ethereum` as signature provider by default.

If you want to use others, you can set `signTypedDataCallback`:

```js
// trustwallet
const broadcastRes = await transferTx.broadcast({
  //...
  signTypedDataCallback: async (addr: string, message: string) => {
    return await window.trustwallet.request({
      method: 'eth_signTypedData_v4',
      params: [addr, message],
    });
  }
});
```

If you broadcast in Nodejs, you can set `privateKey`:
```js
const broadcastRes = await transferTx.broadcast({
  //...
  privateKey: '0x.......'
});
```

### Query

```js
// get account info
await client.account.getAccount(address);
```


more API:

* [account](./src/api/account.ts)
* [basic](./src/api/basic.ts)
* [backet](./src/api/backet.ts)
* [challenge](./src/api/challenge.ts)
* [object](./src/api/object.ts)
* [group](./src/api/group.ts)
* [payment](./src/api/payment.ts)
* [sp](./src/api/sp.ts)


<!-- 
### putBucketPolicy

```js
// `resource` params
const resource = newBucketGRN(bucketName);
msg.resource = GRNToString(resource);
```
 -->
