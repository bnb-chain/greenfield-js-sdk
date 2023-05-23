export const MsgMultiSendTypeUrl = '/cosmos.bank.v1beta1.MsgMultiSend';
export const MsgMultiSendSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'inputs',
      type: 'TypeMsg1Inputs[]',
    },
    {
      name: 'outputs',
      type: 'TypeMsg1Outputs[]',
    },
  ],
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
  TypeMsg1Inputs: [
    {
      name: 'address',
      type: 'string',
    },
    {
      name: 'coins',
      type: 'TypeMsg1InputsCoins[]',
    },
  ],
  TypeMsg1InputsCoins: [
    {
      name: 'denom',
      type: 'string',
    },
    {
      name: 'amount',
      type: 'string',
    },
  ],
  TypeMsg1Outputs: [
    {
      name: 'address',
      type: 'string',
    },
    {
      name: 'coins',
      type: 'TypeMsg1OutputsCoins[]',
    },
  ],
  TypeMsg1OutputsCoins: [
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
