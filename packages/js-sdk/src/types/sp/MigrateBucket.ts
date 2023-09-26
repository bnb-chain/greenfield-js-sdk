import { MsgMigrateBucket } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';

export type MigrateBucketApprovalRequest = Omit<MsgMigrateBucket, 'dstPrimarySpApproval'> & {
  endpoint?: string;
};

export type MigrateBucketApprovalResponse = {
  operator: string;
  bucket_name: string;
  dst_primary_sp_id: number;
  dst_primary_sp_approval: {
    expired_height: string;
    sig: string;
    global_virtual_group_family_id: number;
  };
};
