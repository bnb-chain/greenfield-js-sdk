import { TObject } from './Common';

export interface ListObjectsByBucketNameResponse {
  GfSpListObjectsByBucketNameResponse: GfSPListObjectsByBucketNameResponse;
}

export interface GfSPListObjectsByBucketNameResponse {
  Objects: TObject[];
  KeyCount: string;
  MaxKeys: string;
  IsTruncated: string;
  NextContinuationToken: string;
  Name: string;
  Prefix: string;
  Delimiter: string;
  CommonPrefixes: string[];
  ContinuationToken: string;
}
