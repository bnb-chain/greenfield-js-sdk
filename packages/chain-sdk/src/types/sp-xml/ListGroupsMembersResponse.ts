import { GroupInfo } from './Common';

export interface ListGroupsMembersResponse {
  GfSpGetGroupMembersResponse: GfSpGetGroupMembersResponse;
}

export interface GfSpGetGroupMembersResponse {
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
