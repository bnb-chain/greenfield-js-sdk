import { Account } from './account';
import { ISp, Sp } from './sp';

interface objectResultType<T> {
  code: number;
  xml?: Document;
  message?: string;
  statusCode?: number;
  body?: T;
}

export interface IBucket {
  /**
   * returns the signature info for the approval of preCreating resources
   */
  // getCreateBucketApproval(
  //   creator: string,
  //   bucketName: string,
  //   visi: keyof typeof VisibilityType,
  //   duration?: number,
  // ): Promise<objectResultType<string>>;
  getCreateBucketApproval(): Promise<void>;
}

export class Bucket extends Account implements IBucket {
  private sp: ISp = new Sp(this.rpcUrl, this.chainId);

  // private async getEndpoint(): Promise<string> {
  //   const spList = await this.sp.getStorageProviders();

  //   console.log('x', x);

  //   return '';
  // }

  public async getCreateBucketApproval() {
    // const endpoint = await this.getEndpoint();
    // console.log(endpoint);
  }

  /* public async getCreateBucketApproval(
    creator: string,
    bucketName: string,
    visibility: keyof typeof VisibilityType,
    duration = 3000,
  ) {
    try {
      if (!msg.primarySpAddress) {
        throw new Error('Primary sp address is missing');
      }
      if (!isValidBucketName(msg.bucketName)) {
        throw new Error('Error bucket name');
      }
      if (!msg.creator) {
        throw new Error('Empty creator address');
      }

      const endpoint = await this.getEndpoint();
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
      return {
        code: 0,
        message: 'Get create bucket approval success.',
        body: result.headers.get('X-Gnfd-Signed-Msg') ?? '',
        statusCode: status,
      };
    } catch (error: any) {
      return { code: -1, message: error.message, statusCode: NORMAL_ERROR_CODE };
    }
  } */
}
