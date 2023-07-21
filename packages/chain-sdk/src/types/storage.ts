import {
  RedundancyType,
  VisibilityType,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';

export type SignType = 'authTypeV2' | 'offChainAuth';

export interface IBaseGetCreateBucket {
  bucketName: string;
  creator: string;
  visibility: keyof typeof VisibilityType;
  chargedReadQuota: string;
  spInfo: ISpInfo;
  duration?: number;
}

export interface ICreateBucketByOffChainAuth extends IBaseGetCreateBucket {
  signType: 'offChainAuth';
  domain: string;
  seedString: string;
}

export interface ICreateBucketByAuthTypeV2 extends IBaseGetCreateBucket {
  signType?: 'authTypeV2';
}

export type TCreateBucket = ICreateBucketByOffChainAuth | ICreateBucketByAuthTypeV2;

export interface ISpInfo {
  endpoint: string;
  primarySpAddress?: string;
  sealAddress: string;
  secondarySpAddresses: string[];
}

export interface IObjectResultType<T> {
  code: number;
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
  };
  charged_read_quota: string;
}

export type TBaseGetUserBuckets = {
  address: string;
  duration?: number;
  endpoint: string;
};
export type TGetUserBucketByOffChainAuth = TBaseGetUserBuckets & {
  signType: 'offChainAuth';
  domain: string;
  seedString: string;
};
export type TGetCreateBucketByAuthTypeV2 = TBaseGetUserBuckets & {
  signType?: 'authTypeV2';
};
export type TGetUserBuckets = TGetUserBucketByOffChainAuth | TGetCreateBucketByAuthTypeV2;

export type BucketProps = {
  bucket_info: {
    owner: string;
    bucket_name: string;
    visibility: number;
    id: string;
    source_type: string;
    create_at: string;
    payment_address: string;
    primary_sp_address: string;
    charged_read_quota: string;
    billing_info: {
      price_time: string;
      total_charge_size: string;
      secondary_sp_objects_size: Array<string>;
    };
    bucket_status: number;
  };
  removed: boolean;
  delete_at: string;
  delete_reason: string;
  operator: string;
  create_tx_hash: string;
  update_tx_hash: string;
  update_at: string;
  update_time: string;
};

export type TBaseGetBucketReadQuota = {
  bucketName: string;
  endpoint: string;
  duration?: number;
  year?: number;
  month?: number;
};

export type TGetBucketReadQuotaByAuthTypeV2 = TBaseGetBucketReadQuota & {
  signType?: 'authTypeV2';
};

export type TGetBucketReadQuotaByOffChainAuth = TBaseGetBucketReadQuota & {
  signType: 'offChainAuth';
  domain: string;
  seedString: string;
  address: string;
};

export type TGetBucketReadQuota =
  | TGetBucketReadQuotaByAuthTypeV2
  | TGetBucketReadQuotaByOffChainAuth;

export interface IQuotaProps {
  readQuota: number;
  freeQuota: number;
  consumedQuota: number;
}

export type TBaseGetCreateObject = {
  bucketName: string;
  objectName: string;
  creator: string;
  visibility?: keyof typeof VisibilityType;
  fileType: string;
  redundancyType?: keyof typeof RedundancyType;
  // expectSecondarySpAddresses: string[];
  // endpoint?: string;
  spInfo: ISpInfo;
  duration?: number;
  contentLength: number;
  expectCheckSums: string[];
  // hashResult?: any;
};

export type TCreateObjectByOffChainAuth = TBaseGetCreateObject & {
  signType: 'offChainAuth';
  domain: string;
  seedString: string;
};

export type TCreateObjectByAuthTypeV1 = TBaseGetCreateObject & {
  signType?: 'authTypeV1';
  privateKey: string;
};

export type TCreateObjectByAuthTypeV2 = TBaseGetCreateObject & {
  signType?: 'authTypeV2';
};

export type TCreateObject =
  | TCreateObjectByOffChainAuth
  | TCreateObjectByAuthTypeV1
  | TCreateObjectByAuthTypeV2;

export interface ICreateObjectMsgType {
  creator: string;
  bucket_name: string;
  object_name: string;
  payload_size: string;
  visibility: keyof typeof VisibilityType;
  content_type: string;
  primary_sp_approval: {
    expired_height: string;
    sig: string;
  };
  expect_checksums: string[];
  expect_secondary_sp_addresses: string[];
  redundancy_type: keyof typeof RedundancyType;
  // charged_read_quota: string;
}

export type TBasePutObject = {
  bucketName: string;
  objectName: string;
  txnHash: string;
  body: Blob;
  endpoint?: string;
  duration?: number;
};

export type TPutObjectByAuthTypeV2 = TBasePutObject & {
  signType?: 'authTypeV2';
};

export type TPutObjectByOffChainAuth = TBasePutObject & {
  signType: 'offChainAuth';
  domain: string;
  seedString: string;
  address: string;
};

export type TPutObject = TPutObjectByAuthTypeV2 | TPutObjectByOffChainAuth;

export type TBaseGetObject = {
  bucketName: string;
  objectName: string;
  endpoint?: string;
  duration?: number;
};

export type TGetObjectByAuthTypeV2 = TBaseGetObject & {
  signType?: 'authTypeV2';
};

export type TGetObjectByOffChainAuth = TBaseGetObject & {
  signType: 'offChainAuth';
  domain: string;
  seedString: string;
  address: string;
};

export type TGetObject = TGetObjectByAuthTypeV2 | TGetObjectByOffChainAuth;

export type TBaseListObjects = {
  bucketName: string;
  duration?: number;
  endpoint: string;
  protocol?: string;
  query?: URLSearchParams;
};

export type TListObjectsByAuthTypeV2 = TBaseListObjects & {
  signType?: 'authTypeV2';
};

export type TListObjectsByOffChainAuth = TBaseListObjects & {
  signType: 'offChainAuth';
  domain: string;
  seedString: string;
  address: string;
};

export type TListObjects = TListObjectsByAuthTypeV2 | TListObjectsByOffChainAuth;

export type TDownloadFile = {
  bucketName: string;
  endpoint: string;
  duration?: number;
  year?: number;
  month?: number;
};
export interface IObjectProps {
  object_info: {
    owner: string;
    bucket_name: string;
    object_name: string;
    id: string;
    payload_size: string;
    visibility: number;
    content_type: string;
    create_at: string;
    object_status: string;
    redundancy_type: string;
    source_type: string;
    checksums: Array<string>;
    secondary_sp_addresses: Array<string>;
  };
  locked_balance: string;
  removed: boolean;
  update_at: string;
  delete_at: string;
  delete_reason: string;
  operator: string;
  create_tx_hash: string;
  update_tx_hash: string;
  seal_tx_hash: string;
}

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
