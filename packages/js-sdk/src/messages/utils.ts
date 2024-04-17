import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import * as base64 from '@ethersproject/base64';
import { hexlify } from '@ethersproject/bytes';
import { toUtf8String } from '@ethersproject/strings';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import mapValues from 'lodash.mapvalues';
import set from 'lodash.set';
import sortBy from 'lodash.sortby';
import { MetaTxInfo } from '..';

export type EIP712Msg = Record<string, Array<{ type: string; name: string }>>;

export const typeWrapper = (type: string, msg: object) => {
  return {
    ...msg,
    type,
  };
};

export const generateMsg = (typeUrl: string, msgBytes: Uint8Array) => {
  return Any.fromPartial({
    typeUrl,
    value: msgBytes,
  });
};

export const createEIP712 = (types: object, chainId: string, message: object) => {
  return {
    types,
    primaryType: 'Tx',
    domain: {
      name: 'Greenfield Tx',
      version: '1.0.0',
      chainId,
      verifyingContract: 'greenfield',
      salt: '0',
    },
    message,
  } as const;
};

export const generateMessage = (
  accountNumber: string,
  sequence: string,
  chainCosmosId: string,
  memo: string,
  fee: object,
  msg: object,
  timeoutHeight: string,
) => {
  let res: Record<string, any> = {
    account_number: accountNumber,
    chain_id: chainCosmosId,
    sequence,
    memo,
    fee,
    timeout_height: timeoutHeight,
  };

  if (Object.keys(msg).length == 0) {
    return res;
  }

  if (msg.hasOwnProperty('msg1')) {
    res = {
      ...res,
      ...msg,
    };
  } else {
    res.msg1 = msg;
  }

  return res;
};

export const generateTypes = (newTypes: object) => {
  const types = {
    Coin: [
      { name: 'denom', type: 'string' },
      { name: 'amount', type: 'uint256' },
    ],
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'string' },
      { name: 'salt', type: 'string' },
    ],
    Fee: [
      { name: 'amount', type: 'Coin[]' },
      { name: 'gas_limit', type: 'uint256' },
      { name: 'payer', type: 'string' },
      { name: 'granter', type: 'string' },
    ],
    Tx: [
      {
        name: 'account_number',
        type: 'uint256',
      },
      {
        name: 'chain_id',
        type: 'uint256',
      },
      {
        name: 'fee',
        type: 'Fee',
      },
      {
        name: 'memo',
        type: 'string',
      },
      {
        name: 'sequence',
        type: 'uint256',
      },
      {
        name: 'timeout_height',
        type: 'uint256',
      },
    ],
  };

  if (Array.isArray(newTypes)) {
    for (let i = 0; i < newTypes.length; i++) {
      types.Tx.push({
        name: `msg${i + 1}`,
        type: `Msg${i + 1}`,
      });
    }
    Object.assign(types, ...newTypes);
  } else if (typeof newTypes === 'object') {
    const msgLen = Object.keys(newTypes).filter((k) => k.startsWith('Msg')).length;

    for (let i = 0; i < msgLen; i++) {
      types.Tx.push({
        name: `msg${i + 1}`,
        type: `Msg${i + 1}`,
      });
    }

    Object.assign(types, newTypes);
  } else {
    types.Tx.push({
      name: 'msg1',
      type: 'Msg1',
    });
    Object.assign(types, newTypes);
  }

  return mapValues(types, (o) => {
    return sortBy(o, ['name']);
  });
};

export const generateFee = (
  amount: string,
  denom: string,
  gas_limit: string,
  payer: string,
  granter: string,
) => {
  return {
    amount: [
      {
        amount,
        denom,
      },
    ],
    gas_limit,
    payer,
    granter,
  };
};

export const mergeMultiEip712 = (
  eip712s: MetaTxInfo['MsgSDKTypeEIP712'][],
): MetaTxInfo['MsgSDKTypeEIP712'][] => {
  const res: MetaTxInfo['MsgSDKTypeEIP712'][] = [];

  eip712s.forEach((eip712, index) => {
    if (index === 0) {
      res.push(eip712);
    } else {
      const str = JSON.stringify(eip712);
      const reStr = str.replaceAll('Msg1', `Msg${index + 1}`);
      res.push(JSON.parse(reStr) as MetaTxInfo['MsgSDKTypeEIP712']);
    }
  });

  return res;
};

export const mergeMultiMessage = (txs: MetaTxInfo[]) => {
  const msgs = txs.map((tx) => tx.MsgSDK);

  const res: Record<string, MetaTxInfo['MsgSDK']> = {};
  msgs.forEach((msg, index) => {
    res[`msg${index + 1}`] = {
      ...msg,
      type: txs[index].typeUrl,
    };
  });

  return res;
};

export const findAnyType = (msgData: object): string[][] => {
  const results: string[][] = [];

  function findTypeAnyFields(obj: object, path: string[] = []) {
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        const newPath: string[] = [...path, key];
        // console.log(newPath.join('.'));
        if (key === 'value') {
          results.push(newPath);
        }
        findTypeAnyFields((obj as any)[key], newPath);
      }
    } else {
      // console.log(obj);
    }
  }

  findTypeAnyFields(msgData);
  return results;
};

export const convertAnyTypeData = (msgData: object, fields: string[][]) => {
  const resData = cloneDeep(msgData);

  fields.forEach((field) => {
    const path = field.join('.');
    const anyValue = get(resData, path);

    // console.log('path', path, anyValue);
    if (anyValue.startsWith('ZXl')) {
      // TypeAny: need base64 decode
      set(resData, path, toUtf8String(base64.decode(anyValue)));
    } else if (anyValue.startsWith('eyJ')) {
      // TypeAny[]: need base64 decode and encode hex
      set(resData, path, hexlify(base64.decode(anyValue)));
    } else {
      // throw new Error('not support value' + anyValue);
    }
  });

  return resData;
};
