import { EMPTY_STRING_SHA256, METHOD_PUT } from '@/constants';
import { ReqMeta } from '@/types';
import { generateUrlByBucketName } from '@/utils/s3';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/put_object
export const getPutObjectMetaInfo = async (
  endpoint: string,
  params: {
    objectName: string;
    bucketName: string;
    txnHash: string;
    contentType: string;
  },
) => {
  const { bucketName, objectName, txnHash, contentType } = params;
  const path = `/${objectName}`;
  const query = '';
  const url = `${generateUrlByBucketName(endpoint, bucketName)}${path}`;

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    txnHash: txnHash,
    method: METHOD_PUT,
    url: {
      hostname: new URL(url).hostname,
      query,
      path,
    },
    contentType,
  };

  return {
    url,
    reqMeta,
  };
};
