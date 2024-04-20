# BSC corss greenfield SDK

## Executor

```js
import {CrossChainClient, ExecutorClient} from '@bnb-chain/bsc-cross-greenfield-sdk'
import {privateKeyToAccount} from 'viem'

const account = privateKeyToAccount(ACCOUNT_PRIVATEKEY);
const crossChainClient = new CrossChainClient(CrossChainAddress);
const executorClient = new ExecutorClient(ACCOUNT_PRIVATEKEY, ExecutorAddress);

const { relayFee } = await crossChainClient.getRelayFee();
const params = ExecutorMsg.getCreatePaymentAccountParams({
  creator: account.address,
});

const txHash = await executorClient.execute([params], { relayFee });
```

## MultiMessage

```js
const account = privateKeyToAccount(ACCOUNT_PRIVATEKEY);
const crossChainClient = new CrossChainClient(CrossChainAddress);
const mutliMsgClient = new MultiMessageClient(ACCOUNT_PRIVATEKEY, MultiMessageAddress, {
      bucketHubAddress: BucketHubAddress,
      objectHubAddress: ObjectHubAddress,
      groupHubAddress: GroupHubAddress,
      permissionHubAddress: PermissionHubAddress,
      tokenHubAddress: TokenHubAddress,
    });

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
```
