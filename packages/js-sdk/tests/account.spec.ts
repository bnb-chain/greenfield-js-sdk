import { describe, expect, test } from '@jest/globals';
import { ACCOUNT, client } from './config.spec';

/**
 * test account information
 */

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

  describe('getModuleAccounts', () => {
    test('it works', async () => {
      const res = await client.account.getModuleAccounts();

      expect(res).not.toBeNull();
    });
  });
});
