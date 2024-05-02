import { Address, EIP1193Provider, Hex } from 'viem';

export type ChainConfig = 'testnet' | 'mainnet';
export type AccountConfig = PrivateKeyAccountConfig | JSONRpcAccountConfig;
export type PrivateKeyAccountConfig = {
  privateKey: Address;
};
export type JSONRpcAccountConfig = {
  address: Address;
  ethereumProvider: EIP1193Provider;
};
export type BasicClientParams = {
  chainConfig: ChainConfig;
  accountConfig: AccountConfig;
};

export type ExecuteParams = [number, `0x${string}`];

export type SendMessagesParams = {
  target: `0x${string}`;
  msgBytes: `0x${string}`;
  values: bigint;
};

export type HubAddresses = {
  bucketHubAddress?: Address;
  objectHubAddress?: Address;
  tokenHubAddress?: Address;
  permissionHubAddress?: Address;
  groupHubAddress?: Address;
};

export type MultiMessageParamOptions = {
  sender: Address;
  relayFee: bigint;
  minAckRelayFee: bigint;
  cb?: {
    gasLimit: bigint;
    gasPrice: bigint;
    extraData: {
      appAddress: Address;
      refundAddress: Address;
      failureHandleStrategy: FailureHandleStrategy;
      callbackData: Hex;
    };
  };
};

export enum FailureHandleStrategy {
  BlockOnFail = 0,
  CacheOnFail,
  SkipOnFail,
}

export enum BucketVisibilityType {
  Unspecified = 0,
  PublicRead,
  Private,
  Inherit,
}

export enum UpdateGroupOpType {
  AddMembers = 0,
  RemoveMembers,
  RenewMembers,
}

export type CreateBucketSynPackage = {
  creator: Address;
  name: string;
  visibility: BucketVisibilityType;
  paymentAddress: Address;
  primarySpAddress: Address;
  primarySpApprovalExpiredHeight: bigint;
  globalVirtualGroupFamilyId: number;
  primarySpSignature: Address;
  chargedReadQuota: bigint;
  extraData: `0x${string}`;
};

export type DeleteBucketSynPackage = {
  id: bigint;
};

export type DeleteObjectSynPackage = {
  id: bigint;
};

export type CreateGroupSynPackage = {
  owner: Address;
  name: string;
};

export type DeleteGroupSynPackage = {
  id: bigint;
};

export type UpdateGroupSynPackage = {
  operator: Address;
  id: bigint;
  opType: UpdateGroupOpType;
  members: Address[];
  extraData: `0x${string}`;
  memberExpiration: bigint[];
};

export type DeletePolicySynPackage = {
  id: bigint;
};

export type TransferOutSynPackage = {
  recipient: Address;
  amount: bigint;
};
