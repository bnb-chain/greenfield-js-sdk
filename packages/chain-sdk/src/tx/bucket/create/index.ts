import { createEIP712, generateFee, generateMessage, generateTypes } from '@/messages';
import {
  ICreateBucketMsg,
  newMsgCreateBucket,
  TYPES,
} from '@/messages/greenfield/storage/createBucket';
import { IRawTxInfo } from '@/tx';
import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import { TxBody, TxRaw } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { MsgCreateBucket } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { bufferToHex } from '@ethereumjs/util';
import { sign712Tx } from '../../../sign';
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
    readQuota,
    sig,
    isPublic,
    gasLimit,
  }: IBaseMsg & ICreateBucketMsg) {
    const fee = generateFee(String(gasLimit * 1e9), denom, String(gasLimit), from, '');
    const msg = newMsgCreateBucket({
      bucketName,
      from,
      expiredHeight,
      isPublic,
      paymentAddress: '',
      primarySpAddress,
      readQuota,
      sig,
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
    primarySpAddress,
    denom,
    expiredHeight,
    sig,
    isPublic,
    gasLimit,
    sign,
    pubKey,
    readQuota,
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
      isPublic,
      readQuota,
    });
    const authInfoBytes = this.getAuthInfoBytes({ sequence, pubKey, denom, gasLimit });
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

  private getAuthInfoBytes({
    sequence,
    pubKey,
    denom,
    gasLimit,
  }: Pick<IBaseMsg & ICreateBucketMsg, 'sequence' | 'denom' | 'gasLimit'> & {
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
    isPublic,
    readQuota,
  }: Pick<
    IBaseMsg & ICreateBucketMsg,
    | 'from'
    | 'denom'
    | 'bucketName'
    | 'primarySpAddress'
    | 'sig'
    | 'expiredHeight'
    | 'isPublic'
    | 'readQuota'
  >) {
    const payload = {
      bucketName,
      creator: from,
      isPublic,
      primarySpAddress,
      readQuota,
      primarySpApproval: {
        expiredHeight,
        sig,
      },
    };
    const message = MsgCreateBucket.fromJSON(payload);
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
