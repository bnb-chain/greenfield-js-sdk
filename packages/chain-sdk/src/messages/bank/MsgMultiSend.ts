export const MsgMultiSendTypeUrl = '/cosmos.bank.v1beta1.MsgMulti';
export const MsgMultiSendSDKTypeEIP712 = {
  Msg: [
    { name: 'type', type: 'string' },
    { name: 'from_address', type: 'string' },
    { name: 'to_address', type: 'string' },
    { name: 'amount', type: 'TypeAmount[]' },
  ],
};
