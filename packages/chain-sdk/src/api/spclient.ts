import { delayMs, parseErrorXML } from '@/utils/http';
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
};
export type AuthType = ECDSA | EDDSA;

@singleton()
export class SpClient {
  public async callApi(
    url: string,
    options: RequestInit,
    duration = 30000,
    customError?: {
      message: string;
      code: number;
    },
  ) {
    try {
      const response = (await Promise.race([delayMs(duration), fetch(url, options)])) as Response;
      const { status } = response;

      if (!response.ok) {
        const { code, message } = await parseErrorXML(response);
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

  /* public makeAuthHeader(type: AuthType, meta: Partial<ReqMeta>) {
    // TODO
    const auth = 'some operates';
    // if (type === 'AuthV1') {
    //   return auth
    // }

    // if (type === 'OffChainAuth') {
    //   // 1. Add two headers
    //   // 2. offchain.sign
    // }

    return auth;
  } */
}
