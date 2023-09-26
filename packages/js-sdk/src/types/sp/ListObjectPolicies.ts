import { ActionType } from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';
import { PolicyMeta } from './Common';

export type GetListObjectPoliciesRequest = {
  endpoint?: string;
  bucketName: string;
  objectName: string;
  actionType: keyof typeof ActionType;
  limit?: number;
  startAfter?: string;
};

export type GetListObjectPoliciesResponse = {
  GfSpListObjectPoliciesResponse: GfSpListObjectPoliciesResponse;
};

export interface GfSpListObjectPoliciesResponse {
  Policies: PolicyMeta[];
}
