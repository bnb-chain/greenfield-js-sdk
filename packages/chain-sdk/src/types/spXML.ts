export interface RequestErrorResponse {
  Error: {
    Code: string;
    Message: string;
  };
}

export interface RequestNonceResponse {
  RequestNonceResp: {
    CurrentNonce: number;
    CurrentPublicKey: string;
    ExpiryDate: string;
    NextNonce: number;
  };
}

export interface ReadQuotaResponse {
  GetReadQuotaResult: {
    BucketID: number;
    BucketName: string;
    ReadConsumedSize: number;
    ReadQuotaSize: number;
    SPFreeReadQuotaSize: number;
  };
}

export interface GetUserBucketsResponse {
  GfSpGetUserBucketsResponse: {
    Buckets: {
      BucketInfo: {
        BucketName: string;
        BucketStatus: number;
        ChargedReadQuota: number;
        CreateAt: number;
        GlobalVirtualGroupFamilyId: number;
        Id: number;
        Owner: string;
        PaymentAddress: string;
        SourceType: number;
        Visibility: number;
      };
      CreateTxHash: string;
      DeleteAt: number;
      DeleteReason: string;
      Operator: string;
      Removed: boolean;
      UpdateAt: number;
      UpdateTime: number;
      UpdateTxHash: string;
    }[];
  };
}

interface ObjectInfo {
  Owner: number;
  Creator: number;
  BucketName: string;
  ObjectName: string;
  Id: number;
  LocalVirtualGroupId: number;
  PayloadSize: number;
  Visibility: number;
  ContentType: string;
  CreateAt: number;
  ObjectStatus: number;
  RedundancyType: number;
  SourceType: number;
  Checksums: string[];
}

export interface GetSpListObjectsByBucketNameResponse {
  GfSpListObjectsByBucketNameResponse: {
    Objects: {
      ObjectInfo: ObjectInfo;
      LockedBalance: number;
      Removed: boolean;
      UpdateAt: number;
      DeleteAt: number;
      DeleteReason: string;
      Operator: number;
      CreateTxHash: number;
      UpdateTxHash: number;
      SealTxHash: number;
    }[];
    KeyCount: number;
    MaxKeys: number;
    IsTruncated: boolean;
    NextContinuationToken: string;
    Name: string;
    Prefix: string;
    Delimiter: string;
    ContinuationToken: string;
  };
}
