import { MsgDepositSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgDeposit';
import { MsgDisableRefundSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgDisableRefund';
import { MsgWithdrawSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgWithdraw';
import {
  QueryAllAutoSettleRecordRequest,
  QueryAllAutoSettleRecordResponse,
  QueryAllPaymentAccountCountRequest,
  QueryAllPaymentAccountCountResponse,
  QueryAllPaymentAccountRequest,
  QueryAllPaymentAccountResponse,
  QueryAllStreamRecordRequest,
  QueryAllStreamRecordResponse,
  QueryDynamicBalanceRequest,
  QueryDynamicBalanceResponse,
  QueryGetPaymentAccountCountRequest,
  QueryGetPaymentAccountCountResponse,
  QueryGetPaymentAccountRequest,
  QueryGetPaymentAccountResponse,
  QueryGetPaymentAccountsByOwnerRequest,
  QueryGetPaymentAccountsByOwnerResponse,
  QueryGetStreamRecordResponse,
  QueryParamsByTimestampRequest,
  QueryParamsByTimestampResponse,
  QueryParamsResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/query';
import {
  MsgDeposit,
  MsgDisableRefund,
  MsgWithdraw,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/tx';
import { container, singleton } from 'tsyringe';
import { MsgDepositTypeUrl, MsgDisableRefundTypeUrl, MsgWithdrawTypeUrl, TxResponse } from '..';
import { Basic } from './basic';
import { RpcQueryClient } from './queryclient';

export interface IPayment {
  /**
   * retrieves stream record information for a given stream address.
   * the account must actions: deposit, withdraw
   */
  getStreamRecord(account: string): Promise<QueryGetStreamRecordResponse>;

  getStreamRecordAll(request: QueryAllStreamRecordRequest): Promise<QueryAllStreamRecordResponse>;

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

  paymentAccount(request: QueryGetPaymentAccountRequest): Promise<QueryGetPaymentAccountResponse>;

  paymentAccountAll(
    request: QueryAllPaymentAccountRequest,
  ): Promise<QueryAllPaymentAccountResponse>;

  /** Queries a PaymentAccountCount by index. */
  paymentAccountCount(
    request: QueryGetPaymentAccountCountRequest,
  ): Promise<QueryGetPaymentAccountCountResponse>;

  /** Queries a list of PaymentAccountCount items. */
  paymentAccountCountAll(
    request: QueryAllPaymentAccountCountRequest,
  ): Promise<QueryAllPaymentAccountCountResponse>;

  /** Queries a list of DynamicBalance items. */
  dynamicBalance(request: QueryDynamicBalanceRequest): Promise<QueryDynamicBalanceResponse>;

  /** Queries a list of GetPaymentAccountsByOwner items. */
  getPaymentAccountsByOwner(
    request: QueryGetPaymentAccountsByOwnerRequest,
  ): Promise<QueryGetPaymentAccountsByOwnerResponse>;

  autoSettleRecordAll(
    request: QueryAllAutoSettleRecordRequest,
  ): Promise<QueryAllAutoSettleRecordResponse>;
}

@singleton()
export class Payment implements IPayment {
  private basic: Basic = container.resolve(Basic);
  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);

  public async getStreamRecord(account: string) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.StreamRecord({
      account,
    });
  }

  public async getStreamRecordAll(request: QueryAllStreamRecordRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.StreamRecordAll(request);
  }

  public async params() {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.Params();
  }

  public async paramsByTimestamp(request: QueryParamsByTimestampRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.ParamsByTimestamp(request);
  }

  public async paymentAccountCount(request: QueryGetPaymentAccountCountRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.PaymentAccountCount(request);
  }

  public async paymentAccountCountAll(request: QueryAllPaymentAccountCountRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.PaymentAccountCountAll(request);
  }

  public async paymentAccount(request: QueryGetPaymentAccountRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.PaymentAccount(request);
  }

  public async paymentAccountAll(request: QueryAllPaymentAccountRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.PaymentAccountAll(request);
  }

  public async dynamicBalance(request: QueryDynamicBalanceRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.DynamicBalance(request);
  }

  public async getPaymentAccountsByOwner(request: QueryGetPaymentAccountsByOwnerRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.GetPaymentAccountsByOwner(request);
  }

  public async autoSettleRecordAll(request: QueryAllAutoSettleRecordRequest) {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.AutoSettleRecordAll(request);
  }

  public async deposit(msg: MsgDeposit) {
    return await this.basic.tx(
      MsgDepositTypeUrl,
      msg.creator,
      MsgDepositSDKTypeEIP712,
      MsgDeposit.toSDK(msg),
      MsgDeposit.encode(msg).finish(),
    );
  }

  public async withdraw(msg: MsgWithdraw) {
    return await this.basic.tx(
      MsgWithdrawTypeUrl,
      msg.creator,
      MsgWithdrawSDKTypeEIP712,
      MsgWithdraw.toSDK(msg),
      MsgWithdraw.encode(msg).finish(),
    );
  }

  public async disableRefund(msg: MsgDisableRefund) {
    return await this.basic.tx(
      MsgDisableRefundTypeUrl,
      msg.owner,
      MsgDisableRefundSDKTypeEIP712,
      MsgDisableRefund.toSDK(msg),
      MsgDisableRefund.encode(msg).finish(),
    );
  }
}
