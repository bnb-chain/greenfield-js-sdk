import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import mime from 'mime';
import path from 'path';
import { Client } from '../client';
import { ACCOUNT, GREENFIELD_CHAIN_ID, GRPC_URL } from '../config.spec';

const client = Client.create(GRPC_URL, GREENFIELD_CHAIN_ID);

describe('objectTx', () => {
  // test('createObjectTx', async () => {
  //   // a file
  //   const filePath = './src/api/account.spec.ts';
  //   const fileBuf = fs.readFileSync(filePath);
  //   const extame = path.extname(filePath);
  //   const fileType = mime.getType(extame);
  //   const spInfo = await selectSp();
  //   const createObjectTx = await client.object.createObject({
  //     bucketName: 'risk1',
  //     objectName: 'abcdef',
  //     spInfo,
  //     fileType: fileType || 'application/octet-stream',
  //     creator: ACCOUNT.address,
  //     expectSecondarySpAddresses: [],
  //   });
  //   const rxRes = await createObjectTx.broadcast({
  //     denom: 'BNB',
  //     gasLimit: 210000,
  //     gasPrice: '50000000000',
  //     payer: ACCOUNT.address,
  //     granter: '',
  //   });
  //   expect(rxRes.code).toBe(0);
  // });
});

const selectSp = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter((v: any) => v?.description?.moniker !== 'QATest');
  const selectIndex = 0;
  const secondarySpAddresses = [
    ...finalSps.slice(0, selectIndex),
    ...finalSps.slice(selectIndex + 1),
  ].map((item) => item.operatorAddress);
  const selectSpInfo = {
    endpoint: finalSps[selectIndex].endpoint,
    primarySpAddress: finalSps[selectIndex]?.operatorAddress,
    sealAddress: finalSps[selectIndex].sealAddress,
    secondarySpAddresses,
  };
  return selectSpInfo;
};
