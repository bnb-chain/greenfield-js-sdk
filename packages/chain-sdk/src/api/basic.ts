import { ISimulateGasFee, getGasFeeBySimulate } from '@/utils/units';
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
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { DeliverTxResponse, ProtobufRpcClient, StargateClient } from '@cosmjs/stargate';
import { toBuffer } from '@ethereumjs/util';
import { SignTypedDataVersion, TypedDataUtils } from '@metamask/eth-sig-util';
import Long from 'long';
import { ZERO_PUBKEY } from '../constants';
import { createEIP712, generateFee, generateMessage, generateTypes } from '../messages';
import { makeCosmsPubKey, recoverPk } from '../sign';
import { typeWrapper } from '../tx/utils';

import {
  AuthExtension,
  BankExtension,
  QueryClient,
  TxExtension,
  createProtobufRpcClient,
  setupAuthExtension,
  setupAuthzExtension,
  setupBankExtension,
  setupDistributionExtension,
  setupFeegrantExtension,
  setupGovExtension,
  setupIbcExtension,
  setupMintExtension,
  setupSlashingExtension,
  setupStakingExtension,
  setupTxExtension,
} from '@cosmjs/stargate';
import { AuthzExtension } from '@cosmjs/stargate/build/modules/authz/queries';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';

export const makeClientWithExtension = async (
  rpcUrl: string,
): Promise<
  [QueryClient & BankExtension & TxExtension & AuthExtension & AuthzExtension, Tendermint34Client]
> => {
  const tmClient = await Tendermint34Client.connect(rpcUrl);
  return [
    QueryClient.withExtensions(
      tmClient,
      setupAuthExtension,
      setupAuthzExtension,
      setupBankExtension,
      setupDistributionExtension,
      setupFeegrantExtension,
      setupGovExtension,
      setupIbcExtension,
      setupMintExtension,
      setupSlashingExtension,
      setupStakingExtension,
      setupTxExtension,
    ),
    tmClient,
  ];
};

export const makeRpcClient = async (rpcUrl: string) => {
  const [, tmClient] = await makeClientWithExtension(rpcUrl);
  const rpc = createProtobufRpcClient(new QueryClient(tmClient));
  return rpc;
};

export interface ITxOption {
  denom: string;
  gasLimit: number;
  gasPrice: string;
  payer: string;
  granter: string;
  simulate: boolean;
}

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
    txOption: Pick<ITxOption, 'denom'>,
  ): Promise<ISimulateGasFee>;

  /**
   * broadcasts a transaction containing the provided messages to the chain.
    The function returns a pointer to a BroadcastTxResponse and any error that occurred during the operation.
   */
  broadcastRawTx(txRawBytes: Uint8Array): Promise<DeliverTxResponse>;
}

export class Basic implements IBasic {
  constructor(protected readonly rpcUrl: string, protected readonly chainId: string) {}

  public async getNodeInfo() {
    const rpcClient = await this.getRpcClient();
    const rpc = new tdServiceClientImpl(rpcClient);
    return await rpc.GetNodeInfo();
  }

  public async getLatestBlock(): Promise<GetLatestBlockResponse> {
    const rpcClient = await this.getRpcClient();
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
    const rpcClient = await this.getRpcClient();
    const rpc = new tdServiceClientImpl(rpcClient);
    const syncing = await rpc.GetSyncing();
    return syncing.syncing;
  }

  public async getBlockByHeight(height: number): Promise<GetBlockByHeightResponse> {
    const rpcClient = await this.getRpcClient();
    const rpc = new tdServiceClientImpl(rpcClient);
    return await rpc.GetBlockByHeight({
      height: Long.fromInt(height),
    });
  }

  public async GetLatestValidatorSet(request: GetLatestValidatorSetRequest): Promise<number> {
    const rpcClient = await this.getRpcClient();
    const rpc = new tdServiceClientImpl(rpcClient);
    const validatorSet = await rpc.GetLatestValidatorSet(request);
    return validatorSet.blockHeight.toNumber();
  }

