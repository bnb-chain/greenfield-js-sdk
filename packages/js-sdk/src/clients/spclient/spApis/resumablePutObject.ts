import { EMPTY_STRING_SHA256, METHOD_POST } from '@/constants';
import { ReqMeta } from '@/types';
import { DelegatedOpts } from '@/types/sp/Common';
import { generateUrlByBucketName } from '@/utils/asserts/s3';
import { encodePath, getSortQueryParams } from '../auth';

// https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/storage-provider-rest-api/resumable_put_object.md
export const getResumablePutObjectMetaInfo = async (
  endpoint: string,
  params: {
    objectName: string;
    bucketName: string;
    contentType: string;
    body: File;
    offset: number;
    complete: boolean;
    delegatedOpts?: DelegatedOpts;
  },
) => {
  const { bucketName, objectName, contentType, body, offset, complete, delegatedOpts } = params;
  const path = `/${encodePath(objectName)}`;
  let queryMap: Record<string, string> = {
    offset: String(offset),
    complete: String(complete),
  };

  if (delegatedOpts) {
    queryMap = {
      ...queryMap,
      delegate: '',
      payload_size: String(body.size),
      visibility: delegatedOpts.visibility.toString(),
      is_update: String(delegatedOpts.isUpdate || false),
    };
  }

  let url = new URL(path, generateUrlByBucketName(endpoint, bucketName));
  url = getSortQueryParams(url, queryMap);

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    // txnHash: txnHash,
    method: METHOD_POST,
    url: {
      hostname: url.hostname,
      query: url.searchParams.toString(),
      path,
    },
    contentType,
  };

  const optionsWithOutHeaders: Omit<RequestInit, 'headers'> = {
    method: METHOD_POST,
    body,
  };

  return {
    url: url.href,
    optionsWithOutHeaders,
    reqMeta,
  };
};
