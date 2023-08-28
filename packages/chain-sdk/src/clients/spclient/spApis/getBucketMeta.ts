import { GetBucketMetaResponse } from '@/types';
import xml from 'xml2js';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/get_bucket_meta
export const parseGetBucketMetaResponse = async (data: string) => {
  // Buckets
  const res = (await xml.parseStringPromise(data, {
    strict: true,
    explicitRoot: true,
    explicitArray: false,
  })) as GetBucketMetaResponse;

  return res;
};
