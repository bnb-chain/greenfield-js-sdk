import { MsgSendSDKTypeEIP712, MsgSendTypeUrl } from '@/messages/bank/MsgSend';
import {
  MsgCreatePaymentAccountSDKTypeEIP712,
  MsgCreatePaymentAccountTypeUrl,
} from '@/messages/greenfield/payment/MsgCreatePaymentAccount';
import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import {
  QueryClientImpl as AuthQueryClientImpl,
  QueryModuleAccountByNameResponse,
  QueryModuleAccountsResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/query';
import {
  QueryClientImpl as BankQueryClientImpl,
  QueryBalanceRequest,
  QueryBalanceResponse,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/bank/v1beta1/query';
import { MsgMultiSend, MsgSend } from '@bnb-chain/greenfield-cosmos-types/cosmos/bank/v1beta1/tx';
import {
  QueryClientImpl as PaymentQueryClientImpl,
  QueryGetPaymentAccountRequest,
  QueryGetPaymentAccountResponse,
  QueryGetPaymentAccountsByOwnerResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/query';
import { MsgCreatePaymentAccount } from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/tx';
import { ITxOption, SimulateOrBroad, SimulateOrBroadResponse } from '..';
import { Basic } from './basic';
import { MsgMultiSendSDKTypeEIP712, MsgMultiSendTypeUrl } from '@/messages/bank/MsgMultiSend';

export interface IAccount {
  /**
   * retrieves account information for a given address.
   */
  getAccount(address: string): Promise<BaseAccount>;

  /**
   * retrieves balance information of an account for a given address.
   */
  getAccountBalance(request: QueryBalanceRequest): Promise<QueryBalanceResponse>;

  /**
   * takes an address string as parameters and returns a pointer to a paymentTypes.
   */
  getPaymentAccount(
    request: QueryGetPaymentAccountRequest,
  ): Promise<QueryGetPaymentAccountResponse>;

  getModuleAccounts(): Promise<QueryModuleAccountsResponse>;

  getModuleAccountByName(name: string): Promise<QueryModuleAccountByNameResponse>;

  /**
   * retrieves all payment accounts owned by the given address
   */
  getPaymentAccountsByOwner(owner: string): Promise<QueryGetPaymentAccountsByOwnerResponse>;

  createPaymentAccount<T extends ITxOption>(
    msg: MsgCreatePaymentAccount,
    txOption: T,
  ): Promise<SimulateOrBroad<T>>;
  createPaymentAccount(
    msg: MsgCreatePaymentAccount,
    txOption: ITxOption,
  ): Promise<SimulateOrBroadResponse>;

  /**
   * Transfer function
   */
  transfer<T extends ITxOption>(msg: MsgSend, txOption: T): Promise<SimulateOrBroad<T>>;
  transfer(msg: MsgSend, txOption: ITxOption): Promise<SimulateOrBroadResponse>;

  /**
   * makes transfers from an account to multiple accounts with respect amounts
   */
  multiTransfer<T extends ITxOption>(
    address: string,
    msg: MsgMultiSend,
    txOption: T,
  ): Promise<SimulateOrBroad<T>>;
  multiTransfer(
    address: string,
    msg: MsgMultiSend,
    txOption: ITxOption,
  ): Promise<SimulateOrBroadResponse>;
}

export class Account extends Basic implements IAccount {
  public async multiTransfer(address: string, msg: MsgMultiSend, txOption: ITxOption) {
    return this.boradcastOrSimulate(
      MsgMultiSendTypeUrl,
      address,
      MsgMultiSendSDKTypeEIP712,
      MsgMultiSend.toSDK(msg),
      MsgMultiSend.encode(msg).finish(),
      txOption,
    );
  }

  public async createPaymentAccount(msg: MsgCreatePaymentAccount, txOption: ITxOption) {
    return this.boradcastOrSimulate(
      MsgCreatePaymentAccountTypeUrl,
      msg.creator,
      MsgCreatePaymentAccountSDKTypeEIP712,
      MsgCreatePaymentAccount.toSDK(msg),
      MsgCreatePaymentAccount.encode(msg).finish(),
      txOption,
    );
  }

  public async getPaymentAccountsByOwner(owner: string) {
    const rpcClient = await this.getRpcClient();
    const rpc = new PaymentQueryClientImpl(rpcClient);

    return await rpc.GetPaymentAccountsByOwner({
      owner,
    });
  }

  public async getModuleAccountByName(name: string) {
    const rpcClient = await this.getRpcClient();
    const rpc = new AuthQueryClientImpl(rpcClient);
    return rpc.ModuleAccountByName({
      name,
    });
  }

  public async getModuleAccounts() {
    const rpcClient = await this.getRpcClient();
    const rpc = new AuthQueryClientImpl(rpcClient);
    return await rpc.ModuleAccounts();
  }

  public async getPaymentAccount(
    request: QueryGetPaymentAccountRequest,
  ): Promise<QueryGetPaymentAccountResponse> {
    const rpcClient = await this.getRpcClient();
    const rpc = new PaymentQueryClientImpl(rpcClient);
    return await rpc.PaymentAccount(request);
  }

  public async getAccountBalance(request: QueryBalanceRequest): Promise<QueryBalanceResponse> {
    const rpcClient = await this.getRpcClient();
    const rpc = new BankQueryClientImpl(rpcClient);
    return await rpc.Balance(request);
  }

  public async getAccount(address: string): Promise<BaseAccount> {
    const client = await this.getQueryClient();
    const account = await client.auth.account(address);
    if (!account) return BaseAccount.fromJSON({});

    return BaseAccount.toJSON(BaseAccount.decode(account.value)) as BaseAccount;
  }

  public async transfer(msg: MsgSend, txOption: ITxOption) {
    return this.boradcastOrSimulate(
      MsgSendTypeUrl,
      msg.fromAddress,
      MsgSendSDKTypeEIP712,
      MsgSend.toSDK(msg),
      MsgSend.encode(msg).finish(),
      txOption,
    );
  }

  protected async boradcastOrSimulate(
    typeUrl: string,
    address: string,
    MsgSDKTypeEIP712: object,
    MsgSDK: object,
    msgBytes: Uint8Array,
    txOption: ITxOption,
  ) {
    const accountInfo = await this.getAccount(address);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgSDKTypeEIP712,
      MsgSDK,
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
