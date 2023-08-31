import { GroupInfo } from './Common';

export interface ListUserOwnedGroupsResponse {
  GfSpGetUserOwnedGroupsResponse: GfSpGetUserOwnedGroupsResponse;
}

export interface GfSpGetUserOwnedGroupsResponse {
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