  private rpcClient: ProtobufRpcClient | null = null;
  protected async getRpcClient() {
    if (!this.rpcClient) {
      this.rpcClient = await makeRpcClient(this.rpcUrl);
    }
    return this.rpcClient;
  }

  public async simulateRawTx(
    txBodyBytes: Uint8Array,
    accountInfo: BaseAccount,
    txOption: Pick<ITxOption, 'denom'>,
  ) {
    const rpcClient = await this.getRpcClient();
    const rpc = new ServiceClientImpl(rpcClient);

    const { denom } = txOption;
    const authInfoBytes = this.getAuthInfoBytes({
      sequence: accountInfo.sequence + '',
      denom,
      gasLimit: 0,
      gasPrice: '0',
      pubKey: makeCosmsPubKey(ZERO_PUBKEY),
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
    return getGasFeeBySimulate(res, txOption.denom);
  }

  public async broadcastRawTx(txRawBytes: Uint8Array) {
    const client = await StargateClient.connect(this.rpcUrl);

    return await client.broadcastTx(txRawBytes);
  }

  private queryClient:
    | (QueryClient & BankExtension & TxExtension & AuthExtension & AuthzExtension)
    | null = null;

  protected async getQueryClient() {
    if (!this.queryClient) {
      const [client] = await makeClientWithExtension(this.rpcUrl);
      this.queryClient = client;
    }
    return this.queryClient;
  }

  private getAuthInfoBytes(
    params: Pick<ITxOption, 'denom' | 'gasLimit' | 'gasPrice'> & {
      pubKey: BaseAccount['pubKey'];
      sequence: string;
    },
  ) {
    const { pubKey, denom, sequence, gasLimit, gasPrice } = params;
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

  protected async getRawTxBytes(
    typeUrl: string,
    msgEIP712Structor: object,
    msgEIP712: object,
    bodyBytes: Uint8Array,
    accountInfo: BaseAccount,
    txOption: Omit<ITxOption, 'simulate'>,
  ): Promise<Uint8Array> {
    const { denom, gasLimit, gasPrice } = txOption;
    const eip712 = this.getEIP712Struct(
      typeUrl,
      msgEIP712Structor,
      accountInfo.accountNumber + '',
      accountInfo.sequence + '',
      this.chainId,
      msgEIP712,
      txOption,
    );

    const { signature, pubKey } = await this.signTx(accountInfo.address, JSON.stringify(eip712));

    const authInfoBytes = this.getAuthInfoBytes({
      denom,
      sequence: accountInfo.sequence + '',
      gasLimit,
      gasPrice,
      pubKey,
    });

    const txRaw = TxRaw.fromPartial({
      bodyBytes,
      authInfoBytes,
      signatures: [toBuffer(signature)],
    });

    return TxRaw.encode(txRaw).finish();
  }

  protected getBodyBytes(typeUrl: string, msgBytes: Uint8Array): Uint8Array {
    const msgWrapped = Any.fromPartial({
      typeUrl,
      value: msgBytes,
    });

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
    txOption: Omit<ITxOption, 'simulate'>,
  ) {
    const { gasLimit, gasPrice, denom, payer } = txOption;

    const fee = generateFee(
      String(BigInt(gasLimit) * BigInt(gasPrice)),
      denom,
      String(gasLimit),
      payer,
      '',
    );
    const wrapperTypes = generateTypes(types);
    const wrapperMsg = typeWrapper(typeUrl, msg);
    const messages = generateMessage(accountNumber, sequence, chainId, '', fee, wrapperMsg, '0');
    return createEIP712(wrapperTypes, chainId, messages);
  }

  protected async signTx(addr: string, message: string) {
    // TODO: provider

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const signature = await (window as any).ethereum?.request({
      method: 'eth_signTypedData_v4',
      params: [addr, message],
    });

    const messageHash = TypedDataUtils.eip712Hash(JSON.parse(message), SignTypedDataVersion.V4);

    const pk = recoverPk({
      signature,
      messageHash,
    });
    const pubKey = makeCosmsPubKey(pk);

    return {
      signature,
      messageHash,
      pubKey,
    };
  }
}
