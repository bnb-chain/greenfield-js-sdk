export interface GetUserBucketsResponse {
  GfSpGetUserBucketsResponse: GfSPGetUserBucketsResponse;
}

export interface GfSPGetUserBucketsResponse {
  Buckets: Bucket[];
}

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
