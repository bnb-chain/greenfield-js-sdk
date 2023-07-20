import { MsgGrantAllowanceSDKTypeEIP712 } from '@/messages/feegrant/MsgGrantAllowance';
import { MsgRevokeAllowanceSDKTypeEIP712 } from '@/messages/feegrant/MsgRevokeAllowance';
import {
  AllowedMsgAllowance,
  BasicAllowance,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/feegrant/v1beta1/feegrant';
import {
  QueryAllowanceRequest,
  QueryAllowanceResponse,
  QueryAllowancesRequest,
  QueryAllowancesResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/feegrant/v1beta1/query';
import {
  MsgGrantAllowance,
  MsgRevokeAllowance,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/feegrant/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { Timestamp } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/timestamp';
import {
  base64FromBytes,
  bytesFromBase64,
  toTimestamp,
} from '@bnb-chain/greenfield-cosmos-types/helpers';
import { toBuffer } from '@ethereumjs/util';
import { container, singleton } from 'tsyringe';
import { encodeToHex, MsgGrantAllowanceTypeUrl, MsgRevokeAllowanceTypeUrl, TxResponse } from '..';
import { Basic } from './basic';
import { RpcQueryClient } from './queryclient';

export interface IFeeGrant {
  grantAllowance(msg: MsgGrantAllowance): Promise<TxResponse>;

  revokeAllowance(msg: MsgRevokeAllowance): Promise<TxResponse>;

  getAllowence(request: QueryAllowanceRequest): Promise<QueryAllowanceResponse>;

  getAllowences(request: QueryAllowancesRequest): Promise<QueryAllowancesResponse>;
}

@singleton()
export class FeeGrant implements IFeeGrant {
  private basic: Basic = container.resolve(Basic);
  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);

  public async grantAllowance(msg: MsgGrantAllowance) {
    const basicAllowance: BasicAllowance = {
      spendLimit: [
        {
          amount: '111',
          denom: 'BNB',
        },
      ],
    };

    const allowedMsgAllowance: AllowedMsgAllowance = {
      allowedMessages: ['/greenfield.storage.MsgCreateObject'],
      allowance: Any.fromPartial({
        typeUrl: '/cosmos.feegrant.v1beta1.BasicAllowance',
        value: BasicAllowance.encode(basicAllowance).finish(),
      }),
    };

    const grantAllowance: MsgGrantAllowance = {
      ...msg,
      allowance: Any.fromPartial({
        typeUrl: '/cosmos.feegrant.v1beta1.AllowedMsgAllowance',
        value: AllowedMsgAllowance.encode(allowedMsgAllowance).finish(),
      }),
    };

    const marshal = {
      '@type': '/cosmos.feegrant.v1beta1.AllowedMsgAllowance',
      allowed_messages: ['/greenfield.storage.MsgCreateObject'],
      allowance: Any.fromPartial({
        typeUrl: '/cosmos.feegrant.v1beta1.BasicAllowance',
        value: BasicAllowance.encode(basicAllowance).finish(),
      }),
      // expiration: null,
      // spend_limit: [
      //   {
      //     amount: '111',
      //     denom: 'BNB',
      //   },
      // ],
    };

    return await this.basic.tx(
      MsgGrantAllowanceTypeUrl,
      msg.granter,
      MsgGrantAllowanceSDKTypeEIP712,
      {
        ...MsgGrantAllowance.toSDK(grantAllowance),
        allowance: {
          type: grantAllowance.allowance?.typeUrl,
          value: toBuffer('0x' + encodeToHex(JSON.stringify(marshal))),
        },
      },
      MsgGrantAllowance.encode(grantAllowance).finish(),
    );
  }

  public async revokeAllowance(msg: MsgRevokeAllowance) {
    return await this.basic.tx(
      MsgRevokeAllowanceTypeUrl,
      msg.granter,
      MsgRevokeAllowanceSDKTypeEIP712,
      MsgRevokeAllowance.toSDK(msg),
      MsgRevokeAllowance.encode(msg).finish(),
    );
  }

  public async getAllowence(request: QueryAllowanceRequest) {
    const rpc = await this.queryClient.getFeeGrantQueryClient();
    return await rpc.Allowance(request);
  }

  public async getAllowences(request: QueryAllowancesRequest) {
    const rpc = await this.queryClient.getFeeGrantQueryClient();
    return await rpc.Allowances(request);
  }
}
