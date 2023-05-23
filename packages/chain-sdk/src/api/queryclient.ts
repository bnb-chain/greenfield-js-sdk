import { MsgClientImpl } from '@bnb-chain/greenfield-cosmos-types/cosmos/distribution/v1beta1/tx';
import { QueryClientImpl as AuthQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/query';
import { QueryClientImpl as BankQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/cosmos/bank/v1beta1/query';
import { QueryClientImpl as CrosschainQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/cosmos/crosschain/v1/query';
import { QueryClientImpl as FeeGrantQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/cosmos/feegrant/v1beta1/query';
import { QueryClientImpl as OracleQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/cosmos/oracle/v1/query';
import { QueryClientImpl as BridgeQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/greenfield/bridge/query';
import { QueryClientImpl as ChallengeQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/greenfield/challenge/query';
import { QueryClientImpl as PaymentQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/query';
import { QueryClientImpl as SpQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/query';
import {
  QueryClientImpl as BucketQueryClientImpl,
  QueryClientImpl as StorageQueryClientImpl,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';
import {
  AuthExtension,
  BankExtension,
  createProtobufRpcClient,
  ProtobufRpcClient,
  QueryClient,
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
  TxExtension,
} from '@cosmjs/stargate';
import { AuthzExtension } from '@cosmjs/stargate/build/modules/authz/queries';
import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { inject, singleton } from 'tsyringe';

@singleton()
export class RpcQueryClient {
  constructor(@inject('RPC_URL') private rpcUrl: string) {
    this.rpcUrl = rpcUrl;
  }

  private rpcClient: ProtobufRpcClient | null = null;
  public async getRpcClient() {
    if (!this.rpcClient) {
      this.rpcClient = await makeRpcClient(this.rpcUrl);
    }
    return this.rpcClient;
  }

  private txQueryClient:
    | (QueryClient & BankExtension & TxExtension & AuthExtension & AuthzExtension)
    | null = null;
  public async getQueryClient() {
    if (!this.txQueryClient) {
      const [client] = await makeClientWithExtension(this.rpcUrl);
      this.txQueryClient = client;
    }
    return this.txQueryClient;
  }

  public async getAuthQueryClient() {
    const rpcClient = await this.getRpcClient();
    return new AuthQueryClientImpl(rpcClient);
  }

  public async getBankQueryClient() {
    const rpcClient = await this.getRpcClient();
    return new BankQueryClientImpl(rpcClient);
  }

  public async getPaymentQueryClient() {
    const rpcClient = await this.getRpcClient();
    return new PaymentQueryClientImpl(rpcClient);
  }

  public async getBucketQueryClient() {
    const rpcClient = await this.getRpcClient();
    return new BucketQueryClientImpl(rpcClient);
  }

  public async getSpQueryClient() {
    const rpcClient = await this.getRpcClient();
    return new SpQueryClientImpl(rpcClient);
  }

  public async getChallengeQueryClient() {
    const rpcClient = await this.getRpcClient();
    return new ChallengeQueryClientImpl(rpcClient);
  }

  public async getCrosschainQueryClient() {
    const rpcClient = await this.getRpcClient();
    return new CrosschainQueryClientImpl(rpcClient);
  }

  public async getOracleQueryClient() {
    const rpcClient = await this.getRpcClient();
    return new OracleQueryClientImpl(rpcClient);
  }

  public async getBridgeQueryClient() {
    const rpcClient = await this.getRpcClient();
    return new BridgeQueryClientImpl(rpcClient);
  }

  public async getFeeGrantQueryClient() {
    const rpcClient = await this.getRpcClient();
    return new FeeGrantQueryClientImpl(rpcClient);
  }

  public async getStorageQueryClient() {
    const rpcClient = await this.getRpcClient();
    return new StorageQueryClientImpl(rpcClient);
  }

  public async getMsgClient() {
    const rpcClient = await this.getRpcClient();
    return new MsgClientImpl(rpcClient);
  }
}

export const makeClientWithExtension = async (
  rpcUrl: string,
): Promise<
  [QueryClient & BankExtension & TxExtension & AuthExtension & AuthzExtension, Tendermint37Client]
> => {
  const tmClient = await Tendermint37Client.connect(rpcUrl);
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
