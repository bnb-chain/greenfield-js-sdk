export * from './GetUserBucketsResponse';
export * from './ListObjectsByBucketNameResponse';
export * from './ReadQuotaResponse';
export * from './GetBucketMetaResponse';

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
