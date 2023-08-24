import { EMPTY_STRING_SHA256 } from '@/constants/http';
import { parseError } from '@/parseXML/parseError';
import { ReqMeta } from '@/types/auth';
import { getAuthorization, newRequestHeadersByMeta } from '@/utils/auth';
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

  makeHeaders(reqMeta: Partial<ReqMeta>, authType: AuthType): Promise<Headers>;
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
        const { code, message } = parseError(xmlError);
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
    // 1. make headers (makeAuth)
    // 2. fetchWithTimeout
    // 3. parse XML response
    // 4. return response
  }

  public async makeHeaders(reqMeta: Partial<ReqMeta>, authType: AuthType) {
    const metaHeaders: Headers = newRequestHeadersByMeta(reqMeta);

    let headerObj: Record<string, any> = {
      'X-Gnfd-Txn-hash': metaHeaders.get('X-Gnfd-Txn-hash'),
      'X-Gnfd-Content-Sha256': EMPTY_STRING_SHA256,
      'X-Gnfd-Date': metaHeaders.get('X-Gnfd-Date'),
      'X-Gnfd-Expiry-Timestamp': metaHeaders.get('X-Gnfd-Expiry-Timestamp'),
      'Content-Type': metaHeaders.get('Content-Type'),
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

    return new Headers(headerObj);
  }
}
