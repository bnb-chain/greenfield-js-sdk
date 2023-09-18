import { ObjectMeta } from './Common';

export type ListObjectsByBucketNameRequest = {
  bucketName: string;
  duration?: number;
  endpoint: string;
  protocol?: string;
  query?: URLSearchParams;
};

export interface ListObjectsByBucketNameResponse {
  GfSpListObjectsByBucketNameResponse: GfSPListObjectsByBucketNameResponse;
}

export interface GfSPListObjectsByBucketNameResponse {
  Objects: ObjectMeta[];
  KeyCount: string;
  MaxKeys: string;
  IsTruncated: boolean;
  NextContinuationToken: string;
  Name: string;
  Prefix: string;
  Delimiter: string;
  CommonPrefixes: string[];
  ContinuationToken: string;
}
