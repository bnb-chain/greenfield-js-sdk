export const MsgClaimSDKTypeEIP712 = {
  Msg: [
    {
      type: 'string',
      name: 'type',
    },
    {
      type: 'string',
      name: 'from_address',
    },
    {
      type: 'uint64',
      name: 'src_chain_id',
    },
    {
      type: 'uint64',
      name: 'dest_chain_id',
    },
    {
      type: 'uint64',
      name: 'sequence',
    },
    {
      type: 'uint64',
      name: 'timestamp',
    },
    {
      type: 'bytes',
      name: 'payload',
    },
    {
      type: 'uint64[]',
      name: 'vote_address_set',
    },
    {
      type: 'bytes',
      name: 'agg_signature',
    },
  ],
};
