import { describe, expect, test } from '@jest/globals';
import {
  GREENFIELD_CHAIN_ID,
  GRPC_URL,
  ACCOUNT,
  ZERO_ACCOUNT_ADDRESS,
  DEFAULT_SIMULATE_INFO,
} from '../config.spec';
import { Client } from '../client';

const client = Client.create(GRPC_URL, GREENFIELD_CHAIN_ID);

describe('accountQuery', () => {
  describe('getAccount', () => {
    test('it works', async () => {
      const res = await client.account.getAccount(ACCOUNT.address);

      expect(res).not.toBeNull();
    });
  });

  describe('getAccountBalance', () => {
    test('it works', async () => {
      const res = await client.account.getAccountBalance({
        address: ACCOUNT.address,
        denom: 'BNB',
      });

      expect(res).not.toBeNull();
    });
  });

  describe('getPaymentAccount', () => {
    test('it works', async () => {
      const res = await client.account.getPaymentAccount({
        addr: ACCOUNT.address,
      });

      expect(res).not.toBeNull();
    });
  });

  describe('getModuleAccounts', () => {
    test('it works', async () => {
      const res = await client.account.getModuleAccounts();

      expect(res).not.toBeNull();
    });
  });

  // TODO: don't work
  // describe('getPaymentAccountsByOwner', () => {
  //   test('it works', async () => {
  //     const res = await client.account.getPaymentAccountsByOwner(ACCOUNT.address);

  //     expect(res).not.toBeNull();
  //   });
  // });
});

describe('accountTx', () => {
  let simulateInfo = DEFAULT_SIMULATE_INFO;

  describe('transfer', () => {
    test('simulate works', async () => {
      const transferTx = await makeTransferTx();
      simulateInfo = await transferTx.simulate({
        denom: 'BNB',
      });
      expect(simulateInfo).not.toBeNull();
    });

    test('broadcast works', async () => {
      const transferTx = await makeTransferTx();
      const broadcastInfo = await transferTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        granter: '',
        payer: ACCOUNT.address,
        privateKey: ACCOUNT.privateKey,
      });

      expect(broadcastInfo.code).toEqual(0);
    });
  });

  describe('multiTransfer', () => {
    test('simulate works', async () => {
      const transferTx = await makeMultiTransferTx();
      simulateInfo = await transferTx.simulate({
        denom: 'BNB',
      });
      expect(simulateInfo).not.toBeNull();
    });

    test('broadcast works', async () => {
      const transferTx = await makeMultiTransferTx();
      const broadcastInfo = await transferTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        granter: '',
        payer: ACCOUNT.address,
        privateKey: ACCOUNT.privateKey,
      });

      expect(broadcastInfo.code).toEqual(0);
    });
  });
});

async function makeMultiTransferTx() {
  return await client.account.multiTransfer(ACCOUNT.address, {
    inputs: [
      {
        address: ACCOUNT.address,
        coins: [
          {
            amount: '10',
            denom: 'BNB',
          },
        ],
      },
    ],
    outputs: [
      {
        address: ZERO_ACCOUNT_ADDRESS,
        coins: [
          {
            amount: '10',
            denom: 'BNB',
          },
        ],
      },
    ],
  });
}

async function makeTransferTx() {
  return await client.account.transfer({
    amount: [
      {
        amount: '10',
        denom: 'BNB',
      },
    ],
    fromAddress: ACCOUNT.address,
    toAddress: ZERO_ACCOUNT_ADDRESS,
  });
}
