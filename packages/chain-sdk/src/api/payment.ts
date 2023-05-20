import { MsgDepositSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgDeposit';
import { MsgDisableRefundSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgDisableRefund';
import { MsgWithdrawSDKTypeEIP712 } from '@/messages/greenfield/payment/MsgWithdraw';
import {
  QueryClientImpl as PaymentQueryClientImpl,
  QueryGetStreamRecordResponse,
  QueryParamsResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/query';
import {
  MsgDeposit,
  MsgDisableRefund,
  MsgWithdraw,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/tx';
import { TxResponse } from '..';
import { Account } from './account';

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

export class Payment extends Account implements IPayment {
  public async getStreamRecord(account: string) {
    const rpcClient = await this.getRpcClient();
    const rpc = new PaymentQueryClientImpl(rpcClient);
    return await rpc.StreamRecord({
      account,
    });
  }

  public async params() {
    const rpcClient = await this.getRpcClient();
    const rpc = new PaymentQueryClientImpl(rpcClient);
    return await rpc.Params();
  }

  public async deposit(msg: MsgDeposit) {
    return await this.tx(
      '/greenfield.payment.MsgDeposit',
      msg.creator,
      MsgDepositSDKTypeEIP712,
      MsgDeposit.toSDK(msg),
      MsgDeposit.encode(msg).finish(),
    );
  }

  public async withdraw(msg: MsgWithdraw) {
    return await this.tx(
      '/greenfield.payment.MsgWithdraw',
      msg.creator,
      MsgWithdrawSDKTypeEIP712,
      MsgWithdraw.toSDK(msg),
      MsgWithdraw.encode(msg).finish(),
    );
  }

  public async disableRefund(msg: MsgDisableRefund) {
    return await this.tx(
      '/greenfield.payment.MsgDisableRefund',
      msg.addr,
      MsgDisableRefundSDKTypeEIP712,
      MsgDisableRefund.toSDK(msg),
      MsgDisableRefund.encode(msg).finish(),
    );
  }
}
