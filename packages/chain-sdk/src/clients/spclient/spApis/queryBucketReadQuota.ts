import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ReqMeta, ReadQuotaRequest } from '@/types';
import { ReadQuotaResponse } from '@/types/sp';
import { generateUrlByBucketName } from '@/utils/s3';
import { XMLParser } from 'fast-xml-parser';
import { getSortQuery } from '../auth';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/query_bucket_read_quota
export const getQueryBucketReadQuotaMetaInfo = async (
  endpoint: string,
  params: ReadQuotaRequest,
) => {
  const { year, month, bucketName } = params;
  const currentDate = new Date();
  const finalYear = year ? year : currentDate.getFullYear();
  const finalMonth = month ? month : currentDate.getMonth() + 1;
  // format month to 2 digits, like "01"
  const formattedMonth = finalMonth.toString().padStart(2, '0');

  const path = '/';
  const queryMap = {
    'year-month': `${finalYear}-${formattedMonth}`,
    'read-quota': 'null',
  };
  const query = getSortQuery(queryMap);
  const url = `${generateUrlByBucketName(endpoint, bucketName)}${path}?${query}`;

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    method: METHOD_GET,
    url: {
      hostname: new URL(url).hostname,
      query,
      path,
    },
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

export const parseReadQuotaResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as ReadQuotaResponse;

  return res;
};
