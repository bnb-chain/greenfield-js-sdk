export const MsgCreateValidatorSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'bls_key',
      type: 'string',
    },
    {
      name: 'bls_proof',
      type: 'string',
    },
    {
      name: 'challenger_address',
      type: 'string',
    },
    {
      name: 'commission',
      type: 'TypeMsg1Commission',
    },
    {
      name: 'delegator_address',
      type: 'string',
    },
    {
      name: 'description',
      type: 'TypeMsg1Description',
    },
    {
      name: 'from',
      type: 'string',
    },
    {
      name: 'min_self_delegation',
      type: 'string',
    },
    {
      name: 'pubkey',
      type: 'TypeAny',
    },
    {
      name: 'relayer_address',
      type: 'string',
    },
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'validator_address',
      type: 'string',
    },
    {
      name: 'value',
      type: 'TypeMsg1Value',
    },
  ],
  TypeMsg1Commission: [
    {
      name: 'max_change_rate',
      type: 'string',
    },
    {
      name: 'max_rate',
      type: 'string',
    },
    {
      name: 'rate',
      type: 'string',
    },
  ],
  TypeMsg1Description: [
    {
      name: 'details',
      type: 'string',
    },
    {
      name: 'identity',
      type: 'string',
    },
    {
      name: 'moniker',
      type: 'string',
    },
    {
      name: 'security_contact',
      type: 'string',
    },
    {
      name: 'website',
      type: 'string',
    },
  ],
  TypeMsg1Value: [
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
