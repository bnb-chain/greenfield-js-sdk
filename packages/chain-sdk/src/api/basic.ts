import { getPubKeyByPriKey } from '@/keymanage';
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
import { arrayify } from '@ethersproject/bytes';
import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';
import Long from 'long';
import { container, inject, singleton } from 'tsyringe';
import {
  BroadcastOptions,
  ISimulateGasFee,
  MetaTxInfo,
  SignOptions,
  SimulateOptions,
  TxResponse,
} from '..';
import { DEFAULT_DENOM, ZERO_PUBKEY } from '../constants';
import {
  createEIP712,
  generateFee,
  generateMessage,
  generateTypes,
  mergeMultiEip712,
  mergeMultiMessage,
} from '../messages';
import { generateMsg } from '../messages/utils';
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
  multiTx(txResList: Pick<TxResponse, 'metaTxInfo'>[]): Promise<Omit<TxResponse, 'metaTxInfo'>>;
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
}
