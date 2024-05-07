export const MsgCancelMigrateBucketSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'bucket_name',
      type: 'string',
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
} as const;
