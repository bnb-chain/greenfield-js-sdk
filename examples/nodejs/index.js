const { Client } = require('@bnb-chain/greenfield-js-sdk');
const { getCheckSums } = require('@bnb-chain/greenfiled-file-handle/files');
const fs = require('fs');

const client = Client.create('https://gnfd.qa.bnbchain.world', '9000');

// (async () => {
//   const filePath = './package.json';
//   const fileBuf = fs.readFileSync(filePath);
//   const DEFAULT_SEGMENT_SIZE = 16 * 1024 * 1024;
//   const DEFAULT_DATA_BLOCKS = 4;
//   const DEFAULT_PARITY_BLOCKS = 2;
//   const bytes = new Uint8Array(fileBuf);

//   const hashResult = await getCheckSums(
//     Buffer.from(bytes).toString('hex'),
//     DEFAULT_SEGMENT_SIZE,
//     DEFAULT_DATA_BLOCKS,
//     DEFAULT_PARITY_BLOCKS,
//   );
//   console.log('hashResult', hashResult);
// })();

(async () => {
  const account = await client.account.getAccount('0x1C893441AB6c1A75E01887087ea508bE8e07AAae');

  console.log(account);
})();
