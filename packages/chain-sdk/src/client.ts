import 'reflect-metadata';
import { container, injectable } from 'tsyringe';
import { Account, IAccount } from './api/account';
import { Bucket, IBucket } from './api/bucket';
import { Challenge, IChallenge } from './api/challenge';
import { CrossChain, ICrossChain } from './api/crosschain';
import { Distribution, IDistribution } from './api/distribution';
import { FeeGrant, IFeeGrant } from './api/feegrant';
import { Group, IGroup } from './api/group';
import { IObject, Objectt } from './api/objectt';
import { IPayment, Payment } from './api/payment';
import { ISp, Sp } from './api/sp';
import { IOffChainAuth, OffChainAuth } from './api/offchainauth';
import { IStorage, Storage } from './api/storage';
import { Basic, IBasic } from './api/basic';

@injectable()
export class Client {
  static create(rpcUrl: string, chainId: string): Client {
    container.register('RPC_URL', { useValue: rpcUrl });
    container.register('CHAIN_ID', { useValue: chainId });

    const account = container.resolve<Account>(Account);
    const basic = container.resolve<Basic>(Basic);
    const bucket = container.resolve<Bucket>(Bucket);
    const challenge = container.resolve<Challenge>(Challenge);
    const crosschain = container.resolve<CrossChain>(CrossChain);
    const distribution = container.resolve<Distribution>(Distribution);
    const feegrant = container.resolve<FeeGrant>(FeeGrant);
    const group = container.resolve<Group>(Group);
    const objectt = container.resolve<Objectt>(Objectt);
    const payment = container.resolve<Payment>(Payment);
    const sp = container.resolve<Sp>(Sp);
    const storage = container.resolve<Storage>(Storage);
    const offchainauth = container.resolve<OffChainAuth>(OffChainAuth);

    return new Client(
      account,
      basic,
      bucket,
      challenge,
      crosschain,
      distribution,
      feegrant,
      group,
      objectt,
      payment,
      sp,
      storage,
      offchainauth,
    );
  }

  constructor(
    public account: IAccount,
    public basic: IBasic,
    public bucket: IBucket,
    public challenge: IChallenge,
    public crosschain: ICrossChain,
    public distribution: IDistribution,
    public feegrant: IFeeGrant,
    public group: IGroup,
    public object: IObject,
    public payment: IPayment,
    public sp: ISp,
    public storage: IStorage,
    public offchainauth: IOffChainAuth,
  ) {}
}
