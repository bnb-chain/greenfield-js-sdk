import { assert } from 'chai';
import { getAllBalances, getBalance, getBlock, getSupplyOf, getTotalSupply, getTx } from '../src';

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:26750';
const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS || '0x32Ff14Fa1547314b95991976DB432F9Aa648A423';

describe('client', () => {
  it('getBlock', async () => {
    const res = await getBlock(RPC_URL);
    assert.isNotEmpty(res);
  });

  it('getTx', async () => {
    const res = await getTx(
      RPC_URL,
      '2F94D3BFB4480C93E433DCCEB73F8EF3145C9C041B23C0CEAD82F4548F7B8A11',
    );
    assert.isNotEmpty(res);
  });

  it('getBalance', async () => {
    const balance = await getBalance(RPC_URL, { denom: 'BNB', address: ACCOUNT_ADDRESS });
    assert.isNotEmpty(balance);
  });

  it('getAllBalance', async () => {
    const balances = await getAllBalances(RPC_URL, { address: ACCOUNT_ADDRESS });
    assert.isNotEmpty(balances);
  });

  it('getTotalSupply', async () => {
    const totalSupply = await getTotalSupply(RPC_URL);
    assert.isNotEmpty(totalSupply);
  });

  it('getSupplyOf', async () => {
    const supplyOf = await getSupplyOf(RPC_URL, { denom: 'BNB' });
    assert.isNotEmpty(supplyOf);
  });
});
