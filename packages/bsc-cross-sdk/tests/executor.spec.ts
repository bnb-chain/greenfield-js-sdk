import { UInt64Value } from '@bnb-chain/greenfield-cosmos-types/greenfield/common/wrapper';
import { VisibilityType } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import { Long } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { describe, expect, test } from '@jest/globals';
import { privateKeyToAccount } from 'viem/accounts';
import CrossChainClient from '../src/cross-chain';
import ExecutorClient from '../src/executor';
import ExecutorMsg from '../src/executor/messages';
import { ACCOUNT_PRIVATEKEY, CrossChainAddress, ExecutorAddress } from './env';

const account = privateKeyToAccount(ACCOUNT_PRIVATEKEY);

const crossChainClient = new CrossChainClient(CrossChainAddress);

describe('executor', () => {
  const executorClient = new ExecutorClient(ACCOUNT_PRIVATEKEY, ExecutorAddress);

  test('deposit', async () => {
    const { relayFee } = await crossChainClient.getRelayFee();

    const params = ExecutorMsg.getDepositParams({
      creator: account.address,
      to: '0x00000000000000000000',
      amount: '0.001',
    });

    const txHash = await executorClient.execute([params], { relayFee });

    // eslint-disable-next-line no-console
    console.log('txHash', txHash);
    expect(txHash).toBeDefined();
  });

  test('createPayment', async () => {
    const { relayFee } = await crossChainClient.getRelayFee();

    const params = ExecutorMsg.getCreatePaymentAccountParams({
      creator: account.address,
    });

    const txHash = await executorClient.execute([params], { relayFee });

    // eslint-disable-next-line no-console
    console.log('txHash', txHash);

    expect(txHash).toBeDefined();
  });

  test('updateBucketInfo', async () => {
    const { relayFee } = await crossChainClient.getRelayFee();

    const params = ExecutorMsg.getUpdateBucketInfoParams({
      bucketName: 'test',
      operator: account.address,
      paymentAddress: account.address,
      visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
      chargedReadQuota: UInt64Value.fromPartial({
        value: Long.fromString('10'),
      }),
    });

    const txHash = await executorClient.execute([params], { relayFee });

    // eslint-disable-next-line no-console
    console.log('txHash', txHash);

    expect(txHash).toBeDefined();
  });

  test('multiTx', async () => {
    const { relayFee } = await crossChainClient.getRelayFee();

    const params1 = ExecutorMsg.getDepositParams({
      creator: account.address,
      to: '0x00000000000000000000',
      amount: '0.001',
    });

    const params2 = ExecutorMsg.getCreatePaymentAccountParams({
      creator: account.address,
    });

    const txHash = await executorClient.execute([params1, params2], { relayFee });
    // console.log('txHash', txHash);
    expect(txHash).toBeDefined();
  });
});
