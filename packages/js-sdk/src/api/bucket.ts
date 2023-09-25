import { HTTPHeaderUserAddress } from '@/clients/spclient/auth';
import { getApprovalMetaInfo } from '@/clients/spclient/spApis/approval';
import {
  getBucketMetaInfo,
  parseGetBucketMetaResponse,
} from '@/clients/spclient/spApis/getBucketMeta';
import {
  getUserBucketMetaInfo,
  parseGetUserBucketsResponse,
} from '@/clients/spclient/spApis/getUserBuckets';
import {
  getListBucketReadRecordMetaInfo,
  parseListBucketReadRecordResponse,
} from '@/clients/spclient/spApis/listBucketReadRecords';
import {
  getListBucketsByIDsMetaInfo,
  parseListBucketsByIdsResponse,
} from '@/clients/spclient/spApis/listBucketsByIds';
import {
  getListBucketByPaymentMetaInfo,
  parseListBucketByPaymentResponse,
} from '@/clients/spclient/spApis/listBucketsByPayment';
import { parseError } from '@/clients/spclient/spApis/parseError';
import {
  getQueryBucketReadQuotaMetaInfo,
  parseReadQuotaResponse,
} from '@/clients/spclient/spApis/queryBucketReadQuota';
import { TxClient } from '@/clients/txClient';
import { METHOD_GET, NORMAL_ERROR_CODE } from '@/constants/http';
import { MsgCreateBucketSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgCreateBucket';
import { MsgDeleteBucketSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgDeleteBucket';
import { MsgMigrateBucketSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgMigrateBucket';
import { MsgUpdateBucketInfoSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgUpdateBucketInfo';
import { decodeObjectFromHexString } from '@/utils/encoding';
import { isValidAddress, isValidBucketName, isValidUrl } from '@/utils/s3';
import { UInt64Value } from '@bnb-chain/greenfield-cosmos-types/greenfield/common/wrapper';
import {
  ActionType,
  Principal,
  PrincipalType,
  principalTypeFromJSON,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';
import { visibilityTypeFromJSON } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import {
  QueryBucketNFTResponse,
  QueryHeadBucketExtraResponse,
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
import { container, delay, inject, injectable } from 'tsyringe';
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
import type {
  CreateBucketApprovalRequest,
  CreateBucketApprovalResponse,
  GetBucketMetaRequest,
  GetBucketMetaResponse,
  GetUserBucketsRequest,
  GetUserBucketsResponse,
  IQuotaProps,
  ListBucketReadRecordRequest,
  ListBucketReadRecordResponse,
  ListBucketsByIDsRequest,
  ListBucketsByIDsResponse,
  ListBucketsByPaymentAccountRequest,
  ListBucketsByPaymentAccountResponse,
  MigrateBucketApprovalRequest,
  MigrateBucketApprovalResponse,
  ReadQuotaRequest,
  SpResponse,
} from '../types/sp';
import { Sp } from './sp';
import { Storage } from './storage';

export interface IBucket {
  /**
   * get approval of creating bucket and send createBucket txn to greenfield chain
   */
  createBucket(params: CreateBucketApprovalRequest, authType: AuthType): Promise<TxResponse>;

  deleteBucket(msg: MsgDeleteBucket): Promise<TxResponse>;

  deleteBucketPolicy(
    operator: string,
    bucketName: string,
    principalAddr: string,
    principalType: keyof typeof PrincipalType,
  ): Promise<TxResponse>;

  getBucketMeta(params: GetBucketMetaRequest): Promise<SpResponse<GetBucketMetaResponse>>;

  getBucketPolicy(request: QueryPolicyForAccountRequest): Promise<QueryPolicyForAccountResponse>;

  /**
   * return quota info of bucket of current month, include chain quota, free quota and consumed quota
   */
  getBucketReadQuota(
    configParam: ReadQuotaRequest,
    authType: AuthType,
  ): Promise<SpResponse<IQuotaProps>>;

  /**
   * returns the signature info for the approval of preCreating resources
   */
  getCreateBucketApproval(
    configParam: CreateBucketApprovalRequest,
    authType: AuthType,
  ): Promise<SpResponse<string>>;

  getMigrateBucketApproval(
    params: MigrateBucketApprovalRequest,
    authType: AuthType,
  ): Promise<SpResponse<string>>;

  /**
   * check if the permission of bucket is allowed to the user.
   */
  getVerifyPermission(
    bucketName: string,
    operator: string,
    actionType: ActionType,
  ): Promise<QueryVerifyPermissionResponse>;

  /**
   * query the bucketInfo on chain, return the bucket info if exists
   */
  headBucket(bucketName: string): Promise<QueryHeadBucketResponse>;

  /**
   * query the bucketInfo on chain by bucketId, return the bucket info if exists
   */
  headBucketById(bucketId: string): Promise<QueryHeadBucketResponse>;

  headBucketExtra(bucketName: string): Promise<QueryHeadBucketExtraResponse>;

  headBucketNFT(request: QueryNFTRequest): Promise<QueryBucketNFTResponse>;

  listBucketReadRecords(
    params: ListBucketReadRecordRequest,
    authType: AuthType,
  ): Promise<SpResponse<ListBucketReadRecordResponse>>;

  listBuckets(
    configParam: GetUserBucketsRequest,
  ): Promise<SpResponse<GetUserBucketsResponse['GfSpGetUserBucketsResponse']['Buckets']>>;

  listBucketsByIds(params: ListBucketsByIDsRequest): Promise<SpResponse<ListBucketsByIDsResponse>>;

  /**
   * ListBucketsByPaymentAccount list buckets by payment account
   */
  listBucketsByPaymentAccount(
    params: ListBucketsByPaymentAccountRequest,
  ): Promise<SpResponse<ListBucketsByPaymentAccountResponse>>;

  migrateBucket(params: MigrateBucketApprovalRequest, authType: AuthType): Promise<TxResponse>;

  putBucketPolicy(bucketName: string, srcMsg: Omit<MsgPutPolicy, 'resource'>): Promise<TxResponse>;

  /**
   * Update the bucket meta on chain, including read quota, payment address or visibility. It will send the MsgUpdateBucketInfo msg to greenfield to update the meta.
   */
  updateBucketInfo(
    srcMsg: Omit<MsgUpdateBucketInfo, 'chargedReadQuota'> & { chargedReadQuota?: string },
  ): Promise<TxResponse>;
}

@injectable()
export class Bucket implements IBucket {
  constructor(
    @inject(delay(() => TxClient)) private txClient: TxClient,
    @inject(delay(() => Sp)) private sp: Sp,
    @inject(delay(() => Storage)) private storage: Storage,
  ) {}

  private queryClient = container.resolve(RpcQueryClient);
  private spClient = container.resolve(SpClient);

  public async getCreateBucketApproval(
    params: CreateBucketApprovalRequest,
    authType: AuthType,
  ): Promise<SpResponse<string>> {
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

      const { reqMeta, optionsWithOutHeaders, url } =
        getApprovalMetaInfo<CreateBucketApprovalResponse>(endpoint, 'CreateBucket', {
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
      const requestOptions: RequestInit = {
        ...optionsWithOutHeaders,
        headers: signHeaders,
      };

      const result = await this.spClient.callApi(url, requestOptions, duration, {
        code: -1,
        message: 'Get create bucket approval error.',
      });

      const signedMsgString = result.headers.get('X-Gnfd-Signed-Msg') || '';

      return {
        code: 0,
        message: 'Get create bucket approval success.',
        body: signedMsgString,
        statusCode: result.status,
      } as SpResponse<string>;
    } catch (error: any) {
      throw {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  private async createBucketTx(msg: MsgCreateBucket, signedMsg: CreateBucketApprovalResponse) {
    return await this.txClient.tx(
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

  public async createBucket(params: CreateBucketApprovalRequest, authType: AuthType) {
    const { body } = await this.getCreateBucketApproval(params, authType);

    if (!body) {
      throw new Error('Get create bucket approval error');
    }

    const signedMsg = JSON.parse(bytesToUtf8(hexToBytes(body))) as CreateBucketApprovalResponse;

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
    return await this.txClient.tx(
      MsgDeleteBucketTypeUrl,
      msg.operator,
      MsgDeleteBucketSDKTypeEIP712,
      MsgDeleteBucket.toSDK(msg),
      MsgDeleteBucket.encode(msg).finish(),
    );
  }

  public async headBucket(bucketName: string) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.HeadBucket({
      bucketName,
    });
  }

  public async headBucketById(bucketId: string) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.HeadBucketById({
      bucketId,
    });
  }

  public async headBucketExtra(bucketName: string) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.HeadBucketExtra({
      bucketName,
    });
  }

  public async headBucketNFT(request: QueryNFTRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.HeadBucketNFT(request);
  }

  public async getVerifyPermission(bucketName: string, operator: string, actionType: ActionType) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return rpc.VerifyPermission({
      bucketName,
      operator,
      objectName: '',
      actionType,
    });
  }

  public async listBuckets(configParam: GetUserBucketsRequest) {
    try {
      const { address, duration = 30000, endpoint } = configParam;
      if (!isValidAddress(address)) {
        throw new Error('Error address');
      }
      if (!isValidUrl(endpoint)) {
        throw new Error('Invalid endpoint');
      }
      const { url } = getUserBucketMetaInfo(endpoint);

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
    params: ReadQuotaRequest,
    authType: AuthType,
  ): Promise<SpResponse<IQuotaProps>> {
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

    return await this.txClient.tx(
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

  public async deleteBucketPolicy(
    operator: string,
    bucketName: string,
    principalAddr: string,
    principalType: keyof typeof PrincipalType,
  ) {
    const resource = GRNToString(newBucketGRN(bucketName));
    const principal: Principal = {
      type: principalTypeFromJSON(principalType),
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

  public async getMigrateBucketApproval(params: MigrateBucketApprovalRequest, authType: AuthType) {
    const { bucketName, operator, dstPrimarySpId } = params;

    try {
      let endpoint = params.endpoint;
      if (!endpoint) {
        endpoint = await this.sp.getSPUrlById(params.dstPrimarySpId);
      }

      const { reqMeta, optionsWithOutHeaders, url } =
        getApprovalMetaInfo<MigrateBucketApprovalResponse>(endpoint, 'MigrateBucket', {
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
      const signedMsg = decodeObjectFromHexString(signedMsgString) as MigrateBucketApprovalResponse;

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

  public async migrateBucket(params: MigrateBucketApprovalRequest, authType: AuthType) {
    const { signedMsg } = await this.getMigrateBucketApproval(params, authType);

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

  private async migrateBucketTx(msg: MsgMigrateBucket, signedMsg: MigrateBucketApprovalResponse) {
    return await this.txClient.tx(
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
    const { bucketName } = params;
    if (!isValidBucketName(bucketName)) {
      throw new Error('Error bucket name');
    }

    let endpoint = params.endpoint;
    if (!endpoint) {
      endpoint = await this.sp.getSPUrlByBucket(bucketName);
    }

    const { url } = getBucketMetaInfo(endpoint, params);

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

  public async listBucketReadRecords(params: ListBucketReadRecordRequest, authType: AuthType) {
    try {
      const { bucketName } = params;
      let endpoint = params.endpoint;
      if (!endpoint) {
        endpoint = await this.sp.getSPUrlByBucket(bucketName);
      }
      if (!isValidUrl(endpoint)) {
        throw new Error('Invalid endpoint');
      }

      const { url, optionsWithOutHeaders, reqMeta } = getListBucketReadRecordMetaInfo(
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

  public async listBucketsByIds(params: ListBucketsByIDsRequest) {
    try {
      const { ids } = params;
      const sp = await this.sp.getInServiceSP();
      const { url } = getListBucketsByIDsMetaInfo(sp.endpoint, { ids });

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

  public async listBucketsByPaymentAccount(params: ListBucketsByPaymentAccountRequest) {
    try {
      const sp = await this.sp.getInServiceSP();
      const { url } = getListBucketByPaymentMetaInfo(sp.endpoint, params);

      const result = await this.spClient.callApi(url, {
        headers: {},
        method: METHOD_GET,
      });

      const xmlData = await result.text();
      const res = parseListBucketByPaymentResponse(xmlData);
      return {
        code: 0,
        message: 'Get bucket success.',
        statusCode: result.status,
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
