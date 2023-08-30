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
  // PrimarySpId: number;
  BucketName: string;
  BucketStatus: number;
  ChargedReadQuota: number;
  CreateAt: number;
  GlobalVirtualGroupFamilyId: number;
  Id: string;
  Owner: string;
  PaymentAddress: string;
  SourceType: number;
  Visibility: number;
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
  BucketName: string;
  Checksums: string[];
  ContentType: string;
  CreateAt: number;
  Creator: string;
  Id: number;
  LocalVirtualGroupId: number;
  ObjectName: string;
  ObjectStatus: number;
  Owner: string;
  PayloadSize: number;
  RedundancyType: number;
  SourceType: number;
  Visibility: number;
}

export function formatBucketInfo(o: BucketInfo) {
  return {
    ...o,
    // PrimarySpId: Number(item.BucketInfo.PrimarySpId),
    BucketStatus: Number(o.BucketStatus),
    ChargedReadQuota: Number(o.ChargedReadQuota),
    CreateAt: Number(o.CreateAt),
    GlobalVirtualGroupFamilyId: Number(o.GlobalVirtualGroupFamilyId),
    SourceType: Number(o.SourceType),
    Visibility: Number(o.Visibility),
  };
}

export function formatObjectInfo(o: ObjectInfo) {
  return {
    ...o,
    CreateAt: Number(o.CreateAt),
    Id: Number(o.Id),
    LocalVirtualGroupId: Number(o.LocalVirtualGroupId),
    ObjectStatus: Number(o.ObjectStatus),
    PayloadSize: Number(o.PayloadSize),
    RedundancyType: Number(o.RedundancyType),
    SourceType: Number(o.SourceType),
    Visibility: Number(o.Visibility),
  };
}

export function convertStrToBool(str: string) {
  return String(str).toLowerCase() === 'true';
}
