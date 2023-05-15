# Greenfield Chain JS SDK

## Install

```bash
> npm install @bnb-chain/greenfield-chain-sdk@alpha
```

## Usage

### create client
```js
import {Client} from '@bnb-chain/greenfield-chain-sdk'
const client = Client.create(GRPC_URL, GREEN_CHAIN_ID);
```

Apis include transactions and queries.

### txs

```js
// transfer example
await client.account.transfer(
  {
    fromAddress: address,
    toAddress: transferInfo.to,
    amount: [
      {
        denom: 'BNB',
        amount: transferInfo.amount,
      },
    ],
  },
  {
    simulate: false,
    denom: 'BNB',
    gasLimit: Number(simulateInfo.gasLimit),
    gasPrice: simulateInfo.gasPrice,
    payer: address,
    granter: '',
  },
);
```

### querys

```js
// get account info
await client.account.getAccount(address);
```

#### select sp

```js
const sps = await client.sp.getStorageProviders();
const finalSps = (sps ?? []).filter((v: any) => v?.description?.moniker !== 'QATest');
const selectIndex = 0;
const secondarySpAddresses = [
  ...finalSps.slice(0, selectIndex),
  ...finalSps.slice(selectIndex + 1),
].map((item) => item.operatorAddress);
```

more API List:

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
