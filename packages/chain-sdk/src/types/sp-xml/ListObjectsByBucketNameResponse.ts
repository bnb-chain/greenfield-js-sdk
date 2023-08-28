import { ObjectInfo, ObjectMeta } from './Common';

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

export function formatObjectInfo(o: ObjectInfo) {
  return {
    ...o,
    Id: Number(o.Id),
    LocalVirtualGroupId: Number(o.LocalVirtualGroupId),
    PayloadSize: Number(o.PayloadSize),
    CreateAt: Number(o.CreateAt),
  };
}
