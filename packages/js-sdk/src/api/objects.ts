import { getResumablePutObjectMetaInfo } from '@/clients/spclient/spApis/resumablePutObject';
import { DelegatedOpts, UploadFile } from '@/types/sp/Common';
import {
  ActionType,
  Principal,
  PrincipalType,
  principalTypeFromJSON,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';
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
import { base64FromBytes, bytesFromBase64 } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { hexlify } from '@ethersproject/bytes';
import { ed25519 } from '@noble/curves/ed25519';
import { Headers } from 'cross-fetch';
import { container, delay, inject, injectable } from 'tsyringe';
import {
  DEFAULT_PART_SIZE,
  GRNToString,
  MsgCancelCreateObjectTypeUrl,
  MsgCreateObjectTypeUrl,
  MsgDeleteObjectTypeUrl,
  MsgUpdateObjectInfoTypeUrl,
  newObjectGRN,
} from '..';
import { RpcQueryClient } from '../clients/queryclient';
import {
  HTTPHeaderRegPubKey,
  encodePath,
  getAuthorization,
  getSortQuery,
} from '../clients/spclient/auth';
import {
  getDelegatedCreateFolderMetaInfo,
  parseDelegatedCreateFolderResponse,
} from '../clients/spclient/spApis/delegatedCreateFolder';
import { getGetObjectMetaInfo } from '../clients/spclient/spApis/getObject';
import {
  getObjectMetaInfo,
  parseGetObjectMetaResponse,
} from '../clients/spclient/spApis/getObjectMeta';
import {
  getObjectOffsetInfo,
  parseObjectOffsetResponse,
} from '../clients/spclient/spApis/getObjectOffset';
import {
  getObjectStatusInfo,
  parseObjectStatusResponse,
} from '../clients/spclient/spApis/getObjectStatus';
import {
  getListObjectPoliciesMetaInfo,
  parseGetListObjectPoliciesResponse,
} from '../clients/spclient/spApis/listObjectPolicies';
import { parseListObjectsByBucketNameResponse } from '../clients/spclient/spApis/listObjectsByBucket';
import {
  getListObjectsByIDsMetaInfo,
  parseListObjectsByIdsResponse,
} from '../clients/spclient/spApis/listObjectsByIds';
import { parseError } from '../clients/spclient/spApis/parseError';
import { getPutObjectMetaInfo } from '../clients/spclient/spApis/putObject';
import { SpClient } from '../clients/spclient/spClient';
import { TxClient } from '../clients/txClient';
import { METHOD_GET, NORMAL_ERROR_CODE } from '../constants/http';
import { MsgCancelCreateObjectSDKTypeEIP712 } from '../messages/greenfield/storage/MsgCancelCreateObject';
import { MsgCreateObjectSDKTypeEIP712 } from '../messages/greenfield/storage/MsgCreateObject';
import { MsgDeleteObjectSDKTypeEIP712 } from '../messages/greenfield/storage/MsgDeleteObject';
import { MsgUpdateObjectInfoSDKTypeEIP712 } from '../messages/greenfield/storage/MsgUpdateObjectInfo';
import {
  AuthType,
  GetListObjectPoliciesRequest,
  GetListObjectPoliciesResponse,
  GetPrivewObject,
  ListObjectsByBucketNameRequest,
  ListObjectsByIDsRequest,
  ListObjectsByIDsResponse,
  Long,
  ObjectStatus,
  OnProgress,
  SpResponse,
  TxResponse,
  UploadOffsetResponse,
} from '../types';
import {
  DelegateCreateFolderRepsonse,
  DelegatedCreateFolderRequest,
} from '../types/sp/DelegateCreateFolder';
import { DelegatedPubObjectRequest } from '../types/sp/DelegatedPubObject';
import { GetObjectRequest } from '../types/sp/GetObject';
import { GetObjectMetaRequest, GetObjectMetaResponse } from '../types/sp/GetObjectMeta';
import { ListObjectsByBucketNameResponse } from '../types/sp/ListObjectsByBucketName';
import { PutObjectRequest } from '../types/sp/PutObject';
import { UploadProgressResponse } from '../types/sp/UploadProgress';
import { assertAuthType, assertFileType, assertStringRequire } from '../utils/asserts/params';
import {
  checkObjectName,
  generateUrlByBucketName,
  verifyBucketName,
  verifyObjectName,
  verifyUrl,
} from '../utils/asserts/s3';
import { Sp } from './sp';
import { Storage } from './storage';

export interface IObject {
  createObject(msg: MsgCreateObject): Promise<TxResponse>;

  uploadObject(configParam: PutObjectRequest, authType: AuthType): Promise<SpResponse<null>>;

  delegateUploadObject(
    params: DelegatedPubObjectRequest,
    authType: AuthType,
  ): Promise<SpResponse<null>>;

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
    msg: Omit<MsgCreateObject, 'payloadSize' | 'contentType' | 'expectChecksums'>,
  ): Promise<TxResponse>;

  delegateCreateFolder(
    params: DelegatedCreateFolderRequest,
    authType: AuthType,
  ): Promise<SpResponse<DelegateCreateFolderRepsonse>>;

  putObjectPolicy(
    bucketName: string,
    objectName: string,
    // expirationTime: Date,
    srcMsg: Omit<MsgPutPolicy, 'resource'>,
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

  /**
   * return the status of object including the uploading progress
   */
  getObjectUploadProgress(
    bucketName: string,
    objectName: string,
    authType: AuthType,
  ): Promise<string>;
}

@injectable()
export class Objects implements IObject {
  constructor(
    @inject(delay(() => TxClient)) private txClient: TxClient,
    @inject(delay(() => Storage)) private storage: Storage,
    @inject(delay(() => Sp)) private sp: Sp,
  ) {}

  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);
  private spClient = container.resolve(SpClient);

  public async createObject(msg: MsgCreateObject) {
    verifyBucketName(msg.bucketName);
    verifyObjectName(msg.objectName);
    checkObjectName(msg.objectName);
    assertStringRequire(msg.creator, 'empty creator address');

    const createObjMsg: MsgCreateObject = {
      ...msg,
      primarySpApproval: {
        globalVirtualGroupFamilyId: 0,
        expiredHeight: Long.fromInt(0),
        sig: Uint8Array.from([]),
      },
    };

    return await this.txClient.tx(
      MsgCreateObjectTypeUrl,
      msg.creator,
      MsgCreateObjectSDKTypeEIP712,
      {
        ...MsgCreateObject.toSDK(createObjMsg),
        primary_sp_approval: {
          expired_height: '0',
          global_virtual_group_family_id: 0,
        },
        expect_checksums: createObjMsg.expectChecksums.map((e) => base64FromBytes(e)),
        payload_size: createObjMsg.payloadSize.toNumber(),
      },
      MsgCreateObject.encode(createObjMsg).finish(),
    );
  }

  public async delegateUploadObject(params: DelegatedPubObjectRequest, authType: AuthType) {
    const {
      bucketName,
      objectName,
      body,
      resumableOpts,
      timeout = 30000,
      delegatedOpts,
      onProgress,
    } = params;

    assertAuthType(authType);
    verifyBucketName(bucketName);
    verifyObjectName(objectName);

    const disableResumable = resumableOpts?.disableResumable ?? true;
    const partSize = resumableOpts?.partSize ?? DEFAULT_PART_SIZE;

    let endpoint = params.endpoint;
    if (!endpoint) {
      endpoint = await this.sp.getSPUrlByBucket(bucketName);
    }

    const { params: storageParams } = await this.storage.params();
    const maxSegmentSize = storageParams.versionedParams.maxSegmentSize.toNumber();

    if (partSize % maxSegmentSize !== 0) {
      throw new Error(
        'partSize should be an integer multiple of the segment size: ' + maxSegmentSize,
      );
    }

    if (body.size <= partSize || disableResumable) {
      return this.putObject({
        endpoint,
        bucketName,
        objectName,
        body,
        authType,
        delegatedOpts,
        duration: timeout,
        txnHash: '',
        onProgress,
      });
    }

    return await this.putResumableObject(
      endpoint,
      bucketName,
      objectName,
      body,
      partSize,
      authType,
      timeout,
      delegatedOpts,
    );
  }

  public async uploadObject(
    params: PutObjectRequest,
    authType: AuthType,
  ): Promise<SpResponse<null>> {
    const { bucketName, objectName, body, duration = 30000, resumableOpts, onProgress } = params;
    assertAuthType(authType);
    verifyBucketName(bucketName);
    verifyObjectName(objectName);

    let endpoint = params.endpoint;
    if (!endpoint) {
      endpoint = await this.sp.getSPUrlByBucket(bucketName);
    }

    let txnHash = params.txnHash;
    if (!txnHash) {
      const { body } = await this.getObjectMeta({
        bucketName,
        objectName,
        endpoint,
      });
      txnHash = body.GfSpGetObjectMetaResponse.Object.CreateTxHash;
    }

    const { params: storageParams } = await this.storage.params();

    const maxSegmentSize = storageParams.versionedParams.maxSegmentSize.toNumber();

    const disableResumable = resumableOpts?.disableResumable ?? true;
    const partSize = resumableOpts?.partSize ?? DEFAULT_PART_SIZE;

    if (partSize % maxSegmentSize !== 0) {
      throw new Error(
        'partSize should be an integer multiple of the segment size: ' + maxSegmentSize,
      );
    }

    if (body.size <= partSize || disableResumable) {
      return this.putObject({
        endpoint,
        bucketName,
        objectName,
        body,
        txnHash,
        authType,
        duration,
        onProgress,
      });
    }

    return await this.putResumableObject(
      endpoint,
      bucketName,
      objectName,
      body,
      partSize,
      authType,
      duration,
    );
  }

  private async putObject(params: {
    endpoint: string;
    bucketName: string;
    objectName: string;
    body: UploadFile;
    txnHash: string;
    authType: AuthType;
    delegatedOpts?: DelegatedOpts;
    duration: number;
    onProgress?: OnProgress;
  }): Promise<SpResponse<null>> {
    const {
      authType,
      body,
      bucketName,
      delegatedOpts,
      duration,
      endpoint,
      objectName,
      txnHash,
      onProgress,
    } = params;

    const { reqMeta, optionsWithOutHeaders, url, file } = await getPutObjectMetaInfo(endpoint, {
      bucketName,
      objectName,
      contentType: body.type,
      txnHash,
      body,
      delegatedOpts,
    });
    const signHeaders = await this.spClient.signHeaders(reqMeta, authType);

    try {
      const result = await this.spClient.upload(
        url,
        {
          ...optionsWithOutHeaders,
          headers: signHeaders,
        },
        duration,
        file,
        {
          onProgress,
        },
      );

      const { status } = result;

      return { code: 0, message: 'Put object success.', statusCode: status };
    } catch (error: any) {
      return {
        code: error.code || -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  private splitPartInfo(objectSize: number, configuredPartSize: number) {
    const partSizeFlt = configuredPartSize;
    // Total parts count.
    const totalPartsCount = Math.ceil(objectSize / partSizeFlt);
    // Part size.
    const partSize = partSizeFlt;
    // Last part size.
    const lastPartSize = objectSize - (totalPartsCount - 1) * partSize;
    return {
      totalPartsCount,
      partSize,
      lastPartSize,
    };
  }

  private async putResumableObject(
    endpoint: string,
    bucketName: string,
    objectName: string,
    body: UploadFile,
    partSize: number,
    authType: AuthType,
    timeout: number,
    delegatedOpts?: DelegatedOpts,
  ) {
    let offset = 0;
    if (!delegatedOpts) {
      const isObjectExist = await this.headSPObjectInfo(bucketName, objectName, authType);
      if (!isObjectExist) {
        throw new Error('Object does not exist');
      }

      offset = await this.getObjectResumableUploadOffset(bucketName, objectName, authType);
    }

    const { totalPartsCount } = this.splitPartInfo(body.size, partSize);

    // split file
    const file = assertFileType(body) ? body.content : body;
    const chunks = [];
    for (let i = 0; i < totalPartsCount; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, body.size);
      const chunk = file.slice(start, end);
      chunks.push(chunk);
    }

    let startPartNumber = offset / partSize;
    while (startPartNumber < totalPartsCount) {
      const chunkFile = new File([chunks[startPartNumber]], '');

      const { reqMeta, optionsWithOutHeaders, url } = await getResumablePutObjectMetaInfo(
        endpoint,
        {
          bucketName,
          objectName,
          contentType: body.type,
          body: chunkFile,
          offset: startPartNumber * partSize,
          complete: startPartNumber === totalPartsCount - 1,
          delegatedOpts,
        },
      );

      const signHeaders = await this.spClient.signHeaders(reqMeta, authType);

      try {
        await this.spClient.callApi(
          url,
          {
            ...optionsWithOutHeaders,
            headers: signHeaders,
          },
          timeout,
        );
      } catch (error: any) {
        return {
          code: -1,
          message: error.message,
          statusCode: error?.statusCode || NORMAL_ERROR_CODE,
        };
      } finally {
        startPartNumber++;
      }
    }

    return { code: 0, message: 'Put all object parts success.', statusCode: 200 };
  }

  private async headSPObjectInfo(bucketName: string, objectName: string, authType: AuthType) {
    const { code } = await this.getObjectStatusFromSp(bucketName, objectName, authType);

    if (code === 0) {
      return true;
    }

    return false;
  }

  private async getObjectResumableUploadOffset(
    bucketName: string,
    objectName: string,
    authType: AuthType,
  ) {
    const { objectInfo } = await this.headObject(bucketName, objectName);
    if (!objectInfo) {
      throw new Error('Object not found');
    }

    if (objectInfo.objectStatus == ObjectStatus.OBJECT_STATUS_CREATED) {
      const { code, body } = await this.getObjectOffsetFromSP(bucketName, objectName, authType);

      if (body) {
        return body.QueryResumeOffset.Offset;
      }
    }

    return 0;
  }

  private async getObjectOffsetFromSP(
    bucketName: string,
    objectName: string,
    authType: AuthType,
  ): Promise<SpResponse<UploadOffsetResponse>> {
    const endpoint = await this.sp.getSPUrlByBucket(bucketName);

    const { url, optionsWithOutHeaders, reqMeta } = await getObjectOffsetInfo(endpoint, {
      bucketName,
      objectName,
    });

    const signHeaders = await this.spClient.signHeaders(reqMeta, authType);

    try {
      const result = await this.spClient.callApi(
        url,
        {
          ...optionsWithOutHeaders,
          headers: signHeaders,
        },
        5000,
      );
      // console.log('upload-context result', result);
      const { status } = result;

      if (!result.ok) {
        const xmlError = await result.text();
        const { code, message } = await parseError(xmlError);
        return {
          code: code || -1,
          message: message || 'error',
          statusCode: status,
          body: {
            QueryResumeOffset: {
              Offset: 0,
            },
          },
        };
      }

      const xmlData = await result.text();
      const res = parseObjectOffsetResponse(xmlData);

      return { code: 0, message: 'get upload offset success', statusCode: status, body: res };
    } catch (error: any) {
      // console.log('err', error);
      const message = error.message;

      if (message.includes('no uploading record')) {
        return {
          code: -1,
          message: message,
          statusCode: error.code,
          body: {
            QueryResumeOffset: {
              Offset: 0,
            },
          },
        };
      }
      return {
        code: -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  private async getObjectStatusFromSp(
    bucketName: string,
    objectName: string,
    authType: AuthType,
  ): Promise<SpResponse<UploadProgressResponse>> {
    const endpoint = await this.sp.getSPUrlByBucket(bucketName);

    const { url, optionsWithOutHeaders, reqMeta } = await getObjectStatusInfo(endpoint, {
      bucketName,
      objectName,
    });

    const signHeaders = await this.spClient.signHeaders(reqMeta, authType);

    try {
      const result = await this.spClient.callApi(
        url,
        {
          ...optionsWithOutHeaders,
          headers: signHeaders,
        },
        5000,
      );
      // console.log('upload-progress result', result);
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
      const res = parseObjectStatusResponse(xmlData);

      return { code: 0, message: 'success', statusCode: status, body: res };
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
      assertAuthType(authType);
      const { bucketName, objectName, duration = 30000 } = params;
      verifyBucketName(bucketName);
      verifyObjectName(objectName);

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
    assertAuthType(authType);
    if (authType.type === 'ECDSA') {
      throw new Error('Get object preview url only support EDDSA');
    }
    const { bucketName, objectName, queryMap } = params;
    verifyBucketName(bucketName);
    verifyObjectName(objectName);
    let endpoint = params.endpoint;
    if (!endpoint) {
      endpoint = await this.sp.getSPUrlByBucket(bucketName);
    }

    const path = '/' + encodePath(objectName);
    const url = generateUrlByBucketName(endpoint, bucketName) + path;

    let pubKey = '';
    if (authType.type === 'EDDSA') {
      pubKey = hexlify(ed25519.getPublicKey(authType.seed.slice(2)));
    }

    const queryRaw = getSortQuery({
      ...queryMap,
      [HTTPHeaderRegPubKey]: pubKey.slice(2),
    });

    const canonicalRequest = [
      METHOD_GET,
      `/${encodePath(objectName)}`,
      queryRaw,
      new URL(url).host,
      '\n',
    ].join('\n');

    const auth = getAuthorization(canonicalRequest, authType);

    return `${url}?Authorization=${encodeURIComponent(auth)}&${queryRaw}`;
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

      verifyBucketName(bucketName);
      verifyUrl(endpoint);

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
    msg: Omit<MsgCreateObject, 'payloadSize' | 'contentType' | 'expectChecksums'>,
  ) {
    if (!msg.objectName.endsWith('/')) {
      throw new Error(
        'failed to create folder. Folder names must end with a forward slash (/) character',
      );
    }

    /**
     * const file = new File([], 'scc', { type: 'text/plain' });
      const fileBytes = await file.arrayBuffer();
      console.log('fileBytes', fileBytes);
      const rs = new ReedSolomon();
      const fileBytes = await file.arrayBuffer();
      const expectCheckSums = rs.encode(new Uint8Array(fileBytes));
     */

    const newMsg: MsgCreateObject = {
      ...msg,
      payloadSize: Long.fromInt(0),
      contentType: 'text/plain',
      expectChecksums: [
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
      ].map((x) => bytesFromBase64(x)),
    };

    return this.createObject(newMsg);
  }

  public async delegateCreateFolder(params: DelegatedCreateFolderRequest, authType: AuthType) {
    const { bucketName, objectName, delegatedOpts, timeout = 10000 } = params;

    let endpoint = params.endpoint;
    if (!endpoint) {
      endpoint = await this.sp.getSPUrlByBucket(bucketName);
    }
    const { reqMeta, optionsWithOutHeaders, url } = await getDelegatedCreateFolderMetaInfo(
      endpoint,
      {
        bucketName: bucketName,
        objectName: objectName,
        // contentType: '',
        delegatedOpts,
      },
    );
    const signHeaders = await this.spClient.signHeaders(reqMeta, authType);

    try {
      const result = await this.spClient.callApiV2(
        url,
        {
          ...optionsWithOutHeaders,
          headers: signHeaders,
        },
        timeout,
      );
      const { status } = result;

      //@ts-ignore
      const xmlData = result.text;
      const res = parseDelegatedCreateFolderResponse(xmlData);

      return { code: 0, message: 'Create folder success.', statusCode: status, body: res };
    } catch (error: any) {
      return {
        code: error.code || -1,
        message: error.message,
        statusCode: error?.statusCode || NORMAL_ERROR_CODE,
      };
    }
  }

  public async putObjectPolicy(
    bucketName: string,
    objectName: string,
    // expirationTime: Date,
    srcMsg: Omit<MsgPutPolicy, 'resource'>,
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
    verifyBucketName(bucketName);
    verifyObjectName(objectName);

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

  public async getObjectUploadProgress(bucketName: string, objectName: string, authType: AuthType) {
    const { objectInfo } = await this.headObject(bucketName, objectName);

    if (!objectInfo) {
      throw new Error('object not exist');
    }

    if (objectInfo.objectStatus == ObjectStatus.OBJECT_STATUS_CREATED) {
      const { body, message } = await this.getObjectStatusFromSp(bucketName, objectName, authType);

      if (!body) {
        throw new Error('fail to fetch object uploading progress from sp ' + message);
      }

      return body.QueryUploadProgress.ProgressDescription;
    }

    return objectInfo.objectStatus.toString();
  }
}
