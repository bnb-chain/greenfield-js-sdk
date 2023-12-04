import { Client } from '../src';
import { ISimulateGasFee } from '../src/types';
import { GREENFIELD_CHAIN_ID, GREENFIELD_URL } from './env';

export const client = Client.create(GREENFIELD_URL, GREENFIELD_CHAIN_ID);

export const ZERO_ACCOUNT_ADDRESS = '0x0000000000000000000000000000000000000000';

export const DEFAULT_SIMULATE_INFO: ISimulateGasFee = {
  gasFee: '0',
  gasLimit: BigInt(0),
  gasPrice: '0',
};

export function generateString(length: number) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';

  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const getSps = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter((v) => v.endpoint.includes('nodereal'));

  return finalSps;
};

export const selectSp = async () => {
  const finalSps = await getSps();
  const selectIndex = 0;
  const secondarySpAddresses = [
    ...finalSps.slice(0, selectIndex),
    ...finalSps.slice(selectIndex + 1),
  ].map((item) => item.operatorAddress);
  const selectSpInfo = {
    endpoint: finalSps[selectIndex].endpoint,
    primarySpAddress: finalSps[selectIndex]?.operatorAddress,
    sealAddress: finalSps[selectIndex].sealAddress,
    secondarySpAddresses,
  };

  return selectSpInfo;
};
