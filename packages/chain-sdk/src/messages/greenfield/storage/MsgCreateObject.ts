export const MsgCreateObjectTypeUrl = '/greenfield.storage.MsgCreateObject';

export const MsgCreateObjectSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'creator',
      type: 'string',
    },
    {
      name: 'bucket_name',
      type: 'string',
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
      name: 'visibility',
      type: 'string',
    },
    {
      name: 'content_type',
      type: 'string',
    },
    {
      name: 'primary_sp_approval',
      type: 'TypeMsg1PrimarySpApproval',
    },
    {
      name: 'expect_checksums',
      type: 'bytes[]',
    },
    {
      name: 'redundancy_type',
      type: 'string',
    },
    {
      name: 'expect_secondary_sp_addresses',
      type: 'string[]',
    },
  ],
  TypeMsg1PrimarySpApproval: [
    {
      name: 'expired_height',
      type: 'uint64',
    },
    {
      name: 'sig',
      type: 'bytes',
    },
  ],
};
