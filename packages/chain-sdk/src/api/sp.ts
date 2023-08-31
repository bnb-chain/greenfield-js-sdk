import { parseListGroupsResponse } from '@/clients/spclient/spApis/listGroups';
import { parseError } from '@/clients/spclient/spApis/parseError';
import { SpClient } from '@/clients/spclient/spClient';
import { METHOD_GET, NORMAL_ERROR_CODE } from '@/constants/http';
import { IObjectResultType, TListGroups } from '@/types/storage';
import {
  QueryGlobalSpStorePriceByTimeRequest,
  QueryGlobalSpStorePriceByTimeResponse,
  QueryParamsResponse,
  QuerySpStoragePriceRequest,
  QuerySpStoragePriceResponse,
  QueryStorageProviderByOperatorAddressRequest,
  QueryStorageProviderByOperatorAddressResponse,
  QueryStorageProviderMaintenanceRecordsRequest,
  QueryStorageProviderMaintenanceRecordsResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/query';
import { Status, StorageProvider } from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/types';
import { container, singleton } from 'tsyringe';
import { ListGroupsResponse } from '..';
import { RpcQueryClient } from '../clients/queryclient';
import { Bucket } from './bucket';
import { VirtualGroup } from './virtualGroup';

export interface ISp {
  /**
   * return the storage provider info on chain
	  isInService indicates if only display the sp with STATUS_IN_SERVICE status
   */
  getStorageProviders(): Promise<StorageProvider[]>;

  /**
   * return the sp info with the sp chain address
   */
  getStorageProviderInfo(spId: number): Promise<StorageProvider | undefined>;

  /**
   * get the latest storage price of specific sp
   */
  getQuerySpStoragePrice(request: QuerySpStoragePriceRequest): Promise<QuerySpStoragePriceResponse>;

  /**
   * get global store price by time
   */
  getQueryGlobalSpStorePriceByTime(
    request: QueryGlobalSpStorePriceByTimeRequest,
  ): Promise<QueryGlobalSpStorePriceByTimeResponse>;

  /**
   * Queries a StorageProvider by specify operator address.
   */
  getStorageProviderByOperatorAddress(
    request: QueryStorageProviderByOperatorAddressRequest,
  ): Promise<QueryStorageProviderByOperatorAddressResponse>;

  /**
   * Queries a StorageProvider by specify operator address.
   */
  getStorageProviderMaintenanceRecordsByOperatorAddress(
    request: QueryStorageProviderMaintenanceRecordsRequest,
  ): Promise<QueryStorageProviderMaintenanceRecordsResponse>;

  params(): Promise<QueryParamsResponse>;

  listGroups(params: TListGroups): Promise<IObjectResultType<ListGroupsResponse>>;

  getSPUrlByBucket(bucketName: string): Promise<string>;

  getSPUrlByPrimaryAddr(parimaryAddr: string): Promise<string>;

  getSPUrlById(primaryId: number): Promise<string>;
}

@singleton()
export class Sp implements ISp {
  private bucket = container.resolve(Bucket);
  private queryClient = container.resolve(RpcQueryClient);
  private virtualGroup = container.resolve(VirtualGroup);
  private spClient = container.resolve(SpClient);

  public async getStorageProviders() {
    const rpc = await this.queryClient.getSpQueryClient();
    const res = await rpc.StorageProviders();
    return res.sps;
  }

  public async getStorageProviderInfo(spId: number) {
    const rpc = await this.queryClient.getSpQueryClient();
    const res = await rpc.StorageProvider({
      id: spId,
    });
    return res.storageProvider;
  }

  public async getQuerySpStoragePrice(request: QuerySpStoragePriceRequest) {
    const rpc = await this.queryClient.getSpQueryClient();
    return await rpc.QuerySpStoragePrice(request);
  }

  public async getQueryGlobalSpStorePriceByTime(request: QueryGlobalSpStorePriceByTimeRequest) {
    const rpc = await this.queryClient.getSpQueryClient();
    return await rpc.QueryGlobalSpStorePriceByTime(request);
  }

  public async getStorageProviderByOperatorAddress(
    request: QueryStorageProviderByOperatorAddressRequest,
  ) {
    const rpc = await this.queryClient.getSpQueryClient();
    return await rpc.StorageProviderByOperatorAddress(request);
  }

  public async getStorageProviderMaintenanceRecordsByOperatorAddress(
    request: QueryStorageProviderMaintenanceRecordsRequest,
  ) {
    const rpc = await this.queryClient.getSpQueryClient();
    return await rpc.StorageProviderMaintenanceRecordsByOperatorAddress(request);
  }

  public async getSPUrlById(primaryId: number) {
    const spList = await this.getStorageProviders();
    return spList.filter((sp) => sp.id === primaryId)[0].endpoint;
  }

  public async getSPUrlByBucket(bucketName: string) {
    const { bucketInfo } = await this.bucket.headBucket(bucketName);

    if (!bucketInfo) throw new Error('Get bucket info error');

    const familyResp = await this.virtualGroup.getGlobalVirtualGroupFamily({
      familyId: bucketInfo.globalVirtualGroupFamilyId,
    });

    const spList = await this.getStorageProviders();
    const spId = familyResp.globalVirtualGroupFamily?.primarySpId;

    return spList.filter((sp) => sp.id === spId)[0].endpoint;
  }

  public async getSPUrlByPrimaryAddr(parimaryAddr: string) {
    const sps = await this.getStorageProviders();
    return sps.filter((sp) => sp.operatorAddress === parimaryAddr)[0].endpoint;
  }

  public async params() {
    const rpc = await this.queryClient.getSpQueryClient();
    return await rpc.Params();
  }

  public async getInServiceSP() {
    const sps = await this.getStorageProviders();
    const spList = sps.filter((sp) => sp.status === Status.STATUS_IN_SERVICE);
    if (spList.length === 0) throw new Error('No storage provider found');
    return spList[0];
  }

  public async listGroups(params: TListGroups) {
    try {
      const { name, prefix, sourceType, limit, offset } = params;

      let res: ListGroupsResponse = {
        GfSpGetGroupListResponse: {
          Groups: [],
          Count: 0,
        },
      };

      if (name === '' || prefix === '') {
        return {
          code: 0,
          message: 'success',
          body: res,
        };
      }

      const sp = await this.getInServiceSP();
      const url = `${sp.endpoint}?group-query=null&name=${name}&prefix=${prefix}&source-type=${sourceType}&limit=${limit}&offset=${offset}`;

      const result = await this.spClient.callApi(
        url,
        {
          headers: {},
          method: METHOD_GET,
        },
        3000,
      );
      const { status } = result;
      if (!result.ok) {
        const xmlError = await result.text();
        const { code, message } = await parseError(xmlError);
        throw {
          code: code || -1,
          message: message || 'error',
          statusCode: status,
        };
      }

      const xmlData = await result.text();
      res = await parseListGroupsResponse(xmlData);

      return {
        code: 0,
        message: 'success',
        statusCode: status,
        body: res,
      };
    } catch (error: any) {
      return {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }
}
