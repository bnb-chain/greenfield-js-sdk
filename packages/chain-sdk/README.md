# Greenfield Chain SDK

## Install

```bash
> npm install @bnb-chain/greenfield-chain-sdk
```

## Query

Query chain data by Tendermint RPC client:

1. Install [greenfield-cosmos-types](https://github.com/bnb-chain/gnfd-cosmos-types)

  ```bash
  > npm install @bnb-chain/greenfield-cosmos-types
  ```

2. get RpcClient:

  ```js
  import { makeRpcClient } from '@bnb-chain/greenfield-chain-sdk';
  ```

3. Query any data as long as you can find in greenfield-cosmos-types.

  ```js
  import { QueryClientImpl as storageQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';

  export const getBucketInfo = async (rpcUrl: string, bucketName: string) => {
    const rpcClient = await makeRpcClient(rpcUrl);

    const rpc = new storageQueryClientImpl(rpcClient);
    const bucketInfoRes = await rpc.HeadBucket({
      bucketName,
    });

    const bucketId = bucketInfoRes?.bucketInfo?.id;
    if (!bucketId) throw new Error('no such bucket');

    return await rpc.HeadBucketById({
      bucketId,
    });
  };
  ```

More [Examples](../../examples/wallet/src/client/index.ts)

## Transaction

### transfer

simulateTx:
```js
import {makeCosmsPubKey,recoverPk,getAccount,IRawTxInfo,ISignature712,TransferTx} from '@bnb-chain/greenfield-chain-sdk';

const tTx = new TransferTx(GRPC_URL, CHAIN_ID);
const simulateBytes = tTx.getSimulateBytes({
  from: address,
  to: transferInfo.to,
  amount: ethers.utils.parseEther(transferInfo.amount).toString(),
  denom: 'BNB',
});
const simulateTxInfo = await tTx.simulateTx(address, simulateBytes);
```

broadcastTx:
```js
// 1. signTx
const signInfo = await tTx.signTx({
  from: address,
  to: transferInfo.to,
  amount: ethers.utils.parseEther(transferInfo.amount).toString(),
  sequence: sequence + '',
  accountNumber: accountNumber + '',
  gasLimit: parseInt(transferInfo.gasLimit),
  denom: 'BNB',
});

// 2. get raw bytes
const pk = recoverPk({
  signature: signInfo.signature,
  messageHash: signInfo.messageHash,
});
const pubKey = makeCosmsPubKey(pk);
const rawTxInfo = await tTx.getRawTxInfo({
  sign: transferSignInfo.signature,
  pubKey,
  sequence: String(sequence),
  from: address,
  to: transferInfo.to,
  amount: ethers.utils.parseEther(transferInfo.amount).toString(),
  gasLimit: parseInt(transferInfo.gasLimit),
  denom: 'BNB',
});

// 3. broadcastTx
await tTx.broadcastTx(rawTxInfo.bytes);
```

More [Examples](../../examples/wallet/src/components/):

* CreateBucket
* DeleteBucket
* BucketInfo
* CreateObject
* DeleteObject
* ObjectInfo
* Transfer
* WithDraw
