import type { EIP712Msg } from '@/messages/utils';
import cloneDeep from 'lodash.clonedeep';

const MsgCreateGroupSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'creator',
      type: 'string',
    },
    {
      name: 'extra',
      type: 'string',
    },
    {
      name: 'group_name',
      type: 'string',
    },
    {
      name: 'type',
      type: 'string',
    },
  ],
};

export const getMsgCreateGroupSDKTypeWithTagEIP712 = (isTagsEmpty: boolean) => {
  const res: EIP712Msg = cloneDeep(MsgCreateGroupSDKTypeEIP712);

  if (!isTagsEmpty) {
    res.Msg1.push({
      name: 'tags',
      type: 'TypeMsg1Tags',
    });

    res.TypeMsg1Tags = [
      {
        name: 'tags',
        type: 'TypeMsg1TagsTags[]',
      },
    ];
    res.TypeMsg1TagsTags = [
      {
        name: 'key',
        type: 'string',
      },
      {
        name: 'value',
        type: 'string',
      },
    ];
  } else {
    res.Msg1.push({
      name: 'tags',
      type: 'TypeMsg1Tags',
    });

    res.TypeMsg1Tags = [
      {
        name: 'tags',
        type: 'string[]',
      },
    ];
  }

  return res;
};
