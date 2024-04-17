export const MsgSubmitProposalSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'initial_deposit',
      type: 'TypeMsg1InitialDeposit[]',
    },
    {
      name: 'messages',
      type: 'TypeAny[]',
    },
    {
      name: 'metadata',
      type: 'string',
    },
    {
      name: 'proposer',
      type: 'string',
    },
    {
      name: 'summary',
      type: 'string',
    },
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'type',
      type: 'string',
    },
  ],
  TypeMsg1InitialDeposit: [
    {
      name: 'amount',
      type: 'string',
    },
    {
      name: 'denom',
      type: 'string',
    },
  ],
  TypeAny: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'value',
      type: 'bytes',
    },
  ],
};
