import {
  RedundancyType,
  VisibilityType,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';

export type CreateObjectApprovalRequest = {
  bucketName: string;
  objectName: string;
  creator: string;
  visibility?: keyof typeof VisibilityType;
  fileType: string;
  redundancyType?: keyof typeof RedundancyType;
  duration?: number;
  contentLength: number;
  expectCheckSums: string[];
  endpoint?: string;
};

export type CreateObjectApprovalResponse = {
  creator: string;
  bucket_name: string;
  object_name: string;
  payload_size: string;
  visibility: keyof typeof VisibilityType;
  content_type: string;
  primary_sp_approval: {
    expired_height: string;
    sig: string | null;
    global_virtual_group_family_id: number;
  };
  expect_checksums: string[];
  // expect_secondary_sp_addresses: string[];
  redundancy_type: keyof typeof RedundancyType;
  // charged_read_quota: string;
};
