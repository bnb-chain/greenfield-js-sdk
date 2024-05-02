import { describe, expect, test } from '@jest/globals';
import { bytesFromBase64, Long, RedundancyType, VisibilityType } from '../src';
import { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } from './env';
import { client, generateString, selectSp } from './utils';
import { Account } from '../src/api/account';

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
      const createBucketTx = await client.bucket.createBucket({
        bucketName: BUCKET_NAME,
        creator: ACCOUNT_ADDRESS,
        visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
        chargedReadQuota: Long.fromString('0'),
        primarySpAddress: spInfo.primarySpAddress,
        paymentAddress: ACCOUNT_ADDRESS,
      });

      const simulateInfo = await createBucketTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const res = await createBucketTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '5000000000',
        payer: ACCOUNT_ADDRESS,
        granter: '',
        privateKey: ACCOUNT_PRIVATEKEY,
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
      const createObjectTx = await client.object.createObject({
        bucketName: BUCKET_NAME,
        objectName: OBJECT_NAME,
        payloadSize: Long.fromString('0'),
        contentType: 'text/plain',
        expectChecksums: [
          '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
          '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
          '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
          '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
          '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
          '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
          '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        ].map((x) => bytesFromBase64(x)),
        creator: ACCOUNT_ADDRESS,
        redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
        visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
      });

      const simulateInfo = await createObjectTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const rxRes = await createObjectTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '50000000000',
        payer: ACCOUNT_ADDRESS,
        granter: '',
        privateKey: ACCOUNT_PRIVATEKEY,
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
        operator: ACCOUNT_ADDRESS,
      });

      const simulateInfo = await deleteObjectTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const res = await deleteObjectTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '5000000000',
        payer: ACCOUNT_ADDRESS,
        granter: '',
        privateKey: ACCOUNT_PRIVATEKEY,
      });

      expect(res.code).toBe(0);
    }, 300000);

    test('delete bucket', async () => {
      const deleteBucketTx = await client.bucket.deleteBucket({
        bucketName: BUCKET_NAME,
        operator: ACCOUNT_ADDRESS,
      });

      const simulateInfo = await deleteBucketTx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const res = await deleteBucketTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '5000000000',
        payer: ACCOUNT_ADDRESS,
        granter: '',
        privateKey: ACCOUNT_PRIVATEKEY,
      });

      expect(res.code).toEqual(0);
    }, 300000);
  });

  describe('payment', () => {
    test('setPaymentAccountFlowRateLimit', async () => {
      const tx = await client.bucket.setPaymentAccountFlowRateLimit({
        bucketName: 'dfg',
        bucketOwner: ACCOUNT_ADDRESS,
        operator: ACCOUNT_ADDRESS,
        paymentAddress: ACCOUNT_ADDRESS,
        flowRateLimit: '1000',
      });

      const simulateInfo = await tx.simulate({
        denom: 'BNB',
      });

      expect(simulateInfo).not.toBeNull();

      const res = await tx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '5000000000',
        payer: ACCOUNT_ADDRESS,
        granter: '',
        privateKey: ACCOUNT_PRIVATEKEY,
      });

      expect(res.code).toEqual(0);
    });
  });
});
