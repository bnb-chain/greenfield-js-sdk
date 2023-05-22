import {
  MsgGrantAllowanceSDKTypeEIP712,
  MsgGrantAllowanceTypeUrl,
} from '@/messages/feegrant/MsgGrantAllowance';
import {
  MsgRevokeAllowanceSDKTypeEIP712,
  MsgRevokeAllowanceTypeUrl,
} from '@/messages/feegrant/MsgRevokeAllowance';
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
import { container, singleton } from 'tsyringe';
import { TxResponse } from '..';
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
    return await this.basic.tx(
      MsgGrantAllowanceTypeUrl,
      msg.granter,
      MsgGrantAllowanceSDKTypeEIP712,
      MsgGrantAllowance.toSDK(msg),
      MsgGrantAllowance.encode(msg).finish(),
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
