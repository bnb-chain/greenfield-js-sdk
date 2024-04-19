import { ACCOUNT_PRIVATEKEY, CrossChainAddress, ExecutorAddress, MultiMessageAddress } from './env';
import { describe, expect, test } from '@jest/globals';
import ExecutorClient from '../src/executor';
import ExecutorMsg from '../src/executor/messages';
import { privateKeyToAccount } from 'viem/accounts';
import MultiMessageClient from '../src/multi-message';
import CrossChainClient from '../src/cross-chain';
import { Long } from '@bnb-chain/greenfield-cosmos-types/helpers';

const account = privateKeyToAccount(ACCOUNT_PRIVATEKEY);

const crossChainClient = new CrossChainClient(CrossChainAddress);

describe('executor', () => {
  const executorClient = new ExecutorClient(ACCOUNT_PRIVATEKEY, ExecutorAddress);

  describe('deposit', () => {
    test('it works', async () => {
      const { relayFee } = await crossChainClient.getRelayFee();

      const params = ExecutorMsg.getDepositParams({
        creator: account.address,
        to: '0x00000000000000000000',
        amount: '0.001',
      });

      const txHash = await executorClient.execute([params], { relayFee });
      expect(txHash).toBeDefined();
    });
  });

  describe('createPayment', () => {
    test('it works', async () => {
      const { relayFee } = await crossChainClient.getRelayFee();

      const params = ExecutorMsg.getCreatePaymentAccountParams({
        creator: account.address,
      });

      const txHash = await executorClient.execute([params], { relayFee });
      expect(txHash).toBeDefined();
    });
  });

  describe('multiTx', () => {
    test('it works', async () => {
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
});

describe('multiMessage', () => {
  const mutliMsgClient = new MultiMessageClient(ACCOUNT_PRIVATEKEY, MultiMessageAddress, {
    bucketHubAddress: '0x8A0b8755430F7df0f92DE45ce3E0408A4a324941',
  });

  test('it works', async () => {
    const gasPrice = crossChainClient.getCallbackGasPrice();
    const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

    const args = mutliMsgClient.createBucket(
      {
        bucketName: 'test',
        chargedReadQuota: Long.fromString('100'),
        creator: account.address,
        visibility: 1,
        paymentAddress: account.address,
        primarySpAddress: '0xd142052d8c0881fc7485c1270c3510bc442e05dd',
      },
      {
        minAckRelayFee,
        relayFee,
      },
    );

    await mutliMsgClient.sendMessages(args, {
      minAckRelayFee,
      relayFee,
    });
  });
});
