import {
  QueryClientImpl as CrosschainQueryClientImpl,
  QueryCrossChainPackageResponse,
  QueryReceiveSequenceResponse,
  QuerySendSequenceResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/crosschain/v1/query';
import {
  QueryClientImpl as OracleQueryClientImpl,
  QueryInturnRelayerResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/oracle/v1/query';
import { MsgClaim } from '@bnb-chain/greenfield-cosmos-types/cosmos/oracle/v1/tx';
import { SimulateResponse } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/service';
import { MsgClaimSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/cosmos/oracle/v1/MsgClaimSDKTypeEIP712';
import { MsgTransferOutSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/bridge/MsgTransferOutSDKTypeEIP712';
import { MsgMirrorBucketSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgMirrorBucketSDKTypeEIP712';
import { MsgMirrorGroupSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgMirrorGroupSDKTypeEIP712';
import { MsgMirrorObjectSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgMirrorObjectSDKTypeEIP712';
import { MsgTransferOut } from '@bnb-chain/greenfield-cosmos-types/greenfield/bridge/tx';
import {
  MsgMirrorBucket,
  MsgMirrorGroup,
  MsgMirrorObject,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { DeliverTxResponse } from '@cosmjs/stargate';
import Long from 'long';
import { Account } from './account';
import { ITxOption } from './basic';

export interface ICrossChain {
  /**
   * makes a transfer from Greenfield to BSC
   */
  transferOut(
    msg: MsgTransferOut,
    txOption: ITxOption,
  ): Promise<SimulateResponse | DeliverTxResponse>;

  /**
   * cross-chain packages from BSC to Greenfield, used by relayers which run by validators
   */
  claims(msg: MsgClaim, txOption: ITxOption): Promise<SimulateResponse | DeliverTxResponse>;

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
  mirrorGroup(
    msg: MsgMirrorGroup,
    txOption: ITxOption,
  ): Promise<SimulateResponse | DeliverTxResponse>;

  /**
   * mirrors the bucket to BSC as NFT
   */
  mirrorBucket(
    msg: MsgMirrorBucket,
    txOption: ITxOption,
  ): Promise<SimulateResponse | DeliverTxResponse>;

  /**
   * mirrors the object to BSC as NFT
   */
  mirrorObject(
    msg: MsgMirrorObject,
    txOption: ITxOption,
  ): Promise<SimulateResponse | DeliverTxResponse>;
}

export class CrossChain extends Account implements ICrossChain {
  public async transferOut(msg: MsgTransferOut, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.bridge.MsgTransferOut';
    const msgBytes = MsgTransferOut.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.from);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgTransferOutSDKTypeEIP712,
      MsgTransferOut.toSDK(msg),
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

  public async claims(msg: MsgClaim, txOption: ITxOption) {
    const typeUrl = '/cosmos.oracle.v1.MsgClaim';
    const msgBytes = MsgClaim.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.fromAddress);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgClaimSDKTypeEIP712,
      MsgClaim.toSDK(msg),
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

  public async getChannelSendSequence(channelId: number) {
    const rpcClient = await this.getRpcClient();
    const rpc = new CrosschainQueryClientImpl(rpcClient);
    return await rpc.SendSequence({
      channelId,
    });
  }

  public async getChannelReceiveSequence(channelId: number) {
    const rpcClient = await this.getRpcClient();
    const rpc = new CrosschainQueryClientImpl(rpcClient);
    return await rpc.ReceiveSequence({
      channelId,
    });
  }

  public async getInturnRelayer() {
    const rpcClient = await this.getRpcClient();
    const rpc = new OracleQueryClientImpl(rpcClient);
    return await rpc.InturnRelayer();
  }

  public async getCrosschainPackage(channelId: number, sequence: number) {
    const rpcClient = await this.getRpcClient();
    const rpc = new CrosschainQueryClientImpl(rpcClient);
    return await rpc.CrossChainPackage({
      channelId,
      sequence: Long.fromNumber(sequence),
    });
  }

  public async mirrorGroup(msg: MsgMirrorGroup, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgMirrorGroup';
    const msgBytes = MsgMirrorGroup.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.operator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgMirrorGroupSDKTypeEIP712,
      MsgMirrorGroup.toSDK(msg),
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

  public async mirrorBucket(msg: MsgMirrorBucket, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgMirrorBucket';
    const msgBytes = MsgMirrorBucket.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.operator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgMirrorBucketSDKTypeEIP712,
      MsgMirrorBucket.toSDK(msg),
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

  public async mirrorObject(msg: MsgMirrorObject, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgMirrorObject';
    const msgBytes = MsgMirrorObject.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.operator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgMirrorObjectSDKTypeEIP712,
      MsgMirrorObject.toSDK(msg),
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
}
