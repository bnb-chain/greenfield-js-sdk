import { MsgDepositSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgDeposit';
import { MsgDisableRefundSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgDisableRefund';
import { MsgWithdrawSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgWithdraw';
import {
  QueryGetStreamRecordResponse,
  QueryParamsResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/query';
import {
  MsgDeposit,
  MsgDisableRefund,
  MsgWithdraw,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/tx';
import { container, singleton } from 'tsyringe';
import { TxResponse } from '..';
import { Basic } from './basic';
import { RpcQueryClient } from './queryclient';

export interface IPayment {
  /**
   * retrieves stream record information for a given stream address.
   */
  getStreamRecord(account: string): Promise<QueryGetStreamRecordResponse>;

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

  public async params() {
    const rpc = await this.queryClient.getPaymentQueryClient();
    return await rpc.Params();
  }

  public async deposit(msg: MsgDeposit) {
    return await this.basic.tx(
      '/greenfield.payment.MsgDeposit',
      msg.creator,
      MsgDepositSDKTypeEIP712,
      MsgDeposit.toSDK(msg),
      MsgDeposit.encode(msg).finish(),
    );
  }

  public async withdraw(msg: MsgWithdraw) {
    return await this.basic.tx(
      '/greenfield.payment.MsgWithdraw',
      msg.creator,
      MsgWithdrawSDKTypeEIP712,
      MsgWithdraw.toSDK(msg),
      MsgWithdraw.encode(msg).finish(),
    );
  }

  public async disableRefund(msg: MsgDisableRefund) {
    return await this.basic.tx(
      '/greenfield.payment.MsgDisableRefund',
      msg.addr,
      MsgDisableRefundSDKTypeEIP712,
      MsgDisableRefund.toSDK(msg),
      MsgDisableRefund.encode(msg).finish(),
    );
  }
}
