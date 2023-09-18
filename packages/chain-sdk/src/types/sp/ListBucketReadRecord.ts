import { ReadRecord } from './Common';

export type ListBucketReadRecordRequest = {
  bucketName: string;
  endpoint?: string;
  maxRecords: number;
  startTimeStamp: number;
  endTimeStamp: number;
};

export interface ListBucketReadRecordResponse {
  GetBucketReadQuotaResult: GetBucketReadQuotaResult;
}

export interface GetBucketReadQuotaResult {
  NextStartTimestampUs: string;
  ReadRecords: ReadRecord[];
}
