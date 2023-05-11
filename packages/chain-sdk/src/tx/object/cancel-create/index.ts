import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import { TxBody, TxRaw } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { MsgCancelCreateObject } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { bufferToHex } from '@ethereumjs/util';
import { createEIP712, generateFee, generateMessage, generateTypes } from '../../../messages';
import {
  ICancelCreateObjectMsg,
  newMsgCancelCreateObject,
  MsgCancelCreateObjectSDKTypeEIP712,
} from '../../../messages/greenfield/storage/cancelCreateObject';
import { sign712Tx } from '../../../sign';
import { IRawTxInfo } from '../../../tx';
import { BaseTx, IBaseMsg } from '../../baseTx';

export class CancelCreateObjectTx extends BaseTx {
  readonly rpcUrl: string;
  readonly chainId: string;
  public readonly txType: string;

  constructor(rpcUrl: string, chainId: string) {
    super(rpcUrl, chainId, '/bnbchain.greenfield.storage.MsgCancelCreateObject');

    this.rpcUrl = rpcUrl;
    this.chainId = chainId;
    this.txType = '/bnbchain.greenfield.storage.MsgCancelCreateObject';
  }

  public async signTx(params: IBaseMsg & ICancelCreateObjectMsg) {
    const { accountNumber, bucketName, denom, gasLimit, objectName, sequence, from } = params;
    const fee = generateFee(String(gasLimit * 1e9), denom, String(gasLimit), from, '');
    const msg = newMsgCancelCreateObject({
      bucketName,
      objectName,
      from,
    });
    const types = generateTypes(MsgCancelCreateObjectSDKTypeEIP712);
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
    objectName,
    denom,
    gasPrice,
  }: IBaseMsg &
    ICancelCreateObjectMsg & {
      sign: string;
    } & {
      pubKey: BaseAccount['pubKey'];
    }): Promise<IRawTxInfo> {
    const bodyBytes = this.getSimulateBytes({
      from,
      bucketName,
      objectName,
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

  public getSimulateBytes(params: ICancelCreateObjectMsg): Uint8Array {
    const { from, bucketName, objectName } = params;

    const message = MsgCancelCreateObject.fromJSON({
      operator: from,
      bucketName,
      objectName,
    });

    const messageBytes = MsgCancelCreateObject.encode(message).finish();
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
  }: Pick<IBaseMsg & ICancelCreateObjectMsg, 'denom' | 'sequence' | 'gasLimit' | 'gasPrice'> & {
    pubKey: BaseAccount['pubKey'];
  }) {
    if (!pubKey) throw new Error('pubKey is required');

    const feeAmount: Coin[] = [
      {
        amount: String(BigInt(gasPrice) * BigInt(gasLimit)),
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
