import { assert } from 'chai';
import { ZERO_PUBKEY, makeCosmsPubKey } from '../src';

describe('utils', () => {
  it('makeCosmosPubkey', async () => {
    const cosmosPubkey = makeCosmsPubKey(ZERO_PUBKEY);
    assert.deepEqual(cosmosPubkey, {
      typeUrl: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
      value: Uint8Array.from([
        10, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
      ]),
    });
  });
});
