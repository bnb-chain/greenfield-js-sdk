import { describe, expect, test } from '@jest/globals';
import { VisibilityType } from '../src';
import { ACCOUNT_PRIVATEKEY } from './env';
import { client } from './utils';
import { createFile } from '../src/node/adapter';

describe('upload', () => {
  test('delegrateCreateFolder', async () => {
    const res = await client.object.delegateCreateFolder(
      {
        bucketName: 'dfg',
        objectName: 'f1/',
        delegatedOpts: {
          visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
        },
      },
      {
        type: 'ECDSA',
        privateKey: ACCOUNT_PRIVATEKEY,
      },
    );

    expect(res.code).toBe(0);
  }, 50000);

  test('delegrateUpload', async () => {
    // const file = createFile('./hello0503.json');
    // const file = createFile('./package.json');
    // const file = createFile('./image.png');

    const file = createFile('./hello0503.json');
    // eslint-disable-next-line no-console
    console.log('file: ', file);

    const res = await client.object.delegateUploadObject(
      {
        // bucketName: 'dfg',
        bucketName: 'v32',
        objectName: 'b6450',
        body: file,
        delegatedOpts: {
          visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
        },
      },
      {
        type: 'ECDSA',
        privateKey: ACCOUNT_PRIVATEKEY,
      },
    );

    // eslint-disable-next-line no-console
    console.log('res', res);
    expect(res.code).toEqual(0);
  }, 10000);

  test('delegrateUpload2', async () => {
    // const file = createFile('./hello0503.json');
    // const file = createFile('./package.json');
    // const file = createFile('./image.png');

    const file = createFile('./hello0503.txt');
    // eslint-disable-next-line no-console
    console.log('file: ', file);

    const res = await client.object.delegateUploadObject(
      {
        // bucketName: 'dfg',
        bucketName: 'v32',
        objectName: 't6444',
        body: file,
        delegatedOpts: {
          visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
        },
      },
      {
        type: 'ECDSA',
        privateKey: ACCOUNT_PRIVATEKEY,
      },
    );

    // eslint-disable-next-line no-console
    console.log('res', res);
    expect(res.code).toEqual(0);
  }, 10000);
});
