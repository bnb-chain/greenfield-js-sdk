import { MsgAttestSDKTypeEIP712 } from '@/messages/greenfield/chanenge/MsgAttest';
import { MsgSubmitSDKTypeEIP712 } from '@/messages/greenfield/chanenge/MsgSubmit';
import {
  QueryClientImpl as ChallengeQueryClientImpl,
  QueryInturnAttestationSubmitterResponse,
  QueryLatestAttestedChallengesResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/challenge/query';
import { MsgAttest, MsgSubmit } from '@bnb-chain/greenfield-cosmos-types/greenfield/challenge/tx';
import { ITxOption, SimulateOrBroad, SimulateOrBroadResponse } from '..';
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
  submitChallenge<T extends ITxOption>(
    address: string,
    msg: MsgSubmit,
    txOption: T,
  ): Promise<SimulateOrBroad<T>>;
  submitChallenge(
    address: string,
    msg: MsgSubmit,
    txOption: ITxOption,
  ): Promise<SimulateOrBroadResponse>;

  /**
   * Attest handles user's request for attesting a challenge.
     The attestation can include a valid challenge or is only for heartbeat purpose.
     If the challenge is valid, the related storage provider will be slashed.
     For heartbeat attestation, the challenge is invalid and the storage provider will not be slashed.
   */
  attestChallenge<T extends ITxOption>(
    address: string,
    msg: MsgAttest,
    txOption: T,
  ): Promise<SimulateOrBroad<T>>;
  attestChallenge(
    address: string,
    msg: MsgAttest,
    txOption: ITxOption,
  ): Promise<SimulateOrBroadResponse>;

  latestAttestedChallenges(): Promise<QueryLatestAttestedChallengesResponse>;

  inturnAttestationSubmitter(): Promise<QueryInturnAttestationSubmitterResponse>;
}

export class Challenge extends Account implements IChallenge {
  public async submitChallenge(address: string, msg: MsgSubmit, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.challenge.MsgSubmit';
    const msgBytes = MsgSubmit.encode(msg).finish();
    const accountInfo = await this.getAccount(address);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgSubmitSDKTypeEIP712,
      MsgSubmit.toSDK(msg),
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

  public async attestChallenge(address: string, msg: MsgAttest, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.challenge.MsgAttest';
    const msgBytes = MsgAttest.encode(msg).finish();
    const accountInfo = await this.getAccount(address);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgAttestSDKTypeEIP712,
      MsgAttest.toSDK(msg),
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
