import { BucketInfo } from './Common';

export type ListBucketsByIDsRequest = {
  ids: string[];
};

export interface ListBucketsByIDsResponse {
  GfSpListBucketsByIDsResponse: GfSpListBucketsByIDsResponse;
}

export interface GfSpListBucketsByIDsResponse {
  BucketEntry: BucketEntry[];
}

export interface BucketEntry {
  Id: number;
  Value: {
    BucketInfo: BucketInfo;
    Removed: boolean;
    DeleteAt: number;
    DeleteReason: string;
    Operator: string;
    CreateTxHash: string;
    UpdateTxHash: string;
    UpdateAt: number;
    UpdateTime: number;
  };
}
