import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import { TxBody, TxRaw } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { MsgDeleteBucket } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { bufferToHex } from '@ethereumjs/util';
import { createEIP712, generateFee, generateMessage, generateTypes } from '../../../messages';
import {
  newMsgDeleteBucket,
  MsgDeleteBucketSDKTypeEIP712,
  MsgDeleteBucketTypeUrl,
  type IDeleteBucketMsg,
} from '../../../messages/greenfield/storage/deleteBucket';
import { sign712Tx } from '../../../sign';
import { type IRawTxInfo } from '../../../tx';
import { BaseTx, type IBaseMsg } from '../../baseTx';

export class DelBucketTx extends BaseTx {
  readonly rpcUrl: string;
  readonly chainId: string;
  public readonly txType: string;

  constructor(rpcUrl: string, chainId: string) {
    super(rpcUrl, chainId, MsgDeleteBucketTypeUrl);

    this.rpcUrl = rpcUrl;
    this.chainId = chainId;
    this.txType = MsgDeleteBucketTypeUrl;
  }

  public async signTx({
    from,
    bucketName,
    accountNumber,
    sequence,
    gasLimit,
    denom,
    gasPrice,
  }: IBaseMsg & IDeleteBucketMsg) {
    const fee = generateFee(
      String(BigInt(gasLimit) * BigInt(gasPrice)),
      denom,
      String(gasLimit),
      from,
      '',
    );
    const msg = newMsgDeleteBucket({
      bucketName,
      from,
    });

    const types = generateTypes(MsgDeleteBucketSDKTypeEIP712);
    const messages = generateMessage(accountNumber, sequence, this.chainId, '', fee, msg, '0');
    const eip712 = createEIP712(types, this.chainId, messages);
    return await sign712Tx(from, JSON.stringify(eip712));
  }

  public async getRawTxInfo({
    bucketName,
    from,
    sequence,
    gasLimit,
    sign,
    pubKey,
    denom,
    gasPrice,
  }: IBaseMsg &
    IDeleteBucketMsg & {
      sign: string;
    } & {
      pubKey: BaseAccount['pubKey'];
    }): Promise<IRawTxInfo> {
    const bodyBytes = this.getSimulateBytes({
      from,
      bucketName,
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

  public getSimulateBytes({
    from,
    bucketName,
  }: Pick<IBaseMsg & IDeleteBucketMsg, 'from' | 'bucketName'>): Uint8Array {
    const message = MsgDeleteBucket.fromJSON({
      operator: from,
      bucketName,
    });
    const messageBytes = MsgDeleteBucket.encode(message).finish();
    const msgDemoWrapped = Any.fromPartial({
      typeUrl: this.txType,
      value: messageBytes,
    });

    const txBody = TxBody.fromPartial({
      messages: [msgDemoWrapped],
    });

    return TxBody.encode(txBody).finish();
  }

  public getAuthInfoBytes({
    sequence,
    pubKey,
    denom,
    gasLimit,
    gasPrice,
  }: Pick<IBaseMsg & IDeleteBucketMsg, 'denom' | 'sequence' | 'gasLimit' | 'gasPrice'> & {
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
