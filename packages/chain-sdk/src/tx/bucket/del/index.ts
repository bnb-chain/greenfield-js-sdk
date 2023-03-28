import { createEIP712, generateFee, generateMessage, generateTypes } from '@/messages';
import {
  IDeleteBucketMsg,
  newMsgDeleteBucket,
  TYPES,
} from '@/messages/greenfield/storage/deleteBucket';
import { sign712Tx } from '@/sign';
import { IRawTxInfo } from '@/tx';
import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import { TxBody, TxRaw } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { MsgDeleteBucket } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { bufferToHex } from '@ethereumjs/util';
import { BaseTx, IBaseMsg } from '../../baseTx';

const TYPE_URL = '/bnbchain.greenfield.storage.MsgDeleteBucket';

export class DelBucketTx extends BaseTx {
  readonly rpcUrl: string;
  readonly chainId: string;
  public readonly txType: string;

  constructor(rpcUrl: string, chainId: string) {
    super(rpcUrl, chainId, TYPE_URL);

    this.rpcUrl = rpcUrl;
    this.chainId = chainId;
    this.txType = TYPE_URL;
  }

  public async signTx({
    from,
    bucketName,
    accountNumber,
    sequence,
    gasLimit,
    denom,
  }: IBaseMsg & IDeleteBucketMsg) {
    const fee = generateFee(String(gasLimit * 1e9), denom, String(gasLimit), from, '');
    const msg = newMsgDeleteBucket({
      bucketName,
      from,
    });

    const types = generateTypes(TYPES);
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
    const authInfoBytes = this.getAuthInfoBytes({ denom, sequence, pubKey, from, gasLimit });
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

  private getAuthInfoBytes({
    sequence,
    pubKey,
    from,
    denom,
    gasLimit,
  }: Pick<IBaseMsg & IDeleteBucketMsg, 'denom' | 'sequence' | 'from' | 'gasLimit'> & {
    pubKey: BaseAccount['pubKey'];
  }) {
    if (!pubKey) throw new Error('pubKey is required');

    const feeAmount: Coin[] = [
      {
        amount: String(1e9 * gasLimit),
        denom,
      },
    ];
    const feeGranter = undefined;
    const feePayer = from;
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
