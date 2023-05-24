export const MsgRevokeAllowanceTypeUrl = '/cosmos/feegrant/v1beta1/MsgRevokeAllowance';
export const MsgRevokeAllowanceSDKTypeEIP712 = {
  Msg: [
    {
      type: 'string',
      name: 'type',
    },
    {
      type: 'string',
      name: 'granter',
    },
    {
      type: 'string',
      name: 'grantee',
    },
    {
      type: 'TypeAllowance',
      name: 'allowance',
    },
    {
      type: 'string',
      name: 'granter',
    },
    {
      type: 'string',
      name: 'grantee',
    },
  ],
  TypeAllowance: [
    {
      type: 'string',
      name: 'type_url',
    },
    {
      type: 'bytes',
      name: 'value',
    },
  ],
};
