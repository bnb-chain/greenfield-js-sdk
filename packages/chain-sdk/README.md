## Install

```bash
> npm install @bnb-chain/greenfield-chain-sdk@alpha
```

[Examples](../../examples)



## Create Client

```js
import {Client} from '@bnb-chain/greenfield-chain-sdk'
Client.create()
```

## Basic API

### simulateRawTx

### broadcastRawTx

### getAccount



## Bucket API

### select sp

```js
const sps = await client.sp.getStorageProviders();
const finalSps = (sps ?? []).filter((v: any) => v?.description?.moniker !== 'QATest');
const selectIndex = 0;
const secondarySpAddresses = [
  ...finalSps.slice(0, selectIndex),
  ...finalSps.slice(selectIndex + 1),
].map((item) => item.operatorAddress);
```

### putBucketPolicy

```js
// `resource` params
const resource = newBucketGRN(bucketName);
msg.resource = GRNToString(resource);
```

