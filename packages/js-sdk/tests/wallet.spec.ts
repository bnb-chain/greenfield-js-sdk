import { describe, expect, test } from '@jest/globals';
import { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } from './env';
import { client, DEFAULT_SIMULATE_INFO, ZERO_ACCOUNT_ADDRESS } from './utils';

/**
 * test wallet transaction:
 *
 * include transfer and withdraw
 */
describe('walletTx', () => {
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
        payer: ACCOUNT_ADDRESS,
        privateKey: ACCOUNT_PRIVATEKEY,
      });

      expect(broadcastInfo.code).toEqual(0);
    });
  });

  describe('withdraw', () => {
    test('it works', async () => {
      const transferOutTx = await client.crosschain.transferOut({
        from: ACCOUNT_ADDRESS,
        to: '0x0000000000000000000000000000000000000001',
        amount: {
          amount: '10000000000000000',
          denom: 'BNB',
        },
      });

      const simulateGasFee = await transferOutTx.simulate({
        denom: 'BNB',
      });

      expect(simulateGasFee).not.toBeNull();

      const res = await transferOutTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateGasFee.gasLimit),
        gasPrice: simulateGasFee.gasPrice,
        payer: ACCOUNT_ADDRESS,
        granter: '',
        privateKey: ACCOUNT_PRIVATEKEY,
      });

      expect(res.code).toEqual(0);
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
        payer: ACCOUNT_ADDRESS,
        privateKey: ACCOUNT_PRIVATEKEY,
      });

      expect(broadcastInfo.code).toEqual(0);
    });
  });
});

async function makeMultiTransferTx() {
  return await client.account.multiTransfer(ACCOUNT_ADDRESS, {
    inputs: [
      {
        address: ACCOUNT_ADDRESS,
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
        amount: '1000000000000000',
        denom: 'BNB',
      },
    ],
    fromAddress: ACCOUNT_ADDRESS,
    toAddress: ZERO_ACCOUNT_ADDRESS,
  });
}
