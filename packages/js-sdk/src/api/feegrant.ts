import { TxClient } from '@/clients/txClient';
import { MsgGrantAllowanceSDKTypeEIP712 } from '@/messages/feegrant/MsgGrantAllowance';
import { MsgRevokeAllowanceSDKTypeEIP712 } from '@/messages/feegrant/MsgRevokeAllowance';
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
import { base64FromBytes } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { arrayify } from '@ethersproject/bytes';
import { container, delay, inject, injectable } from 'tsyringe';
import {
  encodeToHex,
  IGrantAllowance,
  MsgGrantAllowanceTypeUrl,
  MsgRevokeAllowanceTypeUrl,
  newAllowedMsgAllowance,
  newBasicAllowance,
  newMarshal,
  newMsgGrantAllowance,
  TxResponse,
} from '..';
import { RpcQueryClient } from '../clients/queryclient';

export interface IFeeGrant {
  grantAllowance(msg: IGrantAllowance): Promise<TxResponse>;

  revokeAllowance(msg: MsgRevokeAllowance): Promise<TxResponse>;

  getAllowence(request: QueryAllowanceRequest): Promise<QueryAllowanceResponse>;

  getAllowences(request: QueryAllowancesRequest): Promise<QueryAllowancesResponse>;
}

@injectable()
export class FeeGrant implements IFeeGrant {
  constructor(@inject(delay(() => TxClient)) private txClient: TxClient) {}
  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);

  public async grantAllowance(params: IGrantAllowance) {
    const { amount, denom, allowedMessages, grantee, granter, expirationTime } = params;

    const basicAllowance = newBasicAllowance(amount, denom, expirationTime);
    const allowedMsgAllowance = newAllowedMsgAllowance(allowedMessages, basicAllowance);
    const grantAllowance = newMsgGrantAllowance(grantee, granter, allowedMsgAllowance);
    const marshal = newMarshal(amount, denom, allowedMessages, expirationTime);

    return await this.txClient.tx(
      MsgGrantAllowanceTypeUrl,
      granter,
      MsgGrantAllowanceSDKTypeEIP712,
      {
        ...MsgGrantAllowance.toSDK(grantAllowance),
        allowance: {
          type: grantAllowance.allowance?.typeUrl,
          value: base64FromBytes(arrayify('0x' + encodeToHex(JSON.stringify(marshal)))),
          // TODO: @roshan next version should return hex string
          // value: '0x' + encodeToHex(JSON.stringify(marshal)),
        },
      },
      MsgGrantAllowance.encode(grantAllowance).finish(),
    );
  }

  public async revokeAllowance(msg: MsgRevokeAllowance) {
    return await this.txClient.tx(
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
