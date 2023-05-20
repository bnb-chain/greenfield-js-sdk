import { MsgMultiSendSDKTypeEIP712, MsgMultiSendTypeUrl } from '@/messages/bank/MsgMultiSend';
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
import { BroadcastOptions, SimulateOptions, TxResponse } from '..';
import { Basic } from './basic';

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

  createPaymentAccount(msg: MsgCreatePaymentAccount): Promise<TxResponse>;

  /**
   * Transfer function
   */
  transfer(msg: MsgSend): Promise<TxResponse>;

  /**
   * makes transfers from an account to multiple accounts with respect amounts
   */
  multiTransfer(address: string, msg: MsgMultiSend): Promise<TxResponse>;
}

export class Account extends Basic implements IAccount {
  public async multiTransfer(address: string, msg: MsgMultiSend) {
    return await this.tx(
      MsgMultiSendTypeUrl,
      address,
      MsgMultiSendSDKTypeEIP712,
      MsgMultiSend.toSDK(msg),
      MsgMultiSend.encode(msg).finish(),
    );
  }

  public async createPaymentAccount(msg: MsgCreatePaymentAccount) {
    return await this.tx(
      MsgCreatePaymentAccountTypeUrl,
      msg.creator,
      MsgCreatePaymentAccountSDKTypeEIP712,
      MsgCreatePaymentAccount.toSDK(msg),
      MsgCreatePaymentAccount.encode(msg).finish(),
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

  public async transfer(msg: MsgSend) {
    return await this.tx(
      MsgSendTypeUrl,
      msg.fromAddress,
      MsgSendSDKTypeEIP712,
      MsgSend.toSDK(msg),
      MsgSend.encode(msg).finish(),
    );
  }

  protected async tx(
    typeUrl: string,
    address: string,
    MsgSDKTypeEIP712: object,
    MsgSDK: object,
    msgBytes: Uint8Array,
  ) {
    const accountInfo = await this.getAccount(address);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    return {
      simulate: async (opts: SimulateOptions) => {
        return await this.simulateRawTx(bodyBytes, accountInfo, opts);
      },
      broadcast: async (opts: BroadcastOptions) => {
        const rawTxBytes = await this.getRawTxBytes(
          typeUrl,
          MsgSDKTypeEIP712,
          MsgSDK,
          bodyBytes,
          accountInfo,
          opts,
        );

        return await this.broadcastRawTx(rawTxBytes);
      },
    };
  }
}
