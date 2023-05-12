export const TYPE_URL = '/bnbchain.greenfield.bridge.MsgTransferOut';

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

export const newMsgTransferOut = (
  amount: string,
  denom: string,
  fromAddress: string,
  toAddress: string,
) => {
  return {
    type: TYPE_URL,
    amount: {
      amount,
      denom,
    },
    from: fromAddress,
    to: toAddress,
  };
};
