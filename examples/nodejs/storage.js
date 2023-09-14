const { client, selectSp, generateString } = require('./client');
const { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } = require('./env');

(async () => {
  const bucketName = generateString(10);
  const spInfo = await selectSp();
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

  const simulateInfo = await createBucketTx.simulate({
    denom: 'BNB',
  });

  console.log('simulateInfo', simulateInfo);

  const res = await createBucketTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: ACCOUNT_ADDRESS,
    granter: '',
    privateKey: ACCOUNT_PRIVATEKEY,
  });

  console.log('res', res);
})();
