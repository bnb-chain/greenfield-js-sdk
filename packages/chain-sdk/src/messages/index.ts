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
  return {
    account_number: accountNumber,
    chain_id: chainCosmosId,
    sequence,
    memo,
    fee,
    msg1: msg,
    timeout_height: timeoutHeight,
  };
};

export const generateTypes = (newTypes?: object) => {
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
  };

  Object.assign(types, newTypes);
  return types;
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
