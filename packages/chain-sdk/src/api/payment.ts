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
import { ITxOption, SimulateOrBroad, SimulateOrBroadResponse } from '..';
import { Account } from './account';

export interface IPayment {
  /**
   * retrieves stream record information for a given stream address.
   */
  getStreamRecord(account: string): Promise<QueryGetStreamRecordResponse>;

  /**
   * deposits BNB to a stream account.
   */
  deposit<T extends ITxOption>(msg: MsgDeposit, txOption: T): Promise<SimulateOrBroad<T>>;
  deposit(msg: MsgDeposit, txOption: ITxOption): Promise<SimulateOrBroadResponse>;

  /**
   * withdraws BNB from a stream account.
   */
  withdraw<T extends ITxOption>(msg: MsgWithdraw, txOption: T): Promise<SimulateOrBroad<T>>;
  withdraw(msg: MsgWithdraw, txOption: ITxOption): Promise<SimulateOrBroadResponse>;

  /**
   * disables refund for a stream account.
   */
  disableRefund<T extends ITxOption>(
    msg: MsgDisableRefund,
    txOption: T,
  ): Promise<SimulateOrBroad<T>>;
  disableRefund(msg: MsgDisableRefund, txOption: ITxOption): Promise<SimulateOrBroadResponse>;

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

  public async deposit(msg: MsgDeposit, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.payment.MsgDeposit';
    const msgBytes = MsgDeposit.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.creator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgDepositSDKTypeEIP712,
      MsgDeposit.toSDK(msg),
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
  }

  public async withdraw(msg: MsgWithdraw, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.payment.MsgWithdraw';
    const msgBytes = MsgWithdraw.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.creator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgWithdrawSDKTypeEIP712,
      MsgWithdraw.toSDK(msg),
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
  }

  public async disableRefund(msg: MsgDisableRefund, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.payment.MsgDisableRefund';
    const msgBytes = MsgDisableRefund.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.addr);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgDisableRefundSDKTypeEIP712,
      MsgDisableRefund.toSDK(msg),
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
  }
}
