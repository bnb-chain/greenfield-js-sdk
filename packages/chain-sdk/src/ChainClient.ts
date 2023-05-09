import { Account, IAccount } from './api/account';
import { Basic, IBasic } from './api/basic';

export class ChainClient {
  static create(rpcUrl: string, chainId: string): ChainClient {
    return new ChainClient(new Account(rpcUrl, chainId), new Basic(rpcUrl, chainId));
  }

  constructor(public account: IAccount, public basic: IBasic) {}
}
