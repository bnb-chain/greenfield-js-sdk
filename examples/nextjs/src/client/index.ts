import { GREEN_CHAIN_ID, GRPC_URL } from '@/config';
import { Client } from '@bnb-chain/greenfield-chain-sdk';

export const client = Client.create(GRPC_URL, String(GREEN_CHAIN_ID));

export const getSps = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter((v: any) => v?.description?.moniker !== 'QATest');

  return finalSps;
};

export const selectSp = async () => {
  const finalSps = await getSps();
  const selectIndex = 1;
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
