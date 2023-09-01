import { GREEN_CHAIN_ID, GRPC_URL } from '@/config';
import { Client } from '@bnb-chain/greenfield-js-sdk';

export const client = Client.create(GRPC_URL, String(GREEN_CHAIN_ID), {
  // zkCryptoUrl: 'https://dcellar.io/static/dcellar-web-ui/wasm/zk.wasm',
  zkCryptoUrl:
    'https://unpkg.com/@bnb-chain/greenfield-zk-crypto@0.0.2-alpha.4/dist/node/zk-crypto.wasm',
});

export const getSps = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter((v: any) => v.endpoint.includes('nodereal'));

  return finalSps;
};

export const getAllSps = async () => {
  const sps = await getSps();

  return sps.map((sp) => {
    return {
      address: sp.operatorAddress,
      endpoint: sp.endpoint,
      name: sp.description?.moniker,
    };
  });
};

export const selectSp = async () => {
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
