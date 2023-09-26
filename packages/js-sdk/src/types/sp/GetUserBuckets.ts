import { BucketMetaWithVGF } from './Common';

export type GetUserBucketsRequest = {
  address: string;
  duration?: number;
  endpoint: string;
};

export interface GetUserBucketsResponse {
  GfSpGetUserBucketsResponse: GfSPGetUserBucketsResponse;
}

export interface GfSPGetUserBucketsResponse {
  Buckets: BucketMetaWithVGF[];
}
