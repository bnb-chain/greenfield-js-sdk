import type { EIP712Msg } from '@/messages/utils';
import cloneDeep from 'lodash.clonedeep';

export const getMsgCreateObjectSDKTypeEIP712 = (isTagsEmpty: boolean) => {
  const res: EIP712Msg = cloneDeep(MsgCreateObjectSDKTypeEIP712);

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

const MsgCreateObjectSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'bucket_name',
      type: 'string',
    },
    {
      name: 'content_type',
      type: 'string',
    },
    {
      name: 'creator',
      type: 'string',
    },
    {
      name: 'expect_checksums',
      type: 'bytes[]',
    },
    {
      name: 'object_name',
      type: 'string',
    },
    {
      name: 'payload_size',
      type: 'uint64',
    },
    {
      name: 'primary_sp_approval',
      type: 'TypeMsg1PrimarySpApproval',
    },
    {
      name: 'redundancy_type',
      type: 'string',
    },
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'visibility',
      type: 'string',
    },
  ],
  TypeMsg1PrimarySpApproval: [
    {
      name: 'expired_height',
      type: 'uint64',
    },
    {
      name: 'global_virtual_group_family_id',
      type: 'uint32',
    },
    {
      name: 'sig',
      type: 'bytes',
    },
  ],
};
