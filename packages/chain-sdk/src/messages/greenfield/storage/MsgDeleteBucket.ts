export const MsgDeleteBucketTypeUrl = '/greenfield.storage.MsgDeleteBucket';

export const MsgDeleteBucketSDKTypeEIP712 = {
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
      name: 'bucket_name',
      type: 'string',
    },
  ],
};

export interface IDeleteBucketMsg {
  bucketName: string;
  from: string;
}

export const newMsgDeleteBucket = ({ bucketName, from }: IDeleteBucketMsg) => {
  return {
    type: MsgDeleteBucketTypeUrl,
    bucket_name: bucketName,
    operator: from,
  };
};
