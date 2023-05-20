import { MsgAttestSDKTypeEIP712 } from '@/messages/greenfield/chanenge/MsgAttest';
import { MsgSubmitSDKTypeEIP712 } from '@/messages/greenfield/chanenge/MsgSubmit';
import {
  QueryClientImpl as ChallengeQueryClientImpl,
  QueryInturnAttestationSubmitterResponse,
  QueryLatestAttestedChallengesResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/challenge/query';
import { MsgAttest, MsgSubmit } from '@bnb-chain/greenfield-cosmos-types/greenfield/challenge/tx';
import { TxResponse } from '..';
import { Account } from './account';

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

export class Challenge extends Account implements IChallenge {
  public async submitChallenge(address: string, msg: MsgSubmit) {
    return await this.tx(
      '/greenfield.challenge.MsgSubmit',
      address,
      MsgSubmitSDKTypeEIP712,
      MsgSubmit.toSDK(msg),
      MsgSubmit.encode(msg).finish(),
    );
  }

  public async attestChallenge(address: string, msg: MsgAttest) {
    return await this.tx(
      '/greenfield.challenge.MsgAttest',
      address,
      MsgAttestSDKTypeEIP712,
      MsgAttest.toSDK(msg),
      MsgAttest.encode(msg).finish(),
    );
  }

  public async latestAttestedChallenges() {
    const rpcClient = await this.getRpcClient();
    const rpc = new ChallengeQueryClientImpl(rpcClient);
    return await rpc.LatestAttestedChallenges();
  }

  public async inturnAttestationSubmitter() {
    const rpcClient = await this.getRpcClient();
    const rpc = new ChallengeQueryClientImpl(rpcClient);
    return await rpc.InturnAttestationSubmitter();
  }
}
