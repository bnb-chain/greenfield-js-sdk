import { GetBucketMetaResponse } from '@/types';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/get_bucket_meta
export const parseGetBucketMetaResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as GetBucketMetaResponse;

  return res;
};
