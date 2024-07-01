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
import { OnProgress } from '@/types';
import { AuthType, ReqMeta } from '@/types/auth';
import { fetchWithTimeout } from '@/utils/http';
import { hexlify } from '@ethersproject/bytes';
import { ed25519 } from '@noble/curves/ed25519';
import superagent from 'superagent';
import { injectable } from 'tsyringe';
import { getGetObjectMetaInfo } from './spApis/getObject';
import { getPutObjectMetaInfo } from './spApis/putObject';
import { assertFileType, assertHttpMethod } from '@/utils';
import { UploadFile } from '@/types/sp/Common';
import { isNode } from 'browser-or-node';

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
      const response = await fetchWithTimeout(
        url,
        {
          ...options,
          signal: controller.signal,
        },
        timeout,
      );
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

  public async callApiV2(
    url: string,
    options: RequestInit,
    timeout = 30000,
    customError?: {
      message: string;
      code: number;
    },
  ) {
    assertHttpMethod(options.method);

    try {
      const R = new superagent.Request(options.method, url);
      if (options.headers) {
        (options.headers as Headers).forEach((v: string, k: string) => {
          R.set(k, v);
        });
      }
      R.timeout(timeout);
      R.ok((res) => res.status < 500);

      const response = await R.send();
      const { status } = response;

      if (status === SP_NOT_AVAILABLE_ERROR_CODE) {
        throw {
          code: SP_NOT_AVAILABLE_ERROR_CODE,
          message: SP_NOT_AVAILABLE_ERROR_MSG,
          statusCode: status,
        };
      }

      if (!response.ok) {
        const xmlError = response.text;
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

  /**
   * just use for uploading object:
   * because fetch can't support upload progress
   */
  public async upload(
    url: string,
    options: RequestInit,
    timeout: number,
    uploadFile: UploadFile,
    callback?: {
      onProgress?: OnProgress;
      customError?: {
        message: string;
        code: number;
      };
    },
  ) {
    const R = superagent.put(url);
    R.timeout(timeout);
    R.ok((res) => res.status < 500);

    if (options.headers) {
      (options.headers as Headers).forEach((v: string, k: string) => {
        R.set(k, v);
      });
    }

    if (callback && callback.onProgress) {
      R.on('progress', (e) => {
        callback.onProgress?.(e);
      });
    }

    const file = assertFileType(uploadFile) ? uploadFile.content : uploadFile;

    // https://ladjs.github.io/superagent/docs/index.html#serializing-request-body
    const sendFile =
      isNode && R.get('Content-Type') === 'application/json' ? file.toString() : file;
    if (isNode) {
      R.buffer(true);
    }

    try {
      const response = await R.send(sendFile);
      const { status } = response;

      if (status === SP_NOT_AVAILABLE_ERROR_CODE) {
        throw {
          code: SP_NOT_AVAILABLE_ERROR_CODE,
          message: SP_NOT_AVAILABLE_ERROR_MSG,
          statusCode: status,
        };
      }

      if (!response.ok) {
        const xmlError = response.text;

        const { code, message } = await parseError(xmlError);

        throw {
          code: callback?.customError?.code || code,
          message: callback?.customError?.message || message,
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
