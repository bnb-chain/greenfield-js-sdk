import { createEIP712, generateFee, generateMessage, generateTypes } from '@/messages';
import { newMsgSend, TYPES } from '@/messages/bank/send';
import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { MsgSend } from '@bnb-chain/greenfield-cosmos-types/cosmos/bank/v1beta1/tx';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import { TxBody, TxRaw } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { bufferToHex } from '@ethereumjs/util';
import { sign712Tx } from '../../sign/signTx';
import { BaseTx, IBaseMsg, IRawTxInfo, ISendMsg } from '../baseTx';

export interface ITransferTxInfo {
  from: string;
  to: string;
  amount: string;
}

export class TransferTx extends BaseTx {
  readonly rpcUrl: string;
  readonly chainId: string;
  public readonly txType: string;

  constructor(rpcUrl: string, chainId: string) {
    super(rpcUrl, chainId, '/cosmos.bank.v1beta1.MsgSend');
    this.rpcUrl = rpcUrl;
    this.chainId = chainId;
    this.txType = '/cosmos.bank.v1beta1.MsgSend';
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
  }: Pick<
    ITransferTxInfo & IBaseMsg,
    'sequence' | 'from' | 'to' | 'amount' | 'gasLimit' | 'denom'
  > & {
    sign: string;
  } & {
    pubKey: BaseAccount['pubKey'];
  }): Promise<IRawTxInfo> {
    const bodyBytes = this.getSimulateBytes({ from, to, amount, denom });
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
  }: IBaseMsg & ISendMsg) {
    const fee = generateFee(String(gasLimit * 1e9), denom, String(gasLimit), from, '');
    const msg = newMsgSend(amount, denom, from, to);

    const types = generateTypes(TYPES);
    const messages = generateMessage(accountNumber, sequence, this.chainId, '', fee, msg, '0');
    const eip712 = createEIP712(types, this.chainId, messages);
    return await sign712Tx(from, JSON.stringify(eip712));
  }

  private getAuthInfoBytes({
    sequence,
    pubKey,
    from,
    gasLimit,
    denom,
  }: Pick<ITransferTxInfo & IBaseMsg, 'denom' | 'sequence' | 'from' | 'gasLimit'> & {
    pubKey: BaseAccount['pubKey'];
  }) {
    if (!pubKey) throw new Error('pubKey is required');
    const feeAmount: Coin[] = [
      {
        denom,
        amount: String(gasLimit * 1e9),
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
