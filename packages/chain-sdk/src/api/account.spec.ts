import { describe, expect, test } from '@jest/globals';
import { GREENFIELD_CHAIN_ID, GRPC_URL, ACCOUNT } from '../config.spec';
import { Client } from '../client';

const client = Client.create(GRPC_URL, GREENFIELD_CHAIN_ID);

describe('getAccount', () => {
  test('works', async () => {
    const res = await client.account.getAccount(ACCOUNT.address);

    expect(res).not.toBeNull();
  });
});
