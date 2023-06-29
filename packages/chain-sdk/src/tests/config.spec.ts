import { Client } from '..';
import { ISimulateGasFee } from '../types';

export const BSC_RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545';
export const BSC_CHAIN_ID = '97';
// export const GRPC_URL = 'https://gnfd.qa.bnbchain.world';
// export const GREENFIELD_URL = 'https://gnfd.qa.bnbchain.world';
// export const GREENFIELD_CHAIN_ID = '9000';

export const GRPC_URL = 'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org';
export const GREENFIELD_URL = 'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org';
export const GREENFIELD_CHAIN_ID = '5600';

export const client = Client.create(GRPC_URL, GREENFIELD_CHAIN_ID);

export const ACCOUNT = {
  address: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
  privateKey: '0x6547492644d0136f76ef65e3bd04a77d079ed38028f747700c6c6063564d7032',
};

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
  const finalSps = (sps ?? []).filter((v: any) => v?.description?.moniker !== 'QATest');

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
