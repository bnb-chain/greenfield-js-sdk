import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { MsgSend } from '@bnb-chain/greenfield-cosmos-types/cosmos/bank/v1beta1/tx';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import { TxBody, TxRaw } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { MsgSendSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/cosmos/bank/v1beta1/MsgSendSDKTypeEIP712';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { bufferToHex } from '@ethereumjs/util';
import { createEIP712, generateFee, generateMessage, generateTypes } from '../../messages';
import { sign712Tx } from '../../sign/signTx';
import { BaseTx, IBaseMsg, IRawTxInfo, ISendMsg } from '../baseTx';
import { typeWrapper } from '../utils';

export interface ITransferTxInfo {
  from: string;
  to: string;
  amount: string;
}

const TYPE_URL = '/cosmos.bank.v1beta1.MsgSend';
export class TransferTx extends BaseTx {
  readonly rpcUrl: string;
  readonly chainId: string;
  public readonly txType: string;

  constructor(rpcUrl: string, chainId: string) {
    super(rpcUrl, chainId, TYPE_URL);
    this.rpcUrl = rpcUrl;
    this.chainId = chainId;
    this.txType = TYPE_URL;
  }

  public async getRawTxInfo({
    sequence,
    sign,
    pubKey,
    from,
    to,
    amount,
    gasLimit,
    denom,
    gasPrice,
  }: Pick<
    ITransferTxInfo & IBaseMsg,
    'sequence' | 'from' | 'to' | 'amount' | 'gasLimit' | 'denom' | 'gasPrice'
  > & {
    sign: string;
  } & {
    pubKey: BaseAccount['pubKey'];
  }): Promise<IRawTxInfo> {
    const bodyBytes = this.getSimulateBytes({ from, to, amount, denom });
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
    to,
    amount,
    denom,
  }: Pick<ITransferTxInfo & IBaseMsg, 'from' | 'to' | 'amount' | 'denom'>): Uint8Array {
    const message = MsgSend.fromPartial({
      amount: [
        {
          amount,
          denom,
        },
      ],
      fromAddress: from,
      toAddress: to,
    });
    const messageBytes = MsgSend.encode(message).finish();

    const msgWrapped = Any.fromPartial({
      typeUrl: this.txType,
      value: messageBytes,
    });

    const txBody = TxBody.fromPartial({
      messages: [msgWrapped],
    });

    return TxBody.encode(txBody).finish();
  }

  public async signTx({
    from,
    to,
    sequence,
    accountNumber,
    amount,
    denom,
    gasLimit,
    gasPrice,
  }: IBaseMsg & ISendMsg) {
    const fee = generateFee(
      String(BigInt(gasLimit) * BigInt(gasPrice)),
      denom,
      String(gasLimit),
      from,
      '',
    );

    const msg = MsgSend.toSDK({
      amount: [
        {
          amount,
          denom,
        },
      ],
      fromAddress: from,
      toAddress: to,
    });

    const wrapperMsg = typeWrapper(TYPE_URL, msg);
    const types = generateTypes(MsgSendSDKTypeEIP712);
    const messages = generateMessage(
      accountNumber,
      sequence,
      this.chainId,
      '',
      fee,
      wrapperMsg,
      '0',
    );
    const eip712 = createEIP712(types, this.chainId, messages);
    return await sign712Tx(from, JSON.stringify(eip712));
  }

  public getAuthInfoBytes({
    sequence,
    pubKey,
    gasLimit,
    denom,
    gasPrice,
  }: Pick<IBaseMsg, 'denom' | 'sequence' | 'gasLimit' | 'gasPrice'> & {
    pubKey: BaseAccount['pubKey'];
  }) {
    if (!pubKey) throw new Error('pubKey is required');
    const feeAmount: Coin[] = [
      {
        denom,
        amount: String(BigInt(gasLimit) * BigInt(gasPrice)),
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
