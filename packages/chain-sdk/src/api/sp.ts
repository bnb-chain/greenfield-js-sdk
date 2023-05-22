import { MsgUpdateSpStoragePriceSDKTypeEIP712 } from '@/messages/greenfield/sp/MsgUpdateSpStoragePrice';

import { MsgUpdateSpStoragePrice } from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/tx';
import {
  SecondarySpStorePrice,
  SpStoragePrice,
  StorageProvider,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/types';
import Long from 'long';
import { container, delay, inject, singleton } from 'tsyringe';
import { Basic } from './basic';
import { RpcQueryClient } from './queryclient';

export interface ISp {
  /**
   * return the storage provider info on chain
	  isInService indicates if only display the sp with STATUS_IN_SERVICE status
   */
  getStorageProviders(): Promise<StorageProvider[]>;

  /**
   * return the sp info with the sp chain address
   */
  getStorageProviderInfo(spAddress: string): Promise<StorageProvider | undefined>;

  /**
   * returns the storage price for a particular storage provider, including update time, read price, store price and .etc.
   */
  getStoragePriceByTime(spAddress: string): Promise<SpStoragePrice | undefined>;

  /**
   * returns the secondary storage price, including update time and store price
   */
  getSecondarySpStorePrice(): Promise<SecondarySpStorePrice | undefined>;

  /**
   * submit a grant transaction to allow gov module account to deduct the specified number of tokens
   */
}

@singleton()
export class Sp implements ISp {
  constructor(@inject(delay(() => Basic)) private basic: Basic) {}
  private queryClient = container.resolve(RpcQueryClient);

  public async getStorageProviders() {
    const rpc = await this.queryClient.getSpQueryClient();
    const res = await rpc.StorageProviders();
    return res.sps;
  }

  public async getStorageProviderInfo(spAddress: string) {
    const rpc = await this.queryClient.getSpQueryClient();
    const res = await rpc.StorageProvider({
      spAddress,
    });
    return res.storageProvider;
  }

  public async getStoragePriceByTime(spAddress: string) {
    const rpc = await this.queryClient.getSpQueryClient();
    const res = await rpc.QueryGetSpStoragePriceByTime({
      timestamp: Long.fromNumber(0),
      spAddr: spAddress,
    });
    return res.spStoragePrice;
  }

  public async getSecondarySpStorePrice() {
    const rpc = await this.queryClient.getSpQueryClient();
    const res = await rpc.QueryGetSecondarySpStorePriceByTime({
      timestamp: Long.fromNumber(0),
    });
    return res.secondarySpStorePrice;
  }

  public async updateSpStoragePrice(address: string, msg: MsgUpdateSpStoragePrice) {
    return await this.basic.tx(
      '/greenfield.sp.MsgUpdateSpStoragePrice',
      address,
      MsgUpdateSpStoragePriceSDKTypeEIP712,
      MsgUpdateSpStoragePrice.toSDK(msg),
      MsgUpdateSpStoragePrice.encode(msg).finish(),
    );
  }
}
