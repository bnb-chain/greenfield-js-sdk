import { SourceType } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import { GroupInfo } from './Common';

export type ListGroupsResquest = {
  name: string;
  prefix: string;
  sourceType?: keyof typeof SourceType;
  limit?: number;
  offset?: number;
};

export interface ListGroupsResponse {
  GfSpGetGroupListResponse: GfSpGetGroupListResponse;
}

interface Group {
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
