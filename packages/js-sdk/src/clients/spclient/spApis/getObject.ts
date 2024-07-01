import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ReqMeta } from '@/types';
import { generateUrlByBucketName } from '@/utils/asserts/s3';
import { encodePath } from '../auth';

// https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/storage-provider-rest-api/get_object.md
export const getGetObjectMetaInfo = async (
  endpoint: string,
  params: {
    objectName: string;
    bucketName: string;
  },
) => {
  const { bucketName, objectName } = params;
  const path = `/${encodePath(objectName)}`;
  const query = '';

  const url = new URL(path, generateUrlByBucketName(endpoint, bucketName));

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    method: METHOD_GET,
    url: {
      hostname: new URL(url).hostname,
      query,
      path,
    },
    contentType: 'application/octet-stream',
  };

  const optionsWithOutHeaders: Omit<RequestInit, 'headers'> = {
    method: METHOD_GET,
  };

  return {
    url: url.href,
    optionsWithOutHeaders,
    reqMeta,
  };
};
