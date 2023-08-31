import { getSortQuery, HTTPHeaderUserAddress } from '@/clients/spclient/auth';
import { getBucketApprovalMetaInfo } from '@/clients/spclient/spApis/bucketApproval';
import { parseGetBucketMetaResponse } from '@/clients/spclient/spApis/getBucketMeta';
import { parseGetUserBucketsResponse } from '@/clients/spclient/spApis/getUserBuckets';
import {
  getListBucketReadRecordMetaInfo,
  parseListBucketReadRecordResponse,
} from '@/clients/spclient/spApis/listBucketReadRecords';
import { parseListBucketsByIdsResponse } from '@/clients/spclient/spApis/listBucketsByIds';
import { getMigrateMetaInfo } from '@/clients/spclient/spApis/migrateApproval';
import { parseError } from '@/clients/spclient/spApis/parseError';
import {
  getQueryBucketReadQuotaMetaInfo,
  parseReadQuotaResponse,
} from '@/clients/spclient/spApis/queryBucketReadQuota';
import { METHOD_GET, NORMAL_ERROR_CODE } from '@/constants/http';
import { MsgCreateBucketSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgCreateBucket';
import { MsgDeleteBucketSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgDeleteBucket';
import { MsgMigrateBucketSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgMigrateBucket';
import { MsgUpdateBucketInfoSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgUpdateBucketInfo';
import {
  GetBucketMetaRequest,
  GetBucketMetaResponse,
  GetUserBucketsResponse,
  ListBucketsByIDsResponse,
} from '@/types/sp-xml';
import { ListBucketReadRecordResponse } from '@/types/sp-xml/ListBucketReadRecordResponse';
import { decodeObjectFromHexString } from '@/utils/encoding';
import { isValidAddress, isValidBucketName, isValidUrl } from '@/utils/s3';
import { UInt64Value } from '@bnb-chain/greenfield-cosmos-types/greenfield/common/wrapper';
import {
  ActionType,
  Principal,
  PrincipalType,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';
import { visibilityTypeFromJSON } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import {
  QueryBucketNFTResponse,
  QueryHeadBucketResponse,
  QueryNFTRequest,
  QueryPolicyForAccountRequest,
  QueryPolicyForAccountResponse,
  QueryVerifyPermissionResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';
import {
  MsgCreateBucket,
  MsgDeleteBucket,
  MsgDeletePolicy,
  MsgMigrateBucket,
  MsgPutPolicy,
  MsgUpdateBucketInfo,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { bytesFromBase64 } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { Headers } from 'cross-fetch';
import { bytesToUtf8, hexToBytes } from 'ethereum-cryptography/utils';
import Long from 'long';
import { container, delay, inject, singleton } from 'tsyringe';
import {
  GRNToString,
  MsgCreateBucketTypeUrl,
  MsgDeleteBucketTypeUrl,
  MsgMigrateBucketTypeUrl,
  MsgUpdateBucketInfoTypeUrl,
  newBucketGRN,
  TxResponse,
} from '..';
import { RpcQueryClient } from '../clients/queryclient';
import { AuthType, SpClient } from '../clients/spclient/spClient';
import {
  IBaseGetCreateBucket,
  ICreateBucketMsgType,
  IMigrateBucketMsgType,
  IObjectResultType,
  IQuotaProps,
  TBaseGetBucketReadQuota,
  TGetUserBuckets,
  TListBucketReadRecord,
  TListBucketsByIDsRequest,
} from '../types/storage';
import { Basic } from './basic';
import { Sp } from './sp';
import { Storage } from './storage';

export interface IBucket {
  /**
   * returns the signature info for the approval of preCreating resources
   */
  getCreateBucketApproval(
    configParam: IBaseGetCreateBucket,
    authType: AuthType,
  ): Promise<IObjectResultType<string>>;

  /**
   * get approval of creating bucket and send createBucket txn to greenfield chain
   */
  createBucket(params: IBaseGetCreateBucket, authType: AuthType): Promise<TxResponse>;

  /**
   * query the bucketInfo on chain, return the bucket info if exists
   */
  headBucket(bucketName: string): Promise<QueryHeadBucketResponse>;

  /**
   * query the bucketInfo on chain by bucketId, return the bucket info if exists
   */
  headBucketById(bucketId: string): Promise<QueryHeadBucketResponse>;

  headBucketNFT(request: QueryNFTRequest): Promise<QueryBucketNFTResponse>;

  /**
   * check if the permission of bucket is allowed to the user.
   */
  getVerifyPermission(
    bucketName: string,
    operator: string,
    actionType: ActionType,
  ): Promise<QueryVerifyPermissionResponse>;

  getUserBuckets(
    configParam: TGetUserBuckets,
  ): Promise<IObjectResultType<GetUserBucketsResponse['GfSpGetUserBucketsResponse']['Buckets']>>;

  /**
   * return quota info of bucket of current month, include chain quota, free quota and consumed quota
   */
  getBucketReadQuota(
    configParam: TBaseGetBucketReadQuota,
    authType: AuthType,
  ): Promise<IObjectResultType<IQuotaProps>>;

  deleteBucket(msg: MsgDeleteBucket): Promise<TxResponse>;

  updateBucketInfo(
    srcMsg: Omit<MsgUpdateBucketInfo, 'chargedReadQuota'> & { chargedReadQuota?: string },
  ): Promise<TxResponse>;

  putBucketPolicy(bucketName: string, srcMsg: Omit<MsgPutPolicy, 'resource'>): Promise<TxResponse>;

  deleteBucketPolicy(
    operator: string,
    bucketName: string,
    principalAddr: string,
  ): Promise<TxResponse>;

  getBucketPolicy(request: QueryPolicyForAccountRequest): Promise<QueryPolicyForAccountResponse>;

  getMigrateBucketApproval(
    params: Omit<MsgMigrateBucket, 'dstPrimarySpApproval'>,
    authType: AuthType,
  ): Promise<IObjectResultType<string>>;

  migrateBucket(
    configParams: Omit<MsgMigrateBucket, 'dstPrimarySpApproval'>,
    authType: AuthType,
  ): Promise<TxResponse>;

  getBucketMeta(params: GetBucketMetaRequest): Promise<IObjectResultType<GetBucketMetaResponse>>;

  listBucketReadRecords(
    params: TListBucketReadRecord,
    authType: AuthType,
  ): Promise<IObjectResultType<ListBucketReadRecordResponse>>;

  listBucketsByIds(
    params: TListBucketsByIDsRequest,
  ): Promise<IObjectResultType<ListBucketsByIDsResponse>>;
}

@singleton()
export class Bucket implements IBucket {
  constructor(
    @inject(delay(() => Basic)) private basic: Basic,
    @inject(delay(() => Sp)) private sp: Sp,
    @inject(delay(() => Storage)) private storage: Storage,
  ) {}

  private queryClient = container.resolve(RpcQueryClient);
  private spClient = container.resolve(SpClient);

  public async getCreateBucketApproval(params: IBaseGetCreateBucket, authType: AuthType) {
    const {
      bucketName,
      creator,
      visibility = 'VISIBILITY_TYPE_PUBLIC_READ',
      chargedReadQuota,
      spInfo,
      duration,
      paymentAddress,
    } = params;

    try {
      if (!spInfo.primarySpAddress) {
        throw new Error('Primary sp address is missing');
      }
      if (!isValidBucketName(bucketName)) {
        throw new Error('Error bucket name');
      }
      if (!creator) {
        throw new Error('Empty creator address');
      }

      const endpoint = await this.sp.getSPUrlByPrimaryAddr(spInfo.primarySpAddress);

      const { reqMeta, optionsWithOutHeaders, url } = await getBucketApprovalMetaInfo(endpoint, {
        bucket_name: bucketName,
        creator,
        visibility,
        primary_sp_address: spInfo.primarySpAddress,
        primary_sp_approval: {
          expired_height: '0',
          sig: '',
          global_virtual_group_family_id: 0,
        },
        charged_read_quota: chargedReadQuota,
        payment_address: paymentAddress,
      });

      const signHeaders = await this.spClient.signHeaders(reqMeta, authType);

      const result = await this.spClient.callApi(
        url,
        {
          ...optionsWithOutHeaders,
          headers: signHeaders,
        },
        duration,
        {
          code: -1,
          message: 'Get create bucket approval error.',
        },
      );

      const signedMsgString = result.headers.get('X-Gnfd-Signed-Msg') || '';
      const signedMsg = JSON.parse(
        bytesToUtf8(hexToBytes(signedMsgString)),
      ) as ICreateBucketMsgType;

      return {
        code: 0,
        message: 'Get create bucket approval success.',
        body: signedMsgString,
        statusCode: result.status,
        signedMsg: signedMsg,
      };
    } catch (error: any) {
      throw {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  private async createBucketTx(msg: MsgCreateBucket, signedMsg: ICreateBucketMsgType) {
    return await this.basic.tx(
      MsgCreateBucketTypeUrl,
      msg.creator,
      MsgCreateBucketSDKTypeEIP712,
      {
        ...signedMsg,
        type: MsgCreateBucketTypeUrl,
        charged_read_quota: signedMsg.charged_read_quota,
        visibility: signedMsg.visibility,
        primary_sp_approval: signedMsg.primary_sp_approval,
      },
      MsgCreateBucket.encode(msg).finish(),
    );
  }

  public async createBucket(params: IBaseGetCreateBucket, authType: AuthType) {
    const { signedMsg } = await this.getCreateBucketApproval(params, authType);

    if (!signedMsg) {
      throw new Error('Get create bucket approval error');
    }

    const msg: MsgCreateBucket = {
      bucketName: signedMsg.bucket_name,
      creator: signedMsg.creator,
      visibility: visibilityTypeFromJSON(signedMsg.visibility),
      primarySpAddress: signedMsg.primary_sp_address,
      primarySpApproval: {
        expiredHeight: Long.fromString(signedMsg.primary_sp_approval.expired_height),
        sig: bytesFromBase64(signedMsg.primary_sp_approval.sig),
        globalVirtualGroupFamilyId: signedMsg.primary_sp_approval.global_virtual_group_family_id,
      },
      chargedReadQuota: Long.fromString(signedMsg.charged_read_quota),
      paymentAddress: signedMsg.payment_address,
    };

    return await this.createBucketTx(msg, signedMsg);
  }

  public async deleteBucket(msg: MsgDeleteBucket) {
    return await this.basic.tx(
      MsgDeleteBucketTypeUrl,
      msg.operator,
      MsgDeleteBucketSDKTypeEIP712,
      MsgDeleteBucket.toSDK(msg),
      MsgDeleteBucket.encode(msg).finish(),
    );
  }

  public async headBucket(bucketName: string) {
    const rpc = await this.queryClient.getBucketQueryClient();
    return await rpc.HeadBucket({
      bucketName,
    });
  }

  public async headBucketById(bucketId: string) {
    const rpc = await this.queryClient.getBucketQueryClient();
    return await rpc.HeadBucketById({
      bucketId,
    });
  }

  public async headBucketNFT(request: QueryNFTRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.HeadBucketNFT(request);
  }

  public async getVerifyPermission(bucketName: string, operator: string, actionType: ActionType) {
    const rpc = await this.queryClient.getBucketQueryClient();
    return rpc.VerifyPermission({
      bucketName,
      operator,
      objectName: '',
      actionType,
    });
  }

  public async getUserBuckets(configParam: TGetUserBuckets) {
    try {
      const { address, duration = 30000, endpoint } = configParam;
      if (!isValidAddress(address)) {
        throw new Error('Error address');
      }
      if (!isValidUrl(endpoint)) {
        throw new Error('Invalid endpoint');
      }
      const url = endpoint;

      const headers = new Headers({
        [HTTPHeaderUserAddress]: address,
      });
      const result = await this.spClient.callApi(
        url,
        {
          headers,
          method: METHOD_GET,
        },
        duration,
      );
      const { status } = result;

      if (!result.ok) {
        const xmlError = await result.text();
        const { code, message } = await parseError(xmlError);
        throw {
          code: code || -1,
          message: message || 'Get bucket error.',
          statusCode: status,
        };
      }

      const xmlData = await result.text();
      const res = await parseGetUserBucketsResponse(xmlData);

      return {
        code: 0,
        message: 'Get bucket success.',
        statusCode: status,
        body: res.GfSpGetUserBucketsResponse.Buckets,
      };
    } catch (error: any) {
      return {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  public async getBucketReadQuota(
    params: TBaseGetBucketReadQuota,
    authType: AuthType,
  ): Promise<IObjectResultType<IQuotaProps>> {
    try {
      const { bucketName, duration = 30000 } = params;
      if (!isValidBucketName(bucketName)) {
        throw new Error('Error bucket name');
      }
      let endpoint = params.endpoint;
      if (!endpoint) {
        endpoint = await this.sp.getSPUrlByBucket(bucketName);
      }

      const { url, optionsWithOutHeaders, reqMeta } = await getQueryBucketReadQuotaMetaInfo(
        endpoint,
        params,
      );
      const signHeaders = await this.spClient.signHeaders(reqMeta, authType);

      const result = await this.spClient.callApi(
        url,
        {
          ...optionsWithOutHeaders,
          headers: signHeaders,
        },
        duration,
        {
          code: -1,
          message: 'Get Bucket Quota error.',
        },
      );

      const xmlData = await result.text();
      const res = await parseReadQuotaResponse(xmlData);

      return {
        code: 0,
        body: {
          readQuota: Number(res.GetReadQuotaResult.ReadQuotaSize ?? '0'),
          freeQuota: Number(res.GetReadQuotaResult.SPFreeReadQuotaSize ?? '0'),
          consumedQuota: Number(res.GetReadQuotaResult.ReadConsumedSize ?? '0'),
          freeConsumedSize: Number(res.GetReadQuotaResult.FreeConsumedSize ?? '0'),
        },
        message: 'Get bucket read quota.',
        statusCode: result.status,
      };
    } catch (error: any) {
      return {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  public async updateBucketInfo(
    srcMsg: Omit<MsgUpdateBucketInfo, 'chargedReadQuota'> & { chargedReadQuota: string },
  ) {
    const msg: MsgUpdateBucketInfo = {
      ...srcMsg,
      visibility: visibilityTypeFromJSON(srcMsg.visibility),
      chargedReadQuota: UInt64Value.fromPartial({
        value: Long.fromString(srcMsg.chargedReadQuota),
      }),
    };

    return await this.basic.tx(
      MsgUpdateBucketInfoTypeUrl,
      msg.operator,
      MsgUpdateBucketInfoSDKTypeEIP712,
      {
        ...MsgUpdateBucketInfo.toSDK(msg),
        charged_read_quota: {
          value: srcMsg.chargedReadQuota,
        },
      },
      MsgUpdateBucketInfo.encode(msg).finish(),
    );
  }

  public async putBucketPolicy(bucketName: string, srcMsg: Omit<MsgPutPolicy, 'resource'>) {
    const resource = GRNToString(newBucketGRN(bucketName));
    const msg: MsgPutPolicy = {
      ...srcMsg,
      resource,
    };

    return this.storage.putPolicy(msg);
  }

  public async deleteBucketPolicy(operator: string, bucketName: string, principalAddr: string) {
    const resource = GRNToString(newBucketGRN(bucketName));
    const principal: Principal = {
      type: PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
      value: principalAddr,
    };

    const msg: MsgDeletePolicy = {
      resource,
      principal,
      operator: operator,
    };
    return await this.storage.deletePolicy(msg);
  }

  public async getBucketPolicy(request: QueryPolicyForAccountRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return rpc.QueryPolicyForAccount(request);
  }

  public async getMigrateBucketApproval(
    params: Omit<MsgMigrateBucket, 'dstPrimarySpApproval'> & { endpoint?: string },
    authType: AuthType,
  ) {
    const { bucketName, operator, dstPrimarySpId } = params;

    try {
      let endpoint = params.endpoint;
      if (!endpoint) {
        endpoint = await this.sp.getSPUrlById(params.dstPrimarySpId);
      }

      const { reqMeta, optionsWithOutHeaders, url } = await getMigrateMetaInfo(endpoint, {
        operator: operator,
        bucket_name: bucketName,
        dst_primary_sp_id: dstPrimarySpId,
        dst_primary_sp_approval: {
          expired_height: '0',
          sig: '',
          global_virtual_group_family_id: 0,
        },
      });

      const signHeaders = await this.spClient.signHeaders(reqMeta, authType);

      const result = await this.spClient.callApi(
        url,
        {
          ...optionsWithOutHeaders,
          headers: signHeaders,
        },
        30000,
      );

      const signedMsgString = result.headers.get('X-Gnfd-Signed-Msg') || '';
      const signedMsg = decodeObjectFromHexString(signedMsgString) as IMigrateBucketMsgType;

      return {
        code: 0,
        message: 'Get migrate bucket approval success.',
        body: signedMsgString,
        statusCode: result.status,
        signedMsg: signedMsg,
      };
    } catch (error: any) {
      throw {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  public async migrateBucket(
    configParams: Omit<MsgMigrateBucket, 'dstPrimarySpApproval'> & { endpoint?: string },
    authType: AuthType,
  ) {
    const { signedMsg } = await this.getMigrateBucketApproval(configParams, authType);

    if (!signedMsg) {
      throw new Error('Get migrate bucket approval error');
    }

    const msg: MsgMigrateBucket = {
      bucketName: signedMsg.bucket_name,
      operator: signedMsg.operator,
      dstPrimarySpId: signedMsg.dst_primary_sp_id,
      dstPrimarySpApproval: {
        expiredHeight: Long.fromString(signedMsg.dst_primary_sp_approval.expired_height),
        globalVirtualGroupFamilyId:
          signedMsg.dst_primary_sp_approval.global_virtual_group_family_id,
        sig: bytesFromBase64(signedMsg.dst_primary_sp_approval.sig),
      },
    };

    return await this.migrateBucketTx(msg, signedMsg);
  }

  private async migrateBucketTx(msg: MsgMigrateBucket, signedMsg: IMigrateBucketMsgType) {
    return await this.basic.tx(
      MsgMigrateBucketTypeUrl,
      msg.operator,
      MsgMigrateBucketSDKTypeEIP712,
      {
        ...signedMsg,
        type: MsgMigrateBucketTypeUrl,
        primary_sp_approval: {
          expired_height: signedMsg.dst_primary_sp_approval.expired_height,
          global_virtual_group_family_id:
            signedMsg.dst_primary_sp_approval.global_virtual_group_family_id,
          sig: signedMsg.dst_primary_sp_approval.sig,
        },
      },
      MsgMigrateBucket.encode(msg).finish(),
    );
  }

  public async getBucketMeta(params: GetBucketMetaRequest) {
    const { bucketName, endpoint } = params;
    if (!isValidBucketName(bucketName)) {
      throw new Error('Error bucket name');
    }
    const queryMap = {
      'bucket-meta': '',
    };
    const query = getSortQuery(queryMap);
    const path = bucketName;
    const url = `${endpoint}/${path}?${query}`;
    const result = await this.spClient.callApi(url, {
      method: METHOD_GET,
    });

    const xml = await result.text();
    const res = await parseGetBucketMetaResponse(xml);

    return {
      code: 0,
      message: 'get bucket meta success.',
      statusCode: result.status,
      body: res,
    };
  }

  public async listBucketReadRecords(params: TListBucketReadRecord, authType: AuthType) {
    try {
      const { bucketName } = params;
      // if (!isValidAddress(address)) {
      //   throw new Error('Error address');
      // }
      let endpoint = params.endpoint;
      if (!endpoint) {
        endpoint = await this.sp.getSPUrlByBucket(bucketName);
      }
      if (!isValidUrl(endpoint)) {
        throw new Error('Invalid endpoint');
      }

      const { url, optionsWithOutHeaders, reqMeta } = await getListBucketReadRecordMetaInfo(
        endpoint,
        params,
      );
      const signHeaders = await this.spClient.signHeaders(reqMeta, authType);

      const result = await this.spClient.callApi(
        url,
        {
          ...optionsWithOutHeaders,
          headers: signHeaders,
        },
        3000,
        {
          code: -1,
          message: 'Get Bucket Quota error.',
        },
      );

      const xmlData = await result.text();
      const res = await parseListBucketReadRecordResponse(xmlData);

      return {
        code: 0,
        body: res,
        message: 'success',
        statusCode: result.status,
      };
    } catch (error: any) {
      return {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  public async listBucketsByIds(params: TListBucketsByIDsRequest) {
    try {
      const { ids } = params;

      const sp = await this.sp.getInServiceSP();
      const url = `${sp.endpoint}?ids=${ids.join(',')}&buckets-query=null`;

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
      const res = await parseListBucketsByIdsResponse(xmlData);

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
