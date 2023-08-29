export const MsgMigrateBucketSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'bucket_name',
      type: 'string',
    },
    {
      name: 'dst_primary_sp_approval',
      type: 'TypeMsg1DstPrimarySpApproval',
    },
    {
      name: 'dst_primary_sp_id',
      type: 'uint32',
    },
    {
      name: 'operator',
      type: 'string',
    },
    {
      name: 'type',
      type: 'string',
    },
  ],
  TypeMsg1DstPrimarySpApproval: [
    {
      name: 'expired_height',
      type: 'uint64',
    },
    {
      name: 'global_virtual_group_family_id',
      type: 'uint32',
    },
    {
      name: 'sig',
      type: 'bytes',
    },
  ],
};
