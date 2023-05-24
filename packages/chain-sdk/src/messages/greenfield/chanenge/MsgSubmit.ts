export const MsgSubmitSDKTypeEIP712 = {
  Msg: [
    {
      type: 'string',
      name: 'type',
    },
    {
      type: 'string',
      name: 'challenger',
    },
    {
      type: 'string',
      name: 'sp_operator_address',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string',
      name: 'object_name',
    },
    {
      type: 'uint64',
      name: 'segment_index',
    },
    {
      type: 'bool',
      name: 'random_index',
    },
  ],
};
