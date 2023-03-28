export const TYPE_URL = '/bnbchain.greenfield.storage.MsgCreateBucket';

export const TYPES = {
  Msg: [
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
      name: 'is_public',
      type: 'bool',
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
      type: 'TypePrimarySpApproval',
    },
    {
      name: 'read_quota',
      type: 'uint64',
    },
  ],
  TypePrimarySpApproval: [
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

export interface ICreateBucketMsg {
  bucketName: string;
  expiredHeight: string;
  from: string;
  isPublic: boolean;
  paymentAddress: string;
  primarySpAddress: string;
  readQuota: number;
  sig: string;
}

export const newMsgCreateBucket = ({
  bucketName,
  expiredHeight,
  from,
  isPublic,
  paymentAddress,
  primarySpAddress,
  readQuota,
  sig,
}: ICreateBucketMsg) => {
  return {
    type: TYPE_URL,
    bucket_name: bucketName,
    creator: from,
    is_public: isPublic,
    payment_address: paymentAddress,
    primary_sp_address: primarySpAddress,
    primary_sp_approval: {
      expired_height: expiredHeight,
      sig,
    },
    read_quota: readQuota,
  };
};
