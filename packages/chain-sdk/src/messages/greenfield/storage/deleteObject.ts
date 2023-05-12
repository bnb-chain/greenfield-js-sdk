export const TYPE_URL = '/bnbchain.greenfield.storage.MsgDeleteObject';

export const MsgDeleteObjectSDKTypeEIP712 = {
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

export interface IDeleteObjectMsg {
  bucketName: string;
  objectName: string;
  from: string;
}

export const newMsgDeleteObject = ({ bucketName, objectName, from }: IDeleteObjectMsg) => {
  return {
    type: TYPE_URL,
    bucket_name: bucketName,
    object_name: objectName,
    operator: from,
  };
};
