export const MsgUpdateGroupMemberSDKTypeEIP712 = {
  Msg: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'operator',
      type: 'string',
    },
    {
      name: 'group_owner',
      type: 'string',
    },
    {
      name: 'group_name',
      type: 'string',
    },
    {
      name: 'members_to_add',
      type: 'string[]',
    },
    {
      name: 'members_to_delete',
      type: 'string[]',
    },
  ],
};
