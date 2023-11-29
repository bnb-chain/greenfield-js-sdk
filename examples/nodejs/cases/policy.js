require('dotenv').config();
const { client, selectSp, generateString } = require('../client');
const { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } = require('../env');

(async () => {
  const GROUP_NAME = generateString(10);
  const EXTRA = generateString(10);

  // create group tx
  const createGroupTx = await client.group.createGroup({
    creator: ACCOUNT_ADDRESS,
    extra: EXTRA,
    groupName: GROUP_NAME,
  });

  const createGroupTxSimulateInfo = await createGroupTx.simulate({
    denom: 'BNB',
  });

  console.log('createGroupTxSimulateInfo', createGroupTxSimulateInfo);

  const createGroupTxRes = await createGroupTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(createGroupTxSimulateInfo?.gasLimit),
    gasPrice: createGroupTxSimulateInfo?.gasPrice || '5000000000',
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

  const updateGroupExtraSimulateInfo = await updateGroupTx.simulate({
    denom: 'BNB',
  });

  const updateGroupTxRes = await updateGroupTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(updateGroupExtraSimulateInfo.gasLimit),
    gasPrice: updateGroupExtraSimulateInfo.gasPrice,
    granter: '',
    payer: ACCOUNT_ADDRESS,
    privateKey: ACCOUNT_PRIVATEKEY,
  });

  // delete group tx
  const deleteGroupTx = await client.group.deleteGroup({
    groupName: GROUP_NAME,
    operator: ACCOUNT_ADDRESS,
  });
  const deleteGroupTxSimulateInfo = await deleteGroupTx.simulate({
    denom: 'BNB',
  });
  const deleteGroupTxRes = await deleteGroupTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(deleteGroupTxSimulateInfo.gasLimit),
    gasPrice: deleteGroupTxSimulateInfo.gasPrice,
    granter: '',
    payer: ACCOUNT_ADDRESS,
    privateKey: ACCOUNT_PRIVATEKEY,
  });
})();
