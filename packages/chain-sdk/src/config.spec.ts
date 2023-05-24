import { ISimulateGasFee } from './types';

// export const GRPC_URL = 'https://gnfd.qa.bnbchain.world';
export const GRPC_URL = 'http://localhost:26750';
// export const GREENFIELD_URL = 'https://gnfd.qa.bnbchain.world';
export const GREENFIELD_URL = 'http://localhost:26750';
export const GREENFIELD_CHAIN_ID = '9000';
export const BSC_RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545';
export const BSC_CHAIN_ID = '97';
// export const ACCOUNT = {
//   address: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
//   privateKey: '0x6547492644d0136f76ef65e3bd04a77d079ed38028f747700c6c6063564d7032',
// };
export const ACCOUNT = {
  address: '0x67c01Cc85Db17E26F279FC588759F266F97d1AB3',
  privateKey: '0x9355300339899ae8df87ba0e2b71e8cc1ca996d65b0520e232d9de54bab11861',
};

export const ZERO_ACCOUNT_ADDRESS = '0x0000000000000000000000000000000000000000';

export const DEFAULT_SIMULATE_INFO: ISimulateGasFee = {
  gasFee: '0',
  gasLimit: BigInt(0),
  gasPrice: '0',
};
