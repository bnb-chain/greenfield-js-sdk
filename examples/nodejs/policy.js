const { client, selectSp, generateString } = require('./client');
const { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } = require('./env');

(async () => {
  const GROUP_NAME = generateString(10);
  const EXTRA = generateString(10);

  // create group tx
  const createGroupTx = await client.group.createGroup({
    creator: ACCOUNT.address,
    extra: EXTRA,
    groupName: GROUP_NAME,
  });

  const simulateInfo = await createGroupTx.simulate({
    denom: 'BNB',
  });

  console.log('simulateInfo', simulateInfo);

  const createGroupTxRes = await createGroupTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: ACCOUNT_ADDRESS,
    granter: '',
    privateKey: ACCOUNT_PRIVATEKEY,
  });

  // update group tx
  const newExtra = generateString(10);
  const updateGroupTx = await client.group.updateGroupExtra({
    groupName: GROUP_NAME,
    groupOwner: ACCOUNT_ADDRESS,
    operator: ACCOUNT_ADDRESS,
    extra: newExtra,
  });

  const simulateInfo = await updateGroupTx.simulate({
    denom: 'BNB',
  });

  expect(simulateInfo).not.toBeNull();

  const updateGroupTxRes = await updateGroupTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo.gasLimit),
    gasPrice: simulateInfo.gasPrice,
    granter: '',
    payer: ACCOUNT_ADDRESS,
    privateKey: ACCOUNT_PRIVATEKEY,
  });

  // delete group tx
  const deleteGroupTx = await client.group.deleteGroup({
    groupName: GROUP_NAME,
    operator: ACCOUNT_ADDRESS,
  });
  const simulateInfo = await deleteGroupTx.simulate({
    denom: 'BNB',
  });
  const deleteGroupTxRes = await deleteGroupTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo.gasLimit),
    gasPrice: simulateInfo.gasPrice,
    granter: '',
    payer: ACCOUNT_ADDRESS,
    privateKey: ACCOUNT_PRIVATEKEY,
  });
})();
