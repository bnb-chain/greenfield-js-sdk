const { Client } = require('@bnb-chain/greenfield-js-sdk');
const client = Client.create(
  process.env.NEXT_PUBLIC_GREENFIELD_RPC_URL,
  process.env.NEXT_PUBLIC_GREEN_CHAIN_ID,
);

const getSps = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter((v) => v.endpoint.includes('nodereal'));

  return finalSps;
};

const getAllSps = async () => {
  const sps = await getSps();

  return sps.map((sp) => {
    return {
      address: sp.operatorAddress,
      endpoint: sp.endpoint,
      name: sp.description?.moniker,
    };
  });
};

const selectSp = async () => {
  const finalSps = await getSps();

  const selectIndex = Math.floor(Math.random() * finalSps.length);

  const secondarySpAddresses = [
    ...finalSps.slice(0, selectIndex),
    ...finalSps.slice(selectIndex + 1),
  ].map((item) => item.operatorAddress);
  const selectSpInfo = {
    id: finalSps[selectIndex].id,
    endpoint: finalSps[selectIndex].endpoint,
    primarySpAddress: finalSps[selectIndex]?.operatorAddress,
    sealAddress: finalSps[selectIndex].sealAddress,
    secondarySpAddresses,
  };

  return selectSpInfo;
};

const generateString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';

  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

module.exports = {
  client,
  selectSp,
  generateString,
};
