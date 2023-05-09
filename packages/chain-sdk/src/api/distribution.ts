import {
  MsgClientImpl,
  MsgFundCommunityPoolResponse,
  MsgSetWithdrawAddressResponse,
  MsgWithdrawDelegatorRewardResponse,
  MsgWithdrawValidatorCommissionResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/distribution/v1beta1/tx';
import { Coin } from '@cosmjs/proto-signing';
import { Account } from './account';
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

export class Distribution extends Account implements IDistribution {
  public async setWithdrawAddress(withdrawAddress: string, delegatorAddress: string) {
    const rpcCient = await this.getRpcClient();
    const rpc = new MsgClientImpl(rpcCient);
    return await rpc.SetWithdrawAddress({
      withdrawAddress,
      delegatorAddress,
    });
  }

  public async withdrawValidatorCommission(validatorAddress: string) {
    const rpcCient = await this.getRpcClient();
    const rpc = new MsgClientImpl(rpcCient);
    return rpc.WithdrawValidatorCommission({
      validatorAddress,
    });
  }

  public async withdrawDelegatorReward(validatorAddress: string, delegatorAddress: string) {
    const rpcCient = await this.getRpcClient();
    const rpc = new MsgClientImpl(rpcCient);
    return rpc.WithdrawDelegatorReward({
      delegatorAddress,
      validatorAddress,
    });
  }

  public async fundCommunityPoolundComm(amount: Coin[], depositor: string) {
    const rpcCient = await this.getRpcClient();
    const rpc = new MsgClientImpl(rpcCient);
    return rpc.FundCommunityPool({
      amount,
      depositor,
    });
  }
}
