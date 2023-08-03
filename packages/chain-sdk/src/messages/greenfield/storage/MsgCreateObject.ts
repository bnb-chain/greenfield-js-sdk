export const MsgCreateObjectSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'bucket_name',
      type: 'string',
    },
    {
      name: 'content_type',
      type: 'string',
    },
    {
      name: 'creator',
      type: 'string',
    },
    {
      name: 'expect_checksums',
      type: 'bytes[]',
    },
    {
      name: 'object_name',
      type: 'string',
    },
    {
      name: 'payload_size',
      type: 'uint64',
    },
    {
      name: 'primary_sp_approval',
      type: 'TypeMsg1PrimarySpApproval',
    },
    {
      name: 'redundancy_type',
      type: 'string',
    },
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'visibility',
      type: 'string',
    },
  ],
  TypeMsg1PrimarySpApproval: [
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
