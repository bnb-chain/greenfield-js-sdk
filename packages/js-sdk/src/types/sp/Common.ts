import { VisibilityType } from '../common';

export type BucketMeta = {
  /**
   * defines the information of the bucket.
   */
  BucketInfo: BucketInfo;

  /**
   * defines the creation transaction hash of bucket
   */
  CreateTxHash: string;

  /**
   * defines the block number when the bucket deleted.
   */
  DeleteAt: number;

  /**
   * defines the deleted reason of bucket
   */
  DeleteReason: string;

  /**
   * defines the operator address of bucket
   */
  Operator: string;

  /**
   * defines the bucket is deleted or not
   */
  Removed: boolean;

  /**
   * defines the block number when the bucket updated
   */
  UpdateAt: number;

  /**
   * defines the block number when the bucket updated
   */
  UpdateTime: number;

  /**
   * defines the update transaction hash of bucket
   */
  UpdateTxHash: string;

  /**
   * OffChainStatus represents the status of a bucket in the off-chain storage.
	  It is used to track the current state of the bucket with respect to off-chain operations,
	  1 means 0001 -> OffChainStatusIsLimited is true
	  0 means 0000 -> OffChainStatusIsLimited is false

    For an explanation of the different OffChainStatus values, please visit:https://github.com/bnb-chain/greenfield-storage-provider/blob/9d7048ad33cf51a2f7eb347e2113c5d0cc45f970/modular/blocksyncer/modules/bucket/bucket_handle.go#L40
   */
  OffChainStatus: string;
};

export type GlobalVirtualGroupFamily = {
  Id: number;
  PrimarySpId: number;
  GlobalVirtualGroupIds: number[];
  VirtualPaymentAddress: string;
};

export interface BucketMetaWithVGF extends BucketMeta {
  /**
   * serve as a means of grouping global virtual groups.
   */
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
  /**
   * globally unique name of bucket
   */
  BucketName: string;

  /**
   * define the status of the bucket.
   */
  BucketStatus: number;

  /**
   * charged_read_quota defines the traffic quota for read in bytes per month.
	  The available read data for each user is the sum of the free read data provided by SP and
	  the ChargeReadQuota specified here.
   */
  ChargedReadQuota: number;

  /**
   * define the block timestamp when the bucket created.
   */
  CreateAt: number;

  /**
   * defines the unique id of gvg family
   */
  GlobalVirtualGroupFamilyId: number;

  /**
   * the unique identification for bucket.
   */
  Id: string;

  /**
   * the account address of bucket creator, it is also the bucket owner.
   */
  Owner: string;

  /**
   * the address of the payment account
   */
  PaymentAddress: string;

  /**
   * defines which chain the user should send the bucket management transactions to
   */
  SourceType: number;

  /**
   * defines the highest permissions for bucket. When a bucket is public, everyone can get storage objects in it.
   */
  Visibility: number;

  /**
   * defines a list of tags the bucket has
   */
  Tags: {
    Tags: {
      Key: string;
      Value: string;
    }[];
  };

  /**
   * indicates that whether bucket owner disable SP as the upload agent.
	when a bucket is created, by default, this is false, means SP is allowed to create object for delegator
   */
  SpAsDelegatedAgentDisabled: string;
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
  Tags: {
    Tags: {
      Key: string;
      Value: string;
    }[];
  };
}

export function formatBucketInfo(o: BucketInfo): BucketInfo {
  let tags = o.Tags.Tags || [];
  if (!Array.isArray(tags)) {
    tags = [tags];
  }

  return {
    ...o,
    // PrimarySpId: Number(item.BucketInfo.PrimarySpId),
    BucketStatus: Number(o.BucketStatus),
    ChargedReadQuota: Number(o.ChargedReadQuota),
    CreateAt: Number(o.CreateAt),
    GlobalVirtualGroupFamilyId: Number(o.GlobalVirtualGroupFamilyId),
    SourceType: Number(o.SourceType),
    Visibility: Number(o.Visibility),
    // @ts-ignore
    SpAsDelegatedAgentDisabled: convertStrToBool(o.SpAsDelegatedAgentDisabled),
    Tags: {
      Tags: tags,
    },
  };
}

export function formatObjectInfo(o: ObjectInfo): ObjectInfo {
  let tags = o.Tags.Tags || [];
  if (!Array.isArray(tags)) {
    tags = [tags];
  }

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
    Tags: {
      Tags: tags,
    },
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
  Tags: {
    Tags: {
      Key: string;
      Value: string;
    }[];
  };
}

export function formatGroupInfo(o: GroupInfo): GroupInfo {
  let tags = o.Tags.Tags || [];
  if (!Array.isArray(tags)) {
    tags = [tags];
  }

  return {
    ...o,
    SourceType: Number(o.SourceType),
    Id: Number(o.Id),
    Tags: {
      Tags: tags,
    },
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

export type DelegatedOpts = {
  visibility: VisibilityType;
  isUpdate?: boolean;
};

export type ResumableOpts = {
  disableResumable: boolean;
  partSize?: number;
};

export type NodeFile = {
  name: string;
  type: string;
  size: number;
  content: Buffer;
};
export type UploadFile = File | NodeFile;
