import {
  getAuthorization,
  HTTPHeaderAuthorization,
  newRequestHeadersByMeta,
} from '@/clients/spclient/auth';
import { parseError } from '@/clients/spclient/spApis/parseError';
import { ReqMeta } from '@/types/auth';
import { Headers } from 'cross-fetch';
import { singleton } from 'tsyringe';

/**
 * V1
 */
export type ECDSA = {
  type: 'ECDSA';
  privateKey: string;
};
/**
 * OffChainAuth
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
}

@singleton()
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
      metaHeaders.append('X-Gnfd-User-Address', address);
      metaHeaders.append('X-Gnfd-App-Domain', domain);
    }

    const auth = await getAuthorization(reqMeta, metaHeaders, authType);
    metaHeaders.set(HTTPHeaderAuthorization, auth);

    return metaHeaders;
  }
}
