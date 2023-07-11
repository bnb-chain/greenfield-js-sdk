import { describe, expect, test } from '@jest/globals';
import Long from 'long';
import { client, selectSp } from './config.spec';

describe('query storage api', () => {
  test('query lock fee', async () => {
    const spInfo = await selectSp();

    const res = await client.storage.queryLockFee({
      createAt: Long.fromInt(0),
      primarySpAddress: spInfo.primarySpAddress,
      payloadSize: Long.fromInt(1111),
    });

    expect(res).not.toBeNull();
  });
});
