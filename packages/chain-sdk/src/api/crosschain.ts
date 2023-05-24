import { MsgClaimSDKTypeEIP712 } from '@/messages/cosmos/oracle/MsgClaim';
import {
  MsgTransferOutSDKTypeEIP712,
  MsgTransferOutTypeUrl,
} from '@/messages/greenfield/bridge/MsgTransferOut';
import { MsgMirrorBucketSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgMirrorBucket';
import { MsgMirrorGroupSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgMirrorGroup';
import { MsgMirrorObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgMirrorObject';
import {
  QueryCrossChainPackageResponse,
  QueryReceiveSequenceResponse,
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
import Long from 'long';
import { container, singleton } from 'tsyringe';
import { TxResponse } from '..';
import { Basic } from './basic';
import { RpcQueryClient } from './queryclient';

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
  getChannelSendSequence(channelId: number): Promise<QuerySendSequenceResponse>;

  /**
   * gets the next receive sequence for a channel
   */
  getChannelReceiveSequence(channelId: number): Promise<QueryReceiveSequenceResponse>;

  /**
   * gets the in-turn relayer bls public key and its relay interval
   */
  getInturnRelayer(): Promise<QueryInturnRelayerResponse>;

  getCrosschainPackage(
    channelId: number,
    sequence: number,
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

@singleton()
export class CrossChain implements ICrossChain {
  private basic: Basic = container.resolve(Basic);
  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);

  public async transferOut(msg: MsgTransferOut) {
    return await this.basic.tx(
      MsgTransferOutTypeUrl,
      msg.from,
      MsgTransferOutSDKTypeEIP712,
      MsgTransferOut.toSDK(msg),
      MsgTransferOut.encode(msg).finish(),
    );
  }

  public async claims(msg: MsgClaim) {
    return await this.basic.tx(
      '/cosmos.oracle.v1.MsgClaim',
      msg.fromAddress,
      MsgClaimSDKTypeEIP712,
      MsgClaim.toSDK(msg),
      MsgClaim.encode(msg).finish(),
    );
  }

  public async getChannelSendSequence(channelId: number) {
    const rpc = await this.queryClient.getCrosschainQueryClient();
    return await rpc.SendSequence({
      channelId,
    });
  }

  public async getChannelReceiveSequence(channelId: number) {
    const rpc = await this.queryClient.getCrosschainQueryClient();
    return await rpc.ReceiveSequence({
      channelId,
    });
  }

  public async getInturnRelayer() {
    const rpc = await this.queryClient.getOracleQueryClient();
    return await rpc.InturnRelayer();
  }

  public async getCrosschainPackage(channelId: number, sequence: number) {
    const rpc = await this.queryClient.getCrosschainQueryClient();
    return await rpc.CrossChainPackage({
      channelId,
      sequence: Long.fromNumber(sequence),
    });
  }

  public async mirrorGroup(msg: MsgMirrorGroup) {
    return await this.basic.tx(
      '/greenfield.storage.MsgMirrorGroup',
      msg.operator,
      MsgMirrorGroupSDKTypeEIP712,
      MsgMirrorGroup.toSDK(msg),
      MsgMirrorGroup.encode(msg).finish(),
    );
  }

  public async mirrorBucket(msg: MsgMirrorBucket) {
    return await this.basic.tx(
      '/greenfield.storage.MsgMirrorBucket',
      msg.operator,
      MsgMirrorBucketSDKTypeEIP712,
      MsgMirrorBucket.toSDK(msg),
      MsgMirrorBucket.encode(msg).finish(),
    );
  }

  public async mirrorObject(msg: MsgMirrorObject) {
    return await this.basic.tx(
      '/greenfield.storage.MsgMirrorObject',
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
