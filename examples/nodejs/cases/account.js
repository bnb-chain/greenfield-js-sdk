require('dotenv').config();
const { client, selectSp, generateString } = require('../client');
const { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } = require('../env');

(async () => {
  const accountInfo = await client.account.getAccount(ACCOUNT_ADDRESS);

  console.log('accountInfo', accountInfo);

  const accountBalance = await client.account.getAccountBalance({
    address: ACCOUNT_ADDRESS,
    denom: 'BNB',
  });

  const moduleAccounts = await client.account.getModuleAccounts();
})();
