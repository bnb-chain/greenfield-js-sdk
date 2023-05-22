import {
  MsgFundCommunityPoolResponse,
  MsgSetWithdrawAddressResponse,
  MsgWithdrawDelegatorRewardResponse,
  MsgWithdrawValidatorCommissionResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/distribution/v1beta1/tx';
import { Coin } from '@cosmjs/proto-signing';
import { container } from 'tsyringe';
import { Basic } from './basic';
import { RpcQueryClient } from './queryclient';
export interface IDistribution {
  /**
   * sets the withdrawal address for a delegator address
   */
  setWithdrawAddress(
    withdrawAddress: string,
    delegatorAddress: string,
  ): Promise<MsgSetWithdrawAddressResponse>;

  /**
   * withdraw accumulated commission by validator
   */
  withdrawValidatorCommission(
    validatorAddress: string,
  ): Promise<MsgWithdrawValidatorCommissionResponse>;

  /**
   * withdraw rewards by a delegator
   */
  withdrawDelegatorReward(
    validatorAddress: string,
    delegatorAddress: string,
  ): Promise<MsgWithdrawDelegatorRewardResponse>;

  /**
   * sends coins directly from the sender to the community pool.
   */
  fundCommunityPoolundComm(
    amount: Coin[],
    depositor: string,
  ): Promise<MsgFundCommunityPoolResponse>;
}

export class Distribution implements IDistribution {
  private basic: Basic = container.resolve(Basic);
  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);

  public async setWithdrawAddress(withdrawAddress: string, delegatorAddress: string) {
    const rpc = await this.queryClient.getMsgClient();
    return await rpc.SetWithdrawAddress({
      withdrawAddress,
      delegatorAddress,
    });
  }

  public async withdrawValidatorCommission(validatorAddress: string) {
    const rpc = await this.queryClient.getMsgClient();
    return rpc.WithdrawValidatorCommission({
      validatorAddress,
    });
  }

  public async withdrawDelegatorReward(validatorAddress: string, delegatorAddress: string) {
    const rpc = await this.queryClient.getMsgClient();
    return rpc.WithdrawDelegatorReward({
      delegatorAddress,
      validatorAddress,
    });
  }

  public async fundCommunityPoolundComm(amount: Coin[], depositor: string) {
    const rpc = await this.queryClient.getMsgClient();
    return rpc.FundCommunityPool({
      amount,
      depositor,
    });
  }
}
