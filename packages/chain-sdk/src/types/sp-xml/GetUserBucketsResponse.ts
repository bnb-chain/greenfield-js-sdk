import { BucketMeta } from './Common';

export interface GetUserBucketsResponse {
  GfSpGetUserBucketsResponse: GfSPGetUserBucketsResponse;
}

export interface GfSPGetUserBucketsResponse {
  Buckets: BucketMeta[];
}
