export const MsgEditValidatorSDKTypeEIP712 = {
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
      name: 'commission_rate',
      type: 'string',
    },
    {
      name: 'description',
      type: 'TypeMsg1Description',
    },
    {
      name: 'min_self_delegation',
      type: 'string',
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
};
