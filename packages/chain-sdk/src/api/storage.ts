import { container } from 'tsyringe';
import { RpcQueryClient } from './queryclient';
import { QueryParamsResponse } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';

export interface IStorage {
  params(): Promise<QueryParamsResponse>;
}

export class Storage implements IStorage {
  private queryClient = container.resolve(RpcQueryClient);

  public async params() {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.Params();
  }
}
