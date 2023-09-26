import 'reflect-metadata';
import { container } from 'tsyringe';
import { Account, IAccount } from './api/account';
import { Basic, IBasic } from './api/basic';
import { Bucket, IBucket } from './api/bucket';
import { Challenge, IChallenge } from './api/challenge';
import { CrossChain, ICrossChain } from './api/crosschain';
import { Distribution, IDistribution } from './api/distribution';
import { FeeGrant, IFeeGrant } from './api/feegrant';
import { Gashub, IGashub } from './api/gashub';
import { Group, IGroup } from './api/group';
import { IObject, Objectt } from './api/objectt';
import { IOffChainAuth, OffChainAuth } from './api/offchainauth';
import { IPayment, Payment } from './api/payment';
import { IProposal, Proposal } from './api/proposal';
import { ISp, Sp } from './api/sp';
import { IStorage, Storage } from './api/storage';
import { Validator } from './api/validator';
import { IVirtualGroup, VirtualGroup } from './api/virtualGroup';
import { RpcQueryClient } from './clients/queryclient';
import { ISpClient, SpClient } from './clients/spclient/spClient';
import { ITxClient, TxClient } from './clients/txClient';

export class Client {
  /**
   * @rpcUrl string
   * @chaidId string
   * @wasmURL optional, need setting only used for browser
   */
  static create(
    rpcUrl: string,
    chainId: string,
    wasmURL?: {
      zkCryptoUrl?: string;
    },
  ): Client {
    container.register('RPC_URL', { useValue: rpcUrl });
    container.register('CHAIN_ID', { useValue: chainId });
    container.register('ZK_CRYPTO', { useValue: wasmURL?.zkCryptoUrl });

    if (wasmURL?.zkCryptoUrl) {
      (globalThis as any).__PUBLIC_ZKCRYPTO_WASM_PATH__ = wasmURL.zkCryptoUrl;
    }

    const account = container.resolve<Account>(Account);
    const basic = container.resolve<Basic>(Basic);
    const bucket = container.resolve<Bucket>(Bucket);
    const challenge = container.resolve<Challenge>(Challenge);
    const crosschain = container.resolve<CrossChain>(CrossChain);
    const distribution = container.resolve<Distribution>(Distribution);
    const feegrant = container.resolve<FeeGrant>(FeeGrant);
    const gashub = container.resolve<Gashub>(Gashub);
    const group = container.resolve<Group>(Group);
    const objectt = container.resolve<Objectt>(Objectt);
    const payment = container.resolve<Payment>(Payment);
    const proposal = container.resolve<Proposal>(Proposal);
    const queryClient = container.resolve<RpcQueryClient>(RpcQueryClient);
    const sp = container.resolve<Sp>(Sp);
    const spClient = container.resolve(SpClient);
    const storage = container.resolve<Storage>(Storage);
    const txClient = container.resolve<TxClient>(TxClient);
    const offchainauth = container.resolve<OffChainAuth>(OffChainAuth);
    const validator = container.resolve<Validator>(Validator);
    const virtualGroup = container.resolve<VirtualGroup>(VirtualGroup);

    return new Client(
      account,
      basic,
      bucket,
      challenge,
      crosschain,
      distribution,
      feegrant,
      gashub,
      group,
      objectt,
      payment,
      proposal,
      queryClient,
      sp,
      spClient,
      storage,
      txClient,
      offchainauth,
      validator,
      virtualGroup,
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
    public gashub: IGashub,
    public group: IGroup,
    public object: IObject,
    public payment: IPayment,
    public proposal: IProposal,
    public queryClient: RpcQueryClient,
    public sp: ISp,
    public spClient: ISpClient,
    public storage: IStorage,
    public txClient: ITxClient,
    public offchainauth: IOffChainAuth,
    public validator: Validator,
    public virtualGroup: IVirtualGroup,
  ) {}
}
