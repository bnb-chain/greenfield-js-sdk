import { EMPTY_STRING_SHA256, METHOD_GET, METHOD_PUT, NORMAL_ERROR_CODE } from '@/constants/http';
import { MsgCancelCreateObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgCancelCreateObject';
import { MsgCreateObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgCreateObject';
import { MsgDeleteObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgDeleteObject';
import { MsgUpdateObjectInfoSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgUpdateObjectInfo';
import { ReqMeta } from '@/types/auth';
import { GetSpListObjectsByBucketNameResponse } from '@/types/spXML';
import { getAuthorization, newRequestHeadersByMeta } from '@/utils/auth';
import { fetchWithTimeout, parseErrorXml } from '@/utils/http';
import {
  ActionType,
  Principal,
  PrincipalType,
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
import { Headers } from 'cross-fetch';
import { XMLParser } from 'fast-xml-parser';
import { container, delay, inject, singleton } from 'tsyringe';
import {
  GRNToString,
  MsgCancelCreateObjectTypeUrl,
  MsgCreateObjectTypeUrl,
  MsgDeleteObjectTypeUrl,
  MsgUpdateObjectInfoTypeUrl,
  newObjectGRN,
} from '..';
import {
  ICreateObjectMsgType,
  IObjectResultType,
  Long,
  TBaseGetCreateObject,
  TBaseGetObject,
  TBasePutObject,
  TKeyValue,
  TListObjects,
  TxResponse,
} from '../types';
import { decodeObjectFromHexString, encodeObjectToHexString } from '../utils/encoding';
import {
  generateUrlByBucketName,
  isValidBucketName,
  isValidObjectName,
  isValidUrl,
} from '../utils/s3';
import { Basic } from './basic';
import { OffChainAuth } from './offchainauth';
import { RpcQueryClient } from './queryclient';
import { Sp } from './sp';
import { AuthType, SpClient } from './spclient';
import { Storage } from './storage';

export interface IObject {
  getCreateObjectApproval(
    configParam: TBaseGetCreateObject,
    authType: AuthType,
  ): Promise<IObjectResultType<string>>;

  createObject(getApprovalParams: TBaseGetCreateObject, authType: AuthType): Promise<TxResponse>;

  uploadObject(configParam: TBasePutObject, authType: AuthType): Promise<IObjectResultType<null>>;

  cancelCreateObject(msg: MsgCancelCreateObject): Promise<TxResponse>;

  updateObjectInfo(msg: MsgUpdateObjectInfo): Promise<TxResponse>;

  deleteObject(msg: MsgDeleteObject): Promise<TxResponse>;

  headObject(bucketName: string, objectName: string): Promise<QueryHeadObjectResponse>;

  headObjectById(objectId: string): Promise<QueryHeadObjectResponse>;

  headObjectNFT(request: QueryNFTRequest): Promise<QueryObjectNFTResponse>;

  /**
   * get s3 object's blob
   */
  getObject(configParam: TBaseGetObject, authType: AuthType): Promise<IObjectResultType<Blob>>;

  /**
   * download s3 object
   */
  downloadFile(configParam: TBaseGetObject, authType: AuthType): Promise<void>;

  listObjects(
    configParam: TListObjects,
  ): Promise<IObjectResultType<GetSpListObjectsByBucketNameResponse>>;

  createFolder(
    getApprovalParams: Omit<TBaseGetCreateObject, 'contentLength' | 'fileType' | 'expectCheckSums'>,
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
  // TODO: GetObjectUploadProgress
  // TODO: getObjectStatusFromSP
}

@singleton()
export class Objectt implements IObject {
  constructor(
    @inject(delay(() => Basic)) private basic: Basic,
    @inject(delay(() => Storage)) private storage: Storage,
    @inject(delay(() => Sp)) private sp: Sp,
  ) {}

  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);
  private offChainAuthClient = container.resolve(OffChainAuth);
  private spClient = container.resolve(SpClient);

  public async getCreateObjectApproval(configParam: TBaseGetCreateObject, authType: AuthType) {
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
    } = configParam;

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

      // must sort (Go SDK)
      const msg: ICreateObjectMsgType = {
        bucket_name: bucketName,
        content_type: fileType,
        // content_type: 'application/octet-stream',
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
      };

      const endpoint = await this.sp.getSPUrlByBucket(bucketName);
      const path = '/greenfield/admin/v1/get-approval';
      const query = 'action=CreateObject';
      const url = `${endpoint}${path}?${query}`;

      const unSignedMessageInHex = encodeObjectToHexString(msg);

      const reqMeta: Partial<ReqMeta> = {
        contentSHA256: EMPTY_STRING_SHA256,
        txnMsg: unSignedMessageInHex,
        method: METHOD_GET,
        url: {
          hostname: new URL(endpoint).hostname,
          query,
          path,
        },
        contentType: fileType,
      };

      const metaHeaders: Headers = newRequestHeadersByMeta(reqMeta);

      let headerObj: Record<string, any> = {
        'X-Gnfd-Unsigned-Msg': unSignedMessageInHex,
        'Content-Type': fileType,
        'X-Gnfd-Content-Sha256': EMPTY_STRING_SHA256,
        'X-Gnfd-Date': metaHeaders.get('X-Gnfd-Date'),
        'X-Gnfd-Expiry-Timestamp': metaHeaders.get('X-Gnfd-Expiry-Timestamp'),
      };

      if (authType.type === 'EDDSA') {
        const { domain } = authType;
        metaHeaders.append('X-Gnfd-User-Address', creator);
        metaHeaders.append('X-Gnfd-App-Domain', domain);

        headerObj = {
          ...headerObj,
          'X-Gnfd-User-Address': creator,
          'X-Gnfd-App-Domain': domain,
        };
      }

      const auth = await getAuthorization(reqMeta, metaHeaders, authType);
      headerObj = {
        ...headerObj,
        Authorization: auth,
      };

      const headers = new Headers(headerObj);
      const result = await this.spClient.callApi(
        url,
        {
          headers,
          method: METHOD_GET,
        },
        duration,
        {
          code: -1,
          message: 'Get create object approval error.',
        },
      );

      const signedMsgString = result.headers.get('X-Gnfd-Signed-Msg') || '';
      const signedMsg = decodeObjectFromHexString(signedMsgString) as ICreateObjectMsgType;

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

  private async createObjectTx(msg: MsgCreateObject, signedMsg: ICreateObjectMsgType) {
    return await this.basic.tx(
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

  public async createObject(getApprovalParams: TBaseGetCreateObject, authType: AuthType) {
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
    configParam: TBasePutObject,
    authType: AuthType,
  ): Promise<IObjectResultType<null>> {
    const { bucketName, objectName, txnHash, body, duration = 30000 } = configParam;
    if (!isValidBucketName(bucketName)) {
      throw new Error('Error bucket name');
    }
    if (!isValidObjectName(objectName)) {
      throw new Error('Error object name');
    }
    if (!txnHash) {
      throw new Error('Transaction hash is empty, please check.');
    }

    const endpoint = await this.sp.getSPUrlByBucket(bucketName);
    const path = `/${objectName}`;
    const query = '';
    const url = `${generateUrlByBucketName(endpoint, bucketName)}${path}`;

    const reqMeta: Partial<ReqMeta> = {
      contentSHA256: EMPTY_STRING_SHA256,
      txnHash: txnHash,
      method: METHOD_PUT,
      url: {
        hostname: new URL(url).hostname,
        query,
        path,
      },
      contentType: body.type,
    };
    const headers = await this.spClient.makeHeaders(reqMeta, authType);

    /* const metaHeaders: Headers = newRequestHeadersByMeta(reqMeta);

    let headerObj: Record<string, any> = {
      'X-Gnfd-Txn-hash': txnHash,
      'X-Gnfd-Content-Sha256': EMPTY_STRING_SHA256,
      'X-Gnfd-Date': metaHeaders.get('X-Gnfd-Date'),
      'X-Gnfd-Expiry-Timestamp': metaHeaders.get('X-Gnfd-Expiry-Timestamp'),
      'Content-Type': body.type,
    };

    if (authType.type === 'EDDSA') {
      const { domain, address } = authType;
      metaHeaders.append('X-Gnfd-User-Address', address);
      metaHeaders.append('X-Gnfd-App-Domain', domain);
      headerObj = {
        ...headerObj,
        'X-Gnfd-User-Address': address,
        'X-Gnfd-App-Domain': domain,
      };
    }

    const auth = await getAuthorization(reqMeta, metaHeaders, authType);

    headerObj = {
      ...headerObj,
      Authorization: auth,
    };
    const headers = new Headers(headerObj); */

    try {
      const result = await fetchWithTimeout(
        url,
        {
          headers,
          method: METHOD_PUT,
          body,
        },
        duration,
      );
      const { status } = result;
      if (!result.ok) {
        const { code, message } = await parseErrorXml(result);
        return {
          code: +(code || 0) || -1,
          message: message || 'Put object error.',
          statusCode: status,
        };
      }

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
    return await this.basic.tx(
      MsgCancelCreateObjectTypeUrl,
      msg.operator,
      MsgCancelCreateObjectSDKTypeEIP712,
      MsgCancelCreateObject.toSDK(msg),
      MsgCancelCreateObject.encode(msg).finish(),
    );
  }

  public async deleteObject(msg: MsgDeleteObject) {
    return await this.basic.tx(
      MsgDeleteObjectTypeUrl,
      msg.operator,
      MsgDeleteObjectSDKTypeEIP712,
      MsgDeleteObject.toSDK(msg),
      MsgDeleteObject.encode(msg).finish(),
    );
  }

  public async updateObjectInfo(msg: MsgUpdateObjectInfo) {
    return await this.basic.tx(
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

  public async getObject(configParam: TBaseGetObject, authType: AuthType) {
    try {
      const { bucketName, objectName, duration = 30000 } = configParam;
      if (!isValidBucketName(bucketName)) {
        throw new Error('Error bucket name');
      }
      if (!isValidObjectName(objectName)) {
        throw new Error('Error object name');
      }
      const endpoint = await this.sp.getSPUrlByBucket(bucketName);
      const path = `/${objectName}`;
      const query = '';
      const url = generateUrlByBucketName(endpoint, bucketName) + '/' + objectName;

      const reqMeta: Partial<ReqMeta> = {
        contentSHA256: EMPTY_STRING_SHA256,
        method: METHOD_PUT,
        url: {
          hostname: new URL(url).hostname,
          query,
          path,
        },
        contentType: 'application/octet-stream',
      };

      const headers = await this.spClient.makeHeaders(reqMeta, authType);

      /* const metaHeaders: Headers = newRequestHeadersByMeta(reqMeta);

      let headerObj: Record<string, any> = {
        'X-Gnfd-Content-Sha256': EMPTY_STRING_SHA256,
        'X-Gnfd-Date': metaHeaders.get('X-Gnfd-Date'),
        'X-Gnfd-Expiry-Timestamp': metaHeaders.get('X-Gnfd-Expiry-Timestamp'),
        'Content-Type': 'application/octet-stream',
      };

      if (authType.type === 'EDDSA') {
        const { domain, address } = authType;
        metaHeaders.append('X-Gnfd-User-Address', address);
        metaHeaders.append('X-Gnfd-App-Domain', domain);
        headerObj = {
          ...headerObj,
          'X-Gnfd-User-Address': address,
          'X-Gnfd-App-Domain': domain,
        };
      }

      const auth = await getAuthorization(reqMeta, metaHeaders, authType);

      headerObj = {
        ...headerObj,
        Authorization: auth,
      };

      const headers = new Headers(headerObj); */

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
        const { code, message } = await parseErrorXml(result);

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

  public async downloadFile(configParam: TBaseGetObject, authType: AuthType): Promise<void> {
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

  public async listObjects(configParam: TListObjects) {
    try {
      const { bucketName, endpoint, duration = 30000, query = new URLSearchParams() } = configParam;
      if (!isValidBucketName(bucketName)) {
        throw new Error('Error bucket name');
      }
      if (!isValidUrl(endpoint)) {
        throw new Error('Invalid endpoint');
      }
      const url = `${generateUrlByBucketName(endpoint, bucketName)}?${query?.toString()}`;
      const headerContent: TKeyValue = {};
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
        const { code, message } = await parseErrorXml(result);
        return {
          code: code || -1,
          message: message || 'List object error.',
          statusCode: status,
        };
      }

      const xmlParser = new XMLParser({
        isArray: (tagName: string) => {
          if (tagName === 'Objects') return true;
          return false;
        },
        numberParseOptions: {
          hex: false,
          leadingZeros: true,
          skipLike: undefined,
          eNotation: false,
        },
      });
      const xmlData = await result.text();
      const res = xmlParser.parse(xmlData) as GetSpListObjectsByBucketNameResponse;

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
    getApprovalParams: Omit<TBaseGetCreateObject, 'contentLength' | 'fileType' | 'expectCheckSums'>,
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

    const params: TBaseGetCreateObject = {
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
  ) {
    const resource = GRNToString(newObjectGRN(bucketName, objectName));
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

  // private async getObjectStatusFromSP(params: IGetObjectStaus) {
  //   const {bucketInfo} = await this.bucket.headBucket(params.bucketName);
  //   const primarySpAddress = bucketInfo?.primarySpAddress

  //   // const url = params.endpoint + '/greenfield/admin/v1/get-approval?upload-progress=';
  //   // const unSignedMessageInHex = encodeObjectToHexString(msg);
  //   // const headers = new Headers({
  //   //   // TODO: replace when offchain release
  //   //   Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${MOCK_SIGNATURE}`,
  //   //   'X-Gnfd-Unsigned-Msg': unSignedMessageInHex,
  //   // });
  // }
}
