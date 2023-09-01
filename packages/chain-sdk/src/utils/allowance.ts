import {
  AllowedMsgAllowance,
  BasicAllowance,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/feegrant/v1beta1/feegrant';
import { MsgGrantAllowance } from '@bnb-chain/greenfield-cosmos-types/cosmos/feegrant/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { Timestamp } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/timestamp';
import {
  AllowedMsgAllowanceTypeUrl,
  BasicAllowanceTypeUrl,
  DEFAULT_DENOM,
  fromTimestamp,
} from '..';

export interface IGrantAllowance {
  amount: string;
  denom: string;
  allowedMessages: string[];
  granter: MsgGrantAllowance['granter'];
  grantee: MsgGrantAllowance['grantee'];
  expirationTime: Timestamp;
}

export const newBasicAllowance = (
  amount: string,
  denom: string = DEFAULT_DENOM,
  expirationTime: Timestamp,
): BasicAllowance => {
  return {
    spendLimit: [
      {
        amount,
        denom,
      },
    ],
    expiration: expirationTime,
  };
};

export const newAllowedMsgAllowance = (
  allowedMessages: string[],
  basicAllowance: BasicAllowance,
): AllowedMsgAllowance => {
  return {
    allowedMessages,
    allowance: Any.fromPartial({
      typeUrl: BasicAllowanceTypeUrl,
      value: BasicAllowance.encode(basicAllowance).finish(),
    }),
  };
};

export const newMsgGrantAllowance = (
  grantee: string,
  granter: string,
  allowedMsgAllowance: AllowedMsgAllowance,
): MsgGrantAllowance => {
  return {
    grantee,
    granter,
    allowance: Any.fromPartial({
      typeUrl: AllowedMsgAllowanceTypeUrl,
      value: AllowedMsgAllowance.encode(allowedMsgAllowance).finish(),
    }),
  };
};

export const newMarshal = (
  amount: string,
  denom: string = DEFAULT_DENOM,
  allowed_messages: string[],
  expirationTime: Timestamp,
) => {
  return {
    '@type': AllowedMsgAllowanceTypeUrl,
    allowance: {
      '@type': BasicAllowanceTypeUrl,
      expiration: fromTimestamp(expirationTime),
      spend_limit: [
        {
          amount,
          denom,
        },
      ],
    },
    allowed_messages,
  };
};
