export const MsgSendTypeUrl = '/cosmos.bank.v1beta1.MsgSend';
export const MsgSendSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'from_address',
      type: 'string',
    },
    {
      name: 'to_address',
      type: 'string',
    },
    {
      name: 'amount',
      type: 'TypeMsg1Amount[]',
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
