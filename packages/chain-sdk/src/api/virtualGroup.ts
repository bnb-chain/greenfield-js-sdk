import {
  QueryGlobalVirtualGroupByFamilyIDRequest,
  QueryGlobalVirtualGroupByFamilyIDResponse,
  QueryGlobalVirtualGroupFamiliesRequest,
  QueryGlobalVirtualGroupFamiliesResponse,
  QueryGlobalVirtualGroupFamilyRequest,
  QueryGlobalVirtualGroupFamilyResponse,
  QueryGlobalVirtualGroupRequest,
  QueryGlobalVirtualGroupResponse,
  QueryParamsResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/virtualgroup/query';
import { container, singleton } from 'tsyringe';
import { RpcQueryClient } from './queryclient';

export interface IVirtualGroup {
  params(): Promise<QueryParamsResponse>;

  getGlobalVirtualGroup(
    request: QueryGlobalVirtualGroupRequest,
  ): Promise<QueryGlobalVirtualGroupResponse>;

  getGlobalVirtualGroupByFamilyID(
    request: QueryGlobalVirtualGroupByFamilyIDRequest,
  ): Promise<QueryGlobalVirtualGroupByFamilyIDResponse>;

  getGlobalVirtualGroupFamilies(
    request: QueryGlobalVirtualGroupFamiliesRequest,
  ): Promise<QueryGlobalVirtualGroupFamiliesResponse>;

  getGlobalVirtualGroupFamily(
    request: QueryGlobalVirtualGroupFamilyRequest,
  ): Promise<QueryGlobalVirtualGroupFamilyResponse>;
}

@singleton()
export class VirtualGroup implements IVirtualGroup {
  private queryClient = container.resolve(RpcQueryClient);

  public async params() {
    const rpc = await this.queryClient.getVirtualGroupClient();
    return await rpc.Params();
  }

  public async getGlobalVirtualGroup(request: QueryGlobalVirtualGroupRequest) {
    const rpc = await this.queryClient.getVirtualGroupClient();
    return await rpc.GlobalVirtualGroup(request);
  }

  public async getGlobalVirtualGroupByFamilyID(request: QueryGlobalVirtualGroupByFamilyIDRequest) {
    const rpc = await this.queryClient.getVirtualGroupClient();
    return await rpc.GlobalVirtualGroupByFamilyID(request);
  }

  public async getGlobalVirtualGroupFamilies(request: QueryGlobalVirtualGroupFamiliesRequest) {
    const rpc = await this.queryClient.getVirtualGroupClient();
    return await rpc.GlobalVirtualGroupFamilies(request);
  }

  public async getGlobalVirtualGroupFamily(request: QueryGlobalVirtualGroupFamilyRequest) {
    const rpc = await this.queryClient.getVirtualGroupClient();
    return await rpc.GlobalVirtualGroupFamily(request);
  }
}
