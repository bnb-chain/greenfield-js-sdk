import { METHOD_GET } from '@/constants/http';
import { fetchWithTimeout, parseErrorXml } from '@/utils/http';
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
import { SourceType } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import { GroupInfo } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/types';
import { Headers } from 'cross-fetch';
import { container, singleton } from 'tsyringe';
import { Bucket } from './bucket';
import { RpcQueryClient } from './queryclient';
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

  listGroup(groupName: string, prefix: string, opts: ListGroupsOptions): Promise<ListGroupsResult>;

  getSPUrlByBucket(bucketName: string): Promise<string>;

  getSPUrlByPrimaryAddr(parimaryAddr: string): Promise<string>;
}

@singleton()
export class Sp implements ISp {
  private bucket = container.resolve(Bucket);
  private queryClient = container.resolve(RpcQueryClient);
  private virtualGroup = container.resolve(VirtualGroup);

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

  public async listGroup(groupName: string, prefix: string, opts: ListGroupsOptions) {
    const MaximumGetGroupListLimit = 1000;
    const MaximumGetGroupListOffset = 100000;
    const DefaultGetGroupListLimit = 50;

    const res: ListGroupsResult = {
      groups: [],
      count: '0',
    };

    if (groupName === '' || prefix === '') {
      return res;
    }

    if (opts.limit < 0) {
      return res;
    } else if (opts.limit > MaximumGetGroupListLimit) {
      opts.limit = MaximumGetGroupListLimit;
    } else if (opts.limit === 0) {
      opts.limit = DefaultGetGroupListLimit;
    }

    if (opts.offset < 0 || opts.offset > MaximumGetGroupListOffset) {
      return res;
    }

    let headerContent: Record<string, any> = {};
    const sp = await this.getInServiceSP();
    headerContent = {
      ...headerContent,
    };
    const url = `${sp.endpoint}?group-query&name=${groupName}&prefix=${prefix}&source-type=${opts.sourceType}&limit=${opts.limit}&offset=${opts.offset}`;

    const headers = new Headers(headerContent);
    const result = await fetchWithTimeout(url, {
      headers,
      method: METHOD_GET,
    });

    const { status } = result;
    if (!result.ok) {
      const { code, message } = await parseErrorXml(result);
      throw {
        code: code || -1,
        message: message || 'Get group list error.',
        statusCode: status,
      };
    }

    return await result.json();
  }
}

type ListGroupsOptions = {
  sourceType: keyof typeof SourceType;
  limit: number;
  offset: number;
};

type ListGroupsResult = {
  groups: {
    group: GroupInfo;
    operator: string;
    create_at: number;
    create_time: number;
    update_at: number;
    update_time: number;
    removed: boolean;
  }[];
  count: string;
};
