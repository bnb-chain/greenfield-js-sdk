import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { MetaTxInfo } from '..';

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
  };
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
  } else {
    types.Tx.push({
      name: 'msg1',
      type: 'Msg1',
    });
    Object.assign(types, newTypes);
  }

  const resTypes: Record<string, any> = {};
  const unsortedObjArr = [...Object.entries(types)];
  const sortedObjArr = unsortedObjArr.sort(([k1], [k2]) => k1.localeCompare(k2));
  sortedObjArr.forEach(([k, v]) => {
    resTypes[k] = v;
  });

  return resTypes;
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
