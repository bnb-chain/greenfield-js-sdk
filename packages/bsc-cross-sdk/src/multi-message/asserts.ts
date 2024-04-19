export function assertBucketHubAddress(address?: `0x${string}`): asserts address is `0x${string}` {
  if (!address) {
    throw new Error('bucket hub address is required in init params');
  }
}
