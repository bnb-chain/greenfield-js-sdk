import {
  redundancyTypeToJSON,
  visibilityTypeToJSON,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';

export const MsgCreateObjectTypeUrl = '/greenfield.storage.MsgCreateObject';

export const MsgCreateObjectSDKTypeEIP712 = {
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
      name: 'visibility',
      type: 'string',
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
  visibility: number;
  objectName: string;
  payloadSize: string;
  redundancyType: number;
  sig: string;
}

export const newMsgCreateObject = ({
  bucketName,
  contentType,
  expectChecksums,
  expiredHeight,
  from,
  visibility,
  objectName,
  payloadSize,
  sig,
  expectSecondarySpAddresses,
  redundancyType,
}: ICreateObjectMsg) => {
  return {
    type: MsgCreateObjectTypeUrl,
    bucket_name: bucketName,
    content_type: contentType,
    creator: from,
    expect_checksums: expectChecksums,
    visibility:
      visibility === undefined ? visibilityTypeToJSON(0) : visibilityTypeToJSON(visibility),
    object_name: objectName,
    payload_size: payloadSize,
    primary_sp_approval: {
      expired_height: expiredHeight,
      sig: sig,
    },
    expect_secondary_sp_addresses: expectSecondarySpAddresses,
    redundancy_type:
      redundancyType === undefined ? redundancyTypeToJSON(0) : redundancyTypeToJSON(redundancyType),
  };
};
