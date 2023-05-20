import {
  MsgGrantAllowanceSDKTypeEIP712,
  MsgGrantAllowanceTypeUrl,
} from '@/messages/feegrant/MsgGrantAllowance';
import {
  MsgRevokeAllowanceSDKTypeEIP712,
  MsgRevokeAllowanceTypeUrl,
} from '@/messages/feegrant/MsgRevokeAllowance';
import {
  QueryClientImpl as FeeGrantQueryClientImpl,
  QueryAllowanceRequest,
  QueryAllowanceResponse,
  QueryAllowancesRequest,
  QueryAllowancesResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/feegrant/v1beta1/query';
import {
  MsgGrantAllowance,
  MsgRevokeAllowance,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/feegrant/v1beta1/tx';
import { TxResponse } from '..';
import { Account } from './account';

export interface IFeeGrant {
  grantAllowance(msg: MsgGrantAllowance): Promise<TxResponse>;

  revokeAllowance(msg: MsgRevokeAllowance): Promise<TxResponse>;

  getAllowence(request: QueryAllowanceRequest): Promise<QueryAllowanceResponse>;

  getAllowences(request: QueryAllowancesRequest): Promise<QueryAllowancesResponse>;
}

export class FeeGrant extends Account implements IFeeGrant {
  public async grantAllowance(msg: MsgGrantAllowance) {
    return await this.tx(
      MsgGrantAllowanceTypeUrl,
      msg.granter,
      MsgGrantAllowanceSDKTypeEIP712,
      MsgGrantAllowance.toSDK(msg),
      MsgGrantAllowance.encode(msg).finish(),
    );
  }

  public async revokeAllowance(msg: MsgRevokeAllowance) {
    return await this.tx(
      MsgRevokeAllowanceTypeUrl,
      msg.granter,
      MsgRevokeAllowanceSDKTypeEIP712,
      MsgRevokeAllowance.toSDK(msg),
      MsgRevokeAllowance.encode(msg).finish(),
    );
  }

  public async getAllowence(request: QueryAllowanceRequest) {
    const rpcClient = await this.getRpcClient();
    const rpc = new FeeGrantQueryClientImpl(rpcClient);
    return await rpc.Allowance(request);
  }

  public async getAllowences(request: QueryAllowancesRequest) {
    const rpcClient = await this.getRpcClient();
    const rpc = new FeeGrantQueryClientImpl(rpcClient);
    return await rpc.Allowances(request);
  }
}
