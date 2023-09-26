import { ActionType } from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';

export type VerifyPermissionRequest = {
  operator: string;
  bucketName: string;
  objectName?: string;
  action: keyof typeof ActionType;
};

export interface VerifyPermissionResponse {
  QueryVerifyPermissionResponse: QueryVerifyPermissionResponse;
}

export interface QueryVerifyPermissionResponse {
  Effect: number;
}
