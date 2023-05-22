export const MsgCreateBucketTypeUrl = '/greenfield.storage.MsgCreateBucket';

export const MsgCreateBucketSDKTypeEIP712 = {
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
      type: 'TypePrimarySpApproval',
    },
    {
      name: 'charged_read_quota',
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
  visibility: string;
  paymentAddress: string;
  primarySpAddress: string;
  chargedReadQuota: number;
  sig: string;
}

export const newMsgCreateBucket = ({
  bucketName,
  expiredHeight,
  from,
  visibility,
  paymentAddress,
  primarySpAddress,
  chargedReadQuota,
  sig,
}: ICreateBucketMsg) => {
  return {
    type: MsgCreateBucketTypeUrl,
    bucket_name: bucketName,
    creator: from,
    visibility,
    payment_address: paymentAddress,
    primary_sp_address: primarySpAddress,
    primary_sp_approval: {
      expired_height: expiredHeight,
      sig,
    },
    charged_read_quota: chargedReadQuota,
  };
};
