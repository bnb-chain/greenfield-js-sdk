import { describe, expect, test } from '@jest/globals';
import { ACCOUNT, client, generateString, selectSp } from './config.spec';

const BUCKET_NAME = generateString(10);
const OBJECT_NAME = generateString(10);

/**
 * test storage transcations:
 * include bucket and object creation and deletion
 */
describe('storageTx', () => {
  describe('bucketTx', () => {
    // eslint-disable-next-line no-console
    console.log('bucket name', BUCKET_NAME);

    test('create bucket', async () => {
      const spInfo = await selectSp();
      const createBucketTx = await client.bucket.createBucket(
        {
          bucketName: BUCKET_NAME,
          creator: ACCOUNT.address,
          visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
          chargedReadQuota: '0',
          spInfo: {
            primarySpAddress: spInfo.primarySpAddress,
          },
          paymentAddress: ACCOUNT.address,
        },
        {
          type: 'ECDSA',
          privateKey: ACCOUNT.privateKey,
        },
      );

      const simulateInfo = await createBucketTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const res = await createBucketTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '5000000000',
        payer: ACCOUNT.address,
        granter: '',
        privateKey: ACCOUNT.privateKey,
      });

      expect(res.code).toEqual(0);
    }, 300000);

    test('bucket info', async () => {
      const bucketInfo = await client.bucket.headBucket(BUCKET_NAME);

      expect(bucketInfo.bucketInfo?.bucketName).toEqual(BUCKET_NAME);
    }, 300000);
  });

  describe('objectTx', () => {
    // eslint-disable-next-line no-console
    console.log('bucket name', BUCKET_NAME);
    // eslint-disable-next-line no-console
    console.log('object name', OBJECT_NAME);

    test('create Object', async () => {
      const createObjectTx = await client.object.createObject(
        {
          bucketName: BUCKET_NAME,
          objectName: OBJECT_NAME,
          contentLength: 0,
          fileType: 'text/plain',
          expectCheckSums: [
            '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
            '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
            '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
            '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
            '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
            '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
            '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
          ],
          creator: ACCOUNT.address,
        },
        {
          type: 'ECDSA',
          privateKey: ACCOUNT.privateKey,
        },
      );

      const simulateInfo = await createObjectTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const rxRes = await createObjectTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '50000000000',
        payer: ACCOUNT.address,
        granter: '',
        privateKey: ACCOUNT.privateKey,
      });
      expect(rxRes.code).toBe(0);
    }, 30000);

    test('object info', async () => {
      const objInfo = await client.object.headObject(BUCKET_NAME, OBJECT_NAME);

      expect(objInfo.objectInfo?.objectName).toEqual(OBJECT_NAME);
    }, 30000);
  });

  describe('delete bucket and object', () => {
    test('delete object', async () => {
      const deleteObjectTx = await client.object.deleteObject({
        bucketName: BUCKET_NAME,
        objectName: OBJECT_NAME,
        operator: ACCOUNT.address,
      });

      const simulateInfo = await deleteObjectTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const res = await deleteObjectTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '5000000000',
        payer: ACCOUNT.address,
        granter: '',
        privateKey: ACCOUNT.privateKey,
      });

      expect(res.code).toBe(0);
    }, 300000);

    test('delete bucket', async () => {
      const deleteBucketTx = await client.bucket.deleteBucket({
        bucketName: BUCKET_NAME,
        operator: ACCOUNT.address,
      });

      const simulateInfo = await deleteBucketTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const res = await deleteBucketTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '5000000000',
        payer: ACCOUNT.address,
        granter: '',
        privateKey: ACCOUNT.privateKey,
      });

      expect(res.code).toEqual(0);
    }, 300000);
  });
});
