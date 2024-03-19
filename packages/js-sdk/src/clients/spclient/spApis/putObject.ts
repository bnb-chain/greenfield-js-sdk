import { EMPTY_STRING_SHA256, METHOD_PUT } from '@/constants';
import { ReqMeta, VisibilityType } from '@/types';
import { generateUrlByBucketName } from '@/utils/asserts/s3';
import { encodePath, getSortQueryParams } from '../auth';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/put_object
export const getPutObjectMetaInfo = async (
  endpoint: string,
  params: {
    objectName: string;
    bucketName: string;
    contentType: string;
    body: File;
    delegated?: boolean;
    txnHash?: string;
    visibility?: VisibilityType;
  },
) => {
  const {
    bucketName,
    objectName,
    txnHash,
    contentType,
    body,
    delegated = false,
    visibility = VisibilityType.VISIBILITY_TYPE_PRIVATE,
  } = params;
  const path = `/${encodePath(objectName)}`;
  let queryMap = {};

  if (delegated) {
    queryMap = {
      delegate: '',
      is_update: 'false',
      payload_size: String(body.size),
      visibility: visibility,
    };
  }

  let url = new URL(path, generateUrlByBucketName(endpoint, bucketName));
  url = getSortQueryParams(url, queryMap);

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    txnHash: txnHash,
    method: METHOD_PUT,
    url: {
      hostname: url.hostname,
      query: url.searchParams.toString(),
      path,
    },
    contentType,
  };

  const optionsWithOutHeaders: Omit<RequestInit, 'headers'> = {
    method: METHOD_PUT,
    body,
  };

  return {
    url: url.href,
    optionsWithOutHeaders,
    reqMeta,
  };
};
