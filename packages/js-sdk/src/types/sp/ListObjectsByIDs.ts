import { ObjectInfo } from './Common';

export type ListObjectsByIDsRequest = {
  ids: string[];
};

export interface ListObjectsByIDsResponse {
  GfSpListObjectsByIDsResponse: GfSpListObjectsByIDsResponse;
}

export interface GfSpListObjectsByIDsResponse {
  ObjectEntry: ObjectEntry[];
}

export interface ObjectEntry {
  Id: number;
  Value: {
    ObjectInfo: ObjectInfo;
    LockedBalance: string;
    Removed: boolean;
    UpdateAt: number;
    DeleteAt: number;
    DeleteReason: string;
    Operator: string;
    CreateTxHash: string;
    UpdateTxHash: string;
    SealTxHash: string;
  };
}
