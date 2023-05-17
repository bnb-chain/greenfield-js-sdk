import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import { TxBody, TxRaw } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { visibilityTypeFromJSON } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import { MsgCreateBucket } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { bytesFromBase64, Long } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { bufferToHex } from '@ethereumjs/util';
import { createEIP712, generateFee, generateMessage, generateTypes } from '../../../messages';
import {
  ICreateBucketMsg,
  newMsgCreateBucket,
  MsgCreateBucketSDKTypeEIP712,
} from '../../../messages/greenfield/storage/MsgCreateBucket';
import { sign712Tx } from '../../../sign';
import { IRawTxInfo } from '../../../tx';
import { BaseTx, IBaseMsg } from '../../baseTx';

export class CreateBucketTx extends BaseTx {
  readonly rpcUrl: string;
  readonly chainId: string;
  public readonly txType: string;

  constructor(rpcUrl: string, chainId: string) {
    super(rpcUrl, chainId, '/bnbchain.greenfield.storage.MsgCreateBucket');

    this.rpcUrl = rpcUrl;
    this.chainId = chainId;
    this.txType = '/bnbchain.greenfield.storage.MsgCreateBucket';
  }

  public async signTx({
    bucketName,
    from,
    sequence,
    primarySpAddress,
    denom,
    accountNumber,
    expiredHeight,
    chargedReadQuota,
    sig,
    visibility,
    gasLimit,
    gasPrice,
    paymentAddress,
  }: IBaseMsg & ICreateBucketMsg) {
    const fee = generateFee(
      String(BigInt(gasLimit) * BigInt(gasPrice)),
      denom,
      String(gasLimit),
      from,
      '',
    );

    const msg = newMsgCreateBucket({
      bucketName,
      from,
      expiredHeight,
      visibility,
      paymentAddress,
      primarySpAddress,
      chargedReadQuota,
      sig,
    });

    const types = generateTypes(MsgCreateBucketSDKTypeEIP712);
    const messages = generateMessage(accountNumber, sequence, this.chainId, '', fee, msg, '0');
    const eip712 = createEIP712(types, this.chainId, messages);

    return await sign712Tx(from, JSON.stringify(eip712));
  }

  public async getRawTxInfo({
    bucketName,
    from,
    sequence,
    primarySpAddress,
    denom,
    expiredHeight,
    sig,
    visibility,
    gasLimit,
    sign,
    pubKey,
    chargedReadQuota,
    gasPrice,
    paymentAddress,
  }: IBaseMsg &
    ICreateBucketMsg & {
      sign: string;
    } & {
      pubKey: BaseAccount['pubKey'];
    }): Promise<IRawTxInfo> {
    const bodyBytes = this.getSimulateBytes({
      primarySpAddress,
      from,
      denom,
      bucketName,
      expiredHeight,
      sig,
      visibility,
      chargedReadQuota,
      paymentAddress,
    });
    const authInfoBytes = this.getAuthInfoBytes({ sequence, pubKey, denom, gasLimit, gasPrice });
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

  public getAuthInfoBytes({
    sequence,
    pubKey,
    denom,
    gasLimit,
    gasPrice,
  }: Pick<IBaseMsg & ICreateBucketMsg, 'sequence' | 'denom' | 'gasLimit' | 'gasPrice'> & {
    pubKey: BaseAccount['pubKey'];
  }) {
    if (!pubKey) throw new Error('pubKey is required');

    const bigGasPrice = BigInt(gasPrice);
    const bigGasLimit = BigInt(gasLimit);

    const feeAmount: Coin[] = [
      {
        amount: String(bigGasPrice * bigGasLimit),
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

  public getSimulateBytes({
    from,
    bucketName,
    primarySpAddress,
    expiredHeight,
    sig,
    visibility,
    chargedReadQuota,
    paymentAddress,
  }: Pick<
    IBaseMsg & ICreateBucketMsg,
    | 'from'
    | 'denom'
    | 'bucketName'
    | 'primarySpAddress'
    | 'sig'
    | 'expiredHeight'
    | 'visibility'
    | 'chargedReadQuota'
    | 'paymentAddress'
  >) {
    const message = MsgCreateBucket.fromPartial({});
    message.bucketName = bucketName;
    message.chargedReadQuota = chargedReadQuota
      ? Long.fromNumber(0)
      : Long.fromNumber(chargedReadQuota);
    message.creator = from;
    message.visibility = visibilityTypeFromJSON(visibility);
    message.paymentAddress = paymentAddress;
    message.primarySpAddress = primarySpAddress;
    message.primarySpApproval = {
      expiredHeight: Long.fromString(expiredHeight),
      sig: bytesFromBase64(sig),
    };

    const messageBytes = MsgCreateBucket.encode(message).finish();
    const msgWrapped = Any.fromPartial({
      typeUrl: this.txType,
      value: messageBytes,
    });

    const txBody = TxBody.fromPartial({
      messages: [msgWrapped],
    });

    return TxBody.encode(txBody).finish();
  }
}
