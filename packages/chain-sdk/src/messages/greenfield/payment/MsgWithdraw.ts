export const MsgWithdrawSDKTypeEIP712 = {
  Msg: [
    {
      type: 'string',
      name: 'type',
    },
    {
      type: 'string',
      name: 'authority',
    },
    {
      type: 'TypeParams',
      name: 'params',
    },
    {
      type: 'string',
      name: 'creator',
    },
    {
      type: 'string',
      name: 'creator',
    },
    {
      type: 'string',
      name: 'to',
    },
    {
      type: 'string',
      name: 'amount',
    },
    {
      type: 'string',
      name: 'creator',
    },
    {
      type: 'string',
      name: 'from',
    },
    {
      type: 'string',
      name: 'amount',
    },
  ],
  TypeParams: [
    {
      type: 'uint64',
      name: 'reserve_time',
    },
    {
      type: 'uint64',
      name: 'payment_account_count_limit',
    },
    {
      type: 'uint64',
      name: 'forced_settle_time',
    },
    {
      type: 'uint64',
      name: 'max_auto_force_settle_num',
    },
    {
      type: 'string',
      name: 'fee_denom',
    },
    {
      type: 'string',
      name: 'validator_tax_rate',
    },
  ],
};
