export const MsgUpdateGroupMemberTypeUrl = '/greenfield.storage.MsgUpdateGroupMember';

export const MsgUpdateGroupMemberSDKTypeEIP712 = {
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
      name: 'group_owner',
      type: 'string',
    },
    {
      name: 'group_name',
      type: 'string',
    },
  ],
};
