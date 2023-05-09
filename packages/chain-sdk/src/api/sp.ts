import { QueryClientImpl as SpQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/query';
import {
  SecondarySpStorePrice,
  SpStoragePrice,
  Status,
  StorageProvider,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/types';
import Long from 'long';
import { MsgUpdateSpStoragePrice } from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/tx';
import { Account } from './account';
import { ITxOption } from './basic';
import { MsgUpdateSpStoragePriceSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/sp/MsgUpdateSpStoragePriceSDKTypeEIP712';

export interface ISp {
  /**
   * return the storage provider info on chain
	  isInService indicates if only display the sp with STATUS_IN_SERVICE status
   */
  listStorageProviders(isInService: boolean): Promise<(StorageProvider | undefined)[]>;

  /**
   * return the sp info with the sp chain address
   */
  getStorageProviderInfo(spAddress: string): Promise<StorageProvider | undefined>;

  /**
   * returns the storage price for a particular storage provider, including update time, read price, store price and .etc.
   */
  getStoragePrice(spAddress: string): Promise<SpStoragePrice | undefined>;

  /**
   * returns the secondary storage price, including update time and store price
   */
  getSecondarySpStorePrice(): Promise<SecondarySpStorePrice | undefined>;

  /**
   * submit a grant transaction to allow gov module account to deduct the specified number of tokens
   */
}

export class Sp extends Account implements ISp {
  public async listStorageProviders(isInService: boolean) {
    const rpcClient = await this.getRpcClient();
    const rpc = new SpQueryClientImpl(rpcClient);
    const res = await rpc.StorageProviders();
    return res.sps.map((sp) => {
      if (isInService && sp.status !== Status.STATUS_IN_SERVICE) return;
      return sp;
    });
  }

  public async getStorageProviderInfo(spAddress: string) {
    const rpcClient = await this.getRpcClient();
    const rpc = new SpQueryClientImpl(rpcClient);
    const res = await rpc.StorageProvider({
      spAddress,
    });
    return res.storageProvider;
  }

  public async getStoragePrice(spAddress: string) {
    const rpcClient = await this.getRpcClient();
    const rpc = new SpQueryClientImpl(rpcClient);
    const res = await rpc.QueryGetSpStoragePriceByTime({
      timestamp: Long.fromNumber(0),
      spAddr: spAddress,
    });
    return res.spStoragePrice;
  }

  public async getSecondarySpStorePrice() {
    const rpcClient = await this.getRpcClient();
    const rpc = new SpQueryClientImpl(rpcClient);
    const res = await rpc.QueryGetSecondarySpStorePriceByTime({
      timestamp: Long.fromNumber(0),
    });
    return res.secondarySpStorePrice;
  }

  public async updateSpStoragePrice(
    address: string,
    msg: MsgUpdateSpStoragePrice,
    txOption: ITxOption,
  ) {
    const typeUrl = '/bnbchain.greenfield.sp.MsgUpdateSpStoragePrice';
    const msgBytes = MsgUpdateSpStoragePrice.encode(msg).finish();
    const accountInfo = await this.getAccount(address);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgUpdateSpStoragePriceSDKTypeEIP712,
      MsgUpdateSpStoragePrice.toSDK(msg),
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
