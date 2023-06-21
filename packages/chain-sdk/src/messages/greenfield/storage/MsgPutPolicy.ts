export const MsgPutPolicyTypeUrl = '/greenfield.storage.MsgPutPolicy';

export const MsgPutPolicySDKTypeEIP712 = {
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
      name: 'principal',
      type: 'TypeMsg1Principal',
    },
    {
      name: 'resource',
      type: 'string',
    },
    {
      name: 'statements',
      type: 'TypeMsg1Statements[]',
    },
    {
      name: 'expiration_time',
      type: 'string',
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
  TypeMsg1Statements: [
    {
      name: 'effect',
      type: 'string',
    },
    {
      name: 'actions',
      type: 'string[]',
    },
    {
      name: 'resources',
      type: 'string[]',
    },
    {
      name: 'expiration_time',
      type: 'string',
    },
  ],
};
