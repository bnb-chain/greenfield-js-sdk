import { beforeEach, describe, expect, test } from '@jest/globals';
import { Account, privateKeyToAccount } from 'viem/accounts';
import CrossChainClient from '../src/cross-chain';
import MultiMessageClient from '../src/multi-message';
import {
  ACCOUNT_PRIVATEKEY,
  BucketHubAddress,
  CrossChainAddress,
  GroupHubAddress,
  MultiMessageAddress,
  ObjectHubAddress,
  PermissionHubAddress,
  TokenHubAddress,
} from './env';
import { generateString } from './utils';
import { parseEther, zeroAddress } from 'viem';
import { ResourceType } from '@bnb-chain/greenfield-cosmos-types/greenfield/resource/types';
import {
  ActionType,
  Effect,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';

describe('base', () => {
  let account: Account;
  let crossChainClient: CrossChainClient;
  let mutliMsgClient: MultiMessageClient;

  beforeEach(() => {
    mutliMsgClient = new MultiMessageClient(ACCOUNT_PRIVATEKEY, MultiMessageAddress, {
      bucketHubAddress: BucketHubAddress,
      objectHubAddress: ObjectHubAddress,
      groupHubAddress: GroupHubAddress,
      permissionHubAddress: PermissionHubAddress,
      tokenHubAddress: TokenHubAddress,
    });
    account = privateKeyToAccount(ACCOUNT_PRIVATEKEY);

    crossChainClient = new CrossChainClient(CrossChainAddress);
  });

  test('createBucket', async () => {
    // const gasPrice = crossChainClient.getCallbackGasPrice();
    const bucketName = generateString(10);

    const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

    const args = mutliMsgClient.createBucket(
      {
        name: bucketName,
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

    // eslint-disable-next-line no-console
    console.log('txHash', txHash);

    expect(txHash).toBeDefined();
  });

  test('deleteBucket', async () => {
    const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

    const args = mutliMsgClient.deleteBucket(
      {
        id: BigInt(180011),
      },
      {
        sender: account.address,
        minAckRelayFee,
        relayFee,
      },
    );

    const txHash = await mutliMsgClient.sendMessages([args]);

    // eslint-disable-next-line no-console
    console.log('txHash', txHash);

    expect(txHash).toBeDefined();
  });

  test('deleteObject', async () => {
    const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

    const args = mutliMsgClient.deleteObject(
      {
        id: BigInt(423155),
      },
      {
        sender: account.address,
        minAckRelayFee,
        relayFee,
      },
    );

    const txHash = await mutliMsgClient.sendMessages([args]);

    // eslint-disable-next-line no-console
    console.log('txHash', txHash);
    expect(txHash).toBeDefined();
  });

  test('createGroup', async () => {
    const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

    const args = mutliMsgClient.createGroup(
      {
        name: generateString(5),
        owner: account.address,
      },
      {
        sender: account.address,
        minAckRelayFee,
        relayFee,
      },
    );

    const txHash = await mutliMsgClient.sendMessages([args]);

    // eslint-disable-next-line no-console
    console.log('txHash', txHash);
    expect(txHash).toBeDefined();
  });

  test('updateGroup', async () => {
    const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

    const args = mutliMsgClient.updateGroup(
      {
        id: BigInt(546),
        operator: account.address,
        opType: 0,
        extraData: '0x31',
        memberExpiration: [BigInt(1734276997)],
        members: ['0xe0523429ea945ced7bd3b170fd8dbe797778049b'],
      },
      {
        sender: account.address,
        minAckRelayFee,
        relayFee,
      },
    );

    const txHash = await mutliMsgClient.sendMessages([args]);

    // eslint-disable-next-line no-console
    console.log('txHash', txHash);
    expect(txHash).toBeDefined();
  });

  test('deleteGroup', async () => {
    const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

    const args = mutliMsgClient.deleteGroup(
      {
        id: BigInt(545),
      },
      {
        sender: account.address,
        minAckRelayFee,
        relayFee,
      },
    );

    const txHash = await mutliMsgClient.sendMessages([args]);

    // eslint-disable-next-line no-console
    console.log('txHash', txHash);
    expect(txHash).toBeDefined();
  });

  test('createPolicy', async () => {
    const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

    const args = mutliMsgClient.createPolicy(
      {
        id: '0',
        resourceId: '180009',
        resourceType: ResourceType.RESOURCE_TYPE_BUCKET,
        statements: [
          {
            effect: Effect.EFFECT_ALLOW,
            actions: [ActionType.ACTION_DELETE_BUCKET],
            resources: [],
          },
        ],
      },
      {
        sender: account.address,
        minAckRelayFee,
        relayFee,
      },
    );

    const txHash = await mutliMsgClient.sendMessages([args]);

    // eslint-disable-next-line no-console
    console.log('txHash', txHash);
    expect(txHash).toBeDefined();
  });

  test('transferOut', async () => {
    const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

    const args = mutliMsgClient.transferOut(
      {
        recipient: zeroAddress,
        amount: parseEther('0.0001'),
      },
      {
        sender: account.address,
        minAckRelayFee,
        relayFee,
      },
    );

    const txHash = await mutliMsgClient.sendMessages([args]);

    // eslint-disable-next-line no-console
    console.log('txHash', txHash);
    expect(txHash).toBeDefined();
  });
});
