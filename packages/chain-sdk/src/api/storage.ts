import {
  MsgPutPolicySDKTypeEIP712,
  MsgPutPolicyTypeUrl,
} from '@/messages/greenfield/storage/MsgPutPolicy';
import {
  QueryParamsResponse,
  QueryPolicyForGroupRequest,
  QueryPolicyForGroupResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';
import { MsgPutPolicy } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { container, delay, inject, singleton } from 'tsyringe';
import { TxResponse } from '..';
import { Basic } from './basic';
import { RpcQueryClient } from './queryclient';

export interface IStorage {
  params(): Promise<QueryParamsResponse>;

  putPolicy(msg: MsgPutPolicy): Promise<TxResponse>;

  getPolicyForGroup(request: QueryPolicyForGroupRequest): Promise<QueryPolicyForGroupResponse>;
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

  public async getPolicyForGroup(request: QueryPolicyForGroupRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.QueryPolicyForGroup(request);
  }
}
