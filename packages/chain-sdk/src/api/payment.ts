import { MsgDepositSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/payment/MsgDepositSDKTypeEIP712';
import { MsgDisableRefundSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/payment/MsgDisableRefundSDKTypeEIP712';
import { MsgWithdrawSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/payment/MsgWithdrawSDKTypeEIP712';
import {
  QueryClientImpl as PaymentQueryClientImpl,
  QueryGetStreamRecordResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/query';
import {
  MsgDeposit,
  MsgDisableRefund,
  MsgWithdraw,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/tx';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { Account } from './account';
import { ITxOption } from './basic';
import { ISimulateGasFee } from '@/utils/units';

export interface IPayment {
  /**
   * retrieves stream record information for a given stream address.
   */
  getStreamRecord(account: string): Promise<QueryGetStreamRecordResponse>;

  /**
   * deposits BNB to a stream account.
   */
  deposit(msg: MsgDeposit, txOption: ITxOption): Promise<DeliverTxResponse | ISimulateGasFee>;

  /**
   * withdraws BNB from a stream account.
   */
  withdraw(msg: MsgWithdraw, txOption: ITxOption): Promise<DeliverTxResponse | ISimulateGasFee>;

  /**
   * disables refund for a stream account.
   */
  disableRefund(
    msg: MsgDisableRefund,
    txOption: ITxOption,
  ): Promise<DeliverTxResponse | ISimulateGasFee>;
}

export class Payment extends Account implements IPayment {
  public async getStreamRecord(account: string) {
    const rpcClient = await this.getRpcClient();
    const rpc = new PaymentQueryClientImpl(rpcClient);
    return await rpc.StreamRecord({
      account,
    });
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
