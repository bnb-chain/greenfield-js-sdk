import {
  getAuthorization,
  getCanonicalRequest,
  HTTPHeaderAppDomain,
  HTTPHeaderAuthorization,
  HTTPHeaderRegPubKey,
  HTTPHeaderUserAddress,
  newRequestHeadersByMeta,
} from '@/clients/spclient/auth';
import { parseError } from '@/clients/spclient/spApis/parseError';
import { SP_NOT_AVAILABLE_ERROR_CODE, SP_NOT_AVAILABLE_ERROR_MSG } from '@/constants/http';
import { AuthType, ReqMeta } from '@/types/auth';
import { fetchWithTimeout } from '@/utils/http';
import { injectable } from 'tsyringe';
import { getGetObjectMetaInfo } from './spApis/getObject';
import { getPutObjectMetaInfo } from './spApis/putObject';
import { ed25519 } from '@noble/curves/ed25519';
import { hexlify } from '@ethersproject/bytes';

export interface ISpClient {
  callApi(
    url: string,
    options: RequestInit,
    duration: number,
    customError?: {
      message: string;
      code: number;
    },
  ): Promise<Response>;

  signHeaders(reqMeta: Partial<ReqMeta>, authType: AuthType): Promise<Headers>;

  /**
   *
   * ```
   * const { PUT_OBJECT: getPutObjectMetaInfo } = client.spClient.getMetaInfo(endpoint, payload);
   * const {reqMeta, url} = await getPutObjectMetaInfo(endpoint, params);
   *
   * axios.put(...)
   * ```
   *
   */
  getMetaInfo(): {
    PUT_OBJECT: typeof getPutObjectMetaInfo;
    GET_OBJECT: typeof getGetObjectMetaInfo;
  };
}

@injectable()
export class SpClient implements ISpClient {
  public async callApi(
    url: string,
    options: RequestInit,
    timeout = 30000,
    customError?: {
      message: string;
      code: number;
    },
  ) {
    try {
      const controller = new AbortController();
      const _id = setTimeout(() => controller.abort(), timeout);
      const response = await fetchWithTimeout(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(_id);

      const { status } = response;

      if (status === SP_NOT_AVAILABLE_ERROR_CODE) {
        throw {
          code: SP_NOT_AVAILABLE_ERROR_CODE,
          message: SP_NOT_AVAILABLE_ERROR_MSG,
          statusCode: status,
        };
      }

      if (!response.ok) {
        const xmlError = await response.text();
        const { code, message } = await parseError(xmlError);

        throw {
          code: code || customError?.code,
          message: message || customError?.message,
          statusCode: status,
        };
      }

      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async signHeaders(reqMeta: Partial<ReqMeta>, authType: AuthType) {
    const metaHeaders: Headers = newRequestHeadersByMeta(reqMeta);

    if (authType.type === 'EDDSA') {
      const { domain, address, seed } = authType;
      const pubKey = hexlify(ed25519.getPublicKey(seed.slice(2)));

      metaHeaders.set(HTTPHeaderUserAddress, address);
      metaHeaders.set(HTTPHeaderAppDomain, domain);
      metaHeaders.set(HTTPHeaderRegPubKey, pubKey.slice(2));
    }

    const canonicalRequest = getCanonicalRequest(reqMeta, metaHeaders);
    const auth = getAuthorization(canonicalRequest, authType);
    metaHeaders.set(HTTPHeaderAuthorization, auth);

    return metaHeaders;
  }

  public getMetaInfo() {
    return {
      PUT_OBJECT: getPutObjectMetaInfo,
      GET_OBJECT: getGetObjectMetaInfo,
    };
  }
}
