require('dotenv').config();
const { Client } = require('@bnb-chain/greenfield-js-sdk');
const client = Client.create('https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org', '5600');

(async () => {
  const transferTx = await client.account.transfer({
    fromAddress: process.env.ACCOUNT_ADDRESS,
    toAddress: '0x0000000000000000000000000000000000000000',
    amount: [
      {
        denom: 'BNB',
        amount: '1000000000',
      },
    ],
  });

  const simulateInfo = await transferTx.simulate({
    denom: 'BNB',
  });

  const res = await transferTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo.gasLimit),
    gasPrice: simulateInfo.gasPrice,
    payer: process.env.ACCOUNT_ADDRESS,
    granter: '',
    privateKey: process.env.ACCOUNT_PRIVATEKEY,
  });

  console.log('res', res);
})();
