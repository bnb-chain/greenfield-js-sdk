import { TxClient } from '@/clients/txClient';
import { MsgSettleSDKTypeEIP712 } from '@/messages/greenfield/virtualgroup/MsgSettle';
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
import { MsgSettle } from '@bnb-chain/greenfield-cosmos-types/greenfield/virtualgroup/tx';
import { container, delay, inject, injectable } from 'tsyringe';
import { MsgSettleTypeUrl, TxResponse } from '..';
import { RpcQueryClient } from '../clients/queryclient';

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

  settle(address: string, msg: MsgSettle): Promise<TxResponse>;
}

@injectable()
export class VirtualGroup implements IVirtualGroup {
  constructor(@inject(delay(() => TxClient)) private txClient: TxClient) {}
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

  public async settle(address: string, msg: MsgSettle) {
    return await this.txClient.tx(
      MsgSettleTypeUrl,
      address,
      MsgSettleSDKTypeEIP712,
      MsgSettle.toSDK(msg),
      MsgSettle.encode(msg).finish(),
    );
  }
}
