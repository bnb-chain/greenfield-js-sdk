import type { EIP712Msg } from '@/messages/utils';
import cloneDeep from 'lodash.clonedeep';

export const getMsgPutPolicySDKTypeEIP712 = (resource: string[]) => {
  const res: EIP712Msg = cloneDeep(MsgPutPolicySDKTypeEIP712);

  if (resource.length !== 0) {
    res.TypeMsg1Statements.push({
      name: 'resources',
      type: 'string[]',
    });
  }

  return res;
};

const MsgPutPolicySDKTypeEIP712 = {
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
      name: 'principal',
      type: 'TypeMsg1Principal',
    },
    {
      name: 'resource',
      type: 'string',
    },
    {
      name: 'statements',
      type: 'TypeMsg1Statements[]',
    },
    {
      name: 'expiration_time',
      type: 'string',
    },
  ],
  TypeMsg1Principal: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'value',
      type: 'string',
    },
  ],
  TypeMsg1Statements: [
    {
      name: 'actions',
      type: 'string[]',
    },
    {
      name: 'effect',
      type: 'string',
    },
    {
      name: 'expiration_time',
      type: 'string',
    },
    // {
    //   name: 'resources',
    //   type: 'string[]',
    // },
  ],
};
