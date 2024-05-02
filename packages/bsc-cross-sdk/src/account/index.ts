import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { assertAddress } from '../asserts';
import { ChainConfig, JSONRpcAccountConfig, PrivateKeyAccountConfig } from '../types';
import { getChain } from '../utils';

export const getPrivateKeyAccount = (
  { privateKey }: PrivateKeyAccountConfig,
  chainConfig: ChainConfig,
) => {
  assertAddress(privateKey);

  return createWalletClient({
    // account: privateKeyToAccount(privateKey),
    chain: getChain(chainConfig),
    transport: http(),
  });
};

export const getJSONRpcAccount = (
  { address, ethereumProvider }: JSONRpcAccountConfig,
  chainConfig: ChainConfig,
) => {
  assertAddress(address);

  return createWalletClient({
    account: address,
    chain: getChain(chainConfig),
    transport: custom(ethereumProvider),
  });
};

export const getPublicClient = (chainConfig: ChainConfig) => {
  return createPublicClient({
    chain: getChain(chainConfig),
    transport: http(),
  });
};
