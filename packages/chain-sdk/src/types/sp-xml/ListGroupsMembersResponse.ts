export interface ListGroupsMembersResponse {
  GfSpGetGroupMembersResponse: GfSpGetGroupMembersResponse;
}

export interface GfSpGetGroupMembersResponse {
  Groups: Group[];
}

interface Group {
  AccountId: string;
  Operator: string;
  CreateAt: number;
  CreateTime: number;
  UpdateAt: number;
  UpdateTime: number;
  Removed: boolean;
  ExpirationTime: string;
}
