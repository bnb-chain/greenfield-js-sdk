export const MsgSendTypeUrl = '/cosmos.bank.v1beta1.MsgSend';
export const MsgSendSDKTypeEIP712 = {
  Tx: [
    {
      name: 'account_number',
      type: 'uint256',
    },
    {
      name: 'chain_id',
      type: 'uint256',
    },
    {
      name: 'fee',
      type: 'Fee',
    },
    {
      name: 'memo',
      type: 'string',
    },
    {
      name: 'sequence',
      type: 'uint256',
    },
    {
      name: 'timeout_height',
      type: 'uint256',
    },
    {
      name: 'msg1',
      type: 'Msg1',
    },
  ],
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
