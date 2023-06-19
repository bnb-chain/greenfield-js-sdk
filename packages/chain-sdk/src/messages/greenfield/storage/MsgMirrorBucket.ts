export const MsgMirrorBucketTypeUrl = '/greenfield.storage.MsgMirrorBucket';

export const MsgMirrorBucketSDKTypeEIP712 = {
  Msg: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'operator',
      type: 'string',
    },
    {
      name: 'id',
      type: 'string',
    },
    {
      name: 'bucket_name',
      type: 'string',
    },
  ],
};
