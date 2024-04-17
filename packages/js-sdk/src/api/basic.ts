import {
  GetBlockByHeightResponse,
  GetLatestBlockResponse,
  GetLatestValidatorSetRequest,
  GetNodeInfoResponse,
  ServiceClientImpl as tdServiceClientImpl,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/base/tendermint/v1beta1/query';
import Long from 'long';
import { container, injectable } from 'tsyringe';
import { RpcQueryClient } from '../clients/queryclient';

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
}

@injectable()
export class Basic implements IBasic {
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
}
