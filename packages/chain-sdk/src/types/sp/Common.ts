export type BucketMeta = {
  BucketInfo: BucketInfo;
  CreateTxHash: string;
  DeleteAt: number;
  DeleteReason: string;
  Operator: string;
  Removed: boolean;
  UpdateAt: number;
  UpdateTime: number;
  UpdateTxHash: string;
};

export type GlobalVirtualGroupFamily = {
  Id: number;
  PrimarySpId: number;
  GlobalVirtualGroupIds: number[];
  VirtualPaymentAddress: string;
};

export interface BucketMetaWithVGF extends BucketMeta {
  Vgf: GlobalVirtualGroupFamily;
}

export function formatVGF(vgf: GlobalVirtualGroupFamily): GlobalVirtualGroupFamily {
  return {
    ...vgf,
    Id: Number(vgf.Id),
    PrimarySpId: Number(vgf.PrimarySpId),
    // GlobalVirtualGroupIds: vgf.GlobalVirtualGroupIds.map((id) => Number(id)),
  };
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

export interface ReadRecord {
  ObjectName: string;
  ObjectID: string;
  ReadAccountAddress: string;
  ReadTimestampUs: number;
  ReadSize: number;
}

export function formatReadRecord(o: ReadRecord) {
  return {
    ...o,
    ReadTimestampUs: Number(o.ReadTimestampUs),
    ReadSize: Number(o.ReadSize),
  };
}

export interface GroupInfo {
  Owner: string;
  GroupName: string;
  SourceType: number;
  Id: number;
  Extra: string;
}

export function formatGroupInfo(o: GroupInfo) {
  return {
    ...o,
    SourceType: Number(o.SourceType),
    Id: Number(o.Id),
  };
}

export interface PolicyMeta {
  /**
   * principal_type defines the type of principal
   */
  PrincipalType: number;
  /**
   * principal_value defines the value of principal
   */
  PrincipalValue: string;
  /**
   * resource_type defines the type of resource that grants permission for
   */
  ResourceType: number;
  /**
   * resource_id defines the bucket/object/group id of the resource that grants permission for
   */
  ResourceId: string;
  /**
   * create_timestamp defines the create time of permission
   */
  CreateTimestamp: number;
  /**
   * update_timestamp defines the update time of permission
   */
  UpdateTimestamp: number;
  /**
   * expiration_time defines the expiration time of permission
   */
  ExpirationTime: number;
}
