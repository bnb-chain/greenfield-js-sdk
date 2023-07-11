export const MsgClaimSDKTypeEIP712 = {
  Msg1: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'from_address',
      type: 'string',
    },
    {
      name: 'src_chain_id',
      type: 'uint32',
    },
    {
      name: 'dest_chain_id',
      type: 'uint32',
    },
    {
      name: 'sequence',
      type: 'uint64',
    },
    {
      name: 'timestamp',
      type: 'uint64',
    },
  ],
};
