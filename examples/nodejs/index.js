const { Client } = require('@bnb-chain/greenfield-js-sdk');
// const { getCheckSums } = require('@bnb-chain/greenfiled-file-handle/files');
// const fs = require('fs');

// const client = Client.create('https://gnfd-dev.qa.bnbchain.world', '8981');

const client = Client.create('https://gnfd.qa.bnbchain.world', '9000');

(async () => {
  const createBucketTx = await client.bucket.createBucket({
    bucketName: 'foo',
    creator: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
    visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
    chargedReadQuota: '0',
    spInfo: {
      primarySpAddress: '0x66d06FFe266B46C6F0730cC9Ec2fc5B811cdA085',
    },
    signType: 'authTypeV1',
    privateKey: '0x6547492644d0136f76ef65e3bd04a77d079ed38028f747700c6c6063564d7032',
    // signType: 'offChainAuth',
    // domain: window.location.origin,
    // seedString: offChainData.seedString,
  });

  const simulateInfo = await createBucketTx.simulate({
    denom: 'BNB',
  });

  console.log('simulateInfo', simulateInfo);

  const res = await createBucketTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
    granter: '',
    privateKey: '0x6547492644d0136f76ef65e3bd04a77d079ed38028f747700c6c6063564d7032',
  });

  if (res.code === 0) {
    console.log('success');
  }
})();
