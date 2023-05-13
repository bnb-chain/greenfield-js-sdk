const { Client } = require('@bnb-chain/greenfield-chain-sdk');
// import {Client} from '@bnb-chain/greenfield-chain-sdk'

const client = Client.create('https://gnfd.qa.bnbchain.world', '9000');

(async () => {
  const account = await client.account.getAccount('0x7239B73CA99b095d4FEe1495cB62e36be8CfeeD1');

  console.log(account);
})();
