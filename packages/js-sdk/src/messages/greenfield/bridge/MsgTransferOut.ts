export const MsgTransferOutSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'from',
      type: 'string',
    },
    {
      name: 'to',
      type: 'string',
    },
    {
      name: 'amount',
      type: 'TypeMsg1Amount',
    },
  ],
  TypeMsg1Amount: [
    {
      name: 'denom',
      type: 'string',
    },
    {
      name: 'amount',
      type: 'string',
    },
  ],
};
