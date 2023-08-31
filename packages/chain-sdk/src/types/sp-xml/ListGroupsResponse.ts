import { GroupInfo } from './Common';

export interface ListGroupsResponse {
  GfSpGetGroupListResponse: GfSpGetGroupListResponse;
}

export interface Group {
  Group: GroupInfo;
  Operator: string;
  CreateAt: number;
  CreateTime: number;
  UpdateAt: number;
  UpdateTime: number;
  Removed: boolean;
}

export interface GfSpGetGroupListResponse {
  Groups: Group[];
  Count: number;
}
