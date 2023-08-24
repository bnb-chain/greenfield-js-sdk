import { Bucket, StreamRecord } from './Common';

export interface GetBucketMetaResponse {
  GfSpGetBucketMetaResponse: GfSPGetBucketMetaResponse;
}

export interface GfSPGetBucketMetaResponse {
  Bucket: Bucket;
  StreamRecord: StreamRecord;
}
