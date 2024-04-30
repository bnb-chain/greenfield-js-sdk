# BSC Cross greenfield SDK

## Install

```bash
npm install @bnb-chain/bsc-cross-greenfield-sdk
```

## Usage Examples

### Local Account

> A Local Account performs signing of transactions & messages with a private key before executing a method over JSON-RPC.

#### Executor

```js
import {CrossChainClient, ExecutorClient, ExecutorMsg} from '@bnb-chain/bsc-cross-greenfield-sdk'
import {privateKeyToAccount} from 'viem'

const privateKey = ...
const CrossChainAddress = ...
const ExecutorAddress = ...

const account = privateKeyToAccount(privateKey);
const config = {
  // 'testnet' | 'mainnet'
  chainConfig: 'testnet',
  accountConfig: {
    privateKey: privateKey,
  },
};

const crossChainClient = new CrossChainClient(config, CrossChainAddress);
const executorClient = new ExecutorClient(config, ExecutorAddress);

;(async => {
  const { relayFee } = await crossChainClient.getRelayFee();
  const params = ExecutorMsg.getCreatePaymentAccountParams({
    creator: account.address,
  });

  const txHash = await executorClient.execute([params], { relayFee });
})()
```

#### MultiMessage

```js
import {CrossChainClient, MultiMessageClient} from '@bnb-chain/bsc-cross-greenfield-sdk'

const privateKey = ...
const CrossChainAddress = ...
const MultiMessageAddress = ...

const account = privateKeyToAccount(privateKey);

const crossChainClient = new CrossChainClient(CrossChainAddress);
const multiMsgClient = new MultiMessageClient(ACCOUNT_PRIVATEKEY, MultiMessageAddress, {
  bucketHubAddress: ...,
  objectHubAddress: ...,
  groupHubAddress: ...,
  permissionHubAddress: ...,
  tokenHubAddress: ...,
});

;(async => {
  const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

  const args = mutliMsgClient.createBucket(
    {
      name: 'testBucketName',
      chargedReadQuota: BigInt(11),
      creator: account.address,
      visibility: 1,
      paymentAddress: account.address,
      primarySpAddress: '0xd142052d8c0881fc7485c1270c3510bc442e05dd',
      primarySpApprovalExpiredHeight: BigInt(0),
      globalVirtualGroupFamilyId: 1,
      primarySpSignature: '0x',
      extraData: '0x',
    },
    {
      sender: account.address,
      minAckRelayFee,
      relayFee,
    },
  );

  const txHash = await mutliMsgClient.sendMessages([args]);
})()
```

### JSON-RPC Account

> A JSON-RPC Account defers signing of transactions & messages to the target Wallet over JSON-RPC. An example could be sending a transaction via a Browser Extension Wallet (e.g. MetaMask) with the `window.ethereum` Provider.

[Example](https://github.com/bnb-chain/greenfield-js-sdk/blob/60bdc913abd9bbcf1053d01259d006744b4da6d5/examples/nextjs/src/components/cross/index.tsx)

#### Executor

```js
import { CrossChainClient, ExecutorClient, ExecutorMsg} from '@bnb-chain/bsc-cross-greenfield-sdk';

const CROSSCHAIN_ADDRESS = ...

const config = {
  chainConfig: 'testnet',
  accountConfig: {
    address,
    ethereumProvider: window.ethereum,
  },
};

const crossChainClient = new CrossChainClient(config, CROSSCHAIN_ADDRESS);
const executorClient = new ExecutorClient(config, EXECUTOR_ADDRESS);

;(async () => {
  const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

  const params = ExecutorMsg.getCreatePaymentAccountParams({
    creator: address,
  });

  const txHash = await executorClient.execute([params], { relayFee });
})()
```

#### MultiMessage

```js
import {
  CrossChainClient,
  MultiMessageClient,
} from '@bnb-chain/bsc-cross-greenfield-sdk';

const crossChainClient = new CrossChainClient(config, CROSSCHAIN_ADDRESS);

const mutliMsgClient = new MultiMessageClient(config, MULTIMESSAGE_ADDRESS, {
  bucketHubAddress: ...,
  objectHubAddress: ...,
  groupHubAddress: ...,
  permissionHubAddress: ...,
  tokenHubAddress: ...,
});

const args = mutliMsgClient.deleteBucket(
  {
    id: BigInt(180013),
  },
  {
    sender: address,
    minAckRelayFee,
    relayFee,
  },
);

;(async () => {
  const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

  const txHash = await mutliMsgClient.sendMessages([args]);
})()
```
