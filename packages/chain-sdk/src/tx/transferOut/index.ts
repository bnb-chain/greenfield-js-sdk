import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import { TxBody, TxRaw } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { MsgTransferOutSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/bridge/MsgTransferOutSDKTypeEIP712';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import {
  QueryClientImpl,
  QueryParamsRequest,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/bridge/query';
import { MsgTransferOut } from '@bnb-chain/greenfield-cosmos-types/greenfield/bridge/tx';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { bufferToHex } from '@ethereumjs/util';
import { makeRpcClient } from '../../client';
import { createEIP712, generateFee, generateMessage, generateTypes } from '../../messages';
import { sign712Tx } from '../../sign/signTx';
import { BaseTx, IBaseMsg, IRawTxInfo, ISendMsg } from '../baseTx';
import { typeWrapper } from '../utils';

export const TYPE_URL = '/bnbchain.greenfield.bridge.MsgTransferOut';

export class TransferOutTx extends BaseTx {
  readonly rpcUrl: string;
  readonly chainId: string;
  readonly txType: string;

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
    denom,
    gasLimit,
    gasPrice,
  }: Pick<
    ISendMsg & IBaseMsg,
    'sequence' | 'from' | 'to' | 'amount' | 'denom' | 'gasLimit' | 'gasPrice'
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
  }: Pick<ISendMsg & IBaseMsg, 'from' | 'to' | 'amount' | 'denom'>): Uint8Array {
    const payload = {
      from,
      to,
      amount: {
        amount,
        denom,
      },
    };
    const message = MsgTransferOut.fromJSON(payload);
    const messageBytes = MsgTransferOut.encode(message).finish();

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
  }: Pick<ISendMsg & IBaseMsg, 'denom' | 'sequence' | 'gasLimit' | 'gasPrice'> & {
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

  public async signTx({
    from,
    to,
    sequence,
    accountNumber,
    amount,
    denom,
    gasLimit,
    gasPrice,
  }: ISendMsg & IBaseMsg) {
    const fee = generateFee(
      String(BigInt(gasLimit) * BigInt(gasPrice)),
      denom,
      String(gasLimit),
      from,
      '',
    );
    // const msg = newMsgTransferOut(amount, denom, from, to);
    const msg = MsgTransferOut.fromSDK({
      from,
      to,
      amount: {
        amount,
        denom,
      },
    });

    const wrappedMsg = typeWrapper(TYPE_URL, msg);

    const types = generateTypes(MsgTransferOutSDKTypeEIP712);
    const messages = generateMessage(
      accountNumber,
      sequence,
      this.chainId,
      '',
      fee,
      wrappedMsg,
      '0',
    );
    const eip712 = createEIP712(types, this.chainId, messages);
    return await sign712Tx(from, JSON.stringify(eip712));
  }

  public async simulateRelayFee() {
    const rpcClient = await makeRpcClient(this.rpcUrl);
    const rpc = new QueryClientImpl(rpcClient);
    const data = QueryParamsRequest.encode({}).finish();
    return rpc.Params(data);
  }
}
