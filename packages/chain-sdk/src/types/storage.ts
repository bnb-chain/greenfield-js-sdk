import {
  RedundancyType,
  SourceType,
  VisibilityType,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';

export interface IBaseGetCreateBucket {
  bucketName: string;
  creator: string;
  visibility: keyof typeof VisibilityType;
  chargedReadQuota: string;
  spInfo: {
    primarySpAddress: string;
  };
  duration?: number;
  paymentAddress: string;
}

export interface ISpInfo {
  id: number;
  endpoint: string;
  primarySpAddress?: string;
  sealAddress: string;
  secondarySpAddresses: string[];
}

export interface IObjectResultType<T> {
  code: number | string;
  xml?: Document;
  message?: string;
  statusCode?: number;
  body?: T;
  signedMsg?: object;
}

export interface ICreateBucketMsgType {
  creator: string;
  bucket_name: string;
  visibility: keyof typeof VisibilityType;
  payment_address: string;
  primary_sp_address: string;
  primary_sp_approval: {
    expired_height: string;
    sig: string;
    global_virtual_group_family_id: number;
  };
  charged_read_quota: string;
}

export type TGetUserBuckets = {
  address: string;
  duration?: number;
  endpoint: string;
};

export type BucketProps = {
  bucket_info: {
    bucket_name: string;
    bucket_status: number;
    charged_read_quota: string;
    create_at: string;
    global_virtual_group_family_id: number;
    id: string;
    owner: string;
    payment_address: string;
    primary_sp_id: number;
    source_type: string;
    visibility: number;
  };
  create_tx_hash: string;
  delete_at: string;
  delete_reason: string;
  operator: string;
  removed: boolean;
  update_at: string;
  update_time: string;
  update_tx_hash: string;
};

export type TBaseGetBucketReadQuota = {
  bucketName: string;
  endpoint?: string;
  duration?: number;
  year?: number;
  month?: number;
};

export interface IQuotaProps {
  readQuota: number;
  freeQuota: number;
  consumedQuota: number;
  freeConsumedSize: number;
}

export type TBaseGetCreateObject = {
  bucketName: string;
  objectName: string;
  creator: string;
  visibility?: keyof typeof VisibilityType;
  fileType: string;
  redundancyType?: keyof typeof RedundancyType;
  duration?: number;
  contentLength: number;
  expectCheckSums: string[];
  endpoint?: string;
};

export interface ICreateObjectMsgType {
  creator: string;
  bucket_name: string;
  object_name: string;
  payload_size: string;
  visibility: keyof typeof VisibilityType;
  content_type: string;
  primary_sp_approval: {
    expired_height: string;
    sig: string | null;
    global_virtual_group_family_id: number;
  };
  expect_checksums: string[];
  // expect_secondary_sp_addresses: string[];
  redundancy_type: keyof typeof RedundancyType;
  // charged_read_quota: string;
}

export type TBasePutObject = {
  bucketName: string;
  objectName: string;
  txnHash: string;
  body: File;
  duration?: number;
  endpoint?: string;
};

export type TBaseGetObject = {
  bucketName: string;
  objectName: string;
  duration?: number;
  endpoint?: string;
};

export type TBaseGetPrivewObject = {
  bucketName: string;
  objectName: string;
  duration?: number;
  queryMap: Record<string, string>;
  endpoint?: string;
};

export type TListObjects = {
  bucketName: string;
  duration?: number;
  endpoint: string;
  protocol?: string;
  query?: URLSearchParams;
};

export type TDownloadFile = {
  bucketName: string;
  endpoint: string;
  duration?: number;
  year?: number;
  month?: number;
};

export interface IGetObjectStaus {
  bucketName: string;
  objectName: string;
  endpoint: string;
}

export interface IBaseUser {
  address: string;
  domain: string;
}
export interface ISp {
  address: string;
  endpoint: string;
  name?: string;
  nonce?: number;
}

export interface IFetchNonce extends IBaseUser {
  spEndpoint: string;
  spAddress: string;
  spName?: string;
}

export interface IFetchNonces extends IBaseUser {
  sps: ISp[];
}

export interface IGenOffChainAuthKeyPairAndUpload extends IBaseUser {
  sps: ISp[];
  chainId: number;
  expirationMs: number;
}

export interface IReturnOffChainAuthKeyPairAndUpload {
  seedString: string;
  pubKey: string;
  expirationTime: number;
  spAddresses: string[];
  failedSpAddresses: string[];
}

export interface IReturnSignWithSeedString {
  unSignedMsg: string;
  signature: string;
  authorization: string;
}

export interface TGenSecondSignMsgParams {
  domain: string;
  address: string;
  pubKey: string;
  chainId: number;
  issuedDate: string;
  expireDate: string;
  sps: ISp[];
}

export interface IUpdateOneSpPubKeyBaseParams {
  address: string;
  domain: string;
  pubKey: string;
  expireDate: string;
  authorization: string;
}

export interface IUpdateOneSpPubKeyParams extends IUpdateOneSpPubKeyBaseParams {
  sp: ISp;
}
export interface IUpdateSpsPubKeyParams extends IUpdateOneSpPubKeyBaseParams {
  sps: ISp[];
}

export interface IPersonalSignParams {
  message: string;
  address: string;
  provider: any;
}

export interface TGetCurrentSeedStringParams {
  message: string;
  address: string;
  chainId: number;
  provider: any;
}

export interface IMigrateBucketMsgType {
  operator: string;
  bucket_name: string;
  dst_primary_sp_id: number;
  dst_primary_sp_approval: {
    expired_height: string;
    sig: string;
    global_virtual_group_family_id: number;
  };
}

export type TListBucketReadRecord = {
  bucketName: string;
  endpoint?: string;
  listReadRecord: string;
  maxRecords: number;
  startTimeStamp: number;
  endTimeStamp: number;
};

export type TListGroups = {
  name: string;
  prefix: string;
  sourceType?: keyof typeof SourceType;
  limit?: number;
  offset?: number;
};

export type TListObjectsByIDsRequest = {
  ids: string[];
};

export type TListBucketsByIDsRequest = {
  ids: string[];
};
