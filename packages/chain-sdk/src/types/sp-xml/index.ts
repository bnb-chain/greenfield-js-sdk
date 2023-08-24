export * from './GetUserBucketsResponse';
export * from './ListObjectsByBucketNameResponse';
export * from './ReadQuotaResponse';

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
