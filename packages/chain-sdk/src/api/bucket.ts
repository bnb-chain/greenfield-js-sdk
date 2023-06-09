import { MsgCreateBucketSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgCreateBucket';
import { MsgDeleteBucketSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgDeleteBucket';
import { MsgUpdateBucketInfoSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgUpdateBucketInfo';
import { getAuthorizationAuthTypeV2 } from '@/utils/auth';
import { decodeObjectFromHexString, encodeObjectToHexString } from '@/utils/encoding';
import { fetchWithTimeout, METHOD_GET, NORMAL_ERROR_CODE } from '@/utils/http';
import { generateUrlByBucketName, isValidAddress, isValidBucketName, isValidUrl } from '@/utils/s3';
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
  MsgPutPolicy,
  MsgUpdateBucketInfo,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { bytesFromBase64 } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { Headers } from 'cross-fetch';
import Long from 'long';
import { container, delay, inject, singleton } from 'tsyringe';
import {
  GRNToString,
  MsgCreateBucketTypeUrl,
  MsgDeleteBucketTypeUrl,
  MsgUpdateBucketInfoTypeUrl,
  newBucketGRN,
  TKeyValue,
  TxResponse,
} from '..';
import {
  BucketProps,
  ICreateBucketMsgType,
  IObjectResultType,
  IQuotaProps,
  TCreateBucket,
  TGetBucketReadQuota,
  TGetUserBuckets,
} from '../types/storage';
import { Basic } from './basic';
import { OffChainAuth } from './offchainauth';
import { RpcQueryClient } from './queryclient';
import { Storage } from './storage';

export interface IBucket {
  /**
   * returns the signature info for the approval of preCreating resources
   */
  getCreateBucketApproval(params: TCreateBucket): Promise<IObjectResultType<string>>;

  /**
   * get approval of creating bucket and send createBucket txn to greenfield chain
   */
  createBucket(params: TCreateBucket): Promise<TxResponse>;

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

  getUserBuckets(configParam: TGetUserBuckets): Promise<IObjectResultType<Array<BucketProps>>>;

  /**
   * return quota info of bucket of current month, include chain quota, free quota and consumed quota
   */
  getBucketReadQuota(configParam: TGetBucketReadQuota): Promise<IObjectResultType<IQuotaProps>>;

  deleteBucket(msg: MsgDeleteBucket): Promise<TxResponse>;

  updateBucketInfo(msg: MsgUpdateBucketInfo): Promise<TxResponse>;

  putBucketPolicy(
    bucketName: string,
    srcMsg: Omit<MsgPutPolicy, 'resource' | 'expirationTime'>,
  ): Promise<TxResponse>;

  deleteBucketPolicy(
    operator: string,
    bucketName: string,
    principalAddr: string,
  ): Promise<TxResponse>;

  getBucketPolicy(request: QueryPolicyForAccountRequest): Promise<QueryPolicyForAccountResponse>;

  // TODO: getBucketReadQuota();
}

@singleton()
export class Bucket implements IBucket {
  constructor(
    @inject(delay(() => Basic)) private basic: Basic,
    @inject(delay(() => Storage)) private storage: Storage,
  ) {}

  private queryClient = container.resolve(RpcQueryClient);
  private offChainAuthClient = container.resolve(OffChainAuth);

  public async getCreateBucketApproval(configParam: TCreateBucket) {
    const {
      bucketName,
      creator,
      visibility = 'VISIBILITY_TYPE_PUBLIC_READ',
      chargedReadQuota,
      spInfo,
      duration,
    } = configParam;

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

      const endpoint = spInfo.endpoint;
      const msg: ICreateBucketMsgType = {
        bucket_name: bucketName,
        creator,
        visibility,
        primary_sp_address: spInfo.primarySpAddress,
        primary_sp_approval: {
          expired_height: '0',
          sig: '',
        },
        charged_read_quota: chargedReadQuota,
        payment_address: '',
      };
      const url = endpoint + '/greenfield/admin/v1/get-approval?action=CreateBucket';
      const unSignedMessageInHex = encodeObjectToHexString(msg);

      let headerContent: TKeyValue = {
        'X-Gnfd-Unsigned-Msg': unSignedMessageInHex,
      };
      if (!configParam.signType || configParam.signType === 'authTypeV2') {
        const Authorization = getAuthorizationAuthTypeV2();
        headerContent = {
          ...headerContent,
          Authorization,
        };
      }
      if (configParam.signType === 'offChainAuth') {
        const { seedString, domain } = configParam;
        const { code, body, statusCode, message } = await this.offChainAuthClient.sign(seedString);
        if (code !== 0) {
          throw {
            code: -1,
            message: message || 'Get create bucket approval error.',
            statusCode: statusCode,
          };
        }
        headerContent = {
          ...headerContent,
          Authorization: body?.authorization as string,
          'X-Gnfd-User-Address': creator,
          'X-Gnfd-App-Domain': domain,
        };
      }

      const headers = new Headers(headerContent);
      const result = await fetchWithTimeout(
        url,
        {
          headers,
          method: METHOD_GET,
        },
        duration,
      );

      const { status } = result;
      if (!result.ok) {
        throw {
          code: -1,
          message: 'Get create bucket approval error.',
          statusCode: status,
        };
      }

      const signedMsgString = result.headers.get('X-Gnfd-Signed-Msg') || '';
      const signedMsg = decodeObjectFromHexString(signedMsgString) as ICreateBucketMsgType;

      return {
        code: 0,
        message: 'Get create bucket approval success.',
        body: signedMsgString,
        statusCode: status,
        signedMsg: signedMsg,
      };
    } catch (error: any) {
      throw { code: -1, message: error.message, statusCode: NORMAL_ERROR_CODE };
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
        primary_sp_approval: {
          expired_height: signedMsg.primary_sp_approval.expired_height,
          sig: signedMsg.primary_sp_approval.sig,
        },
      },
      MsgCreateBucket.encode(msg).finish(),
    );
  }

  public async createBucket(params: TCreateBucket) {
    const { signedMsg } = await this.getCreateBucketApproval(params);

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
      },
      chargedReadQuota: signedMsg.charged_read_quota
        ? Long.fromString('0')
        : Long.fromString(signedMsg.charged_read_quota),
      paymentAddress: '',
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
      const { address, duration = 30000, endpoint, signType } = configParam;
      if (!isValidAddress(address)) {
        throw new Error('Error address');
      }
      if (!isValidUrl(endpoint)) {
        throw new Error('Invalid endpoint');
      }
      const url = endpoint;
      let headerContent: TKeyValue = {
        'X-Gnfd-User-Address': address,
      };
      if (!signType || signType === 'authTypeV2') {
        const Authorization = getAuthorizationAuthTypeV2();
        headerContent = {
          ...headerContent,
          Authorization,
        };
      } else if (configParam.signType === 'offChainAuth') {
        const { seedString } = configParam;
        const { code, body, statusCode, message } = await this.offChainAuthClient.sign(seedString);
        if (code !== 0) {
          return {
            code: -1,
            message: message || 'Get create bucket approval error.',
            statusCode: statusCode,
          };
        }
        headerContent = {
          ...headerContent,
          Authorization: body?.authorization as string,
          'X-Gnfd-App-Domain': configParam.domain,
        };
      }
      const headers = new Headers(headerContent);
      const result = await fetchWithTimeout(
        url,
        {
          headers,
          method: METHOD_GET,
        },
        duration,
      );
      const { status } = result;
      if (!result.ok) {
        return { code: -1, message: 'Get bucket error.', statusCode: status };
      }
      const { buckets } = await result.json();

      return {
        code: 0,
        message: 'Get bucket success.',
        statusCode: status,
        body: buckets,
      };
    } catch (error: any) {
      return { code: -1, message: error.message, statusCode: NORMAL_ERROR_CODE };
    }
  }

  public async getBucketReadQuota(
    configParam: TGetBucketReadQuota,
  ): Promise<IObjectResultType<IQuotaProps>> {
    try {
      const { bucketName, endpoint, duration = 30000, year, month, signType } = configParam;
      if (!isValidUrl(endpoint)) {
        throw new Error('Invalid endpoint');
      }
      if (!isValidBucketName(bucketName)) {
        throw new Error('Error bucket name');
      }
      const currentDate = new Date();
      const finalYear = year ? year : currentDate.getFullYear();
      const finalMonth = month ? month : currentDate.getMonth() + 1;
      const formattedMonth = finalMonth.toString().padStart(2, '0'); // format month to 2 digits, like "01"
      const url =
        generateUrlByBucketName(endpoint, bucketName) +
        `/?read-quota&year-month=${finalYear}-${formattedMonth}`;

      let headerContent: TKeyValue = {};
      if (!signType || signType === 'authTypeV2') {
        const Authorization = getAuthorizationAuthTypeV2();
        headerContent = {
          ...headerContent,
          Authorization,
        };
      } else if (configParam.signType === 'offChainAuth') {
        const { seedString, address, domain } = configParam;
        const { code, body, statusCode, message } = await this.offChainAuthClient.sign(seedString);
        if (code !== 0) {
          return {
            code: -1,
            message: message || 'Get create bucket approval error.',
            statusCode: statusCode,
          };
        }
        headerContent = {
          ...headerContent,
          Authorization: body?.authorization as string,
          'X-Gnfd-User-Address': address,
          'X-Gnfd-App-Domain': domain,
        };
      }

      const headers = new Headers(headerContent);

      const result = await fetchWithTimeout(
        url,
        {
          headers,
          method: METHOD_GET,
        },
        duration,
      );
      const { status } = result;
      if (!result.ok) {
        return { code: -1, message: 'Get Bucket Quota error.', statusCode: status };
      }
      const resultContentType = result.headers.get('Content-Type');
      // Will receive xml when get object met error
      if (resultContentType === 'text/xml' || resultContentType === 'application/xml') {
        const xmlText = await result.text();
        const xml = await new window.DOMParser().parseFromString(xmlText, 'text/xml');
        const ReadQuotaSize = (xml as XMLDocument).getElementsByTagName('ReadQuotaSize')[0]
          .textContent;
        const SPFreeReadQuotaSize = (xml as XMLDocument).getElementsByTagName(
          'SPFreeReadQuotaSize',
        )[0].textContent;
        const ReadConsumedSize = (xml as XMLDocument).getElementsByTagName('ReadConsumedSize')[0]
          .textContent;
        return {
          code: 0,
          body: {
            readQuota: Number(ReadQuotaSize ?? '0'),
            freeQuota: Number(SPFreeReadQuotaSize ?? '0'),
            consumedQuota: Number(ReadConsumedSize ?? '0'),
          },
          message: 'Get bucket read quota.',
          statusCode: status,
        };
      } else {
        return {
          code: -1,
          message: 'Get bucket read quota error.',
          statusCode: status,
        };
      }
    } catch (error: any) {
      return { code: -1, message: error.message, statusCode: NORMAL_ERROR_CODE };
    }
  }

  public async updateBucketInfo(msg: MsgUpdateBucketInfo) {
    return await this.basic.tx(
      MsgUpdateBucketInfoTypeUrl,
      msg.operator,
      MsgUpdateBucketInfoSDKTypeEIP712,
      MsgUpdateBucketInfo.toSDK(msg),
      MsgUpdateBucketInfo.encode(msg).finish(),
    );
  }

  public async putBucketPolicy(
    bucketName: string,
    srcMsg: Omit<MsgPutPolicy, 'resource' | 'expirationTime'>,
  ) {
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
}
