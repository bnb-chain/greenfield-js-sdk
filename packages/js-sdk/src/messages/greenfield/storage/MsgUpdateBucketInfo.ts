export const MsgUpdateBucketInfoSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'operator',
      type: 'string',
    },
    {
      name: 'bucket_name',
      type: 'string',
    },
    {
      name: 'charged_read_quota',
      type: 'TypeMsg1ChargedReadQuota',
    },
    {
      name: 'payment_address',
      type: 'string',
    },
    {
      name: 'visibility',
      type: 'string',
    },
  ],
  TypeMsg1ChargedReadQuota: [
    {
      name: 'value',
      type: 'uint64',
    },
  ],
};
