export const MsgSetTagSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'operator',
      type: 'string',
    },
    {
      name: 'resource',
      type: 'string',
    },
    {
      name: 'tags',
      type: 'TypeMsg1Tags',
    },
    {
      name: 'type',
      type: 'string',
    },
  ],
  TypeMsg1Tags: [
    {
      name: 'tags',
      type: 'TypeMsg1TagsTags[]',
    },
  ],
  TypeMsg1TagsTags: [
    {
      name: 'key',
      type: 'string',
    },
    {
      name: 'value',
      type: 'string',
    },
  ],
};
