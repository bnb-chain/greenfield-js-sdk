import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import { TxBody, TxRaw } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import {
  redundancyTypeFromJSON,
  visibilityTypeFromJSON,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import { MsgCreateObject } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { bytesFromBase64, Long } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { bufferToHex } from '@ethereumjs/util';
import { createEIP712, generateFee, generateMessage, generateTypes } from '../../../messages';
import {
  ICreateObjectMsg,
  newMsgCreateObject,
  MsgCreateObjectSDKTypeEIP712,
} from '../../../messages/greenfield/storage/MsgCreateObject';
import { sign712Tx } from '../../../sign';
import { IRawTxInfo } from '../../../tx';
import { BaseTx, IBaseMsg } from '../../baseTx';

export class CreateObjectTx extends BaseTx {
  readonly rpcUrl: string;
  readonly chainId: string;
  public readonly txType: string;

  constructor(rpcUrl: string, chainId: string) {
    super(rpcUrl, chainId, '/bnbchain.greenfield.storage.MsgCreateObject');

    this.rpcUrl = rpcUrl;
    this.chainId = chainId;
    this.txType = '/bnbchain.greenfield.storage.MsgCreateObject';
  }

  public async signTx(params: IBaseMsg & ICreateObjectMsg) {
    const {
      accountNumber,
      bucketName,
      contentType,
      denom,
      expectChecksums,
      expectSecondarySpAddresses,
      expiredHeight,
      from,
      gasLimit,
      objectName,
      payloadSize,
      redundancyType,
      sequence,
      sig,
      visibility,
      gasPrice,
    } = params;
    const fee = generateFee(
      String(BigInt(gasLimit) * BigInt(gasPrice)),
      denom,
      String(gasLimit),
      from,
      '',
    );
    const msg = newMsgCreateObject({
      bucketName,
      contentType,
      expectChecksums,
      expectSecondarySpAddresses,
      expiredHeight,
      from,
      objectName,
      payloadSize,
      redundancyType,
      sig,
      visibility,
    });

    const types = generateTypes(MsgCreateObjectSDKTypeEIP712);
    const messages = generateMessage(accountNumber, sequence, this.chainId, '', fee, msg, '0');
    const eip712 = createEIP712(types, this.chainId, messages);
    return await sign712Tx(from, JSON.stringify(eip712));
  }

  public async getRawTxInfo({
    bucketName,
    contentType,
    denom,
    expectChecksums,
    expectSecondarySpAddresses,
    expiredHeight,
    from,
    gasLimit,
    objectName,
    payloadSize,
    pubKey,
    redundancyType,
    sequence,
    sig,
    sign,
    visibility,
    gasPrice,
  }: IBaseMsg &
    ICreateObjectMsg & {
      sign: string;
    } & {
      pubKey: BaseAccount['pubKey'];
    }): Promise<IRawTxInfo> {
    const bodyBytes = this.getSimulateBytes({
      from,
      bucketName,
      expiredHeight,
      sig,
      visibility,
      contentType,
      expectChecksums,
      objectName,
      payloadSize,
      expectSecondarySpAddresses,
      redundancyType,
    });
    const authInfoBytes = this.getAuthInfoBytes({ denom, sequence, pubKey, gasLimit, gasPrice });
    const signtureFromWallet = this.getSignture(sign);

    const txRaw = TxRaw.fromPartial({
      bodyBytes,
      authInfoBytes,
      signatures: [signtureFromWallet],
    });

    const txRawBytes = TxRaw.encode(txRaw).finish();

    return {
      bytes: txRawBytes,
      hex: bufferToHex(Buffer.from(txRawBytes)),
    };
  }

  public getSimulateBytes(params: ICreateObjectMsg): Uint8Array {
    const {
      from,
      bucketName,
      objectName,
      contentType,
      visibility,
      payloadSize,
      expiredHeight,
      sig,
      expectChecksums,
      expectSecondarySpAddresses,
      redundancyType,
    } = params;

    const message = MsgCreateObject.fromPartial({
      bucketName,
      objectName,
      contentType,
      payloadSize,
      creator: from,
      expectSecondarySpAddresses,
    });

    message.visibility =
      visibility === undefined ? visibilityTypeFromJSON(0) : visibilityTypeFromJSON(visibility);
    message.redundancyType =
      redundancyType === undefined
        ? redundancyTypeFromJSON(0)
        : redundancyTypeFromJSON(redundancyType);
    message.primarySpApproval = {
      expiredHeight: Long.fromString(expiredHeight),
      sig: bytesFromBase64(sig),
    };
    message.expectChecksums = expectChecksums.map((e: string) => bytesFromBase64(e));

    const messageBytes = MsgCreateObject.encode(message).finish();
    const msgWrapped = Any.fromPartial({
      typeUrl: this.txType,
      value: messageBytes,
    });

    const txBody = TxBody.fromPartial({
      messages: [msgWrapped],
    });

    return TxBody.encode(txBody).finish();
  }

  public getAuthInfoBytes({
    sequence,
    pubKey,
    gasLimit,
    denom,
    gasPrice,
  }: Pick<IBaseMsg & ICreateObjectMsg, 'denom' | 'sequence' | 'gasLimit' | 'gasPrice'> & {
    pubKey: BaseAccount['pubKey'];
  }) {
    if (!pubKey) throw new Error('pubKey is required');

    const feeAmount: Coin[] = [
      {
        amount: String(BigInt(gasLimit) * BigInt(gasPrice)),
        denom,
      },
    ];
    const feeGranter = undefined;
    const feePayer = undefined;
    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey: pubKey, sequence: Number(sequence) }],
      feeAmount,
      gasLimit,
      feeGranter,
      feePayer,
      712,
    );

    return authInfoBytes;
  }
}
