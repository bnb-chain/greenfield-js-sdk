import { GroupInfo } from './Common';

export type ListUserGroupsResquest = {
  address: string;
  limit?: number;
  startAfter?: string;
};

export interface ListUserGroupsResponse {
  GfSpGetUserGroupsResponse: GfSpGetUserGroupsResponse;
}

export interface GfSpGetUserGroupsResponse {
  Groups: Group[];
}

interface Group {
  Group: GroupInfo;
  AccountId: string;
  Operator: string;
  CreateAt: number;
  CreateTime: number;
  UpdateAt: number;
  UpdateTime: number;
  Removed: boolean;
  ExpirationTime: string;
}
