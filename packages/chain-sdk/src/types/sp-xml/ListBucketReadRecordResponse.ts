import { ReadRecord } from './Common';

export interface ListBucketReadRecordResponse {
  GetBucketReadQuotaResult: GetBucketReadQuotaResult;
}

export interface GetBucketReadQuotaResult {
  NextStartTimestampUs: string;
  ReadRecords: ReadRecord[];
}
