export const MsgCancelCreateObjectTypeUrl = '/greenfield.storage.MsgCancelCreateObject';

export const MsgCancelCreateObjectSDKTypeEIP712 = {
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
    {
      name: 'object_name',
      type: 'string',
    },
  ],
};

export interface ICancelCreateObjectMsg {
  from: string;
  bucketName: string;
  objectName: string;
}

export const newMsgCancelCreateObject = ({
  from,
  bucketName,
  objectName,
}: ICancelCreateObjectMsg) => {
  return {
    type: MsgCancelCreateObjectTypeUrl,
    operator: from,
    bucket_name: bucketName,
    object_name: objectName,
  };
};
