import { MsgCreateBucket } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';

export default class MultiMessage {
  static getCreateBucketParams = (msg: MsgCreateBucket) => {
    return MsgCreateBucket.encode(msg).finish();
  };
}
