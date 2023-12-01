require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mimeTypes = require('mime-types');
const { getCheckSums } = require('@bnb-chain/greenfiled-file-handle');
const { client, selectSp, generateString } = require('../client');
const { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } = require('../env');

const filePath = './CHANGELOG.md';
const bucketName = generateString(10);
const objectName = generateString(10);
const fileBuffer = fs.readFileSync(filePath);
const extname = path.extname(filePath);
const fileType = mimeTypes.lookup(extname);

console.log('bucketName', bucketName);
console.log('objectName', objectName);

(async () => {
  const spInfo = await selectSp();

  // create bucket example:
  const createBucketTx = await client.bucket.createBucket(
    {
      bucketName: bucketName,
      creator: ACCOUNT_ADDRESS,
      visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
      chargedReadQuota: '0',
      spInfo: {
        primarySpAddress: spInfo.primarySpAddress,
      },
      paymentAddress: ACCOUNT_ADDRESS,
    },
    {
      type: 'ECDSA',
      privateKey: ACCOUNT_PRIVATEKEY,
    },
  );

  const createBucketTxSimulateInfo = await createBucketTx.simulate({
    denom: 'BNB',
  });

  console.log('createBucketTxSimulateInfo', createBucketTxSimulateInfo);

  const createBucketTxRes = await createBucketTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(createBucketTxSimulateInfo?.gasLimit),
    gasPrice: createBucketTxSimulateInfo?.gasPrice || '5000000000',
    payer: ACCOUNT_ADDRESS,
    granter: '',
    privateKey: ACCOUNT_PRIVATEKEY,
  });

  console.log('create bucket success', createBucketTxRes);

  // create object example:
  const hashResult = await getCheckSums(fileBuffer);
  const { contentLength, expectCheckSums } = hashResult;

  const createObjectTx = await client.object.createObject(
    {
      bucketName: bucketName,
      objectName: objectName,
      creator: ACCOUNT_ADDRESS,
      visibility: 'VISIBILITY_TYPE_PRIVATE',
      fileType: fileType,
      redundancyType: 'REDUNDANCY_EC_TYPE',
      contentLength,
      expectCheckSums: JSON.parse(expectCheckSums),
    },
    {
      type: 'ECDSA',
      privateKey: ACCOUNT_PRIVATEKEY,
    },
  );

  const createObjectTxSimulateInfo = await createObjectTx.simulate({
    denom: 'BNB',
  });

  const createObjectTxRes = await createObjectTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(createObjectTxSimulateInfo?.gasLimit),
    gasPrice: createObjectTxSimulateInfo?.gasPrice || '5000000000',
    payer: ACCOUNT_ADDRESS,
    granter: '',
    privateKey: ACCOUNT_PRIVATEKEY,
  });

  console.log('create object success', createObjectTxRes);

  const uploadRes = await client.object.uploadObject(
    {
      bucketName: bucketName,
      objectName: objectName,
      body: fileBuffer,
      txnHash: createObjectTxRes.transactionHash,
    },
    {
      type: 'ECDSA',
      privateKey: ACCOUNT_PRIVATEKEY,
    },
  );

  if (uploadRes.code === 0) {
    console.log('upload object success', uploadRes);
  }
})();
