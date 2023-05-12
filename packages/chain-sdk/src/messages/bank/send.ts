export const TYPE_URL = '/cosmos.bank.v1beta1.MsgSend';
export const MsgSendSDKTypeEIP712 = {
  Msg: [
    { name: 'type', type: 'string' },
    { name: 'from_address', type: 'string' },
    { name: 'to_address', type: 'string' },
    { name: 'amount', type: 'TypeAmount[]' },
  ],
};
export const newMsgSend = (
  amount: string,
  denom: string,
  fromAddress: string,
  toAddress: string,
) => {
  return {
    type: TYPE_URL,
    amount: [
      {
        amount,
        denom,
      },
    ],
    from_address: fromAddress,
    to_address: toAddress,
  };
};
