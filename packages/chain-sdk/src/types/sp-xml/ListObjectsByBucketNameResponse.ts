import { ObjectMeta } from './Common';

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
