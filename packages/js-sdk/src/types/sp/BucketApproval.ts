import { VisibilityType } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';

export type CreateBucketApprovalRequest = {
  bucketName: string;
  creator: string;
  visibility: keyof typeof VisibilityType;
  chargedReadQuota: string;
  spInfo: {
    primarySpAddress: string;
  };
  duration?: number;
  paymentAddress: string;
};

export interface CreateBucketApprovalResponse {
  creator: string;
  bucket_name: string;
  visibility: keyof typeof VisibilityType;
  payment_address: string;
  primary_sp_address: string;
  primary_sp_approval: {
    expired_height: string;
    sig: string;
    global_virtual_group_family_id: number;
  };
  charged_read_quota: string;
}
