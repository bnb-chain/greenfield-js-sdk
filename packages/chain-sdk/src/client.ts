import { Account, IAccount } from './api/account';
import { Basic, IBasic } from './api/basic';
import { Bucket, IBucket } from './api/bucket';
import { Challenge, IChallenge } from './api/challenge';
import { CrossChain, ICrossChain } from './api/crosschain';
import { Distribution, IDistribution } from './api/distribution';
import { Group, IGroup } from './api/group';
import { IObject, Objectt } from './api/objectt';
import { IPayment, Payment } from './api/payment';
import { ISp, Sp } from './api/sp';

export class Client {
  static create(rpcUrl: string, chainId: string): Client {
    const account = new Account(rpcUrl, chainId);
    const basic = new Basic(rpcUrl, chainId);
    const bucket = new Bucket(rpcUrl, chainId);
    const challenge = new Challenge(rpcUrl, chainId);
    const crosschain = new CrossChain(rpcUrl, chainId);
    const distribution = new Distribution(rpcUrl, chainId);
    const group = new Group(rpcUrl, chainId);
    const object = new Objectt(rpcUrl, chainId);
    const payment = new Payment(rpcUrl, chainId);
    const sp = new Sp(rpcUrl, chainId);

    return new Client(
      account,
      basic,
      bucket,
      challenge,
      crosschain,
      distribution,
      group,
      object,
      payment,
      sp,
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
