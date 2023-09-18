import { describe, expect, test } from '@jest/globals';
import { ACCOUNT, client, generateString } from './config.spec';

const GROUP_NAME = generateString(10);
const EXTRA = generateString(10);

describe('groupTx', () => {
  describe('createGroupTx', () => {
    // eslint-disable-next-line no-console
    console.log('group name', GROUP_NAME);
    // eslint-disable-next-line no-console
    console.log('extra', EXTRA);

    test('create group', async () => {
      const createGroupTx = await client.group.createGroup({
        creator: ACCOUNT.address,
        extra: EXTRA,
        groupName: GROUP_NAME,
      });

      const simulateInfo = await createGroupTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const res = await createGroupTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        granter: '',
        payer: ACCOUNT.address,
        privateKey: ACCOUNT.privateKey,
      });

      expect(res.code).toEqual(0);
    }, 300000);

    test('group info', async () => {
      const { groupInfo } = await client.group.headGroup(GROUP_NAME, ACCOUNT.address);

      expect(groupInfo?.groupName).toEqual(GROUP_NAME);
      expect(groupInfo?.extra).toEqual(EXTRA);
    }, 300000);
  });

  describe('updateGroupTx', () => {
    test('update group name', async () => {
      const newExtra = generateString(10);
      const updateGroupTx = await client.group.updateGroupExtra({
        groupName: GROUP_NAME,
        groupOwner: ACCOUNT.address,
        operator: ACCOUNT.address,
        extra: newExtra,
      });

      const simulateInfo = await updateGroupTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const res = await updateGroupTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        granter: '',
        payer: ACCOUNT.address,
        privateKey: ACCOUNT.privateKey,
      });

      expect(res.code).toEqual(0);
    });
  });

  describe('deleteGroupTx', () => {
    test('delete group', async () => {
      const deleteGroupTx = await client.group.deleteGroup({
        groupName: GROUP_NAME,
        operator: ACCOUNT.address,
      });

      const simulateInfo = await deleteGroupTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const res = await deleteGroupTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        granter: '',
        payer: ACCOUNT.address,
        privateKey: ACCOUNT.privateKey,
      });

      expect(res.code).toEqual(0);
    }, 30000);
  });
});
