import { describe, test } from '@jest/globals';
import { Client } from '../client';
import { ACCOUNT, GREENFIELD_CHAIN_ID, GRPC_URL, ZERO_ACCOUNT_ADDRESS } from '../config.spec';

const client = Client.create(GRPC_URL, GREENFIELD_CHAIN_ID);

describe('groupTx', () => {
  describe('createGroup', () => {
    test('simulate works', async () => {
      const createGroupTx = await client.group.createGroup({
        creator: ACCOUNT.address,
        extra: 'extra init',
        groupName: 'group name',
        members: [ACCOUNT.address],
      });

      const simulateInfo = createGroupTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      // console.log(simulateInfo);
    });

    // test('broadcast works', async () => {
    //   const transferTx = await makeTransferTx();
    //   const broadcastInfo = await transferTx.broadcast({
    //     denom: 'BNB',
    //     gasLimit: Number(simulateInfo.gasLimit),
    //     gasPrice: simulateInfo.gasPrice,
    //     granter: '',
    //     payer: ACCOUNT.address,
    //     privateKey: ACCOUNT.privateKey,
    //   });

    //   expect(broadcastInfo.code).toEqual(0);
    // });
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
