import { TxClient } from '@/clients/txClient';
import { getMsgPutPolicySDKTypeEIP712 } from '@/messages/greenfield';
import { MsgDeletePolicySDKTypeEIP712 } from '@/messages/greenfield/storage/MsgDeletePolicy';
import {
  QueryGroupMembersExistRequest,
  QueryGroupMembersExistResponse,
  QueryGroupsExistByIdRequest,
  QueryGroupsExistRequest,
  QueryGroupsExistResponse,
  QueryLockFeeRequest,
  QueryLockFeeResponse,
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
import { container, delay, inject, injectable } from 'tsyringe';
import { fromTimestamp, MsgDeletePolicyTypeUrl, MsgPutPolicyTypeUrl, TxResponse } from '..';
import { RpcQueryClient } from '../clients/queryclient';

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

  queryLockFee(request: QueryLockFeeRequest): Promise<QueryLockFeeResponse>;

  queryGroupMembersExist(
    request: QueryGroupMembersExistRequest,
  ): Promise<QueryGroupMembersExistResponse>;

  queryGroupExist(request: QueryGroupsExistRequest): Promise<QueryGroupsExistResponse>;

  queryGroupsExistById(request: QueryGroupsExistByIdRequest): Promise<QueryGroupsExistResponse>;
}

@injectable()
export class Storage implements IStorage {
  constructor(@inject(delay(() => TxClient)) private txClient: TxClient) {}
  private queryClient = container.resolve(RpcQueryClient);

  public async params() {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.Params();
  }

  public async putPolicy(msg: MsgPutPolicy) {
    const toSdk = MsgPutPolicy.toSDK(msg);
    return await this.txClient.tx(
      MsgPutPolicyTypeUrl,
      msg.operator,
      getMsgPutPolicySDKTypeEIP712(msg.statements[0].resources),
      {
        ...toSdk,
        expiration_time: msg.expirationTime ? fromTimestamp(msg.expirationTime) : '',
        statements: toSdk.statements.map((e) => {
          // @ts-ignore
          e.expiration_time = '';

          if (e.resources.length == 0) {
            // @ts-ignore
            e.resources = null;
          }
          return e;
        }),
      },
      MsgPutPolicy.encode(msg).finish(),
    );
  }

  public async deletePolicy(msg: MsgDeletePolicy) {
    return await this.txClient.tx(
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

  public async queryLockFee(request: QueryLockFeeRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.QueryLockFee(request);
  }

  public async queryGroupMembersExist(request: QueryGroupMembersExistRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.QueryGroupMembersExist(request);
  }

  public async queryGroupExist(request: QueryGroupsExistRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.QueryGroupsExist(request);
  }

  public async queryGroupsExistById(request: QueryGroupsExistByIdRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.QueryGroupsExistById(request);
  }
}
