export * as TimestampTypes from '@bnb-chain/greenfield-cosmos-types/google/protobuf/timestamp';
export * as PermissionTypes from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';
export * as StorageEnums from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
export {
  BucketStatus,
  ObjectStatus,
  RedundancyType,
  SourceType,
  VisibilityType,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
export { Long };
import Long from 'long';

export type OnProgressEvent = {
  direction: string;
  percent: number;
  total: number;
  loaded: number;
};
export type OnProgress = (event: OnProgressEvent) => void;
