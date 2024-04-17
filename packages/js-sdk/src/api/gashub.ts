import {
  QueryMsgGasParamsRequest,
  QueryMsgGasParamsResponse,
  QueryParamsResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/gashub/v1beta1/query';
import { container, injectable } from 'tsyringe';
import { RpcQueryClient } from '../clients/queryclient';

export interface IGashub {
  getParams(): Promise<QueryParamsResponse>;

  getMsgGasParams(request: QueryMsgGasParamsRequest): Promise<QueryMsgGasParamsResponse>;
}

@injectable()
export class Gashub implements IGashub {
  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);

  async getMsgGasParams(request: QueryMsgGasParamsRequest): Promise<QueryMsgGasParamsResponse> {
    const rpc = await this.queryClient.getGashubClient();
    return await rpc.MsgGasParams(request);
  }

  async getParams() {
    const rpc = await this.queryClient.getGashubClient();
    return await rpc.Params();
  }
}
