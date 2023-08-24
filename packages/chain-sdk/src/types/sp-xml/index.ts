export * from './RequestErrorResponse';
export * from './GetBucketMetaResponse';
export * from './GetObjectMetaResponse';
export * from './GetUserBucketsResponse';
export * from './ListObjectsByBucketNameResponse';
export * from './ReadQuotaResponse';

export interface RequestNonceResponse {
  RequestNonceResp: {
    CurrentNonce: number;
    CurrentPublicKey: string;
    ExpiryDate: string;
    NextNonce: number;
  };
}
