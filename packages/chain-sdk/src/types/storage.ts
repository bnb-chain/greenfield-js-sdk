import {
  RedundancyType,
  VisibilityType,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';

export interface IGetCreateBucketApproval {
  bucketName: string;
  creator: string;
  visibility: keyof typeof VisibilityType;
  chargedReadQuota: string;
  spInfo: ISpInfo;
  duration?: number;
}

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

export interface getUserBucketsPropsType {
  address: string;
  duration?: number;
  endpoint: string;
}

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

export type GetObjectPropsType = {
  bucketName: string;
  endpoint: string;
  duration?: number;
  year?: number;
  month?: number;
};

export interface IQuotaProps {
  readQuota: number;
  freeQuota: number;
  consumedQuota: number;
}

export interface IGetCreateObjectApproval {
  bucketName: string;
  objectName: string;
  creator: string;
  visibility?: keyof typeof VisibilityType;
  fileType: string;
  redundancyType?: keyof typeof RedundancyType;
  expectSecondarySpAddresses: string[];
  // endpoint?: string;
  spInfo: ISpInfo;
  duration?: number;
  contentLength: number;
  expectCheckSums: string[];
  // hashResult?: any;
}

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

export interface IPutObjectPropsType {
  bucketName: string;
  objectName: string;
  txnHash: string;
  body: Blob;
  endpoint?: string;
  duration?: number;
}

export interface IGetObjectPropsType {
  bucketName: string;
  objectName: string;
  endpoint?: string;
  duration?: number;
}

export interface IListObjectsByBucketNamePropsType {
  bucketName: string;
  duration?: number;
  endpoint: string;
  protocol?: string;
}

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
