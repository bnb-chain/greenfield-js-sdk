import { MsgCancelCreateObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgCancelCreateObject';
import { MsgCreateObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgCreateObject';
import { MsgDeleteObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgDeleteObject';
import { MsgUpdateObjectInfoSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgUpdateObjectInfo';
import { getAuthorizationAuthTypeV2 } from '@/utils/auth';
import { fetchWithTimeout, METHOD_GET, METHOD_PUT, NORMAL_ERROR_CODE } from '@/utils/http';
import {
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
import { container, delay, inject, singleton } from 'tsyringe';
import {
  getApproval,
  GRNToString,
  MsgCancelCreateObjectTypeUrl,
  MsgCreateObjectTypeUrl,
  MsgDeleteObjectTypeUrl,
  MsgUpdateObjectInfoTypeUrl,
  newObjectGRN,
} from '..';
import {
  ICreateObjectMsgType,
  IObjectProps,
  IObjectResultType,
  Long,
  TCreateObject,
  TGetObject,
  TKeyValue,
  TListObjects,
  TPutObject,
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
import { Storage } from './storage';

export interface IObject {
  getCreateObjectApproval(
    getApprovalParams: TCreateObject,
  ): Promise<IObjectResultType<ICreateObjectMsgType>>;

  createObject(
    params: TCreateObject,
    approval?: ICreateObjectMsgType['primary_sp_approval'],
  ): Promise<TxResponse>;

  uploadObject(configParam: TPutObject): Promise<IObjectResultType<null>>;

  cancelCreateObject(msg: MsgCancelCreateObject): Promise<TxResponse>;

  updateObjectInfo(msg: MsgUpdateObjectInfo): Promise<TxResponse>;

  deleteObject(msg: MsgDeleteObject): Promise<TxResponse>;

  headObject(bucketName: string, objectName: string): Promise<QueryHeadObjectResponse>;

  headObjectById(objectId: string): Promise<QueryHeadObjectResponse>;

  headObjectNFT(request: QueryNFTRequest): Promise<QueryObjectNFTResponse>;

  getObject(configParam: TGetObject): Promise<IObjectResultType<Blob>>;

  downloadFile(configParam: TGetObject): Promise<void>;

  listObjects(configParam: TListObjects): Promise<IObjectResultType<Array<IObjectProps>>>;

  createFolder(
    getApprovalParams: Omit<TCreateObject, 'contentLength' | 'fileType' | 'expectCheckSums'>,
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

  // TODO: IsObjectPermissionAllowed
  // TODO: GetObjectUploadProgress
  // TODO: getObjectStatusFromSP
}

@singleton()
export class Objectt implements IObject {
  constructor(
    @inject(delay(() => Basic)) private basic: Basic,
    @inject(delay(() => Storage)) private storage: Storage,
  ) {}

  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);
  private offChainAuthClient = container.resolve(OffChainAuth);

  public async getCreateObjectApproval(configParam: TCreateObject) {
    const {
      bucketName,
      creator,
      objectName,
      visibility = 'VISIBILITY_TYPE_PUBLIC_READ',
      spInfo,
      duration = 3000,
      fileType = 'application/octet-stream',
      redundancyType = 'REDUNDANCY_EC_TYPE',
      contentLength,
      expectCheckSums,
    } = configParam;

    try {
      if (!isValidUrl(spInfo.endpoint)) {
        throw new Error('Invalid endpoint');
      }

      if (!isValidBucketName(bucketName)) {
        throw new Error('Error bucket name');
      }
      if (!isValidObjectName(objectName)) {
        throw new Error('Error object name');
      }
      if (!creator) {
        throw new Error('empty creator address');
      }

      const msg: ICreateObjectMsgType = {
        creator: creator,
        object_name: objectName,
        content_type: fileType,
        payload_size: contentLength.toString(),
        bucket_name: bucketName,
        visibility,
        primary_sp_approval: { expired_height: '0', sig: '' },
        expect_checksums: expectCheckSums,
        redundancy_type: redundancyType,
        expect_secondary_sp_addresses: spInfo.secondarySpAddresses,
      };
      const url = spInfo.endpoint + '/greenfield/admin/v1/get-approval?action=CreateObject';
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
      } else if (configParam.signType === 'offChainAuth') {
        const { seedString, domain } = configParam;
        const { code, body, statusCode } = await this.offChainAuthClient.sign(seedString);
        if (code !== 0) {
          throw {
            code: -1,
            message: 'Get create bucket approval error.',
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
          message: 'Get create object approval error.',
          statusCode: status,
          error: result,
        };
      }

      const signedMsgString = result.headers.get('X-Gnfd-Signed-Msg') || '';
      const signedMsg = decodeObjectFromHexString(signedMsgString) as ICreateObjectMsgType;

      return {
        code: 0,
        message: 'Get create object approval success.',
        body: signedMsg,
        statusCode: status,
      };
    } catch (error: any) {
      throw { code: -1, message: error.message, statusCode: NORMAL_ERROR_CODE };
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
          sig: signedMsg.primary_sp_approval.sig,
        },
      },
      MsgCreateObject.encode(msg).finish(),
    );
  }

  public async createObject(
    params: TCreateObject,
    approval?: ICreateObjectMsgType['primary_sp_approval'],
  ) {
    const primarySpApproval = approval
      ? getApproval(approval.expired_height, approval.sig)
      : getApproval(`${Number.MAX_VALUE}`, '');

    const {
      bucketName,
      creator,
      objectName,
      fileType,
      contentLength,
      expectCheckSums,
      visibility = 'VISIBILITY_TYPE_PUBLIC_READ',
      redundancyType = 'REDUNDANCY_EC_TYPE',
    } = params;

    const msg: MsgCreateObject = {
      bucketName,
      creator,
      objectName,
      contentType: fileType,
      payloadSize: Long.fromString(`${contentLength}`),
      visibility: visibilityTypeFromJSON(visibility),
      expectChecksums: expectCheckSums.map((e: string) => bytesFromBase64(e)),
      expectSecondarySpAddresses: params.spInfo.secondarySpAddresses,
      redundancyType: redundancyTypeFromJSON(redundancyType),
      primarySpApproval,
    };

    return await this.basic.tx(
      MsgCreateObjectTypeUrl,
      msg.creator,
      MsgCreateObjectSDKTypeEIP712,
      {
        ...MsgCreateObject.toSDK(msg),
        type: MsgCreateObjectTypeUrl,
        primary_sp_approval: approval,
        expect_checksums: params.expectCheckSums,
        payload_size: params.contentLength,
        redundancy_type: params.redundancyType,
        visibility: params.visibility,
      },
      MsgCreateObject.encode(msg).finish(),
    );
  }

  public async uploadObject(configParam: TPutObject): Promise<IObjectResultType<null>> {
    const { bucketName, objectName, txnHash, body, endpoint, duration = 30000 } = configParam;
    if (!isValidBucketName(bucketName)) {
      throw new Error('Error bucket name');
    }
    if (!isValidUrl(endpoint)) {
      throw new Error('Invalid endpoint');
    }
    if (!isValidObjectName(objectName)) {
      throw new Error('Error object name');
    }
    if (!txnHash) {
      throw new Error('Transaction hash is empty, please check.');
    }
    const url = generateUrlByBucketName(endpoint, bucketName) + '/' + objectName;

    let headerContent: TKeyValue = {
      'X-Gnfd-Txn-hash': txnHash,
    };
    if (!configParam.signType || configParam.signType === 'authTypeV2') {
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
          message: message || 'Get create object approval error.',
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
        return { code: -1, message: 'Put object error.', statusCode: status };
      }

      return { code: 0, message: 'Put object success.', statusCode: status };
    } catch (error: any) {
      return { code: -1, message: error.message, statusCode: NORMAL_ERROR_CODE };
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

  public async getObject(configParam: TGetObject) {
    try {
      const { bucketName, objectName, endpoint, duration = 30000 } = configParam;
      if (!isValidUrl(endpoint)) {
        throw new Error('Invalid endpoint');
      }
      if (!isValidBucketName(bucketName)) {
        throw new Error('Error bucket name');
      }
      if (!isValidObjectName(objectName)) {
        throw new Error('Error object name');
      }
      const url = generateUrlByBucketName(endpoint, bucketName) + '/' + objectName;

      let headerContent: TKeyValue = {};
      if (!configParam.signType || configParam.signType === 'authTypeV2') {
        const Authorization = getAuthorizationAuthTypeV2();
        headerContent = {
          ...headerContent,
          Authorization,
        };
      } else if (configParam.signType === 'offChainAuth') {
        const { seedString, address, domain } = configParam;
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
        return { code: -1, message: 'Get object error.', statusCode: status };
      }

      const fileBlob = await result.blob();
      return {
        code: 0,
        body: fileBlob,
        message: 'Get object success.',
        statusCode: status,
      };
    } catch (error: any) {
      return { code: -1, message: error.message, statusCode: NORMAL_ERROR_CODE };
    }
  }

  public async downloadFile(configParam: TGetObject): Promise<void> {
    try {
      const { objectName } = configParam;
      const getObjectResult = await this.getObject(configParam);

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
      let headerContent: TKeyValue = {};
      if (!configParam.signType || configParam.signType === 'authTypeV2') {
        const Authorization = getAuthorizationAuthTypeV2();
        headerContent = {
          ...headerContent,
          Authorization,
        };
      } else if (configParam.signType === 'offChainAuth') {
        const { seedString, address, domain } = configParam;
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
        return { code: -1, message: 'List object error.', statusCode: status };
      }
      const body = await result.json();
      return {
        code: 0,
        message: 'List object success.',
        statusCode: status,
        body,
      };
    } catch (error: any) {
      return { code: -1, message: error.message, statusCode: NORMAL_ERROR_CODE };
    }
  }

  public async createFolder(
    params: Omit<TCreateObject, 'contentLength' | 'fileType' | 'expectCheckSums'>,
    approval?: ICreateObjectMsgType['primary_sp_approval'],
  ) {
    if (!params.objectName.endsWith('/')) {
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

    return this.createObject(
      {
        bucketName: params.bucketName,
        objectName: params.objectName,
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
        creator: params.creator,
        spInfo: params.spInfo,
      },
      approval,
    );
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
