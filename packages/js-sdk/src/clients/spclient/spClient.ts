import {
  getAuthorization,
  HTTPHeaderAppDomain,
  HTTPHeaderAuthorization,
  HTTPHeaderUserAddress,
  newRequestHeadersByMeta,
} from '@/clients/spclient/auth';
import { parseError } from '@/clients/spclient/spApis/parseError';
import { ReqMeta } from '@/types/auth';
import { injectable } from 'tsyringe';
import { getGetObjectMetaInfo } from './spApis/getObject';
import { getPutObjectMetaInfo } from './spApis/putObject';

/**
 * ECDSA Signature
 */
export type ECDSA = {
  type: 'ECDSA';
  privateKey: string;
};
/**
 * EDDSA Signature
 */
export type EDDSA = {
  type: 'EDDSA';
  seed: string;
  domain: string;
  address: string;
};
export type AuthType = ECDSA | EDDSA;

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
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(_id);

      const { status } = response;

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
      const { domain, address } = authType;
      metaHeaders.set(HTTPHeaderUserAddress, address);
      metaHeaders.set(HTTPHeaderAppDomain, domain);
    }

    const auth = await getAuthorization(reqMeta, metaHeaders, authType);
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
