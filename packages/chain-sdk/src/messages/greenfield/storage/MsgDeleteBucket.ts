export const MsgDeleteBucketTypeUrl = '/greenfield.storage.MsgDeleteBucket';

export const MsgDeleteBucketSDKTypeEIP712 = {
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
  ],
};
