require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { NodeAdapterReedSolomon } = require('@bnb-chain/reed-solomon/node.adapter');
const {
  Client,
  Long,
  VisibilityType,
  RedundancyType,
  bytesFromBase64,
} = require('@bnb-chain/greenfield-js-sdk');
const mimeTypes = require('mime-types');
const client = Client.create('https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org', '5600');

const { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } = process.env;

const generateString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';

  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const bucketName = generateString(10);
const objectName = generateString(10);
console.log('bucketName', bucketName);
console.log('objectName', objectName);

(async () => {
  // get sotrage providers list
  const sps = await client.sp.getStorageProviders();

  // choose the first up to be the primary SP
  // const primarySP = sps[0].operatorAddress;
  const primarySP = '0xD142052d8C0881FC7485C1270c3510BC442E05DD';
  console.log('primarySP', primarySP);

  // create bucket
  const createBucketTx = await client.bucket.createBucket({
    bucketName: bucketName,
    creator: ACCOUNT_ADDRESS,
    visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
    chargedReadQuota: Long.fromString('0'),
    primarySpAddress: primarySP,
    paymentAddress: ACCOUNT_ADDRESS,
  });

  const createBucketTxSimulateInfo = await createBucketTx.simulate({
    denom: 'BNB',
  });

  const createBucketRes = await createBucketTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(createBucketTxSimulateInfo?.gasLimit),
    gasPrice: createBucketTxSimulateInfo?.gasPrice || '5000000000',
    payer: ACCOUNT_ADDRESS,
    granter: '',
    privateKey: ACCOUNT_PRIVATEKEY,
  });

  if (createBucketRes.code === 0) {
    console.log('create bucket success');
  }

  // get file's expectCheckSums
  const filePath = './index.js';
  const fileBuffer = fs.readFileSync(filePath);
  const fileType = mimeTypes.lookup(path.extname(filePath));
  const rs = new NodeAdapterReedSolomon();
  const expectCheckSums = await rs.encodeInWorker(__filename, Uint8Array.from(fileBuffer));

  // create object tx
  const createObjectTx = await client.object.createObject({
    bucketName: bucketName,
    objectName: objectName,
    creator: ACCOUNT_ADDRESS,
    visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
    contentType: fileType,
    redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
    payloadSize: Long.fromInt(fileBuffer.length),
    expectChecksums: expectCheckSums.map((x) => bytesFromBase64(x)),
  });
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

  if (createObjectTxRes.code === 0) {
    console.log('create object success');
  }

  // upload your object
  await client.object.uploadObject(
    {
      bucketName: bucketName,
      objectName: objectName,
      body: createFile(filePath),
      txnHash: createObjectTxRes.transactionHash,
    },
    {
      type: 'ECDSA',
      privateKey: ACCOUNT_PRIVATEKEY,
    },
  );
})();

function createFile(path) {
  const stats = fs.statSync(path);
  const fileSize = stats.size;

  return {
    name: path,
    type: '',
    size: fileSize,
    content: fs.readFileSync(path),
  };
}
