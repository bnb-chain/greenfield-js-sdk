import { describe, expect, test } from '@jest/globals';
import { GREENFIELD_CHAIN_ID, GRPC_URL, ACCOUNT } from '../config.spec';
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

// describe('accountTx', () => {
//   describe('transfer', async () => {
//     // ...
//   });
// });
