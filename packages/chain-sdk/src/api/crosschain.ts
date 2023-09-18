import { TxClient } from '@/clients/txClient';
import { MsgClaimSDKTypeEIP712 } from '@/messages/cosmos/oracle/MsgClaim';
import { MsgTransferOutSDKTypeEIP712 } from '@/messages/greenfield/bridge/MsgTransferOut';
import { MsgMirrorBucketSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgMirrorBucket';
import { MsgMirrorGroupSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgMirrorGroup';
import { MsgMirrorObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgMirrorObject';
import {
  QueryCrossChainPackageRequest,
  QueryCrossChainPackageResponse,
  QueryReceiveSequenceRequest,
  QueryReceiveSequenceResponse,
  QuerySendSequenceRequest,
  QuerySendSequenceResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/crosschain/v1/query';
import { QueryInturnRelayerResponse } from '@bnb-chain/greenfield-cosmos-types/cosmos/oracle/v1/query';
import { MsgClaim } from '@bnb-chain/greenfield-cosmos-types/cosmos/oracle/v1/tx';
import { QueryParamsResponse } from '@bnb-chain/greenfield-cosmos-types/greenfield/bridge/query';
import { MsgTransferOut } from '@bnb-chain/greenfield-cosmos-types/greenfield/bridge/tx';
import {
  MsgMirrorBucket,
  MsgMirrorGroup,
  MsgMirrorObject,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { container, delay, inject, injectable } from 'tsyringe';
import {
  MsgClaimTypeUrl,
  MsgMirrorBucketTypeUrl,
  MsgMirrorGroupTypeUrl,
  MsgMirrorObjectTypeUrl,
  MsgTransferOutTypeUrl,
  TxResponse,
} from '..';
import { RpcQueryClient } from '../clients/queryclient';

export interface ICrossChain {
  /**
   * makes a transfer from Greenfield to BSC
   */
  transferOut(msg: MsgTransferOut): Promise<TxResponse>;

  /**
   * cross-chain packages from BSC to Greenfield, used by relayers which run by validators
   */
  claims(msg: MsgClaim): Promise<TxResponse>;

  /**
   * gets the next send sequence for a channel
   */
  getChannelSendSequence(request: QuerySendSequenceRequest): Promise<QuerySendSequenceResponse>;

  /**
   * gets the next receive sequence for a channel
   */
  getChannelReceiveSequence(
    request: QueryReceiveSequenceRequest,
  ): Promise<QueryReceiveSequenceResponse>;

  /**
   * gets the in-turn relayer bls public key and its relay interval
   */
  getInturnRelayer(): Promise<QueryInturnRelayerResponse>;

  getCrosschainPackage(
    request: QueryCrossChainPackageRequest,
  ): Promise<QueryCrossChainPackageResponse>;

  /**
   * mirrors the group to BSC as NFT
   */
  mirrorGroup(msg: MsgMirrorGroup): Promise<TxResponse>;

  /**
   * mirrors the bucket to BSC as NFT
   */
  mirrorBucket(msg: MsgMirrorBucket): Promise<TxResponse>;

  /**
   * mirrors the object to BSC as NFT
   */
  mirrorObject(msg: MsgMirrorObject): Promise<TxResponse>;

  getParams(): Promise<QueryParamsResponse>;
}

@injectable()
export class CrossChain implements ICrossChain {
  constructor(@inject(delay(() => TxClient)) private txClient: TxClient) {}
  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);

  public async transferOut(msg: MsgTransferOut) {
    return await this.txClient.tx(
      MsgTransferOutTypeUrl,
      msg.from,
      MsgTransferOutSDKTypeEIP712,
      MsgTransferOut.toSDK(msg),
      MsgTransferOut.encode(msg).finish(),
    );
  }

  public async claims(msg: MsgClaim) {
    return await this.txClient.tx(
      MsgClaimTypeUrl,
      msg.fromAddress,
      MsgClaimSDKTypeEIP712,
      MsgClaim.toSDK(msg),
      MsgClaim.encode(msg).finish(),
    );
  }

  public async getChannelSendSequence(request: QuerySendSequenceRequest) {
    const rpc = await this.queryClient.getCrosschainQueryClient();
    return await rpc.SendSequence(request);
  }

  public async getChannelReceiveSequence(request: QueryReceiveSequenceRequest) {
    const rpc = await this.queryClient.getCrosschainQueryClient();
    return await rpc.ReceiveSequence(request);
  }

  public async getInturnRelayer() {
    const rpc = await this.queryClient.getOracleQueryClient();
    return await rpc.InturnRelayer();
  }

  public async getCrosschainPackage(request: QueryCrossChainPackageRequest) {
    const rpc = await this.queryClient.getCrosschainQueryClient();
    return await rpc.CrossChainPackage(request);
  }

  public async mirrorGroup(msg: MsgMirrorGroup) {
    return await this.txClient.tx(
      MsgMirrorGroupTypeUrl,
      msg.operator,
      MsgMirrorGroupSDKTypeEIP712,
      MsgMirrorGroup.toSDK(msg),
      MsgMirrorGroup.encode(msg).finish(),
    );
  }

  public async mirrorBucket(msg: MsgMirrorBucket) {
    return await this.txClient.tx(
      MsgMirrorBucketTypeUrl,
      msg.operator,
      MsgMirrorBucketSDKTypeEIP712,
      MsgMirrorBucket.toSDK(msg),
      MsgMirrorBucket.encode(msg).finish(),
    );
  }

  public async mirrorObject(msg: MsgMirrorObject) {
    return await this.txClient.tx(
      MsgMirrorObjectTypeUrl,
      msg.operator,
      MsgMirrorObjectSDKTypeEIP712,
      MsgMirrorObject.toSDK(msg),
      MsgMirrorObject.encode(msg).finish(),
    );
  }

  async getParams() {
    const rpc = await this.queryClient.getBridgeQueryClient();
    return rpc.Params();
  }
}
