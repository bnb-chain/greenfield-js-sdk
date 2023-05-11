import {
  BucketProps,
  GetObjectPropsType,
  ICreateBucketMsgType,
  IGetCreateBucketApproval,
  IObjectResultType,
  IQuotaProps,
  getUserBucketsPropsType,
} from '@/types/storage';
import { decodeObjectFromHexString, encodeObjectToHexString } from '@/utils/encoding';
import { METHOD_GET, MOCK_SIGNATURE, NORMAL_ERROR_CODE, fetchWithTimeout } from '@/utils/http';
import { generateUrlByBucketName, isValidAddress, isValidBucketName, isValidUrl } from '@/utils/s3';
import { ISimulateGasFee } from '@/utils/units';
import { MsgCreateBucketSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgCreateBucketSDKTypeEIP712';
import { ActionType } from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';
import { visibilityTypeFromJSON } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import {
  QueryClientImpl as BucketQueryClientImpl,
  QueryHeadBucketResponse,
  QueryVerifyPermissionResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';
import {
  MsgCreateBucket,
  MsgDeleteBucket,
  MsgDeletePolicy,
  MsgPutPolicy,
  MsgUpdateBucketInfo,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { MsgDeleteBucketSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgDeleteBucketSDKTypeEIP712';
import { bytesFromBase64 } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { DeliverTxResponse } from '@cosmjs/stargate';
import Long from 'long';
import { MsgUpdateBucketInfoSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgUpdateBucketInfoSDKTypeEIP712';
import { MsgPutPolicySDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgPutPolicySDKTypeEIP712';
import { Account } from './account';
import { ITxOption } from './basic';
import { MsgDeletePolicySDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgDeletePolicySDKTypeEIP712';

export interface IBucket {
  /**
   * returns the signature info for the approval of preCreating resources
   */
  getCreateBucketApproval(params: IGetCreateBucketApproval): Promise<IObjectResultType<string>>;

  /**
   * get approval of creating bucket and send createBucket txn to greenfield chain
   */
  createBucket(
    params: IGetCreateBucketApproval,
    txOption: ITxOption,
  ): Promise<ISimulateGasFee | DeliverTxResponse>;

  /**
   * query the bucketInfo on chain, return the bucket info if exists
   */
  headBucket(bucketName: string): Promise<QueryHeadBucketResponse>;

  /**
   * query the bucketInfo on chain by bucketId, return the bucket info if exists
   */
  headBucketById(bucketId: string): Promise<QueryHeadBucketResponse>;

  /**
   * check if the permission of bucket is allowed to the user.
   */
  getVerifyPermission(
    bucketName: string,
    operator: string,
    actionType: ActionType,
  ): Promise<QueryVerifyPermissionResponse>;

  getUserBuckets(
    configParam: getUserBucketsPropsType,
  ): Promise<IObjectResultType<Array<BucketProps>>>;

  /**
   * return quota info of bucket of current month, include chain quota, free quota and consumed quota
   */
  getBucketReadQuota(configParam: GetObjectPropsType): Promise<IObjectResultType<IQuotaProps>>;

  deleteBucket(
    msg: MsgDeleteBucket,
    txOption: ITxOption,
  ): Promise<ISimulateGasFee | DeliverTxResponse>;

  updateBucketInfo(
    msg: MsgUpdateBucketInfo,
    txOption: ITxOption,
  ): Promise<ISimulateGasFee | DeliverTxResponse>;

  putBucketPolicy(
    msg: MsgPutPolicy,
    txOption: ITxOption,
  ): Promise<ISimulateGasFee | DeliverTxResponse>;

  deleteBucketPolicy(
    msg: MsgDeletePolicy,
    txOption: ITxOption,
  ): Promise<ISimulateGasFee | DeliverTxResponse>;
}

export class Bucket extends Account implements IBucket {
  // private sp: ISp = new Sp(this.rpcUrl, this.chainId);
  /* private async getRandomSpInfo(): Promise<ISpInfo> {
    const spList = await this.sp.getStorageProviders();
    if (!spList || spList.length === 0) {
      return {} as ISpInfo;
    }

    const randomIndex = Math.floor(Math.random() * spList.length);
    const selectSp = spList[randomIndex];
    const secondarySpAddresses = spList
      .filter((_, index) => index !== randomIndex)
      .map((sp) => sp.operatorAddress);
    const { endpoint, operatorAddress, sealAddress } = selectSp;

    return {
      endpoint,
      primarySpAddress: operatorAddress,
      sealAddress,
      secondarySpAddresses,
    };
  } */

  public async getCreateBucketApproval({
    bucketName,
    creator,
    visibility = 'VISIBILITY_TYPE_PUBLIC_READ',
    chargedReadQuota,
    spInfo,
    duration,
  }: IGetCreateBucketApproval) {
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
      const headers = new Headers({
        // TODO: replace when offchain release
        Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${MOCK_SIGNATURE}`,
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
          message: 'Get create bucket approval error.',
          statusCode: status,
        };
      }

      const resultContentType = result.headers.get('Content-Type');
      if (resultContentType === 'text/xml' || resultContentType === 'application/xml') {
        const xmlText = await result.text();
        const xml = await new window.DOMParser().parseFromString(xmlText, 'text/xml');
        return {
          code: -1,
          xml,
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
      return { code: -1, message: error.message, statusCode: NORMAL_ERROR_CODE };
    }
  }

  public async createBucket(params: IGetCreateBucketApproval, txOption: ITxOption) {
    const { signedMsg } = await this.getCreateBucketApproval(params);
    if (!signedMsg) {
      throw new Error('Get create bucket approval error');
    }

    const sig = signedMsg.primary_sp_approval.sig;
    const expiredHeight = signedMsg.primary_sp_approval.expired_height;

    const msg: MsgCreateBucket = {
      bucketName: signedMsg.bucket_name,
      creator: signedMsg.creator,
      visibility: visibilityTypeFromJSON(signedMsg.visibility),
      primarySpAddress: signedMsg.primary_sp_address,
      primarySpApproval: {
        expiredHeight: Long.fromString(expiredHeight),
        sig: bytesFromBase64(sig),
      },
      chargedReadQuota: signedMsg.charged_read_quota
        ? Long.fromString('0')
        : Long.fromString(signedMsg.charged_read_quota),
      paymentAddress: '',
    };

    const typeUrl = '/bnbchain.greenfield.storage.MsgCreateBucket';
    const msgBytes = MsgCreateBucket.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.creator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgCreateBucketSDKTypeEIP712,
      {
        ...signedMsg,
        type: typeUrl,
        charged_read_quota: signedMsg.charged_read_quota,
        visibility: signedMsg.visibility,
        primary_sp_approval: {
          expired_height: expiredHeight,
          sig,
        },
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

  public async deleteBucket(msg: MsgDeleteBucket, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgDeleteBucket';
    const msgBytes = MsgDeleteBucket.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.operator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgDeleteBucketSDKTypeEIP712,
      MsgDeleteBucket.toSDK(msg),
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

  public async headBucket(bucketName: string) {
    const rpcClient = await this.getRpcClient();
    const rpc = new BucketQueryClientImpl(rpcClient);
    return await rpc.HeadBucket({
      bucketName,
    });
  }

  public async headBucketById(bucketId: string) {
    const rpcClient = await this.getRpcClient();
    const rpc = new BucketQueryClientImpl(rpcClient);
    return await rpc.HeadBucketById({
      bucketId,
    });
  }

  public async getVerifyPermission(bucketName: string, operator: string, actionType: ActionType) {
    const rpcClient = await this.getRpcClient();
    const rpc = new BucketQueryClientImpl(rpcClient);
    return rpc.VerifyPermission({
      bucketName,
      operator,
      objectName: '',
      actionType,
    });
  }

  public async getUserBuckets(configParam: getUserBucketsPropsType) {
    try {
      const { address, duration = 30000, endpoint } = configParam;
      if (!isValidAddress(address)) {
        throw new Error('Error address');
      }
      if (!isValidUrl(endpoint)) {
        throw new Error('Invalid endpoint');
      }
      const url = endpoint;
      const signature = MOCK_SIGNATURE;
      const headers = new Headers({
        // todo place the correct authorization string
        Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${signature}`,
        'X-Gnfd-User-Address': address,
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
    configParam: GetObjectPropsType,
  ): Promise<IObjectResultType<IQuotaProps>> {
    try {
      const { bucketName, endpoint, duration = 30000, year, month } = configParam;
      // todo generate real signature
      const signature = MOCK_SIGNATURE;
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
      const headers = new Headers({
        Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${signature}`,
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

  public async updateBucketInfo(msg: MsgUpdateBucketInfo, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgUpdateBucketInfo';
    const msgBytes = MsgUpdateBucketInfo.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.operator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgUpdateBucketInfoSDKTypeEIP712,
      MsgUpdateBucketInfo.toSDK(msg),
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

  public async putBucketPolicy(msg: MsgPutPolicy, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgPutPolicy';
    const msgBytes = MsgPutPolicy.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.operator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgPutPolicySDKTypeEIP712,
      MsgPutPolicy.toSDK(msg),
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

  public async deleteBucketPolicy(msg: MsgDeletePolicy, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgDeletePolicy';
    const msgBytes = MsgDeletePolicy.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.operator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgDeletePolicySDKTypeEIP712,
      MsgDeletePolicy.toSDK(msg),
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
