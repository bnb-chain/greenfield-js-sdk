import {
  MsgDeletePolicySDKTypeEIP712,
  MsgDeletePolicyTypeUrl,
} from '@/messages/greenfield/storage/MsgDeletePolicy';
import {
  MsgPutPolicySDKTypeEIP712,
  MsgPutPolicyTypeUrl,
} from '@/messages/greenfield/storage/MsgPutPolicy';
import {
  QueryParamsResponse,
  QueryPolicyByIdRequest,
  QueryPolicyByIdResponse,
  QueryPolicyForAccountRequest,
  QueryPolicyForAccountResponse,
  QueryPolicyForGroupRequest,
  QueryPolicyForGroupResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';
import {
  MsgDeletePolicy,
  MsgPutPolicy,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { container, delay, inject, singleton } from 'tsyringe';
import { TxResponse } from '..';
import { Basic } from './basic';
import { RpcQueryClient } from './queryclient';

export interface IStorage {
  params(): Promise<QueryParamsResponse>;

  putPolicy(msg: MsgPutPolicy): Promise<TxResponse>;

  deletePolicy(msg: MsgDeletePolicy): Promise<TxResponse>;

  getPolicyForGroup(request: QueryPolicyForGroupRequest): Promise<QueryPolicyForGroupResponse>;

  getQueryPolicyForAccount(
    request: QueryPolicyForAccountRequest,
  ): Promise<QueryPolicyForAccountResponse>;

  getQueryPolicyForGroup(request: QueryPolicyForGroupRequest): Promise<QueryPolicyForGroupResponse>;

  getQueryPolicyById(request: QueryPolicyByIdRequest): Promise<QueryPolicyByIdResponse>;
}

@singleton()
export class Storage implements IStorage {
  constructor(@inject(delay(() => Basic)) private basic: Basic) {}
  private queryClient = container.resolve(RpcQueryClient);

  public async params() {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.Params();
  }

  public async putPolicy(msg: MsgPutPolicy) {
    return await this.basic.tx(
      MsgPutPolicyTypeUrl,
      msg.operator,
      MsgPutPolicySDKTypeEIP712,
      MsgPutPolicy.toSDK(msg),
      MsgPutPolicy.encode(msg).finish(),
    );
  }

  public async deletePolicy(msg: MsgDeletePolicy) {
    return await this.basic.tx(
      MsgDeletePolicyTypeUrl,
      msg.operator,
      MsgDeletePolicySDKTypeEIP712,
      MsgDeletePolicy.toSDK(msg),
      MsgDeletePolicy.encode(msg).finish(),
    );
  }

  public async getPolicyForGroup(request: QueryPolicyForGroupRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.QueryPolicyForGroup(request);
  }

  public async getQueryPolicyForAccount(request: QueryPolicyForAccountRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.QueryPolicyForAccount(request);
  }

  public async getQueryPolicyForGroup(request: QueryPolicyForGroupRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.QueryPolicyForGroup(request);
  }

  public async getQueryPolicyById(request: QueryPolicyByIdRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.QueryPolicyById(request);
  }
}
