import { Account, Address, WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { getJSONRpcAccount, getPrivateKeyAccount, getPublicClient } from '../../account';
import { isJSONRpcAccount, isPrivateKeyAccount } from '../../asserts';
import { BasicClientParams } from '../../types';

export class BasicClient {
  protected publicClient: any;
  protected walletClient: WalletClient;
  protected account: Account | Address;

  constructor(initParams: BasicClientParams) {
    const { chainConfig, accountConfig } = initParams;

    if (isJSONRpcAccount(accountConfig)) {
      this.walletClient = getJSONRpcAccount(accountConfig, chainConfig);
      this.account = accountConfig.address;
    }
    if (isPrivateKeyAccount(accountConfig)) {
      this.walletClient = getPrivateKeyAccount(accountConfig, chainConfig);
      this.account = privateKeyToAccount(accountConfig.privateKey);
    }

    this.publicClient = getPublicClient(chainConfig);
  }
}
