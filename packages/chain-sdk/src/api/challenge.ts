import { TxClient } from '@/clients/txClient';
import { MsgAttestSDKTypeEIP712 } from '@/messages/greenfield/chanenge/MsgAttest';
import { MsgSubmitSDKTypeEIP712 } from '@/messages/greenfield/chanenge/MsgSubmit';
import {
  QueryInturnAttestationSubmitterResponse,
  QueryLatestAttestedChallengesResponse,
  QueryParamsResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/challenge/query';
import { MsgAttest, MsgSubmit } from '@bnb-chain/greenfield-cosmos-types/greenfield/challenge/tx';
import { container, delay, inject, injectable } from 'tsyringe';
import { MsgAttestTypeUrl, MsgSubmitTypeUrl, TxResponse } from '..';
import { RpcQueryClient } from '../clients/queryclient';

export interface IChallenge {
  // TODO: getChallengeInfo();

  /**
   * challenges the service provider data integrity, used by off-chain service greenfield-challenger.
   */
  submitChallenge(address: string, msg: MsgSubmit): Promise<TxResponse>;

  /**
   * Attest handles user's request for attesting a challenge.
     The attestation can include a valid challenge or is only for heartbeat purpose.
     If the challenge is valid, the related storage provider will be slashed.
     For heartbeat attestation, the challenge is invalid and the storage provider will not be slashed.
   */
  attestChallenge(address: string, msg: MsgAttest): Promise<TxResponse>;

  latestAttestedChallenges(): Promise<QueryLatestAttestedChallengesResponse>;

  inturnAttestationSubmitter(): Promise<QueryInturnAttestationSubmitterResponse>;

  params(): Promise<QueryParamsResponse>;
}

@injectable()
export class Challenge implements IChallenge {
  private queryClient = container.resolve(RpcQueryClient);
  constructor(@inject(delay(() => TxClient)) private txClient: TxClient) {}

  public async submitChallenge(address: string, msg: MsgSubmit) {
    return await this.txClient.tx(
      MsgSubmitTypeUrl,
      address,
      MsgSubmitSDKTypeEIP712,
      MsgSubmit.toSDK(msg),
      MsgSubmit.encode(msg).finish(),
    );
  }

  public async attestChallenge(address: string, msg: MsgAttest) {
    return await this.txClient.tx(
      MsgAttestTypeUrl,
      address,
      MsgAttestSDKTypeEIP712,
      MsgAttest.toSDK(msg),
      MsgAttest.encode(msg).finish(),
    );
  }

  public async latestAttestedChallenges() {
    const rpc = await this.queryClient.getChallengeQueryClient();
    return await rpc.LatestAttestedChallenges();
  }

  public async inturnAttestationSubmitter() {
    const rpc = await this.queryClient.getChallengeQueryClient();
    return await rpc.InturnAttestationSubmitter();
  }

  public async params() {
    const rpc = await this.queryClient.getChallengeQueryClient();
    return await rpc.Params();
  }
}
