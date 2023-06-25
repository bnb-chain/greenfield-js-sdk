export const MsgCreateBucketTypeUrl = '/greenfield.storage.MsgCreateBucket';

export const MsgCreateBucketSDKTypeEIP712 = {
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
      name: 'visibility',
      type: 'string',
    },
    {
      name: 'payment_address',
      type: 'string',
    },
    {
      name: 'primary_sp_address',
      type: 'string',
    },
    {
      name: 'primary_sp_approval',
      type: 'TypeMsg1PrimarySpApproval',
    },
    {
      name: 'charged_read_quota',
      type: 'uint64',
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
