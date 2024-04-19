export type ExecuteParams = [number, `0x${string}`];
export type SendMessagesParams = {
  target: `0x${string}`;
  msgBytes: `0x${string}`;
  values: bigint;
};
export type MultiMessageClientInitParams = {
  bucketHubAddress?: `0x${string}`;
};
export type MultiMessageParamOptions = {
  relayFee: bigint;
  minAckRelayFee: bigint;
};
