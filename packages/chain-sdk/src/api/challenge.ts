import { MsgAttestSDKTypeEIP712 } from '@/messages/greenfield/chanenge/MsgAttest';
import { MsgSubmitSDKTypeEIP712 } from '@/messages/greenfield/chanenge/MsgSubmit';
import {
  QueryInturnAttestationSubmitterResponse,
  QueryLatestAttestedChallengesResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/challenge/query';
import { MsgAttest, MsgSubmit } from '@bnb-chain/greenfield-cosmos-types/greenfield/challenge/tx';
import { container, delay, inject, singleton } from 'tsyringe';
import { TxResponse } from '..';
import { Basic } from './basic';
import { RpcQueryClient } from './queryclient';

export interface IChallenge {
  /**
   * sends request to challenge and get challenge result info
   * The challenge info includes the piece data, piece hash roots and integrity hash corresponding to the accessed SP
   */
  // getChallengeInfo();
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
}

@singleton()
export class Challenge implements IChallenge {
  private queryClient = container.resolve(RpcQueryClient);
  constructor(@inject(delay(() => Basic)) private basic: Basic) {}

  public async submitChallenge(address: string, msg: MsgSubmit) {
    return await this.basic.tx(
      '/greenfield.challenge.MsgSubmit',
      address,
      MsgSubmitSDKTypeEIP712,
      MsgSubmit.toSDK(msg),
      MsgSubmit.encode(msg).finish(),
    );
  }

  public async attestChallenge(address: string, msg: MsgAttest) {
    return await this.basic.tx(
      '/greenfield.challenge.MsgAttest',
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
}
