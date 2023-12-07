import type { EIP712Msg } from '@/messages/utils';
import cloneDeep from 'lodash.clonedeep';

export const getMsgCreateBucketSDKTypeEIP712 = (isTagsEmpty: boolean) => {
  const res: EIP712Msg = cloneDeep(MsgCreateBucketSDKTypeEIP712);

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

const MsgCreateBucketSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'bucket_name',
      type: 'string',
    },
    {
      name: 'charged_read_quota',
      type: 'uint64',
    },
    {
      name: 'creator',
      type: 'string',
    },
    {
      name: 'payment_address',
      type: 'string',
    },
    {
      name: 'primary_sp_address',
      type: 'string',
    },
    {
      name: 'primary_sp_approval',
      type: 'TypeMsg1PrimarySpApproval',
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
