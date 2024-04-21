import { isAddress } from 'viem';
import { AccountConfig, JSONRpcAccountConfig, PrivateKeyAccountConfig } from './types';

export function assertHubAddress(
  errMsg: string,
  address?: `0x${string}`,
): asserts address is `0x${string}` {
  if (!address || !isAddress(address)) {
    throw new Error(errMsg);
  }
}

export function assertAddress(address: string): asserts address is `0x${string}` {
  if (address && !address.startsWith('0x')) {
    throw new Error('address should start with 0x');
  }
}

export function isJSONRpcAccount(
  accountConfig: AccountConfig,
): accountConfig is JSONRpcAccountConfig {
  return 'address' in accountConfig;
}

export function isPrivateKeyAccount(
  accountConfig: AccountConfig,
): accountConfig is PrivateKeyAccountConfig {
  return 'privateKey' in accountConfig;
}
