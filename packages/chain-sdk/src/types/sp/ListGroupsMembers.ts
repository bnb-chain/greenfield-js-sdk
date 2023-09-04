import { GroupInfo } from './Common';

export type ListGroupsMembersRequest = {
  groupId: number;
  limit?: number;
  startAfter?: string;
};

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
