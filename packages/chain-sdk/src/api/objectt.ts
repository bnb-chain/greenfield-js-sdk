import {
  MsgCancelCreateObjectSDKTypeEIP712,
  MsgCancelCreateObjectTypeUrl,
} from '@/messages/greenfield/storage/MsgCancelCreateObject';
import {
  MsgCreateObjectSDKTypeEIP712,
  MsgCreateObjectTypeUrl,
} from '@/messages/greenfield/storage/MsgCreateObject';
import {
  MsgDeleteObjectSDKTypeEIP712,
  MsgDeleteObjectTypeUrl,
} from '@/messages/greenfield/storage/MsgDeleteObject';
import {
  MsgUpdateObjectInfoSDKTypeEIP712,
  MsgUpdateObjectInfoTypeUrl,
} from '@/messages/greenfield/storage/MsgUpdateObjectInfo';
import { fetchWithTimeout, METHOD_GET, METHOD_PUT, NORMAL_ERROR_CODE } from '@/utils/http';
import {
  redundancyTypeFromJSON,
  visibilityTypeFromJSON,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import { QueryHeadObjectResponse } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';
import {
  MsgCancelCreateObject,
  MsgCreateObject,
  MsgDeleteObject,
  MsgUpdateObjectInfo,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { bytesFromBase64 } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { container, singleton } from 'tsyringe';
import {
  ICreateObjectMsgType,
  IObjectProps,
  IObjectResultType,
  TPutObject,
  Long,
  TGetCreateObject,
  TKeyValue,
  TxResponse,
  TGetObject,
  TListObjects,
  TDownloadFile,
} from '../types';
import { decodeObjectFromHexString, encodeObjectToHexString } from '../utils/encoding';
import {
  generateUrlByBucketName,
  isValidBucketName,
  isValidObjectName,
  isValidUrl,
} from '../utils/s3';
import { Basic } from './basic';
import { RpcQueryClient } from './queryclient';
import { getAuthorizationAuthTypeV2 } from '@/utils/auth';
import { OffChainAuth } from './offchainauth';

export interface IObject {
  getCreateObjectApproval(getApprovalParams: TGetCreateObject): Promise<IObjectResultType<string>>;

  createObject(getApprovalParams: TGetCreateObject): Promise<TxResponse>;

  uploadObject(configParam: TPutObject): Promise<IObjectResultType<null>>;

  cancelCreateObject(msg: MsgCancelCreateObject): Promise<TxResponse>;

  updateObjectInfo(msg: MsgUpdateObjectInfo): Promise<TxResponse>;

  deleteObject(msg: MsgDeleteObject): Promise<TxResponse>;

  headObject(bucketName: string, objectName: string): Promise<QueryHeadObjectResponse>;

  headObjectById(objectId: string): Promise<QueryHeadObjectResponse>;

  getObject(configParam: TGetObject): Promise<IObjectResultType<Blob>>;

  downloadFile(configParam: TGetObject): Promise<void>;

  listObjects(configParam: TListObjects): Promise<IObjectResultType<Array<IObjectProps>>>;

  createFolder(getApprovalParams: TGetCreateObject): Promise<TxResponse>;

  // TODO: PutObjectPolicy
  // TODO: DeleteObjectPolicy
  // TODO: IsObjectPermissionAllowed
  // TODO: GetObjectUploadProgress
  // TODO: getObjectStatusFromSP
}

@singleton()
export class Objectt implements IObject {
  private basic: Basic = container.resolve(Basic);
  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);
  private offChainAuthClient = container.resolve(OffChainAuth);

  public async getCreateObjectApproval(configParam: TGetCreateObject) {
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
      if (configParam.signType === 'authTypeV2') {
        const Authorization = getAuthorizationAuthTypeV2();
        headerContent = {
          ...headerContent,
          Authorization,
        };
      }
      if (configParam.signType === 'offChainAuth') {
        const { seedString, domain } = configParam;
        const { code, body, statusCode } = await this.offChainAuthClient.sign(seedString);
        if (code !== 0) {
          return {
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
        return {
          code: -1,
          message: 'Get create object approval error.',
          statusCode: status,
        };
      }
      const resultContentType = result.headers.get('Content-Type');
      // Will receive xml when get object met error
      if (resultContentType === 'text/xml' || resultContentType === 'application/xml') {
        const xmlText = await result.text();
        const xml = await new window.DOMParser().parseFromString(xmlText, 'text/xml');
        return {
          code: -1,
          xml,
          message: 'Get create object approval error.',
          statusCode: status,
        };
      }

      const signedMsgString = result.headers.get('X-Gnfd-Signed-Msg') || '';
      const signedMsg = decodeObjectFromHexString(signedMsgString) as ICreateObjectMsgType;

      return {
        code: 0,
        message: 'Get create object approval success.',
        body: result.headers.get('X-Gnfd-Signed-Msg') ?? '',
        statusCode: status,
        signedMsg,
      };
    } catch (error: any) {
      return { code: -1, message: error.message, statusCode: NORMAL_ERROR_CODE };
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
        visibility: signedMsg.visibility,
        primary_sp_approval: {
          expired_height: signedMsg.primary_sp_approval.expired_height,
          sig: signedMsg.primary_sp_approval.sig,
        },
        redundancy_type: signedMsg.redundancy_type,
        payload_size: signedMsg.payload_size,
      },
      MsgCreateObject.encode(msg).finish(),
    );
  }

  public async createObject(getApprovalParams: TGetCreateObject) {
    const { signedMsg } = await this.getCreateObjectApproval(getApprovalParams);
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
      expectSecondarySpAddresses: signedMsg.expect_secondary_sp_addresses,
      redundancyType:
        signedMsg.redundancy_type === undefined
          ? redundancyTypeFromJSON(0)
          : redundancyTypeFromJSON(signedMsg.redundancy_type),
      primarySpApproval: {
        expiredHeight: Long.fromString(signedMsg.primary_sp_approval.expired_height),
        sig: bytesFromBase64(signedMsg.primary_sp_approval.sig),
      },
    };

    return await this.createObjectTx(msg, signedMsg);
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
    if (configParam.signType === 'authTypeV2') {
      const Authorization = getAuthorizationAuthTypeV2();
      headerContent = {
        ...headerContent,
        Authorization,
      };
    }
    if (configParam.signType === 'offChainAuth') {
      const { seedString, address, domain } = configParam;
      const { code, body, statusCode } = await this.offChainAuthClient.sign(seedString);
      if (code !== 0) {
        return {
          code: -1,
          message: 'Get create bucket approval error.',
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
      const resultContentType = result.headers.get('Content-Type');
      // Will receive xml when put object met error
      if (resultContentType === 'text/xml' || resultContentType === 'application/xml') {
        const xmlText = await result.text();
        const xml = await new window.DOMParser().parseFromString(xmlText, 'text/xml');
        return { code: -1, message: 'Put object error.', xml, statusCode: status };
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
      if (configParam.signType === 'authTypeV2') {
        const Authorization = getAuthorizationAuthTypeV2();
        headerContent = {
          ...headerContent,
          Authorization,
        };
      }
      if (configParam.signType === 'offChainAuth') {
        const { seedString, address, domain } = configParam;
        const { code, body, statusCode } = await this.offChainAuthClient.sign(seedString);
        if (code !== 0) {
          return {
            code: -1,
            message: 'Get create bucket approval error.',
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
      const resultContentType = result.headers.get('Content-Type');
      // Will receive xml when get object met error
      if (resultContentType === 'text/xml' || resultContentType === 'application/xml') {
        const xmlText = await result.text();
        const xml = await new window.DOMParser().parseFromString(xmlText, 'text/xml');
        return {
          code: -1,
          xml,
          message: 'Get object error.',
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
      const { bucketName, endpoint, duration = 30000 } = configParam;
      if (!isValidBucketName(bucketName)) {
        throw new Error('Error bucket name');
      }
      if (!isValidUrl(endpoint)) {
        throw new Error('Invalid endpoint');
      }
      const url = generateUrlByBucketName(endpoint, bucketName);

      let headerContent: TKeyValue = {};
      if (configParam.signType === 'authTypeV2') {
        const Authorization = getAuthorizationAuthTypeV2();
        headerContent = {
          ...headerContent,
          Authorization,
        };
      }
      if (configParam.signType === 'offChainAuth') {
        const { seedString, address, domain } = configParam;
        const { code, body, statusCode } = await this.offChainAuthClient.sign(seedString);
        if (code !== 0) {
          return {
            code: -1,
            message: 'Get create bucket approval error.',
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
      const { objects } = await result.json();
      return {
        code: 0,
        message: 'List object success.',
        statusCode: status,
        body: objects,
      };
    } catch (error: any) {
      return { code: -1, message: error.message, statusCode: NORMAL_ERROR_CODE };
    }
  }

  public async createFolder(getApprovalParams: TGetCreateObject) {
    if (!getApprovalParams.objectName.endsWith('/')) {
      throw new Error(
        'failed to create folder. Folder names must end with a forward slash (/) character',
      );
    }

    return this.createObject(getApprovalParams);
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
