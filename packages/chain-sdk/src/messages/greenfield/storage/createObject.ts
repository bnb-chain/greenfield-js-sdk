import { redundancyTypeToJSON } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import { MsgCreateObject } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';

export const TYPE_URL = '/bnbchain.greenfield.storage.MsgCreateObject';

export const TYPES = {
  Msg: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'creator',
      type: 'string',
    },
    {
      name: 'bucket_name',
      type: 'string',
    },
    {
      name: 'object_name',
      type: 'string',
    },
    {
      name: 'payload_size',
      type: 'uint64',
    },
    {
      name: 'is_public',
      type: 'bool',
    },
    {
      name: 'content_type',
      type: 'string',
    },
    {
      name: 'primary_sp_approval',
      type: 'TypePrimarySpApproval',
    },
    {
      name: 'expect_checksums',
      type: 'bytes[]',
    },
    {
      name: 'redundancy_type',
      type: 'string',
    },
    {
      name: 'expect_secondary_sp_addresses',
      type: 'string[]',
    },
  ],
  TypePrimarySpApproval: [
    {
      name: 'expired_height',
      type: 'uint64',
    },
    {
      name: 'sig',
      type: 'bytes',
    },
  ],
};

export interface ICreateObjectMsg {
  bucketName: string;
  contentType: string;
  expectChecksums: string[];
  expectSecondarySpAddresses: string[];
  expiredHeight: string;
  from: string;
  isPublic: boolean;
  objectName: string;
  payloadSize: string;
  redundancyType: string;
  sig: string;
}

export const newMsgCreateObject = ({
  bucketName,
  contentType,
  expectChecksums,
  expiredHeight,
  from,
  isPublic,
  objectName,
  payloadSize,
  sig,
  expectSecondarySpAddresses,
  redundancyType,
}: ICreateObjectMsg) => {
  const message = MsgCreateObject.fromJSON({
    expectSecondarySpAddresses,
    redundancyType,
  });

  return {
    type: TYPE_URL,
    bucket_name: bucketName,
    content_type: contentType,
    creator: from,
    expect_checksums: expectChecksums,
    is_public: isPublic,
    object_name: objectName,
    payload_size: payloadSize,
    primary_sp_approval: {
      expired_height: expiredHeight,
      sig: sig,
    },
    expect_secondary_sp_addresses: expectSecondarySpAddresses,
    redundancy_type: redundancyTypeToJSON(message.redundancyType),
  };
};
