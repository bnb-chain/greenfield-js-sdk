const { Client } = require('@bnb-chain/greenfield-js-sdk');

// testnet
const client = Client.create('https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org', '5600');

(async () => {
  const latestBlockHeight = await client.basic.getLatestBlockHeight();

  console.log('latestBlockHeight', latestBlockHeight);
})();
(async () => {
  const balance = await client.account.getAccountBalance({
    address: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
    denom: 'BNB',
  });

  console.log('balance', balance);
})();
