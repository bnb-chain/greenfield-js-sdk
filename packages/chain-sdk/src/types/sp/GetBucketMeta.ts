import { BucketMeta, StreamRecord } from './Common';

export interface GetBucketMetaRequest {
  bucketName: string;
  endpoint?: string;
}

export interface GetBucketMetaResponse {
  GfSpGetBucketMetaResponse: GfSPGetBucketMetaResponse;
}

export interface GfSPGetBucketMetaResponse {
  Bucket: BucketMeta;
  StreamRecord: StreamRecord;
}
