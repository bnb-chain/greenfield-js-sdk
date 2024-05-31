import { EMPTY_STRING_SHA256, METHOD_PUT } from '@/constants';
import { ReqMeta, VisibilityType } from '@/types';
import { UploadFile } from '@/types/sp/Common';
import { generateUrlByBucketName } from '@/utils/asserts/s3';
import { encodePath, getSortQueryParams } from '../auth';

// https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/storage-provider-rest-api/put_object.md
export const getPutObjectMetaInfo = async (
  endpoint: string,
  params: {
    objectName: string;
    bucketName: string;
    contentType: string;
    body: UploadFile;
    txnHash?: string;
    delegatedOpts?: {
      visibility: VisibilityType;
      isUpdate?: boolean;
    };
  },
) => {
  const { bucketName, objectName, txnHash, contentType, body, delegatedOpts } = params;
  const path = `/${encodePath(objectName)}`;
  let queryMap = {};

  if (delegatedOpts) {
    queryMap = {
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
  };

  return {
    url: url.href,
    optionsWithOutHeaders,
    reqMeta,
    file: body,
  };
};
