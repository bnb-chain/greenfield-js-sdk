import { MOCK_SIGNATURE } from '@/utils/http';
import { container, singleton } from 'tsyringe';
import { Bucket } from './bucket';
import { Sp } from './sp';
import { StorageProvider } from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/types';

export interface IHttpClient {
  approval(
    endpoint: string,
    path: string,
    params: { unSignedMsg: string; signature?: string },
    timeout: number,
  ): Promise<Response>;

  getSPUrlByBucket(bucketName: string): Promise<StorageProvider | undefined>;
}

@singleton()
export class HttpClient implements IHttpClient {
  private bucket: Bucket = container.resolve(Bucket);
  private sp: Sp = container.resolve(Sp);

  public async approval(
    endpoint: string,
    path: string,
    params: { unSignedMsg: string; signature?: string },
    timeout = 30000,
  ) {
    const url = endpoint + path;
    const { unSignedMsg, signature = MOCK_SIGNATURE } = params;

    const headers = new Headers({
      // todo place the correct authorization string
      Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${signature}`,
      'X-Gnfd-Unsigned-Msg': unSignedMsg,
    });

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = fetch(url, {
        headers,
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(id);
      return response;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async getSPUrlByBucket(bucketName: string /* spInfo: ISpInfo */) {
    const { bucketInfo } = await this.bucket.headBucket(bucketName);

    if (!bucketInfo) throw new Error('Bucket not found');
    const { primarySpAddress } = bucketInfo;

    const sps = await this.sp.getStorageProviders();

    return sps.find((sp) => sp.operatorAddress === primarySpAddress);
  }
}
