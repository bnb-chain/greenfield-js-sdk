import { ITxOption, SimulateOrBroad, SimulateOrBroadResponse } from '..';
import {
  MsgGrantAllowance,
  MsgRevokeAllowance,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/feegrant/v1beta1/tx';
import { Account } from './account';
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

export interface IFeeGrant {
  grantAllowance<T extends ITxOption>(
    msg: MsgGrantAllowance,
    txOption: T,
  ): Promise<SimulateOrBroad<T>>;
  grantAllowance(msg: MsgGrantAllowance, txOption: ITxOption): Promise<SimulateOrBroadResponse>;

  revokeAllowance<T extends ITxOption>(
    msg: MsgRevokeAllowance,
    txOption: T,
  ): Promise<SimulateOrBroad<T>>;
  revokeAllowance(msg: MsgRevokeAllowance, txOption: ITxOption): Promise<SimulateOrBroadResponse>;

  getAllowence(request: QueryAllowanceRequest): Promise<QueryAllowanceResponse>;

  getAllowences(request: QueryAllowancesRequest): Promise<QueryAllowancesResponse>;
}

export class FeeGrant extends Account implements IFeeGrant {
  public async grantAllowance(msg: MsgGrantAllowance, txOption: ITxOption) {
    const typeUrl = MsgGrantAllowanceTypeUrl;
    const msgBytes = MsgGrantAllowance.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.granter);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgGrantAllowanceSDKTypeEIP712,
      MsgGrantAllowance.toSDK(msg),
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
  }

  public async revokeAllowance(msg: MsgRevokeAllowance, txOption: ITxOption) {
    const typeUrl = MsgRevokeAllowanceTypeUrl;
    const msgBytes = MsgRevokeAllowance.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.granter);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgRevokeAllowanceSDKTypeEIP712,
      MsgRevokeAllowance.toSDK(msg),
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
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
