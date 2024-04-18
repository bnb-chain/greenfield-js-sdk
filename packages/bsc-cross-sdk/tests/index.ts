import { describe, expect, test } from '@jest/globals';
import ExecutorClient from '../src/executor';
import ExecutorMsg from '../src/executor/messages';
import { ACCOUNT_PRIVATEKEY, CrossChainAddress, ExecutorAddress } from './env';
import { privateKeyToAccount } from 'viem/accounts';

const executorClient = new ExecutorClient(ACCOUNT_PRIVATEKEY, ExecutorAddress, CrossChainAddress);

const account = privateKeyToAccount(ACCOUNT_PRIVATEKEY);

describe('executor', () => {
  describe('deposit', () => {
    test('it works', async () => {
      const params = ExecutorMsg.getDepositParams({
        creator: account.address,
        to: '0x00000000000000000000',
        amount: '0.001',
      });

      const txHash = await executorClient.execute([params]);
      expect(txHash).toBeDefined();
    });
  });

  describe('createPayment', () => {
    test('it works', async () => {
      const params = ExecutorMsg.getCreatePaymentAccountParams({
        creator: account.address,
      });

      const txHash = await executorClient.execute([params]);
      expect(txHash).toBeDefined();
    });
  });

  describe('multiTx', () => {
    test('it works', async () => {
      const params1 = ExecutorMsg.getDepositParams({
        creator: account.address,
        to: '0x00000000000000000000',
        amount: '0.001',
      });

      const params2 = ExecutorMsg.getCreatePaymentAccountParams({
        creator: account.address,
      });

      const txHash = await executorClient.execute([params1, params2]);
      // console.log('txHash', txHash);
      expect(txHash).toBeDefined();
    });
  });
});

describe('multiMessage', () => {
  // test('it works', async () => {});
});
