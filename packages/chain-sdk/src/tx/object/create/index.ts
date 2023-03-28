import { createEIP712, generateFee, generateMessage, generateTypes } from '@/messages';
import {
  ICreateObjectMsg,
  newMsgCreateObject,
  TYPES,
} from '@/messages/greenfield/storage/createObject';
import { sign712Tx } from '@/sign';
import { IRawTxInfo } from '@/tx';
import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import { TxBody, TxRaw } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { MsgCreateObject } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { bufferToHex } from '@ethereumjs/util';
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
      isPublic,
      objectName,
      payloadSize,
      redundancyType,
      sequence,
      sig,
    } = params;
    const fee = generateFee(String(gasLimit * 1e9), denom, String(gasLimit), from, '');
    const msg = newMsgCreateObject({
      bucketName,
      contentType,
      expectChecksums,
      expiredHeight,
      from,
      isPublic,
      objectName,
      payloadSize,
      sig,
      expectSecondarySpAddresses,
      redundancyType,
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
    expiredHeight,
    sig,
    isPublic,
    gasLimit,
    sign,
    pubKey,
    contentType,
    expectChecksums,
    objectName,
    payloadSize,
    redundancyType,
    expectSecondarySpAddresses,
    denom,
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
      isPublic,
      contentType,
      expectChecksums,
      objectName,
      payloadSize,
      expectSecondarySpAddresses,
      redundancyType,
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

  public getSimulateBytes(params: ICreateObjectMsg): Uint8Array {
    const {
      from,
      bucketName,
      objectName,
      contentType,
      isPublic,
      payloadSize,
      expiredHeight,
      sig,
      expectChecksums,
      expectSecondarySpAddresses,
      redundancyType,
    } = params;

    const message = MsgCreateObject.fromJSON({
      creator: from,
      bucketName,
      objectName,
      contentType,
      isPublic,
      payloadSize,
      primarySpApproval: {
        expiredHeight,
        sig,
      },
      expectChecksums,
      expectSecondarySpAddresses,
      redundancyType,
    });

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

  private getAuthInfoBytes({
    sequence,
    pubKey,
    gasLimit,
    denom,
  }: Pick<IBaseMsg & ICreateObjectMsg, 'denom' | 'sequence' | 'from' | 'gasLimit'> & {
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
}
