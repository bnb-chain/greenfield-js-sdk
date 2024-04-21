import { isAddress } from 'viem';

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
