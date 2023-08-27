import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ReqMeta } from '@/types';
import { generateUrlByBucketName } from '@/utils/s3';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/get_object
export const getGetObjectMetaInfo = async (
  endpoint: string,
  params: {
    objectName: string;
    bucketName: string;
  },
) => {
  const { bucketName, objectName } = params;
  const path = `/${objectName}`;
  const query = '';
  const url = generateUrlByBucketName(endpoint, bucketName) + '/' + objectName;

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
    url,
    optionsWithOutHeaders,
    reqMeta,
  };
};
