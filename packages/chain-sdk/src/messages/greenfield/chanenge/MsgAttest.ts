export const MsgAttestSDKTypeEIP712 = {
  Msg: [
    {
      type: 'string',
      name: 'type',
    },
    {
      type: 'string',
      name: 'challenger',
    },
    {
      type: 'string',
      name: 'sp_operator_address',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string',
      name: 'object_name',
    },
    {
      type: 'uint64',
      name: 'segment_index',
    },
    {
      type: 'bool',
      name: 'random_index',
    },
    {
      type: 'string',
      name: 'submitter',
    },
    {
      type: 'uint64',
      name: 'challenge_id',
    },
    {
      type: 'string',
      name: 'object_id',
    },
    {
      type: 'string',
      name: 'sp_operator_address',
    },
    {
      type: 'string',
      name: 'vote_result',
    },
    {
      type: 'string',
      name: 'challenger_address',
    },
    {
      type: 'uint64[]',
      name: 'vote_validator_set',
    },
    {
      type: 'bytes',
      name: 'vote_agg_signature',
    },
  ],
};
