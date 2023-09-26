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
