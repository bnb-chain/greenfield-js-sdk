export interface Bucket {
  BucketInfo: BucketInfo;
  Removed: string;
  DeleteAt: string;
  DeleteReason: string;
  Operator: string;
  CreateTxHash: string;
  UpdateTxHash: string;
  UpdateAt: string;
  UpdateTime: string;
}

export interface BucketInfo {
  Owner: string;
  BucketName: string;
  Visibility: string;
  Id: string;
  SourceType: string;
  CreateAt: string;
  PaymentAddress: string;
  GlobalVirtualGroupFamilyId: string;
  ChargedReadQuota: string;
  BucketStatus: string;
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

export interface TObject {
  ObjectInfo: ObjectInfo;
  LockedBalance: string;
  Removed: string;
  UpdateAt: string;
  DeleteAt: string;
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
  Id: string;
  LocalVirtualGroupId: string;
  PayloadSize: string;
  Visibility: string;
  ContentType: string;
  CreateAt: string;
  ObjectStatus: string;
  RedundancyType: string;
  SourceType: string;
  Checksums: string[];
}
