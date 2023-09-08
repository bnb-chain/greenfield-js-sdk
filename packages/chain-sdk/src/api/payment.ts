import {
  getListUserPaymentAccountMetaInfo,
  parseListUserPaymentAccountResponse,
} from '@/clients/spclient/spApis/listUserPaymentAccounts';
import { AuthType, SpClient } from '@/clients/spclient/spClient';
import { TxClient } from '@/clients/txClient';
import { MsgDepositSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgDeposit';
import { MsgDisableRefundSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgDisableRefund';
import { MsgWithdrawSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgWithdraw';
import {
  QueryAutoSettleRecordsRequest,
  QueryAutoSettleRecordsResponse,
  QueryDynamicBalanceRequest,
  QueryDynamicBalanceResponse,
  QueryGetStreamRecordResponse,
  QueryOutFlowsRequest,
  QueryOutFlowsResponse,
  QueryParamsByTimestampRequest,
  QueryParamsByTimestampResponse,
  QueryParamsResponse,
  QueryPaymentAccountCountRequest,
  QueryPaymentAccountCountResponse,
  QueryPaymentAccountCountsRequest,
  QueryPaymentAccountCountsResponse,
  QueryPaymentAccountRequest,
  QueryPaymentAccountResponse,
  QueryPaymentAccountsByOwnerRequest,
  QueryPaymentAccountsByOwnerResponse,
  QueryPaymentAccountsRequest,
  QueryPaymentAccountsResponse,
  QueryStreamRecordsRequest,
  QueryStreamRecordsResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/query';
import {
  MsgDeposit,
  MsgDisableRefund,
  MsgWithdraw,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/tx';
import { container, delay, inject, injectable } from 'tsyringe';
import {
  MsgDepositTypeUrl,
  MsgDisableRefundTypeUrl,
  MsgWithdrawTypeUrl,
  NORMAL_ERROR_CODE,
  SpResponse,
  TxResponse,
} from '..';
import { RpcQueryClient } from '../clients/queryclient';
import {
  ListUserPaymentAccountsResponse,
  ListUserPaymentAccountsResquest,
} from '../types/sp/ListUserPaymentAccounts';
import { Sp } from './sp';

export interface IPayment {
  /**
   * retrieves stream record information for a given stream address.
   * the account must actions: deposit, withdraw
   */
  getStreamRecord(account: string): Promise<QueryGetStreamRecordResponse>;

  getStreamRecordAll(request: QueryStreamRecordsRequest): Promise<QueryStreamRecordsResponse>;

  /**
   * deposits BNB to a stream account.
   */
  deposit(msg: MsgDeposit): Promise<TxResponse>;

  /**
   * withdraws BNB from a stream account.
   */
  withdraw(msg: MsgWithdraw): Promise<TxResponse>;

  /**
   * disables refund for a stream account.
   */
  disableRefund(msg: MsgDisableRefund): Promise<TxResponse>;

  params(): Promise<QueryParamsResponse>;

  paramsByTimestamp(
    request: QueryParamsByTimestampRequest,
  ): Promise<QueryParamsByTimestampResponse>;

  paymentAccount(request: QueryPaymentAccountRequest): Promise<QueryPaymentAccountResponse>;

  paymentAccountAll(request: QueryPaymentAccountsRequest): Promise<QueryPaymentAccountsResponse>;

  /** Queries a PaymentAccountCount by index. */
  getPaymentAccountCount(
    request: QueryPaymentAccountCountRequest,
  ): Promise<QueryPaymentAccountCountResponse>;

  /** Queries a list of PaymentAccountCount items. */
  getPaymentAccountCounts(
    request: QueryPaymentAccountCountsRequest,
  ): Promise<QueryPaymentAccountCountsResponse>;

  /** Queries a list of DynamicBalance items. */
  dynamicBalance(request: QueryDynamicBalanceRequest): Promise<QueryDynamicBalanceResponse>;

  /** Queries a list of GetPaymentAccountsByOwner items. */
  getPaymentAccountsByOwner(
    request: QueryPaymentAccountsByOwnerRequest,
  ): Promise<QueryPaymentAccountsByOwnerResponse>;

  getAutoSettleRecords(
    request: QueryAutoSettleRecordsRequest,
  ): Promise<QueryAutoSettleRecordsResponse>;

  getOutFlows(request: QueryOutFlowsRequest): Promise<QueryOutFlowsResponse>;

  listUserPaymentAccounts(
    params: ListUserPaymentAccountsResquest,
    authType: AuthType,
  ): Promise<SpResponse<ListUserPaymentAccountsResponse>>;
}

@injectable()
export class Payment implements IPayment {
  constructor(
    @inject(delay(() => TxClient)) private txClient: TxClient,
    @inject(delay(() => Sp)) private sp: Sp,
  ) {}
  private spClient = container.resolve(SpClient);
  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);

  public async getStreamRecord(account: string) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.StreamRecord({
      account,
    });
  }

  public async getStreamRecordAll(request: QueryStreamRecordsRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.StreamRecords(request);
  }

  public async params() {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.Params();
  }

  public async paramsByTimestamp(request: QueryParamsByTimestampRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.ParamsByTimestamp(request);
  }

  public async getPaymentAccountCount(request: QueryPaymentAccountCountRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.PaymentAccountCount(request);
  }

  public async getPaymentAccountCounts(request: QueryPaymentAccountCountsRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.PaymentAccountCounts(request);
  }

  public async paymentAccount(request: QueryPaymentAccountRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.PaymentAccount(request);
  }

  public async paymentAccountAll(request: QueryPaymentAccountsRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.PaymentAccounts(request);
  }

  public async dynamicBalance(request: QueryDynamicBalanceRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.DynamicBalance(request);
  }

  public async getPaymentAccountsByOwner(request: QueryPaymentAccountsByOwnerRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.PaymentAccountsByOwner(request);
  }

  public async getAutoSettleRecords(request: QueryAutoSettleRecordsRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.AutoSettleRecords(request);
  }

  public async getOutFlows(request: QueryOutFlowsRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.OutFlows(request);
  }

  public async deposit(msg: MsgDeposit) {
    return await this.txClient.tx(
      MsgDepositTypeUrl,
      msg.creator,
      MsgDepositSDKTypeEIP712,
      MsgDeposit.toSDK(msg),
      MsgDeposit.encode(msg).finish(),
    );
  }

  public async withdraw(msg: MsgWithdraw) {
    return await this.txClient.tx(
      MsgWithdrawTypeUrl,
      msg.creator,
      MsgWithdrawSDKTypeEIP712,
      MsgWithdraw.toSDK(msg),
      MsgWithdraw.encode(msg).finish(),
    );
  }

  public async disableRefund(msg: MsgDisableRefund) {
    return await this.txClient.tx(
      MsgDisableRefundTypeUrl,
      msg.owner,
      MsgDisableRefundSDKTypeEIP712,
      MsgDisableRefund.toSDK(msg),
      MsgDisableRefund.encode(msg).finish(),
    );
  }

  public async listUserPaymentAccounts(
    params: ListUserPaymentAccountsResquest,
    authType: AuthType,
  ) {
    try {
      const sp = await this.sp.getInServiceSP();

      const { url, optionsWithOutHeaders, reqMeta } = getListUserPaymentAccountMetaInfo(
        sp.endpoint,
        params,
      );

      const signHeaders = await this.spClient.signHeaders(reqMeta, authType);

      const result = await this.spClient.callApi(url, {
        ...optionsWithOutHeaders,
        headers: signHeaders,
      });

      const xml = await result.text();
      const res = parseListUserPaymentAccountResponse(xml);

      return {
        code: 0,
        message: 'Get bucket success.',
        statusCode: result.status,
        body: res,
      };
    } catch (error: any) {
      return {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }
}
