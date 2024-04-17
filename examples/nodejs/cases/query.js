require('dotenv').config();
const { client, selectSp, generateString } = require('../client');
const { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } = require('../env');

(async () => {
  const spInfo = await selectSp();

  const queryLockFeeRes = await client.storage.queryLockFee({
    createAt: Long.fromInt(0),
    primarySpAddress: spInfo.primarySpAddress,
    payloadSize: Long.fromInt(1111),
  });
})();
