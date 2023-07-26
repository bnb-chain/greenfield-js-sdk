import { getPubKeyByPriKey, signEIP712Data } from '@/keymanage';
import { defaultSignTypedData } from '@/sign/signTx';
import { getGasFeeBySimulate } from '@/utils/units';
import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import {
  GetBlockByHeightResponse,
  GetLatestBlockResponse,
  GetLatestValidatorSetRequest,
  GetNodeInfoResponse,
  ServiceClientImpl as tdServiceClientImpl,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/base/tendermint/v1beta1/query';
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
import { toBuffer } from '@ethereumjs/util';
import Long from 'long';
import { container, inject, singleton } from 'tsyringe';
import { BroadcastOptions, ISimulateGasFee, MetaTxInfo, SimulateOptions, TxResponse } from '..';
import { DEFAULT_DENOM, ZERO_PUBKEY } from '../constants';
import {
  createEIP712,
  generateFee,
  generateMessage,
  generateTypes,
  mergeMultiEip712,
  mergeMultiMessage,
} from '../messages';
import { generateMsg, typeWrapper } from '../messages/utils';
import { eip712Hash, makeCosmsPubKey, recoverPk } from '../sign';
import { Account } from './account';
import { RpcQueryClient } from './queryclient';

export interface IBasic {
  /**
   * returns the current node info of the greenfield that the client is connected to.
   */
  getNodeInfo(): Promise<GetNodeInfoResponse>;

  /**
   * retrieves the latest block from the chain.
   */
  getLatestBlock(): Promise<GetLatestBlockResponse>;

  /**
   * retrieves the height of the latest block from the chain.
   * returns the block height and any error that occurred during the operation.
   */
  getLatestBlockHeight(): Promise<number>;

  /**
   * retrieves the syncing status of the node. If true, means the node is catching up the latest block.
   * The function returns a boolean indicating whether the node is syncing and any error that occurred during the operation.
   */
  getSyncing(): Promise<boolean>;

  /**
   * GetBlockByHeight retrieves the block at the given height from the chain.
   * The function returns a pointer to a Block object and any error that occurred during the operation.
   */
  getBlockByHeight(height: number): Promise<GetBlockByHeightResponse>;

  /**
   * retrieves the latest validator set from the chain.
   * The function returns the block height of the validator set
   */
  GetLatestValidatorSet(request: GetLatestValidatorSetRequest): Promise<number>;

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

  /**
   *
   */
  multiTx(txResList: TxResponse[]): Promise<Omit<TxResponse, 'metaTxInfo'>>;
}

@singleton()
export class Basic implements IBasic {
  public rpcUrl: string;
  public chainId: string;
  constructor(@inject('RPC_URL') rpcUrl: string, @inject('CHAIN_ID') chainId: string) {
    this.rpcUrl = rpcUrl;
    this.chainId = chainId;
  }

  private account: Account = container.resolve(Account);
  private rpcQueryClient = container.resolve(RpcQueryClient);

  public async getNodeInfo() {
    const rpcClient = await this.rpcQueryClient.getRpcClient();
    const rpc = new tdServiceClientImpl(rpcClient);
    return await rpc.GetNodeInfo();
  }

  public async getLatestBlock(): Promise<GetLatestBlockResponse> {
    const rpcClient = await this.rpcQueryClient.getRpcClient();
    const rpc = new tdServiceClientImpl(rpcClient);
    return await rpc.GetLatestBlock();
  }

  public async getLatestBlockHeight(): Promise<number> {
    const latestBlock = await this.getLatestBlock();
    const height = latestBlock.sdkBlock?.header?.height;
    if (!height) return 0;
    return height.toNumber();
  }

  public async getSyncing(): Promise<boolean> {
    const rpcClient = await this.rpcQueryClient.getRpcClient();
    const rpc = new tdServiceClientImpl(rpcClient);
    const syncing = await rpc.GetSyncing();
    return syncing.syncing;
  }

  public async getBlockByHeight(height: number): Promise<GetBlockByHeightResponse> {
    const rpcClient = await this.rpcQueryClient.getRpcClient();
    const rpc = new tdServiceClientImpl(rpcClient);
    return await rpc.GetBlockByHeight({
      height: Long.fromInt(height),
    });
  }

  public async GetLatestValidatorSet(request: GetLatestValidatorSetRequest): Promise<number> {
    const rpcClient = await this.rpcQueryClient.getRpcClient();
    const rpc = new tdServiceClientImpl(rpcClient);
    const validatorSet = await rpc.GetLatestValidatorSet(request);
    return validatorSet.blockHeight.toNumber();
  }

  public async tx(
    typeUrl: MetaTxInfo['typeUrl'],
    address: MetaTxInfo['address'],
    MsgSDKTypeEIP712: MetaTxInfo['MsgSDKTypeEIP712'],
    MsgSDK: MetaTxInfo['MsgSDK'],
    msgBytes: MetaTxInfo['msgBytes'],
  ) {
    const accountInfo = await this.account.getAccount(address);
    const bodyBytes = this.getSingleBodyBytes(typeUrl, msgBytes);

    return {
      simulate: async (opts: SimulateOptions) => {
        return await this.simulateRawTx(bodyBytes, accountInfo, opts);
      },
      broadcast: async (opts: BroadcastOptions) => {
        const rawTxBytes = await this.getRawTxBytes(
          typeUrl,
          MsgSDKTypeEIP712,
          MsgSDK,
          bodyBytes,
          accountInfo,
          opts,
        );

        // console.log('txRaw', bufferToHex(Buffer.from(rawTxBytes)));

        return await this.broadcastRawTx(rawTxBytes);
      },
      metaTxInfo: {
        typeUrl,
        address,
        MsgSDKTypeEIP712,
        MsgSDK,
        msgBytes,
        bodyBytes,
      },
    };
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

  public async multiTx(txResList: TxResponse[]) {
    const txs = txResList.map((txRes) => txRes.metaTxInfo);
    const accountInfo = await this.account.getAccount(txs[0].address);
    const multiMsgBytes = txs.map((tx) => {
      return generateMsg(tx.typeUrl, tx.msgBytes);
    });
    const txBody = TxBody.fromPartial({
      messages: multiMsgBytes,
    });
    const txBodyBytes = TxBody.encode(txBody).finish();

    return {
      simulate: async (opts: SimulateOptions) => {
        return await this.simulateRawTx(txBodyBytes, accountInfo, opts);
      },
      broadcast: async (opts: BroadcastOptions) => {
        const {
          denom,
          gasLimit,
          gasPrice,
          privateKey,
          payer,
          granter,
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
        const signature = await signTypedDataCallback(accountInfo.address, JSON.stringify(eip712));
        const messageHash = eip712Hash(JSON.stringify(eip712));

        const pk = recoverPk({
          signature,
          messageHash,
        });
        const pubKey = makeCosmsPubKey(pk);

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
          signatures: [toBuffer(signature)],
        });
        const txBytes = TxRaw.encode(txRaw).finish();
        return await this.broadcastRawTx(txBytes);
      },
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
    const feeGranter = granter;
    const feePayer = payer;
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

  /**
   * Get the body bytes of a transaction
   *
   * EIP712 sign or private key sign
   */
  protected async getRawTxBytes(
    typeUrl: string,
    msgEIP712Structor: object,
    msgEIP712: object,
    bodyBytes: Uint8Array,
    accountInfo: BaseAccount,
    txOption: BroadcastOptions,
  ): Promise<Uint8Array> {
    const {
      denom,
      gasLimit,
      gasPrice,
      privateKey,
      signTypedDataCallback = defaultSignTypedData,
      granter,
      payer,
    } = txOption;

    // console.log('txOption', txOption);
    // console.log('msgEIP712', msgEIP712);

    let signature,
      pubKey = undefined;

    if (privateKey) {
      pubKey = getPubKeyByPriKey(privateKey);
      signature = signEIP712Data(
        this.chainId,
        accountInfo.accountNumber + '',
        accountInfo.sequence + '',
        typeUrl,
        msgEIP712Structor,
        msgEIP712,
        txOption,
      );
      // console.log('signature', signature);
    } else {
      const eip712 = this.getEIP712Struct(
        typeUrl,
        msgEIP712Structor,
        accountInfo.accountNumber + '',
        accountInfo.sequence + '',
        this.chainId,
        msgEIP712,
        txOption,
      );
      signature = await signTypedDataCallback(accountInfo.address, JSON.stringify(eip712));
      const messageHash = eip712Hash(JSON.stringify(eip712));
      const pk = recoverPk({
        signature,
        messageHash,
      });
      pubKey = makeCosmsPubKey(pk);

      // console.log('messageHash', bufferToHex(messageHash));
      // console.log('signature', signature);
      // console.log('pubKey', pubKey, bufferToHex(Buffer.from(pubKey.value)));
    }

    // console.log('eip712', eip712, JSON.stringify(eip712));

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
      bodyBytes,
      authInfoBytes,
      signatures: [toBuffer(signature)],
    });

    return TxRaw.encode(txRaw).finish();
  }

  protected getSingleBodyBytes(typeUrl: string, msgBytes: Uint8Array): Uint8Array {
    const msgWrapped = generateMsg(typeUrl, msgBytes);

    const txBody = TxBody.fromPartial({
      messages: [msgWrapped],
    });

    return TxBody.encode(txBody).finish();
  }

  protected getEIP712Struct(
    typeUrl: string,
    types: object,
    accountNumber: string,
    sequence: string,
    chainId: string,
    msg: object,
    txOption: BroadcastOptions,
  ) {
    const { gasLimit, gasPrice, denom = DEFAULT_DENOM, payer, granter } = txOption;

    const fee = generateFee(
      String(BigInt(gasLimit) * BigInt(gasPrice)),
      denom,
      String(gasLimit),
      payer,
      granter,
    );
    const wrapperTypes = generateTypes(types);
    const wrapperMsg = typeWrapper(typeUrl, msg);
    const messages = generateMessage(accountNumber, sequence, chainId, '', fee, wrapperMsg, '0');
    return createEIP712(wrapperTypes, chainId, messages);
  }
}
