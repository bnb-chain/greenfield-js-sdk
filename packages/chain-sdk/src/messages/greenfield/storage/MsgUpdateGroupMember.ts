import cloneDeep from 'lodash.clonedeep';

export const getMsgUpdateGroupMemberSDKTypeEIP712 = ({
  membersToAdd,
  membersToDelete,
}: {
  membersToAdd: string[];
  membersToDelete: string[];
}) => {
  const res = cloneDeep(MsgUpdateGroupMemberSDKTypeEIP712);
  if (membersToAdd.length > 0) {
    res.Msg1.push({
      name: 'members_to_add',
      type: 'string[]',
    });
  }

  if (membersToDelete.length > 0) {
    res.Msg1.push({
      name: 'members_to_delete',
      type: 'string[]',
    });
  }

  return res;
};

const MsgUpdateGroupMemberSDKTypeEIP712 = {
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
    // {
    //   name: 'members_to_add',
    //   type: 'string[]',
    // },
    // {
    //   name: 'members_to_delete',
    //   type: 'string[]',
    // },
  ],
};
