import { ReadRecord } from './Common';

export interface ListBucketReadRecordResponse {
  ListBucketReadRecordResult: ListBucketReadRecordResult;
}

export interface ListBucketReadRecordResult {
  NextStartTimestampUs: string;
  ReadRecords: ReadRecord[];
}
