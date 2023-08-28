import {
  BucketStatus,
  ObjectStatus,
  RedundancyType,
  SourceType,
  VisibilityType,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';

export interface BucketMeta {
  BucketInfo: BucketInfo;
  Removed: boolean;
  DeleteAt: number;
  DeleteReason: string;
  Operator: string;
  CreateTxHash: string;
  UpdateTxHash: string;
  UpdateAt: number;
  UpdateTime: number;
}

export interface BucketInfo {
  Owner: string;
  BucketName: string;
  Visibility: keyof typeof VisibilityType;
  Id: string;
  SourceType: keyof typeof SourceType;
  CreateAt: number;
  PaymentAddress: string;
  PrimarySpId: number;
  GlobalVirtualGroupFamilyId: number;
  ChargedReadQuota: number;
  BucketStatus: keyof typeof BucketStatus;
}

export interface StreamRecord {
  Account: string;
  CrudTimestamp: string;
  NetflowRate: string;
  StaticBalance: string;
  BufferBalance: string;
  LockBalance: string;
  Status: string;
  SettleTimestamp: string;
  OutFlowCount: string;
  FrozenNetflowRate: string;
}

export interface ObjectMeta {
  ObjectInfo: ObjectInfo;
  LockedBalance: string;
  Removed: boolean;
  UpdateAt: number;
  DeleteAt: number;
  DeleteReason: string;
  Operator: string;
  CreateTxHash: string;
  UpdateTxHash: string;
  SealTxHash: string;
}

export interface ObjectInfo {
  Owner: string;
  Creator: string;
  BucketName: string;
  ObjectName: string;
  Id: number;
  LocalVirtualGroupId: number;
  PayloadSize: number;
  Visibility: keyof typeof VisibilityType;
  ContentType: string;
  CreateAt: number;
  ObjectStatus: keyof typeof ObjectStatus;
  RedundancyType: keyof typeof RedundancyType;
  SourceType: keyof typeof SourceType;
  Checksums: string[];
}
