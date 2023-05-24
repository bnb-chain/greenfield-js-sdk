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
      name: 'redundancy_type',
      type: 'string',
    },
  ],
  TypeMsg1PrimarySpApproval: [
    {
      name: 'expired_height',
      type: 'uint64',
    },
  ],
};
