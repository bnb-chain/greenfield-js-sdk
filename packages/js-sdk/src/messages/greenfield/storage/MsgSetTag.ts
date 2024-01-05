import type { EIP712Msg } from '@/messages/utils';
import cloneDeep from 'lodash.clonedeep';

export const getMsgSetTagSDKTypeEIP712 = (isTagsEmpty: boolean) => {
  const res: EIP712Msg = cloneDeep(MsgSetTagSDKTypeEIP712);

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

const MsgSetTagSDKTypeEIP712 = {
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
      name: 'type',
      type: 'string',
    },
  ],
};
