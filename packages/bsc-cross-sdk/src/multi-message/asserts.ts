export function assertBucketHubAddress(address?: `0x${string}`): asserts address is `0x${string}` {
  if (!address) {
    throw new Error('bucket hub address is required in init params');
  }
}

export function assertAddress(address: string): asserts address is `0x${string}` {
  if (address && !address.startsWith('0x')) {
    throw new Error('address should start with 0x');
  }
}
