import { MsgGrantAllowanceSDKTypeEIP712 } from '@/messages/feegrant/MsgGrantAllowance';
import { MsgRevokeAllowanceSDKTypeEIP712 } from '@/messages/feegrant/MsgRevokeAllowance';
import { BasicAllowance } from '@bnb-chain/greenfield-cosmos-types/cosmos/feegrant/v1beta1/feegrant';
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
    const x: BasicAllowance = {
      spendLimit: [
        {
          amount: '111',
          denom: 'BNB',
        },
      ],
      // expiration: null,
    };

    // console.log('BasicAllowance', BasicAllowance.encode(x).finish());

    const marshal = {
      '@type': '/cosmos.feegrant.v1beta1.BasicAllowance',
      expiration: null,
      spend_limit: [
        {
          amount: '111',
          denom: 'BNB',
        },
      ],
    };

    // console.log(JSON.stringify(marshal));
    // console.log('marshal', base64FromBytes(toBuffer('0x' + encodeToHex(JSON.stringify(marshal)))));

    const MyMsg: MsgGrantAllowance = {
      ...msg,
      allowance: Any.fromPartial({
        typeUrl: '/cosmos.feegrant.v1beta1.BasicAllowance',
        value: BasicAllowance.encode(x).finish(),
      }),
    };

    // console.log('MyMsg', MyMsg);

    // const utf8Decoder = new TextDecoder();
    // const tt = MyMsg.allowance?.value || Uint8Array.from([]);
    // console.log(base64FromBytes(tt));

    return await this.basic.tx(
      MsgGrantAllowanceTypeUrl,
      msg.granter,
      MsgGrantAllowanceSDKTypeEIP712,
      {
        ...MsgGrantAllowance.toSDK(MyMsg),
        allowance: {
          type: MyMsg.allowance?.typeUrl,
          value: base64FromBytes(toBuffer('0x' + encodeToHex(JSON.stringify(marshal)))),
        },
      },
      MsgGrantAllowance.encode(MyMsg).finish(),
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
