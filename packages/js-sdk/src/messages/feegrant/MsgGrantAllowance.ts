export const MsgGrantAllowanceSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'granter',
      type: 'string',
    },
    {
      name: 'grantee',
      type: 'string',
    },
    {
      name: 'allowance',
      type: 'TypeAny',
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
