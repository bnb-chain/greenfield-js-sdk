import { Account } from '@/api/account';
import { getPubKeyByPriKey } from '@/keymanage';
import { defaultSignTypedData } from '@/sign/signTx';
import { getGasFeeBySimulate } from '@/utils/units';
import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import {
  ServiceClientImpl,
  SimulateRequest,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/service';
import {
  AuthInfo,
  Tx,
  TxBody,
  TxRaw,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { DeliverTxResponse, StargateClient } from '@cosmjs/stargate';
import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { arrayify, hexlify } from '@ethersproject/bytes';
import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { container, inject, injectable } from 'tsyringe';
import {
  BroadcastOptions,
  CustomTx,
  ISimulateGasFee,
  MetaTxInfo,
  SignOptions,
  SimulateOptions,
  TxResponse,
} from '..';
import { RpcQueryClient } from './queryclient';
import { DEFAULT_DENOM, ZERO_PUBKEY } from '../constants';
import {
  createEIP712,
  generateFee,
  generateMessage,
  generateTypes,
  mergeMultiEip712,
  mergeMultiMessage,
} from '../messages';
import { convertAnyTypeData, findAnyType, generateMsg } from '../messages/utils';
import { eip712Hash, makeCosmsPubKey, recoverPk } from '../sign';

export interface ITxClient {
  /**
   * simulates a transaction containing the provided messages on the chain.
    The function returns a pointer to a ISimulateGasFee
   */
  simulateRawTx(
    txBodyBytes: Uint8Array,
    accountInfo: BaseAccount,
    txOption: SimulateOptions,
  ): Promise<ISimulateGasFee>;

  /**
   * broadcasts a transaction containing the provided messages to the chain.
    The function returns a pointer to a BroadcastTxResponse and any error that occurred during the operation.
   */
  broadcastRawTx(txRawBytes: Uint8Array): Promise<DeliverTxResponse>;

  tx(
    typeUrl: MetaTxInfo['typeUrl'],
    address: MetaTxInfo['address'],
    MsgSDKTypeEIP712: MetaTxInfo['MsgSDKTypeEIP712'],
    MsgSDK: MetaTxInfo['MsgSDK'],
    msgBytes: MetaTxInfo['msgBytes'],
  ): Promise<TxResponse>;

  txRaw({
    address,
    txRawHex,
    eip712MsgType,
    msgData,
  }: CustomTx): Promise<Omit<TxResponse, 'metaTxInfo'>>;

  /**
   *
   */
  multiTx(txResList: Pick<TxResponse, 'metaTxInfo'>[]): Promise<Omit<TxResponse, 'metaTxInfo'>>;
}

@injectable()
export class TxClient implements ITxClient {
  public rpcUrl: string;
  public chainId: string;
  constructor(@inject('RPC_URL') rpcUrl: string, @inject('CHAIN_ID') chainId: string) {
    this.rpcUrl = rpcUrl;
    this.chainId = chainId;
  }

  private account: Account = container.resolve(Account);
  private rpcQueryClient = container.resolve(RpcQueryClient);

  public async tx(
    typeUrl: MetaTxInfo['typeUrl'],
    address: MetaTxInfo['address'],
    MsgSDKTypeEIP712: MetaTxInfo['MsgSDKTypeEIP712'],
    MsgSDK: MetaTxInfo['MsgSDK'],
    msgBytes: MetaTxInfo['msgBytes'],
  ) {
    const txBodyBytes = this.getBodyBytes([
      {
        typeUrl,
        msgBytes,
      },
    ]);

    const tx = await this.multiTx([
      {
        metaTxInfo: {
          typeUrl,
          address,
          MsgSDKTypeEIP712,
          MsgSDK,
          msgBytes,
          bodyBytes: txBodyBytes,
        },
      },
    ]);

    return {
      simulate: tx.simulate,
      broadcast: tx.broadcast,
      metaTxInfo: {
        typeUrl,
        address,
        MsgSDKTypeEIP712,
        MsgSDK,
        msgBytes,
        bodyBytes: txBodyBytes,
      },
    };
  }

  public async txRaw({
    address,
    txRawHex,
    eip712MsgType,
    msgData,
  }: CustomTx): Promise<Omit<TxResponse, 'metaTxInfo'>> {
    const accountInfo = await this.account.getAccount(address);
    const txRawBytes = arrayify(txRawHex);
    const txRawData = TxRaw.decode(txRawBytes);

    return {
      simulate: async (opts: SimulateOptions) => {
        return await this.simulateRawTx(txRawData.bodyBytes, accountInfo, opts);
      },
      broadcast: async (opts: BroadcastOptions) => {
        const {
          denom,
          gasLimit,
          gasPrice,
          payer,
          granter,
          privateKey,
          signTypedDataCallback = defaultSignTypedData,
        } = opts;

        const fee = generateFee(
          String(BigInt(gasLimit) * BigInt(gasPrice)),
          denom,
          String(gasLimit),
          payer,
          granter,
        );
        // console.log('eip712MsgType', eip712MsgType);
        const wrapperTypes = generateTypes(eip712MsgType);

        // find type any and convert
        const anyFields = findAnyType(msgData);
        // console.log('anyFields', anyFields);
        const convertedMsg = convertAnyTypeData(msgData, anyFields);

        const messages = generateMessage(
          accountInfo.accountNumber.toString(),
          accountInfo.sequence.toString(),
          this.chainId,
          '',
          fee,
          convertedMsg,
          '0',
        );

        const eip712 = createEIP712(wrapperTypes, this.chainId, messages);
        // console.log('eip712', eip712);
        const { pubKey, signature } = privateKey
          ? this.getSignByPriKey(eip712, privateKey)
          : await this.getSignByWallet(eip712, accountInfo.address, signTypedDataCallback);

        const authInfoBytes = this.getAuthInfoBytes({
          denom,
          sequence: accountInfo.sequence + '',
          gasLimit,
          gasPrice,
          pubKey,
          granter,
          payer,
        });

        const txRaw = TxRaw.fromPartial({
          bodyBytes: txRawData.bodyBytes,
          authInfoBytes,
          signatures: [arrayify(signature)],
        });
        const txBytes = TxRaw.encode(txRaw).finish();

        // console.log('txBytes', hexlify(txBytes));
        return await this.broadcastRawTx(txBytes);
      },
    };
  }

  private getBodyBytes(params: { typeUrl: string; msgBytes: Uint8Array }[]) {
    const multiMsgBytes = params.map((tx) => {
      return generateMsg(tx.typeUrl, tx.msgBytes);
    });

    const txBody = TxBody.fromPartial({
      messages: multiMsgBytes,
    });
    const txBodyBytes = TxBody.encode(txBody).finish();
    return txBodyBytes;
  }

  private getSignByPriKey(
    eip712: ReturnType<typeof createEIP712>,
    privateKey: SignOptions['privateKey'],
  ) {
    const pubKey = getPubKeyByPriKey(privateKey);
    const signature = signTypedData({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data: eip712,
      version: SignTypedDataVersion.V4,
      privateKey: Buffer.from(arrayify(privateKey)),
    });

    return {
      pubKey,
      signature,
    };
  }

  private async getSignByWallet(
    eip712: ReturnType<typeof createEIP712>,
    address: string,
    signTypedDataCallback: SignOptions['signTypedDataCallback'],
  ) {
    const signature = await signTypedDataCallback(address, JSON.stringify(eip712));
    const messageHash = eip712Hash(JSON.stringify(eip712));
    // console.log('eip712 hash', hexlify(messageHash));

    const pk = recoverPk({
      signature,
      messageHash,
    });
    const pubKey = makeCosmsPubKey(pk);

    return {
      pubKey,
      signature,
    };
  }

  private getAuthInfoBytes(
    params: Pick<BroadcastOptions, 'denom' | 'gasLimit' | 'gasPrice' | 'granter' | 'payer'> & {
      pubKey: BaseAccount['pubKey'];
      sequence: string;
    },
  ) {
    const { pubKey, denom = DEFAULT_DENOM, sequence, gasLimit, gasPrice, granter, payer } = params;
    if (!pubKey) throw new Error('pubKey is required');

    const feeAmount: Coin[] = [
      {
        denom,
        amount: String(BigInt(gasLimit) * BigInt(gasPrice)),
      },
    ];

    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey: pubKey, sequence: Number(sequence) }],
      feeAmount,
      gasLimit,
      granter,
      payer,
      712,
    );

    return authInfoBytes;
  }

  public async simulateRawTx(
    txBodyBytes: Uint8Array,
    accountInfo: BaseAccount,
    options: SimulateOptions,
  ) {
    const rpcClient = await this.rpcQueryClient.getRpcClient();
    const rpc = new ServiceClientImpl(rpcClient);

    const { denom } = options;
    const authInfoBytes = this.getAuthInfoBytes({
      sequence: accountInfo.sequence + '',
      denom,
      gasLimit: 0,
      gasPrice: '0',
      pubKey: makeCosmsPubKey(ZERO_PUBKEY),
      granter: '',
      payer: '',
    });
    const tx = Tx.fromPartial({
      authInfo: AuthInfo.decode(authInfoBytes),
      body: TxBody.decode(txBodyBytes),
      signatures: [Uint8Array.from([])],
    });

    const request = SimulateRequest.fromPartial({
      txBytes: Tx.encode(tx).finish(),
    });

    const res = await rpc.Simulate(request);
    return getGasFeeBySimulate(res, denom);
  }

  public async broadcastRawTx(txRawBytes: Uint8Array) {
    const tmClient = await Tendermint37Client.connect(this.rpcUrl);

    const client = await StargateClient.create(tmClient);
    return await client.broadcastTx(txRawBytes);
  }

  public async multiTx(txResList: Pick<TxResponse, 'metaTxInfo'>[]) {
    const txs = txResList.map((txRes) => txRes.metaTxInfo);
    const accountInfo = await this.account.getAccount(txs[0].address);
    const txBodyBytes = this.getBodyBytes(txs);

    return {
      simulate: async (opts: SimulateOptions) => {
        return await this.simulateRawTx(txBodyBytes, accountInfo, opts);
      },
      broadcast: async (opts: BroadcastOptions) => {
        const {
          denom,
          gasLimit,
          gasPrice,
          payer,
          granter,
          privateKey,
          signTypedDataCallback = defaultSignTypedData,
        } = opts;

        const types = mergeMultiEip712(txs.map((tx) => tx.MsgSDKTypeEIP712));
        const fee = generateFee(
          String(BigInt(gasLimit) * BigInt(gasPrice)),
          denom,
          String(gasLimit),
          payer,
          granter,
        );
        const wrapperTypes = generateTypes(types);
        const multiMessages = mergeMultiMessage(txs);
        const messages = generateMessage(
          accountInfo.accountNumber.toString(),
          accountInfo.sequence.toString(),
          this.chainId,
          '',
          fee,
          multiMessages,
          '0',
        );

        const eip712 = createEIP712(wrapperTypes, this.chainId, messages);
        // console.log('eip712', eip712);

        const { pubKey, signature } = privateKey
          ? this.getSignByPriKey(eip712, privateKey)
          : await this.getSignByWallet(eip712, accountInfo.address, signTypedDataCallback);

        const authInfoBytes = this.getAuthInfoBytes({
          denom,
          sequence: accountInfo.sequence + '',
          gasLimit,
          gasPrice,
          pubKey,
          granter,
          payer,
        });

        const txRaw = TxRaw.fromPartial({
          bodyBytes: txBodyBytes,
          authInfoBytes,
          signatures: [arrayify(signature)],
        });
        const txBytes = TxRaw.encode(txRaw).finish();

        // console.log('txBytes', hexlify(txBytes));
        return await this.broadcastRawTx(txBytes);
      },
    };
  }
}
