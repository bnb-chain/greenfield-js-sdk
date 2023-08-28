import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ReqMeta, TBaseGetBucketReadQuota } from '@/types';
import { ReadQuotaResponse } from '@/types/sp-xml';
import { generateUrlByBucketName } from '@/utils/s3';
import xml from 'xml2js';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/query_bucket_read_quota
export const getQueryBucketReadQuotaMetaInfo = async (
  endpoint: string,
  params: TBaseGetBucketReadQuota,
) => {
  const { year, month, bucketName } = params;
  const currentDate = new Date();
  const finalYear = year ? year : currentDate.getFullYear();
  const finalMonth = month ? month : currentDate.getMonth() + 1;
  // format month to 2 digits, like "01"
  const formattedMonth = finalMonth.toString().padStart(2, '0');

  const path = '/';
  const query = `read-quota=null&year-month=${finalYear}-${formattedMonth}`;
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
  const res = (await xml.parseStringPromise(data, {
    strict: true,
    explicitRoot: true,
    explicitArray: false,
  })) as ReadQuotaResponse;

  return res;
};
