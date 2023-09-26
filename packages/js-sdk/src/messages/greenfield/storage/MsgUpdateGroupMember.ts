import type { EIP712Msg } from '@/messages/utils';
import { MsgGroupMember } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import cloneDeep from 'lodash.clonedeep';

export const getMsgUpdateGroupMemberSDKTypeEIP712 = ({
  membersToAdd,
  membersToDelete,
}: {
  membersToAdd: MsgGroupMember[];
  membersToDelete: string[];
}) => {
  const res: EIP712Msg = cloneDeep(MsgUpdateGroupMemberSDKTypeEIP712);

  if (membersToAdd.length > 0) {
    res.Msg1.push({
      name: 'members_to_add',
      type: 'TypeMsg1MembersToAdd[]',
    });
    res.TypeMsg1MembersToAdd = [
      {
        name: 'expiration_time',
        type: 'string',
      },
      {
        name: 'member',
        type: 'string',
      },
    ];
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
      name: 'group_name',
      type: 'string',
    },
    {
      name: 'group_owner',
      type: 'string',
    },
    // {
    //   name: 'members_to_add',
    //   type: 'TypeMsg1MembersToAdd[]',
    // },
    // {
    //   name: 'members_to_delete',
    //   type: 'string[]',
    // },
    {
      name: 'operator',
      type: 'string',
    },
    {
      name: 'type',
      type: 'string',
    },
  ],
  // TypeMsg1MembersToAdd: [
  //   {
  //     name: 'expiration_time',
  //     type: 'string',
  //   },
  //   {
  //     name: 'member',
  //     type: 'string',
  //   },
  // ],
};
