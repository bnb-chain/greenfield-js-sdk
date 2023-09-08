import { RpcQueryClient } from '@/clients/queryclient';
import { TxClient } from '@/clients/txClient';
import { MsgEditValidatorSDKTypeEIP712 } from '@/messages/cosmos/staking/MsgEditValidator';
import {
  QueryValidatorsRequest,
  QueryValidatorsResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/staking/v1beta1/query';
import { MsgEditValidator } from '@bnb-chain/greenfield-cosmos-types/cosmos/staking/v1beta1/tx';
import { container, delay, inject, injectable } from 'tsyringe';
import { MsgEditValidatorTypeUrl, TxResponse } from '..';

export interface IValidator {
  /**
   * lists all validators (if status is empty string) or validators filtered by status.
   * STATUS:
   * "BOND_STATUS_UNBONDED",
   * "BOND_STATUS_UNBONDING",
   * "BOND_STATUS_BONDED",
   */
  listValidators(request: QueryValidatorsRequest): Promise<QueryValidatorsResponse>;

  /**
   * NOTICE: only validator can use this api
   */
  editValidator(address: string, msg: MsgEditValidator): Promise<TxResponse>;
}

@injectable()
export class Validator implements IValidator {
  constructor(@inject(delay(() => TxClient)) private txClient: TxClient) {}
  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);

  public async listValidators(request: QueryValidatorsRequest) {
    const client = await this.queryClient.getStakingClient();
    return client.Validators(request);
  }

  // public async createValidator(address: string, msg: MsgCreateValidator) {
  //   return await this.txClient.tx(
  //     MsgCreateValidatorTypeUrl,
  //     address,
  //     MsgCreateValidatorSDKTypeEIP712,
  //     MsgCreateValidator.toSDK(msg),
  //     MsgCreateValidator.encode(msg).finish(),
  //   );
  // }

  public async editValidator(address: string, msg: MsgEditValidator) {
    return await this.txClient.tx(
      MsgEditValidatorTypeUrl,
      address,
      MsgEditValidatorSDKTypeEIP712,
      MsgEditValidator.toSDK(msg),
      MsgEditValidator.encode(msg).finish(),
    );
  }
}
