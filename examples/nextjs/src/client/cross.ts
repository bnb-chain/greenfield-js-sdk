import { BasicClientParams } from '@bnb-chain/bsc-cross-greenfield-sdk';

/**
 * bsc testnet
 */
export const getCrossClientConfig = (address: `0x${string}`) => {
  const config: BasicClientParams = {
    chainConfig: 'testnet',
    accountConfig: {
      address,
      ethereumProvider: window.ethereum,
    },
  };

  return config;
};
