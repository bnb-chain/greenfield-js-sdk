import { UInt64Value } from '@bnb-chain/greenfield-cosmos-types/greenfield/common/wrapper';
import { VisibilityType } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import { Long } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { describe, expect, test } from '@jest/globals';
import { Account, privateKeyToAccount } from 'viem/accounts';
import CrossChainClient from '../src/cross-chain';
import ExecutorClient from '../src/executor';
import { ACCOUNT_PRIVATEKEY, CrossChainAddress, ExecutorAddress } from './env';
import ExecutorMsg from '../src/executor/message';

describe('executor', () => {
  let account: Account;
  let crossChainClient: CrossChainClient;
  let executorClient: ExecutorClient;

  beforeEach(() => {
    account = privateKeyToAccount(ACCOUNT_PRIVATEKEY);
    crossChainClient = new CrossChainClient(CrossChainAddress);
    executorClient = new ExecutorClient(ACCOUNT_PRIVATEKEY, ExecutorAddress);
  });

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
      bucketName: 'stplfiijom',
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
