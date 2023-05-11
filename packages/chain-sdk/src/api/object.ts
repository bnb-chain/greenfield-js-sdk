import { FileHandler } from '@bnb-chain/greenfiled-file-handle';
import {
  ICreateObjectMsgType,
  IGetCreateObjectApproval,
  IObjectResultType,
  IPutObjectPropsType,
  ISimulateGasFee,
  Long,
  decodeObjectFromHexString,
  encodeObjectToHexString,
  generateUrlByBucketName,
  isValidBucketName,
  isValidObjectName,
  isValidUrl,
} from '..';
import { Account } from './account';
import {
  METHOD_GET,
  METHOD_PUT,
  MOCK_SIGNATURE,
  NORMAL_ERROR_CODE,
  fetchWithTimeout,
} from '@/utils/http';
import { ITxOption } from './basic';
import {
  MsgCancelCreateObject,
  MsgCreateObject,
  MsgDeleteObject,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import {
  redundancyTypeFromJSON,
  visibilityTypeFromJSON,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import { bytesFromBase64 } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { MsgCreateObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/createObject';
import { MsgCancelCreateObjectSDKTypeEIP712 } from '@/messages/greenfield/storage/cancelCreateObject';
import { MsgDeleteObjectSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgDeleteObjectSDKTypeEIP712';

export interface IObject {
  getCreateObjectApproval(
    getApprovalParams: IGetCreateObjectApproval,
  ): Promise<IObjectResultType<string>>;

  createObject(
    getApprovalParams: IGetCreateObjectApproval,
    txOption: ITxOption,
  ): Promise<ISimulateGasFee | DeliverTxResponse>;

  uploadObject(configParam: IPutObjectPropsType): Promise<IObjectResultType<null>>;

  cancelCreateObject(
    msg: MsgCancelCreateObject,
    txOption: ITxOption,
  ): Promise<ISimulateGasFee | DeliverTxResponse>;

  deleteObject(
    msg: MsgDeleteObject,
    txOption: ITxOption,
  ): Promise<ISimulateGasFee | DeliverTxResponse>;
}

export class Object extends Account implements IObject {
  public async getCreateObjectApproval({
    bucketName,
    creator,
    objectName,
    visibility = 'VISIBILITY_TYPE_PUBLIC_READ',
    spInfo,
    duration = 3000,
    file,
    redundancyType = 'REDUNDANCY_EC_TYPE',
  }: IGetCreateObjectApproval) {
    try {
      if (!isValidUrl(spInfo.endpoint)) {
        throw new Error('Invalid endpoint');
      }

      if (!file) {
        throw new Error('File is needed');
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
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const hashResult = await FileHandler.getPieceHashRoots(bytes);
      const { contentLength, expectCheckSums } = hashResult;
      const finalContentType =
        file && file.type && file.type.length > 0 ? file.type : 'application/octet-stream';
      const msg: ICreateObjectMsgType = {
        creator: creator,
        object_name: objectName,
        content_type: finalContentType,
        payload_size: contentLength.toString(),
        bucket_name: bucketName,
        visibility,
        primary_sp_approval: { expired_height: '0', sig: '' },
        expect_checksums: expectCheckSums,
        redundancy_type: redundancyType,
        expect_secondary_sp_addresses: spInfo.secondarySpAddresses,
      };
      const signature = MOCK_SIGNATURE;
      const url = spInfo.endpoint + '/greenfield/admin/v1/get-approval?action=CreateObject';
      const unSignedMessageInHex = encodeObjectToHexString(msg);
      const headers = new Headers({
        // todo place the correct authorization string
        Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${signature}`,
        'X-Gnfd-Unsigned-Msg': unSignedMessageInHex,
      });
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

  public async createObject(getApprovalParams: IGetCreateObjectApproval, txOption: ITxOption) {
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

    const typeUrl = '/bnbchain.greenfield.storage.MsgCreateObject';
    const msgBytes = MsgCreateObject.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.creator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgCreateObjectSDKTypeEIP712,
      {
        ...signedMsg,
        type: typeUrl,
        visibility: signedMsg.visibility,
        primary_sp_approval: {
          expired_height: signedMsg.primary_sp_approval.expired_height,
          sig: signedMsg.primary_sp_approval.sig,
        },
        redundancy_type: signedMsg.redundancy_type,
        payload_size: signedMsg.payload_size,
      },
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
  }

  public async uploadObject(configParam: IPutObjectPropsType): Promise<IObjectResultType<null>> {
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
    // todo generate real signature
    const signature = MOCK_SIGNATURE;
    const headers = new Headers({
      // todo place the correct authorization string
      Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${signature}`,
      'X-Gnfd-Txn-hash': txnHash,
    });

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

  public async cancelCreateObject(msg: MsgCancelCreateObject, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgCancelCreateObject';
    const msgBytes = MsgCancelCreateObject.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.operator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgCancelCreateObjectSDKTypeEIP712,
      MsgCancelCreateObject.toSDK(msg),
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
  }

  public async deleteObject(msg: MsgDeleteObject, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgDeleteObject';
    const msgBytes = MsgDeleteObject.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.operator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgDeleteObjectSDKTypeEIP712,
      MsgDeleteObject.toSDK(msg),
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
  }
}
