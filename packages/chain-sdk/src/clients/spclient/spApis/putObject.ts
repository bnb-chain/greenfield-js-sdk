import { EMPTY_STRING_SHA256, METHOD_PUT } from '@/constants';
import { ReqMeta } from '@/types';
import { generateUrlByBucketName } from '@/utils/s3';
import { encodePath } from '../auth';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/put_object
export const getPutObjectMetaInfo = async (
  endpoint: string,
  params: {
    objectName: string;
    bucketName: string;
    txnHash: string;
    contentType: string;
    body: File;
  },
) => {
  const { bucketName, objectName, txnHash, contentType, body } = params;
  const path = `/${encodePath(objectName)}`;
  const query = '';
  const url = new URL(path, generateUrlByBucketName(endpoint, bucketName));

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    txnHash: txnHash,
    method: METHOD_PUT,
    url: {
      hostname: url.hostname,
      query,
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
