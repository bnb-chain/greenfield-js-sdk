const { Client } = require('@bnb-chain/greenfield-chain-sdk');
// import {Client} from '@bnb-chain/greenfield-chain-sdk'

const client = Client.create('https://gnfd.qa.bnbchain.world', '9000');

(async () => {
  const account = await client.account.getAccount('0x1C893441AB6c1A75E01887087ea508bE8e07AAae');

  console.log(account);
})();
