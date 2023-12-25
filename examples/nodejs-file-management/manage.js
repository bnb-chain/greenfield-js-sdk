require('dotenv').config();
const fs = require('fs');
const { Client } = require('@bnb-chain/greenfield-js-sdk');

const client = Client.create('https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org', '5600');

const { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } = process.env;

// download object
// ;(async () => {
//   const res = await client.object.getObject({
//     bucketName: 'extfkdcxxd',
//     objectName: 'yhulwcfxye'
//   }, {
//     type: 'ECDSA',
//     privateKey: ACCOUNT_PRIVATEKEY,
//   })

//   // res.body is Blob
//   console.log('res', res)
//   const buffer = Buffer.from([res.body]);
//   fs.writeFileSync('your_output_file', buffer)
// })()

// update object visibility
// ;(async () => {
//   const tx = await client.object.updateObjectInfo({
//     bucketName: 'extfkdcxxd',
//     objectName: 'yhulwcfxye',
//     operator: ACCOUNT_ADDRESS,
//     visibility: 1,
//   })

//   const simulateTx = await tx.simulate({
//     denom: 'BNB',
//   })

//   const createObjectTxRes = await tx.broadcast({
//     denom: 'BNB',
//     gasLimit: Number(simulateTx?.gasLimit),
//     gasPrice: simulateTx?.gasPrice || '5000000000',
//     payer: ACCOUNT_ADDRESS,
//     granter: '',
//     privateKey: ACCOUNT_PRIVATEKEY,
//   });
// })()

// delete object
(async () => {
  const tx = await client.object.deleteObject({
    bucketName: 'extfkdcxxd',
    objectName: 'yhulwcfxye',
    operator: ACCOUNT_ADDRESS,
  });

  const simulateTx = await tx.simulate({
    denom: 'BNB',
  });

  const createObjectTxRes = await tx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateTx?.gasLimit),
    gasPrice: simulateTx?.gasPrice || '5000000000',
    payer: ACCOUNT_ADDRESS,
    granter: '',
    privateKey: ACCOUNT_PRIVATEKEY,
  });

  if (createObjectTxRes.code === 0) {
    console.log('delete object success');
  }
})();
