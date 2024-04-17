export const MsgDeletePolicySDKTypeEIP712 = {
  Msg1: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'operator',
      type: 'string',
    },
    {
      name: 'resource',
      type: 'string',
    },
    {
      name: 'principal',
      type: 'TypeMsg1Principal',
    },
  ],
  TypeMsg1Principal: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'value',
      type: 'string',
    },
  ],
};
