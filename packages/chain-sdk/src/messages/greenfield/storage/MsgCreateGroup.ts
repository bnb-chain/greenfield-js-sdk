export const MsgCreateGroupTypeUrl = '/greenfield.storage.MsgCreateGroup';

export const MsgCreateGroupSDKTypeEIP712 = {
  Msg: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'creator',
      type: 'string',
    },
    {
      name: 'group_name',
      type: 'string',
    },
    {
      name: 'members',
      type: 'string[]',
    },
    {
      name: 'extra',
      type: 'string',
    },
  ],
};
