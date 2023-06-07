import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';

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
