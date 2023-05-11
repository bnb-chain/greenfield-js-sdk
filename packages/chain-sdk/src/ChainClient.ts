import { Account, IAccount } from './api/account';
import { FileHandler } from '@bnb-chain/greenfiled-file-handle';
import { Basic, IBasic } from './api/basic';
import { Bucket, IBucket } from './api/bucket';
import { Challenge, IChallenge } from './api/challenge';
import { CrossChain, ICrossChain } from './api/crosschain';
import { Distribution, IDistribution } from './api/distribution';
import { Group, IGroup } from './api/group';
import { IObject, Object } from './api/object';
import { IPayment, Payment } from './api/payment';
import { ISp, Sp } from './api/sp';

export class ChainClient {
  static create(rpcUrl: string, chainId: string): ChainClient {
    return new ChainClient(
      new Account(rpcUrl, chainId),
      new Basic(rpcUrl, chainId),
      new Bucket(rpcUrl, chainId),
      new Challenge(rpcUrl, chainId),
      new CrossChain(rpcUrl, chainId),
      new Distribution(rpcUrl, chainId),
      new Group(rpcUrl, chainId),
      new Object(rpcUrl, chainId),
      new Payment(rpcUrl, chainId),
      new Sp(rpcUrl, chainId),
    );
  }

  constructor(
    public account: IAccount,
    public basic: IBasic,
    public bucket: IBucket,
    public challenge: IChallenge,
    public crosschain: ICrossChain,
    public distribution: IDistribution,
    public group: IGroup,
    public object: IObject,
    public payment: IPayment,
    public sp: ISp,
  ) {}
}
