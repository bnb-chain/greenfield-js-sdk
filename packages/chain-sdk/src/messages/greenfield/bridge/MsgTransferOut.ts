export const MsgTransferOutTypeUrl = '/greenfield.bridge.MsgTransferOut';

export const MsgTransferOutSDKTypeEIP712 = {
  Msg: [
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
      type: 'TypeAmount',
    },
  ],
};
