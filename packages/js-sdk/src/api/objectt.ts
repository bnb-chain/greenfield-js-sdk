import { encodePath, getMsgToSign, getSortQuery, secpSign } from '@/clients/spclient/auth';
import { getApprovalMetaInfo } from '@/clients/spclient/spApis/approval';
import { getGetObjectMetaInfo } from '@/clients/spclient/spApis/getObject';
import {
  getObjectMetaInfo,
  parseGetObjectMetaResponse,
} from '@/clients/spclient/spApis/getObjectMeta';
import {
  getListObjectPoliciesMetaInfo,
  parseGetListObjectPoliciesResponse,
} from '@/clients/spclient/spApis/listObjectPolicies';
import { parseListObjectsByBucketNameResponse } from '@/clients/spclient/spApis/listObjectsByBucket';
import {
  getListObjectsByIDsMetaInfo,
  parseListObjectsByIdsResponse,
} from '@/clients/spclient/spApis/listObjectsByIds';
import { parseError } from '@/clients/spclient/spApis/parseError';
import { getPutObjectMetaInfo } from '@/clients/spclient/spApis/putObject';
import { TxClient } from '@/clients/txClient';
import { METHOD_GET, NORMAL_ERROR_CODE } from '@/constants/http';
import { MsgCancelCreateObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgCancelCreateObject';
import { MsgCreateObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgCreateObject';
import { MsgDeleteObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgDeleteObject';
import { MsgUpdateObjectInfoSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgUpdateObjectInfo';
import { signSignatureByEddsa } from '@/offchainauth';
import { GetObjectRequest } from '@/types/sp/GetObject';
import { GetObjectMetaRequest, GetObjectMetaResponse } from '@/types/sp/GetObjectMeta';
import { ListObjectsByBucketNameResponse } from '@/types/sp/ListObjectsByBucketName';
import { PutObjectRequest } from '@/types/sp/PutObject';
import {
  ActionType,
  Principal,
  PrincipalType,
  principalTypeFromJSON,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';
import {
  redundancyTypeFromJSON,
  visibilityTypeFromJSON,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import {
  QueryHeadObjectResponse,
  QueryNFTRequest,
  QueryObjectNFTResponse,
  QueryPolicyForAccountResponse,
  QueryVerifyPermissionResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';
import {
  MsgCancelCreateObject,
  MsgCreateObject,
  MsgDeleteObject,
  MsgDeletePolicy,
  MsgPutPolicy,
  MsgUpdateObjectInfo,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { bytesFromBase64 } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { hexlify } from '@ethersproject/bytes';
import { Headers } from 'cross-fetch';
import { bytesToUtf8, hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils';
import { container, delay, inject, injectable } from 'tsyringe';
import {
  GRNToString,
  MsgCancelCreateObjectTypeUrl,
  MsgCreateObjectTypeUrl,
  MsgDeleteObjectTypeUrl,
  MsgUpdateObjectInfoTypeUrl,
  newObjectGRN,
} from '..';
import { RpcQueryClient } from '../clients/queryclient';
import { AuthType, SpClient } from '../clients/spclient/spClient';
import {
  CreateObjectApprovalRequest,
  CreateObjectApprovalResponse,
  GetListObjectPoliciesRequest,
  GetListObjectPoliciesResponse,
  GetPrivewObject,
  ListObjectsByBucketNameRequest,
  ListObjectsByIDsRequest,
  ListObjectsByIDsResponse,
  Long,
  SpResponse,
  TxResponse,
} from '../types';
import {
  generateUrlByBucketName,
  isValidBucketName,
  isValidObjectName,
  isValidUrl,
} from '../utils/s3';
import { Sp } from './sp';
import { Storage } from './storage';

export interface IObject {
  getCreateObjectApproval(
    configParam: CreateObjectApprovalRequest,
    authType: AuthType,
  ): Promise<SpResponse<string>>;

  createObject(
    getApprovalParams: CreateObjectApprovalRequest,
    authType: AuthType,
  ): Promise<TxResponse>;

  uploadObject(configParam: PutObjectRequest, authType: AuthType): Promise<SpResponse<null>>;

  cancelCreateObject(msg: MsgCancelCreateObject): Promise<TxResponse>;

  updateObjectInfo(msg: MsgUpdateObjectInfo): Promise<TxResponse>;

  deleteObject(msg: MsgDeleteObject): Promise<TxResponse>;

  headObject(bucketName: string, objectName: string): Promise<QueryHeadObjectResponse>;

  headObjectById(objectId: string): Promise<QueryHeadObjectResponse>;

  headObjectNFT(request: QueryNFTRequest): Promise<QueryObjectNFTResponse>;

  /**
   * get s3 object's blob
   */
  getObject(configParam: GetObjectRequest, authType: AuthType): Promise<SpResponse<Blob>>;

  getObjectPreviewUrl(configParam: GetPrivewObject, authType: AuthType): Promise<string>;

  /**
   * download s3 object
   */
  downloadFile(configParam: GetObjectRequest, authType: AuthType): Promise<void>;

  listObjects(
    configParam: ListObjectsByBucketNameRequest,
  ): Promise<SpResponse<ListObjectsByBucketNameResponse>>;

  createFolder(
    getApprovalParams: Omit<
      CreateObjectApprovalRequest,
      'contentLength' | 'fileType' | 'expectCheckSums'
    >,
    authType: AuthType,
  ): Promise<TxResponse>;

  putObjectPolicy(
    bucketName: string,
    objectName: string,
    // expirationTime: Date,
    srcMsg: Omit<MsgPutPolicy, 'resource' | 'expirationTime'>,
  ): Promise<TxResponse>;

  deleteObjectPolicy(
    operator: string,
    bucketName: string,
    objectName: string,
    principalAddr: string,
    principalType: keyof typeof PrincipalType,
  ): Promise<TxResponse>;

  isObjectPermissionAllowed(
    bucketName: string,
    objectName: string,
    actionType: ActionType,
    operator: string,
  ): Promise<QueryVerifyPermissionResponse>;

  getObjectPolicy(
    bucketName: string,
    objectName: string,
    principalAddr: string,
  ): Promise<QueryPolicyForAccountResponse>;

  getObjectMeta(params: GetObjectMetaRequest): Promise<SpResponse<GetObjectMetaResponse>>;

  listObjectsByIds(params: ListObjectsByIDsRequest): Promise<SpResponse<ListObjectsByIDsResponse>>;

  listObjectPolicies(
    params: GetListObjectPoliciesRequest,
  ): Promise<SpResponse<GetListObjectPoliciesResponse>>;
  // TODO: GetObjectUploadProgress
  // TODO: getObjectStatusFromSP
}

@injectable()
export class Objectt implements IObject {
  constructor(
    @inject(delay(() => TxClient)) private txClient: TxClient,
    @inject(delay(() => Storage)) private storage: Storage,
    @inject(delay(() => Sp)) private sp: Sp,
  ) {}

  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);
  private spClient = container.resolve(SpClient);

  public async getCreateObjectApproval(params: CreateObjectApprovalRequest, authType: AuthType) {
    const {
      bucketName,
      creator,
      objectName,
      visibility = 'VISIBILITY_TYPE_PUBLIC_READ',
      duration = 3000,
      fileType = 'application/octet-stream',
      redundancyType = 'REDUNDANCY_EC_TYPE',
      contentLength,
      expectCheckSums,
    } = params;

    try {
      if (!isValidBucketName(bucketName)) {
        throw new Error('Error bucket name');
      }
      if (!isValidObjectName(objectName)) {
        throw new Error('Error object name');
      }
      if (!creator) {
        throw new Error('empty creator address');
      }

      let endpoint = params.endpoint;
      if (!endpoint) {
        endpoint = await this.sp.getSPUrlByBucket(bucketName);
      }
      const { reqMeta, optionsWithOutHeaders, url } =
        getApprovalMetaInfo<CreateObjectApprovalResponse>(endpoint, 'CreateObject', {
          bucket_name: bucketName,
          content_type: fileType,
          creator: creator,
          expect_checksums: expectCheckSums,
          object_name: objectName,
          payload_size: contentLength.toString(),
          primary_sp_approval: {
            expired_height: '0',
            global_virtual_group_family_id: 0,
            sig: null,
          },
          redundancy_type: redundancyType,
          visibility,
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
          message: 'Get create object approval error.',
        },
      );

      const signedMsgString = result.headers.get('X-Gnfd-Signed-Msg') || '';
      const signedMsg = JSON.parse(
        bytesToUtf8(hexToBytes(signedMsgString)),
      ) as CreateObjectApprovalResponse;

      return {
        code: 0,
        message: 'Get create object approval success.',
        body: result.headers.get('X-Gnfd-Signed-Msg') ?? '',
        statusCode: result.status,
        signedMsg,
      };
    } catch (error: any) {
      throw {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  private async createObjectTx(msg: MsgCreateObject, signedMsg: CreateObjectApprovalResponse) {
    return await this.txClient.tx(
      MsgCreateObjectTypeUrl,
      msg.creator,
      MsgCreateObjectSDKTypeEIP712,
      {
        ...signedMsg,
        type: MsgCreateObjectTypeUrl,
        primary_sp_approval: {
          expired_height: signedMsg.primary_sp_approval.expired_height,
          global_virtual_group_family_id:
            signedMsg.primary_sp_approval.global_virtual_group_family_id,
          sig: signedMsg.primary_sp_approval.sig,
        },
      },
      MsgCreateObject.encode(msg).finish(),
    );
  }

  public async createObject(getApprovalParams: CreateObjectApprovalRequest, authType: AuthType) {
    const { signedMsg } = await this.getCreateObjectApproval(getApprovalParams, authType);
    if (!signedMsg) {
      throw new Error('Get create object approval error');
    }

    const msg: MsgCreateObject = {
      bucketName: signedMsg.bucket_name,
      creator: signedMsg.creator,
      objectName: signedMsg.object_name,
      contentType: signedMsg.content_type,
      payloadSize: Long.fromString(signedMsg.payload_size),
      visibility: visibilityTypeFromJSON(signedMsg.visibility),
      expectChecksums: signedMsg.expect_checksums.map((e: string) => bytesFromBase64(e)),
      redundancyType: redundancyTypeFromJSON(signedMsg.redundancy_type),
      primarySpApproval: {
        expiredHeight: Long.fromString(signedMsg.primary_sp_approval.expired_height),
        sig: bytesFromBase64(signedMsg.primary_sp_approval.sig || ''),
        globalVirtualGroupFamilyId: signedMsg.primary_sp_approval.global_virtual_group_family_id,
      },
    };

    return await this.createObjectTx(msg, signedMsg);
  }

  public async uploadObject(
    params: PutObjectRequest,
    authType: AuthType,
  ): Promise<SpResponse<null>> {
    const { bucketName, objectName, txnHash, body, duration = 30000 } = params;
    if (!isValidBucketName(bucketName)) {
      throw new Error('Error bucket name');
    }
    if (!isValidObjectName(objectName)) {
      throw new Error('Error object name');
    }
    if (!txnHash) {
      throw new Error('Transaction hash is empty, please check.');
    }

    let endpoint = params.endpoint;
    if (!endpoint) {
      endpoint = await this.sp.getSPUrlByBucket(bucketName);
    }
    const { reqMeta, optionsWithOutHeaders, url } = await getPutObjectMetaInfo(endpoint, {
      bucketName,
      objectName,
      contentType: body.type,
      txnHash,
      body,
    });
    const signHeaders = await this.spClient.signHeaders(reqMeta, authType);

    try {
      const result = await this.spClient.callApi(
        url,
        {
          ...optionsWithOutHeaders,
          headers: signHeaders,
        },
        duration,
      );
      const { status } = result;

      return { code: 0, message: 'Put object success.', statusCode: status };
    } catch (error: any) {
      return {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  public async cancelCreateObject(msg: MsgCancelCreateObject) {
    return await this.txClient.tx(
      MsgCancelCreateObjectTypeUrl,
      msg.operator,
      MsgCancelCreateObjectSDKTypeEIP712,
      MsgCancelCreateObject.toSDK(msg),
      MsgCancelCreateObject.encode(msg).finish(),
    );
  }

  public async deleteObject(msg: MsgDeleteObject) {
    return await this.txClient.tx(
      MsgDeleteObjectTypeUrl,
      msg.operator,
      MsgDeleteObjectSDKTypeEIP712,
      MsgDeleteObject.toSDK(msg),
      MsgDeleteObject.encode(msg).finish(),
    );
  }

  public async updateObjectInfo(msg: MsgUpdateObjectInfo) {
    return await this.txClient.tx(
      MsgUpdateObjectInfoTypeUrl,
      msg.operator,
      MsgUpdateObjectInfoSDKTypeEIP712,
      MsgUpdateObjectInfo.toSDK(msg),
      MsgUpdateObjectInfo.encode(msg).finish(),
    );
  }

  public async headObject(bucketName: string, objectName: string) {
    const rpc = await this.queryClient.getStorageQueryClient();

    return rpc.HeadObject({
      bucketName,
      objectName,
    });
  }

  public async headObjectById(objectId: string) {
    const rpc = await this.queryClient.getStorageQueryClient();

    return rpc.HeadObjectById({
      objectId,
    });
  }

  public async headObjectNFT(request: QueryNFTRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.HeadObjectNFT(request);
  }

  public async getObject(params: GetObjectRequest, authType: AuthType) {
    try {
      const { bucketName, objectName, duration = 30000 } = params;
      if (!isValidBucketName(bucketName)) {
        throw new Error('Error bucket name');
      }
      if (!isValidObjectName(objectName)) {
        throw new Error('Error object name');
      }
      let endpoint = params.endpoint;
      if (!endpoint) {
        endpoint = await this.sp.getSPUrlByBucket(bucketName);
      }

      const { reqMeta, optionsWithOutHeaders, url } = await getGetObjectMetaInfo(endpoint, {
        bucketName,
        objectName,
      });

      const headers = await this.spClient.signHeaders(reqMeta, authType);

      const result = await this.spClient.callApi(
        url,
        {
          ...optionsWithOutHeaders,
          headers,
        },
        duration,
      );
      const { status } = result;
      if (!result.ok) {
        const xmlError = await result.text();
        const { code, message } = await parseError(xmlError);

        return {
          code: code || -1,
          message: message || 'Get object error.',
          statusCode: status,
        };
      }

      const fileBlob = await result.blob();
      return {
        code: 0,
        body: fileBlob,
        message: 'Get object success.',
        statusCode: status,
      };
    } catch (error: any) {
      return {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  public async getObjectPreviewUrl(params: GetPrivewObject, authType: AuthType) {
    const { bucketName, objectName, queryMap } = params;
    if (!isValidBucketName(bucketName)) {
      throw new Error('Error bucket name');
    }
    if (!isValidObjectName(objectName)) {
      throw new Error('Error object name');
    }
    let endpoint = params.endpoint;
    if (!endpoint) {
      endpoint = await this.sp.getSPUrlByBucket(bucketName);
    }

    const path = '/' + encodePath(objectName);
    const url = generateUrlByBucketName(endpoint, bucketName) + path;

    const queryRaw = getSortQuery(queryMap);

    const canonicalRequest = [
      METHOD_GET,
      `/${encodePath(objectName)}`,
      queryRaw,
      new URL(url).host,
      '\n',
    ].join('\n');

    const unsignedMsg = getMsgToSign(utf8ToBytes(canonicalRequest));
    let authorization = '';
    if (authType.type === 'ECDSA') {
      const sig = secpSign(unsignedMsg, authType.privateKey);
      authorization = `GNFD1-ECDSA, Signature=${sig.slice(2)}`;
    } else {
      const sig = await signSignatureByEddsa(authType.seed, hexlify(unsignedMsg).slice(2));
      authorization = `GNFD1-EDDSA,Signature=${sig}`;
    }

    return `${url}?Authorization=${encodeURIComponent(authorization)}&${queryRaw}`;
  }

  public async downloadFile(configParam: GetObjectRequest, authType: AuthType): Promise<void> {
    try {
      const { objectName } = configParam;
      const getObjectResult = await this.getObject(configParam, authType);

      if (getObjectResult.code !== 0) {
        throw new Error(getObjectResult.message);
      }

      const file = getObjectResult?.body;
      if (file) {
        // const {file} = getObjectResult;
        const fileURL = URL.createObjectURL(file);
        // create <a> tag dynamically
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        // it forces the name of the downloaded file
        fileLink.download = objectName as string;
        // triggers the click event
        fileLink.click();
      }
      return;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async listObjects(configParam: ListObjectsByBucketNameRequest) {
    try {
      const { bucketName, endpoint, duration = 30000, query = new URLSearchParams() } = configParam;
      if (!isValidBucketName(bucketName)) {
        throw new Error('Error bucket name');
      }
      if (!isValidUrl(endpoint)) {
        throw new Error('Invalid endpoint');
      }
      const url = `${generateUrlByBucketName(endpoint, bucketName)}?${query?.toString()}`;
      const headers = new Headers();

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
        return {
          code: code || -1,
          message: message || 'List object error.',
          statusCode: status,
        };
      }

      const xmlData = await result.text();
      const res = await parseListObjectsByBucketNameResponse(xmlData);

      return {
        code: 0,
        message: 'List object success.',
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

  public async createFolder(
    getApprovalParams: Omit<
      CreateObjectApprovalRequest,
      'contentLength' | 'fileType' | 'expectCheckSums'
    >,
    authType: AuthType,
  ) {
    if (!getApprovalParams.objectName.endsWith('/')) {
      throw new Error(
        'failed to create folder. Folder names must end with a forward slash (/) character',
      );
    }

    /**
     * const file = new File([], 'scc', { type: 'text/plain' });
      const fileBytes = await file.arrayBuffer();
      console.log('fileBytes', fileBytes);
      const hashResult = await FileHandler.getPieceHashRoots(new Uint8Array(fileBytes));
      console.log('hashResult', hashResult);
      const { contentLength, expectCheckSums } = hashResult;
     */

    const params: CreateObjectApprovalRequest = {
      bucketName: getApprovalParams.bucketName,
      objectName: getApprovalParams.objectName,
      contentLength: 0,
      fileType: 'text/plain',
      expectCheckSums: [
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
      ],
      creator: getApprovalParams.creator,
    };

    return this.createObject(params, authType);
  }

  public async putObjectPolicy(
    bucketName: string,
    objectName: string,
    // expirationTime: Date,
    srcMsg: Omit<MsgPutPolicy, 'resource' | 'expirationTime'>,
  ) {
    const resource = GRNToString(newObjectGRN(bucketName, objectName));
    const msg: MsgPutPolicy = {
      ...srcMsg,
      resource,
      // expirationTime: fromJsonTimestamp(expirationTime),
    };
    return await this.storage.putPolicy(msg);
  }

  public async isObjectPermissionAllowed(
    bucketName: string,
    objectName: string,
    actionType: ActionType,
    operator: string,
  ) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.VerifyPermission({
      bucketName,
      objectName,
      actionType,
      operator,
    });
  }

  public async getObjectPolicy(bucketName: string, objectName: string, principalAddr: string) {
    const rpc = await this.queryClient.getStorageQueryClient();

    const resource = GRNToString(newObjectGRN(bucketName, objectName));

    return await rpc.QueryPolicyForAccount({
      resource,
      principalAddress: principalAddr,
    });
  }

  public async deleteObjectPolicy(
    operator: string,
    bucketName: string,
    objectName: string,
    principalAddr: string,
    principalType: keyof typeof PrincipalType,
  ) {
    const resource = GRNToString(newObjectGRN(bucketName, objectName));
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

  public async getObjectMeta(params: GetObjectMetaRequest) {
    const { bucketName, objectName, endpoint } = params;
    if (!isValidBucketName(bucketName)) {
      throw new Error('Error bucket name');
    }
    if (!isValidObjectName(objectName)) {
      throw new Error('Error object name');
    }

    const { url } = getObjectMetaInfo(endpoint, params);

    const result = await this.spClient.callApi(url, {
      method: METHOD_GET,
    });

    const xml = await result.text();
    const res = await parseGetObjectMetaResponse(xml);

    return {
      code: 0,
      message: 'get object meta success.',
      statusCode: result.status,
      body: res,
    };
  }

  public async listObjectsByIds(params: ListObjectsByIDsRequest) {
    try {
      const sp = await this.sp.getInServiceSP();
      const { url } = getListObjectsByIDsMetaInfo(sp.endpoint, params);

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
      const res = await parseListObjectsByIdsResponse(xmlData);

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

  public async listObjectPolicies(params: GetListObjectPoliciesRequest) {
    let endpoint = params.endpoint;
    if (!endpoint) {
      endpoint = await this.sp.getSPUrlByBucket(params.bucketName);
    }
    const { url } = getListObjectPoliciesMetaInfo(endpoint, params);

    const result = await this.spClient.callApi(url, {
      headers: {},
      method: METHOD_GET,
    });

    const xml = await result.text();
    const res = parseGetListObjectPoliciesResponse(xml);

    return {
      code: 0,
      message: 'success',
      statusCode: result.status,
      body: res,
    };
  }
}
