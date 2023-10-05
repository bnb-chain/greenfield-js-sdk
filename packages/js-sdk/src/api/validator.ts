import { RpcQueryClient } from '@/clients/queryclient';
import { TxClient } from '@/clients/txClient';
import { MsgCreateValidatorSDKTypeEIP712 } from '@/messages/cosmos/staking/MsgCreateValidator';
import { MsgEditValidatorSDKTypeEIP712 } from '@/messages/cosmos/staking/MsgEditValidator';
import { MsgSubmitProposal } from '@bnb-chain/greenfield-cosmos-types/cosmos/gov/v1/tx';
import {
  QueryValidatorsRequest,
  QueryValidatorsResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/staking/v1beta1/query';
import {
  MsgCreateValidator,
  MsgEditValidator,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/staking/v1beta1/tx';
import { arrayify } from '@ethersproject/bytes';
import { container, delay, inject, injectable } from 'tsyringe';
import {
  base64FromBytes,
  bytesFromBase64,
  encodeToHex,
  MsgCreateValidatorTypeUrl,
  MsgEditValidatorTypeUrl,
  TxResponse,
} from '..';
import { Proposal } from './proposal';

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
  createValidator(address: string, createValidatorSrcMsg: MsgCreateValidator): Promise<TxResponse>;

  /**
   * NOTICE: only validator can use this api
   */
  editValidator(address: string, msg: MsgEditValidator): Promise<TxResponse>;
}

@injectable()
export class Validator implements IValidator {
  constructor(@inject(delay(() => TxClient)) private txClient: TxClient) {}
  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);

  private proposal: Proposal = container.resolve(Proposal);

  public async listValidators(request: QueryValidatorsRequest) {
    const client = await this.queryClient.getStakingClient();
    return client.Validators(request);
  }

  public async createValidator(address: string, msg: MsgCreateValidator) {
    return await this.txClient.tx(
      MsgCreateValidatorTypeUrl,
      address,
      MsgCreateValidatorSDKTypeEIP712,
      MsgCreateValidator.toSDK(msg),
      MsgCreateValidator.encode(msg).finish(),
    );
  }

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
