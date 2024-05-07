import {
  MsgCreateBucketSDKTypeEIP712,
  MsgDeleteBucketSDKTypeEIP712,
  MsgMigrateBucketSDKTypeEIP712,
  MsgToggleSPAsDelegatedAgentSDKTypeEIP712,
  MsgUpdateBucketInfoSDKTypeEIP712,
} from '@/messages/greenfield';
import { MsgSetBucketFlowRateLimitSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgSetBucketFlowRateLimit';
import { assertAuthType, assertStringRequire } from '@/utils/asserts/params';
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
  MsgCancelMigrateBucket,
  MsgCreateBucket,
  MsgDeleteBucket,
  MsgDeletePolicy,
  MsgMigrateBucket,
  MsgPutPolicy,
  MsgSetBucketFlowRateLimit,
  MsgToggleSPAsDelegatedAgent,
  MsgUpdateBucketInfo,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { PickVGFStrategy } from '@bnb-chain/greenfield-cosmos-types/greenfield/virtualgroup/common';
import { bytesFromBase64 } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { Headers } from 'cross-fetch';
import Long from 'long';
import { container, delay, inject, injectable } from 'tsyringe';
import {
  AuthType,
  GRNToString,
  MsgCancelMigrateBucketTypeUrl,
  MsgCreateBucketTypeUrl,
  MsgDeleteBucketTypeUrl,
  MsgMigrateBucketTypeUrl,
  MsgSetBucketFlowRateLimitTypeUrl,
  MsgToggleSPAsDelegatedAgentTypeUrl,
  MsgUpdateBucketInfoTypeUrl,
  TxResponse,
  newBucketGRN,
} from '..';
import { RpcQueryClient } from '../clients/queryclient';
import { HTTPHeaderUserAddress } from '../clients/spclient/auth';
import { getApprovalMetaInfo } from '../clients/spclient/spApis/approval';
import {
  getBucketMetaInfo,
  parseGetBucketMetaResponse,
} from '../clients/spclient/spApis/getBucketMeta';
import {
  getUserBucketMetaInfo,
  parseGetUserBucketsResponse,
} from '../clients/spclient/spApis/getUserBuckets';
import {
  getListBucketReadRecordMetaInfo,
  parseListBucketReadRecordResponse,
} from '../clients/spclient/spApis/listBucketReadRecords';
import {
  getListBucketsByIDsMetaInfo,
  parseListBucketsByIdsResponse,
} from '../clients/spclient/spApis/listBucketsByIds';
import {
  getListBucketByPaymentMetaInfo,
  parseListBucketByPaymentResponse,
} from '../clients/spclient/spApis/listBucketsByPayment';
import { parseError } from '../clients/spclient/spApis/parseError';
import {
  getQueryBucketReadQuotaMetaInfo,
  parseReadQuotaResponse,
} from '../clients/spclient/spApis/queryBucketReadQuota';
import { SpClient } from '../clients/spclient/spClient';
import { TxClient } from '../clients/txClient';
import { METHOD_GET, NORMAL_ERROR_CODE } from '../constants/http';
import type {
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
import { verifyAddress, verifyBucketName, verifyUrl } from '../utils/asserts/s3';
import { decodeObjectFromHexString } from '../utils/encoding';
import { Sp } from './sp';
import { Storage } from './storage';
import { VirtualGroup } from './virtualGroup';
import { MsgCancelMigrateBucketSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgCancelMigrateBucket';

export interface IBucket {
  /**
   * send createBucket txn to greenfield chain
   */
  createBucket(msg: MsgCreateBucket): Promise<TxResponse>;

  deleteBucket(msg: MsgDeleteBucket): Promise<TxResponse>;

  deleteBucketPolicy(
    operator: string,
    bucketName: string,
    principalAddr: string,
    principalType: keyof typeof PrincipalType,
  ): Promise<TxResponse>;

  toggleSpAsDelegatedAgent(msg: MsgToggleSPAsDelegatedAgent): Promise<TxResponse>;

  getBucketMeta(params: GetBucketMetaRequest): Promise<SpResponse<GetBucketMetaResponse>>;

  getBucketPolicy(request: QueryPolicyForAccountRequest): Promise<QueryPolicyForAccountResponse>;

  /**
   * return quota info of bucket of current month, include chain quota, free quota and consumed quota
   */
  getBucketReadQuota(
    configParam: ReadQuotaRequest,
    authType: AuthType,
  ): Promise<SpResponse<IQuotaProps>>;

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

  cancelMigrateBucket(msg: MsgCancelMigrateBucket): Promise<TxResponse>;

  putBucketPolicy(bucketName: string, srcMsg: Omit<MsgPutPolicy, 'resource'>): Promise<TxResponse>;

  /**
   * Update the bucket meta on chain, including read quota, payment address or visibility. It will send the MsgUpdateBucketInfo msg to greenfield to update the meta.
   */
  updateBucketInfo(
    srcMsg: Omit<MsgUpdateBucketInfo, 'chargedReadQuota'> & { chargedReadQuota?: string },
  ): Promise<TxResponse>;

  /**
   * Get the flow rate limit of the bucket.
   */
  setPaymentAccountFlowRateLimit(msg: MsgSetBucketFlowRateLimit): Promise<TxResponse>;
}

@injectable()
export class Bucket implements IBucket {
  constructor(
    @inject(delay(() => TxClient)) private txClient: TxClient,
    @inject(delay(() => Sp)) private sp: Sp,
    @inject(delay(() => Storage)) private storage: Storage,
    @inject(delay(() => VirtualGroup)) private virtualGroup: VirtualGroup,
  ) {}

  private queryClient = container.resolve(RpcQueryClient);
  private spClient = container.resolve(SpClient);

  public async setPaymentAccountFlowRateLimit(msg: MsgSetBucketFlowRateLimit) {
    return await this.txClient.tx(
      MsgSetBucketFlowRateLimitTypeUrl,
      msg.operator,
      MsgSetBucketFlowRateLimitSDKTypeEIP712,
      MsgSetBucketFlowRateLimit.toSDK(msg),
      MsgSetBucketFlowRateLimit.encode(msg).finish(),
    );
  }

  public async createBucket(msg: MsgCreateBucket) {
    assertStringRequire(msg.primarySpAddress, 'Primary sp address is missing');
    assertStringRequire(msg.creator, 'Empty creator address');
    verifyBucketName(msg.bucketName);

    const { storageProvider } = await this.sp.getStorageProviderByOperatorAddress({
      operatorAddress: msg.primarySpAddress,
    });

    if (!storageProvider) {
      throw new Error(`Storage provider ${msg.primarySpAddress} not found`);
    }

    const { globalVirtualGroupFamilyId } =
      await this.virtualGroup.getSpOptimalGlobalVirtualGroupFamily({
        spId: storageProvider.id,
        pickVgfStrategy: PickVGFStrategy.Strategy_Oldest_Create_Time,
      });

    const createBucketMsg: MsgCreateBucket = {
      ...msg,
      primarySpApproval: {
        globalVirtualGroupFamilyId: globalVirtualGroupFamilyId,
        expiredHeight: Long.fromInt(0),
        sig: Uint8Array.from([]),
      },
    };

    return await this.txClient.tx(
      MsgCreateBucketTypeUrl,
      msg.creator,
      MsgCreateBucketSDKTypeEIP712,
      {
        ...MsgCreateBucket.toSDK(createBucketMsg),
        primary_sp_approval: {
          expired_height: '0',
          global_virtual_group_family_id: globalVirtualGroupFamilyId,
        },
        charged_read_quota: createBucketMsg.chargedReadQuota.toString(),
      },
      MsgCreateBucket.encode(createBucketMsg).finish(),
    );
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

  public async toggleSpAsDelegatedAgent(msg: MsgToggleSPAsDelegatedAgent) {
    const { bucketInfo } = await this.headBucket(msg.bucketName);

    if (!bucketInfo) {
      throw new Error(`Bucket ${msg.bucketName} not found`);
    }

    return await this.txClient.tx(
      MsgToggleSPAsDelegatedAgentTypeUrl,
      msg.operator,
      MsgToggleSPAsDelegatedAgentSDKTypeEIP712,
      MsgToggleSPAsDelegatedAgent.toSDK(msg),
      MsgToggleSPAsDelegatedAgent.encode(msg).finish(),
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
      verifyAddress(address);
      verifyUrl(endpoint);

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

      verifyBucketName(bucketName);
      assertAuthType(authType);

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
          monthlyFreeQuota: Number(res.GetReadQuotaResult.MonthlyFreeQuota ?? '0'),
          monthlyQuotaConsumedSize: Number(res.GetReadQuotaResult.MonthlyQuotaConsumedSize ?? '0'),
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
    assertAuthType(authType);
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
    assertAuthType(authType);

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

  public async cancelMigrateBucket(msg: MsgCancelMigrateBucket): Promise<TxResponse> {
    return await this.txClient.tx(
      MsgCancelMigrateBucketTypeUrl,
      msg.operator,
      MsgCancelMigrateBucketSDKTypeEIP712,
      MsgCancelMigrateBucket.toSDK(msg),
      MsgCancelMigrateBucket.encode(msg).finish(),
    );
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
    verifyBucketName(bucketName);

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
      assertAuthType(authType);

      const { bucketName } = params;
      let endpoint = params.endpoint;
      if (!endpoint) {
        endpoint = await this.sp.getSPUrlByBucket(bucketName);
      }
      verifyUrl(endpoint);

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
