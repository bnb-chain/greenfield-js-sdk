import { TxClient } from '@/clients/txClient';
import { MsgFundCommunityPoolTypeUrlSDKTypeEIP712 } from '@/messages/cosmos/distribution/MsgFundCommunityPoolTypeUrl';
import { MsgSetWithdrawAddressSDKTypeEIP712 } from '@/messages/cosmos/distribution/MsgSetWithdrawAddress';
import { MsgWithdrawDelegatorRewardSDKTypeEIP712 } from '@/messages/cosmos/distribution/MsgWithdrawDelegatorReward';
import { MsgWithdrawValidatorCommissionSDKTypeEIP712 } from '@/messages/cosmos/distribution/MsgWithdrawValidatorCommission';
import {
  MsgFundCommunityPool,
  MsgSetWithdrawAddress,
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/distribution/v1beta1/tx';
import { container, delay, inject, injectable } from 'tsyringe';
import {
  MsgFundCommunityPoolTypeUrl,
  MsgSetWithdrawAddressTypeUrl,
  MsgWithdrawDelegatorRewardTypeUrl,
  MsgWithdrawValidatorCommissionTypeUrl,
  TxResponse,
} from '..';
import { RpcQueryClient } from '../clients/queryclient';
export interface IDistribution {
  /**
   * sets the withdrawal address for a delegator address
   */
  setWithdrawAddress(msg: MsgSetWithdrawAddress): Promise<TxResponse>;

  /**
   * withdraw accumulated commission by validator
   */
  withdrawValidatorCommission(
    address: string,
    msg: MsgWithdrawValidatorCommission,
  ): Promise<TxResponse>;

  /**
   * withdraw rewards by a delegator
   */
  withdrawDelegatorReward(msg: MsgWithdrawDelegatorReward): Promise<TxResponse>;

  /**
   * sends coins directly from the sender to the community pool.
   */
  fundCommunityPoolundComm(address: string, msg: MsgFundCommunityPool): Promise<TxResponse>;
}

@injectable()
export class Distribution implements IDistribution {
  constructor(@inject(delay(() => TxClient)) private txClient: TxClient) {}

  public async setWithdrawAddress(msg: MsgSetWithdrawAddress) {
    return await this.txClient.tx(
      MsgSetWithdrawAddressTypeUrl,
      msg.delegatorAddress,
      MsgSetWithdrawAddressSDKTypeEIP712,
      MsgSetWithdrawAddress.toSDK(msg),
      MsgSetWithdrawAddress.encode(msg).finish(),
    );
  }

  public async withdrawValidatorCommission(address: string, msg: MsgWithdrawValidatorCommission) {
    return await this.txClient.tx(
      MsgWithdrawValidatorCommissionTypeUrl,
      address,
      MsgWithdrawValidatorCommissionSDKTypeEIP712,
      MsgWithdrawValidatorCommission.toSDK(msg),
      MsgWithdrawValidatorCommission.encode(msg).finish(),
    );
  }

  public async withdrawDelegatorReward(msg: MsgWithdrawDelegatorReward) {
    return await this.txClient.tx(
      MsgWithdrawDelegatorRewardTypeUrl,
      msg.delegatorAddress,
      MsgWithdrawDelegatorRewardSDKTypeEIP712,
      MsgWithdrawDelegatorReward.toSDK(msg),
      MsgWithdrawDelegatorReward.encode(msg).finish(),
    );
  }

  public async fundCommunityPoolundComm(address: string, msg: MsgFundCommunityPool) {
    return await this.txClient.tx(
      MsgFundCommunityPoolTypeUrl,
      address,
      MsgFundCommunityPoolTypeUrlSDKTypeEIP712,
      MsgFundCommunityPool.toSDK(msg),
      MsgFundCommunityPool.encode(msg).finish(),
    );
  }
}
